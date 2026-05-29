import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Settings,
  PlayCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Layers,
  FileImage,
} from 'lucide-react';
import api, { BACKEND_ORIGIN } from '../api/axios';

// ── Types ──────────────────────────────────────────────────────────────────

interface Template {
  templateId: number;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;
}

interface Paper {
  studentPaperId: number;
  templateId: number;
  studentCode: string;
  imageUrl: string;
  status: 'Pending' | 'Processing' | 'Done' | 'Failed';
  totalGrade: number | null;
  createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    bg: 'bg-warning/10',
    text: 'text-warning',
    dot: 'bg-warning',
    icon: <Clock size={11} />,
  },
  Processing: {
    label: 'Processing',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    icon: <Loader2 size={11} className="animate-spin" />,
  },
  Done: {
    label: 'Done',
    bg: 'bg-success/10',
    text: 'text-success',
    dot: 'bg-success',
    icon: <CheckCircle2 size={11} />,
  },
  Failed: {
    label: 'Failed',
    bg: 'bg-error/10',
    text: 'text-error',
    dot: 'bg-error',
    icon: <AlertCircle size={11} />,
  },
};

function StatusBadge({ status }: { status: Paper['status'] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['Pending'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ── Exam Card ──────────────────────────────────────────────────────────────

interface ExamCardProps {
  template: Template;
  papers: Paper[];
}

const ExamCard: React.FC<ExamCardProps> = ({ template, papers }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const donePapers = papers.filter((p) => p.status === 'Done').length;
  const pendingPapers = papers.filter((p) => p.status === 'Pending').length;
  const failedPapers = papers.filter((p) => p.status === 'Failed').length;

  return (
    <div className="bg-white rounded-[1.5rem] border border-border/60 hover:shadow-strong hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 group overflow-hidden">
      <div className="p-6">
        {/* ── Top Row: Image + Info ── */}
        <div className="flex gap-5">

          {/* Template Thumbnail */}
          <div className="flex-shrink-0 w-[100px] h-[130px] rounded-xl overflow-hidden bg-bg-surface border border-border/30 relative shadow-sm">
            {template.imageUrl ? (
              <img
                src={`${BACKEND_ORIGIN}${template.imageUrl}`}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <ImageIcon size={32} strokeWidth={1.5} />
              </div>
            )}
            {/* Overlay label */}
            <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm px-2 py-1">
              <p className="text-white text-[9px] font-bold truncate text-center">TEMPLATE</p>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-text-primary leading-snug truncate pr-2">
                {template.name}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link to={`/edit-template/${template.templateId}`}>
                  <button
                    id={`edit-exam-${template.templateId}`}
                    className="p-2 rounded-xl hover:bg-primary/10 text-text-muted hover:text-primary transition-all"
                    title="Edit Template"
                  >
                    <Settings size={16} strokeWidth={2.5} />
                  </button>
                </Link>
                <button
                  id={`evaluate-exam-${template.templateId}`}
                  onClick={() => navigate(`/evaluate?templateId=${template.templateId}`)}
                  className="p-2 rounded-xl hover:bg-success/10 text-text-muted hover:text-success transition-all"
                  title="Upload & Evaluate Papers"
                >
                  <PlayCircle size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium mt-1.5">
              <Calendar size={11} />
              <span>{formatDate(template.createdAt)}</span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5 bg-bg-surface px-3 py-1.5 rounded-xl">
                <Layers size={12} className="text-primary" />
                <span className="text-xs font-bold text-text-primary">
                  {papers.length} papers
                </span>
              </div>
              {donePapers > 0 && (
                <div className="flex items-center gap-1.5 bg-success/8 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 size={12} className="text-success" />
                  <span className="text-xs font-bold text-success">{donePapers} done</span>
                </div>
              )}
              {pendingPapers > 0 && (
                <div className="flex items-center gap-1.5 bg-warning/10 px-3 py-1.5 rounded-xl">
                  <Clock size={12} className="text-warning" />
                  <span className="text-xs font-bold text-warning">{pendingPapers} pending</span>
                </div>
              )}
              {failedPapers > 0 && (
                <div className="flex items-center gap-1.5 bg-error/10 px-3 py-1.5 rounded-xl">
                  <AlertCircle size={12} className="text-error" />
                  <span className="text-xs font-bold text-error">{failedPapers} failed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Expand: Papers List ── */}
        {papers.length > 0 && (
          <>
            <button
              id={`toggle-papers-${template.templateId}`}
              onClick={() => setExpanded((p) => !p)}
              className="mt-5 w-full flex items-center justify-between px-4 py-2.5 bg-bg-surface hover:bg-gray-100 rounded-xl transition-colors text-xs font-bold text-text-secondary"
            >
              <div className="flex items-center gap-2">
                <FileImage size={13} />
                {expanded ? 'Hide Exam Papers' : `View ${papers.length} Exam Paper${papers.length !== 1 ? 's' : ''}`}
              </div>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expanded && (
              <div className="mt-3 space-y-2 animate-fade-in">
                {papers.map((paper) => (
                  <div
                    key={paper.studentPaperId}
                    className="flex items-center gap-3 px-4 py-3 bg-bg-surface/70 hover:bg-bg-surface rounded-xl transition-colors border border-border/20"
                  >
                    {/* Paper thumbnail */}
                    <div className="w-9 h-12 rounded-lg overflow-hidden bg-white border border-border/30 flex-shrink-0 shadow-sm">
                      {paper.imageUrl ? (
                        <img
                          src={`${BACKEND_ORIGIN}${paper.imageUrl}`}
                          alt={paper.studentCode}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <FileText size={14} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{paper.studentCode}</p>
                      <p className="text-[11px] text-text-muted font-medium mt-0.5">{formatDate(paper.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {paper.totalGrade !== null && (
                        <span className="text-xs font-bold text-text-secondary bg-white border border-border/40 px-2.5 py-1 rounded-lg shadow-sm">
                          {paper.totalGrade} pts
                        </span>
                      )}
                      <StatusBadge status={paper.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {papers.length === 0 && (
          <div className="mt-5 px-4 py-4 bg-bg-surface/60 border border-dashed border-border/60 rounded-xl flex items-center gap-3 text-text-muted">
            <FileImage size={16} strokeWidth={1.5} />
            <span className="text-xs font-semibold">No papers uploaded yet.</span>
            <button
              onClick={() => navigate(`/evaluate?templateId=${template.templateId}`)}
              className="ml-auto text-xs font-bold text-primary hover:underline"
            >
              Upload now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────

const Exams: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [papers, setPapers] = useState<Record<number, Paper[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: tmplList } = await api.get<Template[]>('/templates');
        setTemplates(tmplList);

        // Fetch papers for all templates in parallel
        const paperResults = await Promise.allSettled(
          tmplList.map((t) =>
            api.get<Paper[]>(`/templates/${t.templateId}/papers`)
          )
        );

        const paperMap: Record<number, Paper[]> = {};
        paperResults.forEach((res, idx) => {
          const id = tmplList[idx].templateId;
          paperMap[id] = res.status === 'fulfilled' ? res.value.data : [];
        });
        setPapers(paperMap);
      } catch (err) {
        setError('Failed to load exams. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPapers = Object.values(papers).flat().length;
  const totalDone = Object.values(papers).flat().filter((p) => p.status === 'Done').length;

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Exams</h2>
          <p className="text-text-muted mt-1 font-medium">
            Manage your exam templates and review uploaded student papers.
          </p>
        </div>
        <Link to="/upload-template">
          <button
            id="create-new-exam-btn"
            className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2.5} />
            New Exam
          </button>
        </Link>
      </div>

      {/* Summary Stats */}
      {!loading && templates.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Exams', value: templates.length, color: 'text-primary', bg: 'bg-primary/8', icon: <FileText size={18} className="text-primary" /> },
            { label: 'Total Papers', value: totalPapers, color: 'text-secondary', bg: 'bg-secondary/8', icon: <Layers size={18} className="text-secondary" /> },
            { label: 'Evaluated', value: totalDone, color: 'text-success', bg: 'bg-success/8', icon: <CheckCircle2 size={18} className="text-success" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-border/30 p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${s.bg}`}>{s.icon}</div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-text-muted font-semibold">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          id="exam-search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exams..."
          className="w-full bg-white border border-border/40 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-text-primary outline-none focus:border-primary/30 shadow-sm transition-all"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-text-muted">
          <Loader2 size={36} className="animate-spin text-primary" />
          <p className="font-semibold">Loading your exams...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 flex items-center gap-4 font-semibold">
          <AlertCircle size={22} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && templates.length === 0 && (
        <div className="bg-white rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.07)] border border-border/30 p-16 flex flex-col items-center justify-center text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center text-primary">
            <FileText size={36} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">No exams yet</h3>
            <p className="text-text-muted font-medium mt-2 max-w-sm">
              Create your first exam template to start evaluating student papers with AI.
            </p>
          </div>
          <Link to="/upload-template">
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2">
              <Plus size={18} strokeWidth={2.5} />
              Create First Exam
            </button>
          </Link>
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && templates.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted font-semibold">
          No exams match "<span className="text-text-primary">{search}</span>".
        </div>
      )}

      {/* Exam Cards Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((template) => (
            <ExamCard
              key={template.templateId}
              template={template}
              papers={papers[template.templateId] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Exams;
