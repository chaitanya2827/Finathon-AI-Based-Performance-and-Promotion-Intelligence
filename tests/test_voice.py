"""
ZEROBUGS HRM-05: AI Performance Voice Brief Test Suite.
Validates ElevenLabs TTS integration, voice brief generation, SHA-256 caching,
audio serving endpoints, security controls, and error handling.
All external ElevenLabs API interactions are strictly mocked.
"""

import os
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient

from backend.app.config import settings
from backend.app.database.database import SessionLocal
from backend.app.main import app
from backend.app.services.analysis_service import AnalysisOrchestrator
from backend.app.services.voice_service import VoiceService

client = TestClient(app)


def test_01_missing_employee_404():
    """Verify requesting voice brief for non-existent employee returns 404."""
    res = client.post("/api/voice/performance/NON_EXISTENT_999")
    assert res.status_code == 404
    data = res.json()
    assert "not found" in data["detail"].lower()


def test_02_missing_api_key_503(monkeypatch, tmp_path):
    """Verify clean 503 response when ELEVENLABS_API_KEY is not configured."""
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)
    monkeypatch.setattr(settings, "ELEVENLABS_API_KEY", "")
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_ID", "voice_123")

    res = client.post("/api/voice/performance/EMP001")
    assert res.status_code == 503
    data = res.json()
    assert "ELEVENLABS_API_KEY is not configured" in data["detail"]


def test_03_missing_voice_id_503(monkeypatch, tmp_path):
    """Verify clean 503 response when ELEVENLABS_VOICE_ID is not configured."""
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)
    monkeypatch.setattr(settings, "ELEVENLABS_API_KEY", "dummy_key")
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_ID", "")

    res = client.post("/api/voice/performance/EMP001")
    assert res.status_code == 503
    data = res.json()
    assert "ELEVENLABS_VOICE_ID is not configured" in data["detail"]


def test_04_elevenlabs_api_failure_502(monkeypatch, tmp_path):
    """Verify clean 502 Bad Gateway response when ElevenLabs SDK raises an exception."""
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)
    monkeypatch.setattr(settings, "ELEVENLABS_API_KEY", "dummy_key")
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_ID", "dummy_voice_id")

    mock_client = MagicMock()
    mock_client.text_to_speech.convert.side_effect = RuntimeError("ElevenLabs connection reset")

    with patch("elevenlabs.client.ElevenLabs", return_value=mock_client):
        res = client.post("/api/voice/performance/EMP001")
        assert res.status_code == 502
        data = res.json()
        assert "Failed to synthesize voice audio with ElevenLabs service." in data["detail"]
        # Ensure raw API key or internal stack traces are never leaked
        assert "dummy_key" not in res.text
        assert "RuntimeError" not in res.text


def test_05_summary_generation_personas():
    """Verify concise, evidence-grounded summary generation for demo personas."""
    db = SessionLocal()
    try:
        # Elena Rostova (EMP001) - Top performer
        elena_analysis = AnalysisOrchestrator.analyze_employee(db, "EMP001", persist=False)
        elena_summary = VoiceService.build_voice_summary(elena_analysis)
        assert "Elena Rostova" in elena_summary
        assert "98.6" in elena_summary
        assert "Tech Lead" in elena_summary
        assert "Ready Now" in elena_summary
        assert "These insights are advisory and final promotion decisions remain with HR and management." in elena_summary
        assert 400 <= len(elena_summary) <= 800
        assert "Promote this employee" not in elena_summary

        # Marcus Chen (EMP002) - Developing with skills gaps
        marcus_analysis = AnalysisOrchestrator.analyze_employee(db, "EMP002", persist=False)
        marcus_summary = VoiceService.build_voice_summary(marcus_analysis)
        assert "Marcus Chen" in marcus_summary
        assert "Senior Data Engineer" in marcus_summary
        assert "Developing - Ready in 6-12 Months" in marcus_summary
        assert "Kubernetes" in marcus_summary
        assert 400 <= len(marcus_summary) <= 800

        # Priya Sharma (EMP003) - Neutral evaluation inconsistency flag
        priya_analysis = AnalysisOrchestrator.analyze_employee(db, "EMP003", persist=False)
        priya_summary = VoiceService.build_voice_summary(priya_analysis)
        assert "Priya Sharma" in priya_summary
        assert "Potential evaluation inconsistency detected" in priya_summary
        assert "flagged for HR review and calibration" in priya_summary
        assert "biased" not in priya_summary
        assert "wrong" not in priya_summary
        assert 400 <= len(priya_summary) <= 800
    finally:
        db.close()


