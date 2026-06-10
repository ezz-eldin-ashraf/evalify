import React, { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, ChevronDown, ChevronUp, Download, Loader2,
  CheckCircle2, Clock, XCircle, AlertCircle, User, BookOpen,
  BarChart3, Search, Eye
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Template {
  templateId: number;
  name: string;
}

interface Paper {
  studentPaperId: number;
  studentCode: string;
  status: 'Pending' | 'Processing' | 'Done' | 'Failed';
  totalGrade: number | null;
  createdAt: string;
}

interface Student {
  id: number;
  studentCode: string;
  fullName: string;
}

interface StudentList {
  id: number;
  name: string;
  studentCount: number;
}

interface TemplateReport {
  template: Template;
  papers: Paper[];
  loading: boolean;
  expanded: boolean;
  selectedListId: string;
  studentMap: Record<string, string>; // studentCode → fullName
  searchQuery: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusConfig = {
  Done: {
    label: 'Done',
    icon: <CheckCircle2 size={14} />,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  Pending: {
    label: 'Pending',
    icon: <Clock size={14} />,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  Processing: {
    label: 'Processing',
    icon: <Loader2 size={14} className="animate-spin" />,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  Failed: {
    label: 'Failed',
    icon: <XCircle size={14} />,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

const StatusBadge: React.FC<{ status: Paper['status'] }> = ({ status }) => {
  const cfg = statusConfig[status] ?? statusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.className}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Reports: React.FC = () => {
  const [reports, setReports] = useState<TemplateReport[]>([]);
  const [studentLists, setStudentLists] = useState<StudentList[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<number | null>(null);
  const navigate = useNavigate();

  // ── Initial load: templates + student lists + papers ─────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, lRes] = await Promise.all([
          api.get('/templates'),
          api.get('/student-lists'),
        ]);
        const templates: Template[] = tRes.data;
        const lists: StudentList[] = lRes.data;
        setStudentLists(lists);

        // Fetch papers for all templates upfront to show accurate global totals
        const papersResults = await Promise.allSettled(
          templates.map(t => api.get(`/templates/${t.templateId}/papers`))
        );

        const initial: TemplateReport[] = await Promise.all(templates.map(async (t, idx) => {
          const res = papersResults[idx];
          const papers = res.status === 'fulfilled' ? (res.value.data ?? []) : [];
          const savedListId = localStorage.getItem(`evalify_list_${t.templateId}`) || '';
          
          let studentMap: Record<string, string> = {};
          if (savedListId) {
            try {
              const sRes = await api.get(`/student-lists/${savedListId}/students`);
              (sRes.data ?? []).forEach((s: { studentCode: string; fullName: string }) => {
                studentMap[s.studentCode] = s.fullName;
              });
            } catch { /* silent */ }
          }

          return {
            template: t,
            papers,
            loading: false,
            expanded: false,
            selectedListId: savedListId,
            studentMap,
            searchQuery: '',
          };
        }));
        
        setReports(initial);
      } catch {
        setError('Failed to load templates. Please refresh the page.');
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, []);

  // ── Expand / collapse ───────────────────────────────────────────────────
  const toggleExpand = useCallback((idx: number) => {
    setReports(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], expanded: !copy[idx].expanded };
      return copy;
    });
  }, []);

  // ── Select a student list to resolve student names ──────────────────────
  const selectList = useCallback(async (idx: number, listId: string) => {
    setReports(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], selectedListId: listId, studentMap: {} };
      return copy;
    });
    if (!listId) return;
    try {
      const res = await api.get(`/student-lists/${listId}/students`);
      const students: Student[] = res.data ?? [];
      const map: Record<string, string> = {};
      students.forEach(s => { map[s.studentCode] = s.fullName; });
      setReports(prev => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], studentMap: map };
        return copy;
      });
    } catch {
      // silent: name resolution is best-effort
    }
  }, []);

  // ── Export CSV ────────────────────────────────────────────────────────────
  const exportCsv = async (templateId: number) => {
    setExportingId(templateId);
    try {
      const res = await api.get(`/templates/${templateId}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `results_template_${templateId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setExportingId(null);
    }
  };

  // ── Search handler ────────────────────────────────────────────────────────
  const setSearch = (idx: number, q: string) => {
    setReports(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], searchQuery: q };
      return copy;
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 font-semibold">
        <AlertCircle size={20} /> {error}
      </div>
    );
  }

  // ── Summary totals ────────────────────────────────────────────────────────
  const allPapers = reports.flatMap(r => r.papers);
  const totalDone = allPapers.filter(p => p.status === 'Done').length;
  const totalPending = allPapers.filter(p => p.status === 'Pending' || p.status === 'Processing').length;
  const totalFailed = allPapers.filter(p => p.status === 'Failed').length;

  return (
    <div className="space-y-8 animate-fade-in-up w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Evaluation Reports</h2>
          <p className="text-text-muted mt-2 font-medium">
            View grading status, student results, and download exports for each exam template.
          </p>
        </div>
      </div>

      {/* Summary cards (only shown once papers have been loaded) */}
      {allPapers.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Graded', value: totalDone, icon: <CheckCircle2 size={22} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { label: 'Pending / Processing', value: totalPending, icon: <Clock size={22} />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { label: 'Failed', value: totalFailed, icon: <XCircle size={22} />, color: 'text-red-600 bg-red-50 border-red-200' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className={`flex items-center gap-4 rounded-2xl border p-5 ${color}`}>
              {icon}
              <div>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-xs font-semibold opacity-70">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template cards */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] shadow-strong flex flex-col items-center justify-center min-h-[400px] text-center p-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
            <ClipboardList size={40} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No Templates Yet</h3>
          <p className="text-text-muted font-medium max-w-sm">Create an exam template first, then upload student papers to start seeing reports here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report, idx) => {
            const filteredPapers = report.papers.filter(p => {
              const q = report.searchQuery.toLowerCase();
              if (!q) return true;
              const name = report.studentMap[p.studentCode] ?? '';
              return p.studentCode.toLowerCase().includes(q) || name.toLowerCase().includes(q);
            });

            const doneCount = report.papers.filter(p => p.status === 'Done').length;
            const pendingCount = report.papers.filter(p => p.status === 'Pending' || p.status === 'Processing').length;
            const avgGrade = report.papers.filter(p => p.status === 'Done' && p.totalGrade != null).reduce((acc, p, _, arr) => acc + (p.totalGrade ?? 0) / arr.length, 0);

            return (
              <div key={report.template.templateId} className="bg-white rounded-2xl shadow-strong overflow-hidden border border-border/20">
                {/* ── Card Header ── */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-bg-surface transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{report.template.name}</h3>
                      {report.papers.length > 0 && (
                        <p className="text-sm text-text-muted font-medium">
                          {report.papers.length} papers · {doneCount} graded
                          {pendingCount > 0 && ` · ${pendingCount} pending`}
                          {doneCount > 0 && ` · Avg ${avgGrade.toFixed(2)}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {report.loading && <Loader2 size={18} className="animate-spin text-primary" />}
                    {doneCount > 0 && (
                      <button
                        onClick={e => { e.stopPropagation(); exportCsv(report.template.templateId); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {exportingId === report.template.templateId
                          ? <Loader2 size={13} className="animate-spin" />
                          : <Download size={13} />}
                        Export CSV
                      </button>
                    )}
                    {report.expanded ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
                  </div>
                </button>

                {/* ── Expanded Content ── */}
                {report.expanded && (
                  <div className="border-t border-border/30 px-6 pb-6 pt-4 space-y-4">

                    {/* Controls row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Student list selector */}
                      <div className="relative flex-1">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <select
                          value={report.selectedListId}
                          onChange={e => selectList(idx, e.target.value)}
                          className="w-full appearance-none bg-bg-input text-text-primary text-sm font-semibold rounded-xl py-2.5 pl-9 pr-10 border border-transparent focus:border-primary/30 outline-none cursor-pointer"
                        >
                          <option value="">Resolve names from roster…</option>
                          {studentLists.map(l => (
                            <option key={l.id} value={l.id}>{l.name} ({l.studentCount} students)</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>

                      {/* Search */}
                      <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                          type="text"
                          value={report.searchQuery}
                          onChange={e => setSearch(idx, e.target.value)}
                          placeholder="Search by code or name…"
                          className="w-full bg-bg-input text-text-primary text-sm font-semibold rounded-xl py-2.5 pl-9 pr-4 border border-transparent focus:border-primary/30 outline-none"
                        />
                      </div>
                    </div>

                    {/* Status pills */}
                    {report.papers.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {doneCount > 0 && <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">{doneCount} Graded</span>}
                        {pendingCount > 0 && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">{pendingCount} Pending</span>}
                        {report.papers.filter(p => p.status === 'Failed').length > 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                            {report.papers.filter(p => p.status === 'Failed').length} Failed
                          </span>
                        )}
                        {doneCount > 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            <BarChart3 size={11} className="inline mr-1" />
                            Avg {avgGrade.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Table */}
                    {report.loading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 size={30} className="animate-spin text-primary" />
                      </div>
                    ) : report.papers.length === 0 ? (
                      <div className="text-center py-10 text-text-muted font-medium">
                        No papers uploaded for this template yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-border/30">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-bg-surface text-text-muted text-xs font-bold uppercase tracking-wide">
                              <th className="px-4 py-3 text-left">#</th>
                              <th className="px-4 py-3 text-left">Student Code</th>
                              <th className="px-4 py-3 text-left">Student Name</th>
                              <th className="px-4 py-3 text-center">Status</th>
                              <th className="px-4 py-3 text-center">Total Grade</th>
                              <th className="px-4 py-3 text-center">Submitted</th>
                              <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20">
                            {filteredPapers.map((paper, i) => {
                              const studentName = report.studentMap[paper.studentCode];
                              return (
                                <tr key={paper.studentPaperId} className="hover:bg-bg-surface/50 transition-colors">
                                  <td className="px-4 py-3 text-text-muted font-medium">{i + 1}</td>
                                  <td className="px-4 py-3 font-mono font-bold text-text-primary">{paper.studentCode}</td>
                                  <td className="px-4 py-3">
                                    {studentName ? (
                                      <span className="font-semibold text-text-primary">{studentName}</span>
                                    ) : (
                                      <span className="text-text-muted italic text-xs">Select roster above</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <StatusBadge status={paper.status} />
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {paper.status === 'Done' && paper.totalGrade != null ? (
                                      <span className="font-black text-text-primary">{paper.totalGrade.toFixed(2)}</span>
                                    ) : (
                                      <span className="text-text-muted">—</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center text-text-muted text-xs">
                                    {new Date(paper.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {paper.status === 'Done' ? (
                                      <button
                                        onClick={() => navigate(`/results/${paper.studentPaperId}`)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                      >
                                        <Eye size={13} /> View
                                      </button>
                                    ) : (
                                      <span className="text-text-muted text-xs">—</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reports;
