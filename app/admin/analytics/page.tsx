'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import type { DailyAnalytics } from '@/types';
import StatCard from '@/components/admin/StatCard';
import VisitorChart from '@/components/admin/VisitorChart';
import ProjectTabBar from '@/components/admin/ProjectTabBar';
import AddMinutesModal from '@/components/admin/AddMinutesModal';
import {
  Users,
  Clock,
  MessageCircle,
  Percent,
  Building2,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RotateCcw,
  Zap,
  Plus,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

type PresetRange = '7' | '14' | '30' | 'custom';
type SortField = 'date' | 'visitor_count' | 'avg_session_duration' | 'leads_count';
type SortOrder = 'asc' | 'desc';

export default function AnalyticsPage() {
  const { projects, settings } = useSettings();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [isAddMinutesOpen, setIsAddMinutesOpen] = useState(false);

  // Live data states
  const [analyticsRows, setAnalyticsRows] = useState<DailyAnalytics[]>([]);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Table filter states
  const [presetRange, setPresetRange] = useState<PresetRange>('7');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch real analytics and leads from Cloudflare D1
  useEffect(() => {
    const fetchRealData = async () => {
      setIsLoading(true);
      try {
        const [analyticsRes, leadsRes] = await Promise.all([
          fetch('/api/analytics', { cache: 'no-store' })
            .then((r) => (r.ok ? r.json() : { analytics: [] }))
            .catch(() => ({ analytics: [] })),
          fetch('/api/leads', { cache: 'no-store' })
            .then((r) => (r.ok ? r.json() : { leads: [] }))
            .catch(() => ({ leads: [] })),
        ]);

        if (analyticsRes.analytics && Array.isArray(analyticsRes.analytics) && analyticsRes.analytics.length > 0) {
          setAnalyticsRows(
            analyticsRes.analytics.map((r: any) => ({
              date: r.date,
              visitor_count: Number(r.visitor_count) || 0,
              avg_session_duration: Number(r.avg_session_duration) || 0,
              leads_count: Number(r.leads_count) || 0,
            }))
          );
        } else {
          // Default to today's active live row
          const today = new Date().toISOString().split('T')[0];
          setAnalyticsRows([
            { date: today, visitor_count: 0, avg_session_duration: 0, leads_count: 0 },
          ]);
        }

        if (leadsRes.leads && Array.isArray(leadsRes.leads)) {
          setLeadsList(leadsRes.leads);
        }
      } catch (err) {
        console.warn('Failed to fetch real analytics from Cloudflare D1:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // Compute live lead counts per project for the Excel tabs
  const leadCountsByProject = useMemo(() => {
    const counts: Record<string, number> = {};
    leadsList.forEach((l) => {
      if (l.project_id) {
        counts[l.project_id] = (counts[l.project_id] || 0) + 1;
      }
    });
    return counts;
  }, [leadsList]);

  // Selected project reference
  const activeProj = projects.find((p) => p.id === selectedProjectId);

  // Real aggregated metrics
  const totalVisitors = useMemo(() => {
    return analyticsRows.reduce((acc, curr) => acc + (curr.visitor_count || 0), 0);
  }, [analyticsRows]);

  const totalLeads = useMemo(() => {
    if (selectedProjectId === 'all') {
      return leadsList.length;
    }
    return leadsList.filter((l) => l.project_id === selectedProjectId).length;
  }, [leadsList, selectedProjectId]);

  const conversionRate = useMemo(() => {
    if (totalVisitors <= 0) return 0;
    return Number(((totalLeads / totalVisitors) * 100).toFixed(1));
  }, [totalVisitors, totalLeads]);

  const avgDuration = useMemo(() => {
    const activeDays = analyticsRows.filter((d) => d.visitor_count > 0 || d.avg_session_duration > 0);
    if (activeDays.length === 0) return 0;
    const totalSecs = activeDays.reduce((acc, d) => acc + (d.avg_session_duration || 0), 0);
    return Math.round(totalSecs / activeDays.length);
  }, [analyticsRows]);

  // Raw daily data
  const rawDailyData = useMemo(() => {
    if (analyticsRows.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      return [{ date: today, visitor_count: 0, avg_session_duration: 0, leads_count: 0 }];
    }
    return analyticsRows;
  }, [analyticsRows]);

  // Filter and sort table records based on date presets or custom start/end dates
  const filteredAndSortedDaily = useMemo(() => {
    let result = [...rawDailyData];

    // Date filtering
    if (presetRange === '7') {
      result = result.slice(-7);
    } else if (presetRange === '14') {
      result = result.slice(-14);
    } else if (presetRange === '30') {
      result = result.slice(-30);
    } else if (presetRange === 'custom') {
      if (startDate) {
        result = result.filter((day) => day.date >= startDate);
      }
      if (endDate) {
        result = result.filter((day) => day.date <= endDate);
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (day) =>
          day.date.toLowerCase().includes(q) ||
          new Date(day.date)
            .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            .toLowerCase()
            .includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rawDailyData, presetRange, startDate, endDate, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-white/25" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-indigo-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-400" />
    );
  };

  const resetFilters = () => {
    setPresetRange('7');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setSortField('date');
    setSortOrder('desc');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Analytics</h1>
          <p className="text-white/40 text-sm mt-1">
            Track visitor engagement and WhatsApp lead conversions
          </p>
        </div>
      </div>

      {/* ── Excel-Style Sheet Tab Bar (Auto-creates tabs for every project!) ──── */}
      <ProjectTabBar
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        leadCountsByProject={leadCountsByProject}
      />

      {/* Active Filter Indicator */}
      <div className="flex items-center gap-2 text-xs text-white/50 bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5 w-fit">
        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
        <span>
          Viewing metrics for:{' '}
          <strong className="text-white">
            {selectedProjectId === 'all'
              ? 'All Projects (Aggregated)'
              : activeProj?.project_name || 'Selected Project'}
          </strong>
        </span>
      </div>

      {/* ── Global View: Available AI Voice Minutes (Master Account Quota) ──── */}
      {selectedProjectId === 'all' && (() => {
        const availableMins = settings.available_minutes ?? 100;
        const maxMinsCapacity = 300;
        const percent = Math.min(100, Math.round((availableMins / maxMinsCapacity) * 100));
        const isDepleted = availableMins <= 0;
        const isLow = availableMins > 0 && availableMins <= 20;

        return (
          <div
            className="rounded-3xl p-6 relative overflow-hidden text-white"
            style={{
              background: isDepleted
                ? 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,15,28,0.95))'
                : isLow
                ? 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,15,28,0.95))'
                : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.08), rgba(15,15,28,0.95))',
              border: isDepleted
                ? '1px solid rgba(239,68,68,0.3)'
                : isLow
                ? '1px solid rgba(245,158,11,0.3)'
                : '1px solid rgba(99,102,241,0.25)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              {/* Left Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDepleted
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : isLow
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">
                      Master Available AI Voice Minutes
                    </h3>
                    <p className="text-xs text-white/50">
                      Global speaking quota balance for the entire account across all projects
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black tracking-tight text-white font-mono">
                    {availableMins.toFixed(2)}{' '}
                    <span className="text-lg font-medium text-white/60">Minutes</span>
                  </span>
                  <span className="text-xs text-white/50 font-mono">
                    ≈ {(availableMins / 60).toFixed(2)} hrs available
                  </span>

                  {/* Status Badge */}
                  {isDepleted ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      Quota Depleted (Voice Disabled)
                    </span>
                  ) : isLow ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      Low Balance — Refill Recommended
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Master Quota Active & Operational
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDepleted
                          ? 'bg-rose-500'
                          : isLow
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Action: Add Minutes Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsAddMinutesOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add AI Minutes</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Project View: Consumed AI Minutes (Specific to Selected Project) ─── */}
      {selectedProjectId !== 'all' && activeProj && (() => {
        const consumedMins = activeProj.consumed_minutes ?? 0;
        const projectSessionsCount =
          leadsList.filter((s) => s.project_id === selectedProjectId).length || 0;

        return (
          <div
            className="rounded-3xl p-6 relative overflow-hidden text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(99,102,241,0.06), rgba(15,15,28,0.95))',
              border: '1px solid rgba(6,182,212,0.25)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">
                      Project Total Consumed Minutes
                    </h3>
                    <p className="text-xs text-white/50">
                      Total AI speaking voice duration consumed exclusively by {activeProj.project_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black tracking-tight text-white font-mono">
                    {consumedMins.toFixed(2)}{' '}
                    <span className="text-lg font-medium text-white/60">Minutes Consumed</span>
                  </span>
                  <span className="text-xs text-cyan-300 font-mono">
                    ≈ {(consumedMins / 60).toFixed(2)} speaking hrs
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
                <div className="text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Inquiries / Leads</p>
                  <p className="text-lg font-bold text-white font-mono">{projectSessionsCount}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Avg. Session</p>
                  <p className="text-lg font-bold text-cyan-400 font-mono">
                    {projectSessionsCount > 0 ? (consumedMins / projectSessionsCount).toFixed(2) : '0.00'}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={totalVisitors.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          color="indigo"
        />
        <StatCard
          title="Avg. Session Duration"
          value={formatDuration(avgDuration)}
          icon={<Clock className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          title="WhatsApp Leads"
          value={totalLeads}
          icon={<MessageCircle className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={<Percent className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Visitor Chart */}
      <VisitorChart data={rawDailyData} />

      {/* ── Specified Filters DIRECTLY ABOVE the Daily Breakdown Table ────── */}
      <div className="space-y-3 pt-4">
        <div
          className="p-4 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {/* Left: Filter Title & Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/70 mr-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              Table Filters:
            </span>

            {(['7', '14', '30'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setPresetRange(r);
                  setStartDate('');
                  setEndDate('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  presetRange === r
                    ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-white/60 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                Last {r} Days
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPresetRange('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                presetRange === 'custom'
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-white/60 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Right: Custom Date Picker Inputs + Search + Reset */}
          <div className="flex flex-wrap items-center gap-3">
            {presetRange === 'custom' && (
              <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 text-xs">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 ml-1" />
                <div className="flex items-center gap-1.5">
                  <span className="text-white/40">From:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-black/30 text-white text-xs px-2 py-1 rounded-lg border border-white/10 outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/40">To:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-black/30 text-white text-xs px-2 py-1 rounded-lg border border-white/10 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search date..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-white/25 bg-white/5 border border-white/10 outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Reset Button */}
            {(presetRange !== '7' || startDate || endDate || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Daily Breakdown Table ────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <h3 className="text-white font-semibold text-sm">
              Daily Breakdown —{' '}
              {selectedProjectId === 'all' ? 'All Projects' : activeProj?.project_name}
            </h3>
            <span className="text-white/30 text-xs">
              {filteredAndSortedDaily.length} day{filteredAndSortedDaily.length === 1 ? '' : 's'} displayed · Click headers to sort
            </span>
          </div>

          {/* Sortable Column Headers */}
          <div
            className="grid grid-cols-4 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5 select-none"
            style={{ background: 'rgba(255,255,255,0.01)' }}
          >
            <button
              type="button"
              onClick={() => handleSort('date')}
              className="flex items-center gap-1.5 text-left hover:text-white transition-colors"
            >
              <span>Date</span>
              {renderSortIcon('date')}
            </button>
            <button
              type="button"
              onClick={() => handleSort('visitor_count')}
              className="flex items-center gap-1.5 text-left hover:text-white transition-colors"
            >
              <span>Visitors</span>
              {renderSortIcon('visitor_count')}
            </button>
            <button
              type="button"
              onClick={() => handleSort('avg_session_duration')}
              className="hidden sm:flex items-center gap-1.5 text-left hover:text-white transition-colors"
            >
              <span>Avg Duration</span>
              {renderSortIcon('avg_session_duration')}
            </button>
            <button
              type="button"
              onClick={() => handleSort('leads_count')}
              className="flex items-center gap-1.5 text-left hover:text-white transition-colors"
            >
              <span>WhatsApp Leads</span>
              {renderSortIcon('leads_count')}
            </button>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {filteredAndSortedDaily.length > 0 ? (
              filteredAndSortedDaily.map((day) => (
                <div
                  key={day.date}
                  className="grid grid-cols-4 gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white/70 text-sm font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-white font-semibold text-sm tabular-nums">
                    {day.visitor_count}
                  </span>
                  <span className="hidden sm:block text-white/50 text-sm">
                    {formatDuration(day.avg_session_duration)}
                  </span>
                  <span className="text-emerald-400 font-semibold text-sm tabular-nums">
                    {day.leads_count}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-white/40">
                No analytics records found for the selected date range.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Minutes Modal (Global Master Account Replenishment) */}
      <AddMinutesModal
        isOpen={isAddMinutesOpen}
        onClose={() => setIsAddMinutesOpen(false)}
      />
    </div>
  );
}