def test_06_mocked_elevenlabs_generation_and_mp3_creation(monkeypatch, tmp_path):
    """Verify successful synthesis produces MP3 file and returns proper response schema."""
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)
    monkeypatch.setattr(settings, "ELEVENLABS_API_KEY", "test_key_valid")
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_ID", "voice_abc_123")
    monkeypatch.setattr(settings, "ELEVENLABS_MODEL_ID", "eleven_flash_v2_5")

    mock_client = MagicMock()
    mock_audio_chunks = [b"ID3_MOCK_HEADER", b"_AUDIO_FRAME_DATA"]
    mock_client.text_to_speech.convert.return_value = mock_audio_chunks

    with patch("elevenlabs.client.ElevenLabs", return_value=mock_client):
        res = client.post("/api/voice/performance/EMP001")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "success"
        assert data["employee_id"] == "EMP001"
        assert data["employee_name"] == "Elena Rostova"
        assert "Ready Now" in data["summary_text"]
        assert data["cached"] is False
        assert data["audio_url"].startswith("/api/voice/audio/EMP001_")
        assert data["audio_url"].endswith(".mp3")

        # Verify MP3 exists on disk with correct content
        audio_filename = data["audio_url"].split("/")[-1]
        target_file = tmp_path / audio_filename
        assert target_file.exists()
        assert target_file.read_bytes() == b"ID3_MOCK_HEADER_AUDIO_FRAME_DATA"


def test_07_cache_credit_protection_hit(monkeypatch, tmp_path):
    """
    CRITICAL CREDIT PROTECTION TEST:
    Verify that identical subsequent requests reuse the existing MP3 file
    and NEVER invoke the ElevenLabs API again.
    """
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)
    monkeypatch.setattr(settings, "ELEVENLABS_API_KEY", "test_key_valid")
    monkeypatch.setattr(settings, "ELEVENLABS_VOICE_ID", "voice_abc_123")

    mock_client = MagicMock()
    mock_client.text_to_speech.convert.return_value = [b"AUDIO_DATA_FOR_CACHE_TEST"]

    with patch("elevenlabs.client.ElevenLabs", return_value=mock_client):
        # 1. First call (cache miss)
        res1 = client.post("/api/voice/performance/EMP001")
        assert res1.status_code == 200
        data1 = res1.json()
        assert data1["cached"] is False
        assert mock_client.text_to_speech.convert.call_count == 1

        # 2. Second identical call (cache hit)
        res2 = client.post("/api/voice/performance/EMP001")
        assert res2.status_code == 200
        data2 = res2.json()
        assert data2["cached"] is True
        assert data2["audio_url"] == data1["audio_url"]

        # CRITICAL ASSERTION: ElevenLabs convert was NOT called again
        assert mock_client.text_to_speech.convert.call_count == 1


def test_08_audio_serving_endpoints(monkeypatch, tmp_path):
    """Verify that both /audio/{filename} and /audio/{employee_id}/{filename} serve MP3."""
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)

    sample_filename = "EMP001_1a2b3c4d5e6f7a8b.mp3"
    file_path = tmp_path / sample_filename
    file_path.write_bytes(b"FAKE_MP3_AUDIO_CONTENT_HEADER")

    # Test GET /api/voice/audio/{filename}
    res_direct = client.get(f"/api/voice/audio/{sample_filename}")
    assert res_direct.status_code == 200
    assert res_direct.headers["content-type"] == "audio/mpeg"
    assert res_direct.content == b"FAKE_MP3_AUDIO_CONTENT_HEADER"

    # Test GET /api/voice/audio/{employee_id}/{filename}
    res_namespaced = client.get(f"/api/voice/audio/EMP001/{sample_filename}")
    assert res_namespaced.status_code == 200
    assert res_namespaced.headers["content-type"] == "audio/mpeg"
    assert res_namespaced.content == b"FAKE_MP3_AUDIO_CONTENT_HEADER"


def test_09_audio_file_missing_404(monkeypatch, tmp_path):
    """Verify 404 response when requested audio file does not exist."""
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)

    res1 = client.get("/api/voice/audio/EMP001_nonexistentfile123.mp3")
    assert res1.status_code == 404

    res2 = client.get("/api/voice/audio/EMP001/EMP001_nonexistentfile123.mp3")
    assert res2.status_code == 404


def test_10_path_traversal_and_invalid_filename_rejected(monkeypatch, tmp_path):
    """Verify path traversal attacks and dangerous file formats are strictly rejected."""
    monkeypatch.setattr(settings, "AUDIO_DIR", tmp_path)

    # 1. Disallow non-mp3 extensions
    res1 = client.get("/api/voice/audio/evil_script.exe")
    assert res1.status_code in (400, 404)

    # 2. Path traversal attempts
    res2 = client.get("/api/voice/audio/..%2F..%2Fetc%2Fpasswd.mp3")
    assert res2.status_code in (400, 404)

    # 3. Mismatched employee ID in namespaced route
    sample_filename = "EMP001_1a2b3c4d5e6f7a8b.mp3"
    (tmp_path / sample_filename).write_bytes(b"CONTENT")
    res3 = client.get(f"/api/voice/audio/EMP002/{sample_filename}")
    assert res3.status_code == 400
    assert "Filename does not match" in res3.json()["detail"]


def test_11_hash_changes_when_summary_differs():
    """Verify that different summaries or voice configurations produce different cache keys."""
    key1 = VoiceService.get_cache_key("EMP001", "Summary Version A", "voice_1", "model_1")
    key2 = VoiceService.get_cache_key("EMP001", "Summary Version B", "voice_1", "model_1")
    key3 = VoiceService.get_cache_key("EMP001", "Summary Version A", "voice_2", "model_1")

    assert key1 != key2
    assert key1 != key3
    assert len(key1) == 16
