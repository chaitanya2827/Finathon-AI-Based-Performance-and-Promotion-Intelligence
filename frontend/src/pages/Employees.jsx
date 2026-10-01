import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Eye,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import ProgressBar from '../components/common/ProgressBar';
import EmployeeAvatar from '../components/common/EmployeeAvatar';
import DataTable from '../components/common/DataTable';
import LoadingState from '../components/common/LoadingState';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';

import { getEmployees } from '../services/api';

export default function Employees() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Filters state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    department: 'All',
    readiness: 'All',
    performance: 'All',
    role: 'All'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getEmployees({
        search,
        department: filters.department,
        readiness: filters.readiness,
        performance: filters.performance,
        role: filters.role
      });
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({
      department: 'All',
      readiness: 'All',
      performance: 'All',
      role: 'All'
    });
  };

  // Columns for Table view
  const columns = [
    {
      header: 'Employee',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar name={row.name} src={row.avatar} size="sm" status={row.status} />
          <div>
            <span className="font-bold text-[#F0F9FF] block group-hover:text-cyan-400 transition-colors">
              {row.name}
            </span>
            <span className="text-[11px] text-[#7F9BB2] font-mono">{row.id}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role & Dept',
      key: 'role',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-[#F0F9FF] text-xs block">{row.role}</span>
          <span className="text-[11px] text-[#B6C9D9]">{row.department}</span>
        </div>
      )
    },
    {
      header: 'Reporting Manager',
      key: 'manager',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-[#B6C9D9] font-medium">{row.manager}</span>
      )
    },
    {
      header: 'Performance',
      key: 'performanceScore',
      sortable: true,
      render: (row) => (
        <div className="w-28">
          <ProgressBar
            value={row.performanceScore}
            max={100}
            label={`${row.performanceScore}%`}
            showValue={false}
            color="auto"
            height="h-2"
          />
          <span className="text-[10px] text-[#7F9BB2] font-medium">
            {row.performanceCategory}
          </span>
        </div>
      )
    },
    {
      header: 'Skill Score',
      key: 'skillScore',
      sortable: true,
      render: (row) => (
        <div className="font-semibold text-cyan-300 text-xs">
          <span>{row.skillScore}%</span>
        </div>
      )
    },
    {
      header: 'Promotion Readiness',
      key: 'promotionReadiness',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.readinessStatus} size="sm" />
          <span className="text-xs font-bold text-[#F0F9FF]">{row.promotionReadiness}%</span>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Action',
      key: 'action',
      className: 'text-right',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/employees/${row.id}`);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all shadow-[0_0_8px_rgba(34,211,238,0.15)]"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#F0F9FF] tracking-tight">
            Employees
          </h2>
          <p className="text-xs sm:text-sm text-[#B6C9D9] mt-0.5">
            Search, filter, and review evidence-based profiles across all departments
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#0B223D]/60 border border-cyan-500/20 backdrop-blur-md rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'text-[#7F9BB2] hover:text-[#F0F9FF]'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'cards'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'text-[#7F9BB2] hover:text-[#F0F9FF]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Card Grid</span>
          </button>
        </div>
      </div>

      {/* Decision-Support Banner */}
      <AIDisclaimerBanner
        variant="subtle"
        message="Employee profiles integrate 8 data dimensions: goals, outcomes, peer reviews, skills, LMS training, attendance, and business impact."
      />

      {/* Search and Filters Bar */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, role, department, manager or ID..."
            className="flex-1"
          />

          <div className="text-xs text-[#B6C9D9] font-medium flex items-center gap-2 self-end md:self-auto">
            <span>Showing:</span>
            <span className="font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded-md">
              {employees.length} employees
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-cyan-500/10">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Filtering employee database records..." rows={5} />
      ) : viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={employees}
          pageSize={10}
          keyField="id"
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
          emptyTitle="No matching employees found"
          emptyDescription="Adjust your search criteria or reset filters to view all team members."
        />
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => navigate(`/employees/${emp.id}`)}
              className="card p-5 cursor-pointer card-hover flex flex-col justify-between group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar name={emp.name} src={emp.avatar} size="md" status={emp.status} />
                    <div>
                      <h4 className="font-bold text-sm text-[#F0F9FF] group-hover:text-cyan-400 transition-colors">
                        {emp.name}
                      </h4>
                      <p className="text-xs text-[#B6C9D9]">{emp.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={emp.readinessStatus} size="sm" />
                </div>

                <div className="text-[11px] text-[#7F9BB2] font-mono mb-3">
                  {emp.id} • {emp.department} • Mgr: {emp.manager}
                </div>

                {/* Score bars */}
                <div className="space-y-2.5 py-2.5 border-y border-cyan-500/10">
                  <ProgressBar
                    value={emp.performanceScore}
                    max={100}
                    label="Performance Score"
                    showValue={true}
                    color="auto"
                    height="h-1.5"
                  />
                  <ProgressBar
                    value={emp.skillScore}
                    max={100}
                    label="Skill Proficiency"
                    showValue={true}
                    color="cyan"
                    height="h-1.5"
                  />
                  <ProgressBar
                    value={emp.promotionReadiness}
                    max={100}
                    label="Promotion Readiness"
                    showValue={true}
                    color={emp.promotionReadiness >= 80 ? 'emerald' : 'cyan'}
                    height="h-1.5"
                  />
                </div>

                {/* AI Summary snippet */}
                <p className="text-xs text-[#B6C9D9] mt-3 line-clamp-2 leading-relaxed">
                  {emp.aiSummary?.overview}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                <span className="text-[11px] text-[#7F9BB2]">
                  Tenure: {emp.joinDate}
                </span>
                <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                  View Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
