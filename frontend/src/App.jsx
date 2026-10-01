import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import Performance from './pages/Performance';
import SkillsGaps from './pages/SkillsGaps';
import CareerPath from './pages/CareerPath';
import PromotionReadiness from './pages/PromotionReadiness';
import Calibration from './pages/Calibration';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public HR Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Enterprise Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect to Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Dedicated Employee Directory */}
              <Route path="employees" element={<Employees />} />

              {/* Individual Employee Profile */}
              <Route path="employees/:id" element={<EmployeeProfile />} />

              {/* Performance Analytics */}
              <Route path="performance" element={<Performance />} />

              {/* Skills & Competency Development */}
              <Route path="skills" element={<SkillsGaps />} />

              {/* Career Path Recommendations */}
              <Route path="career" element={<CareerPath />} />
              <Route path="career-path" element={<CareerPath />} />

              {/* Promotion Readiness Decision-Support */}
              <Route path="promotion" element={<PromotionReadiness />} />
              <Route path="promotion-readiness" element={<PromotionReadiness />} />

              {/* Manager Calibration Console */}
              <Route path="calibration" element={<Calibration />} />

              {/* Platform Governance & Settings */}
              <Route path="settings" element={<Settings />} />

              {/* Fallback to Dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
