import { useState, useEffect, useCallback, useRef } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Eye, Users, MousePointerClick, FileText, TrendingUp, AlertCircle,
  LogOut, RefreshCw, Calendar, Smartphone, Monitor, Tablet,
  ArrowUp, ArrowDown, Minus, BarChart2, Activity,
  MessageSquare, Clock, Percent, Sparkles, Copy, Printer,
  CheckCheck, ChevronDown, ChevronUp, History, X, Send,
  Bot, FileBarChart, Loader2,
} from 'lucide-react';

const BACKEND_URL = `https://${projectId}.supabase.co/functions/v1/make-server-41141608`;
const ADMIN_PASSWORD = 'admin2025';

const CHART_COLORS = {
  blue900: '#1e3a8a',
  blue700: '#1d4ed8',
  blue500: '#3b82f6',
  blue300: '#93c5fd',
  yellow: '#eab308',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f97316',
  purple: '#8b5cf6',
  gray: '#94a3b8',
};

const DEVICE_COLORS = [CHART_COLORS.blue900, CHART_COLORS.blue500, CHART_COLORS.blue300];

type DateRange = 'hoje' | '7dias' | '30dias' | 'tudo';

interface Totals {
  totalPageViews: number;
  totalSessions: number;
  eventCounts: Record<string, number>;
  devices: { mobile: number; desktop: number; tablet: number };
  referrers: Record<string, number>;
  faqClicks: Record<string, number>;
  sectionViews: Record<string, number>;
  scrollDepths: Record<string, number>;
  dailyPageViews: Record<string, number>;
  dailySessions: Record<string, number>;
  dailyEventCounts: Record<string, Record<string, number>>;
  hourlyPageViews: Record<string, number>;
}

interface EventRecord {
  id: string;
  event: string;
  sessionId: string;
  properties: Record<string, any>;
  url: string;
  referrer: string;
  device: string;
  timestamp: string;
  date: string;
  hour: number;
}

function getDateRange(range: DateRange): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  if (range === 'hoje') {
    start.setHours(0, 0, 0, 0);
  } else if (range === '7dias') {
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  } else if (range === '30dias') {
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setFullYear(2020, 0, 1);
  }
  return { start, end };
}

function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function eventLabel(event: string): string {
  const labels: Record<string, string> = {
    page_view: 'Visualização de Página',
    cta_click: 'Clique em CTA',
    form_start: 'Início de Formulário',
    form_submit: 'Envio de Formulário',
    form_success: 'Formulário com Sucesso',
    form_error: 'Erro no Formulário',
    faq_click: 'Clique no FAQ',
    scroll_depth: 'Profundidade de Rolagem',
    section_view: 'Seção Visualizada',
    exit_intent: 'Intenção de Saída',
    time_on_page: 'Tempo na Página',
    nav_click: 'Clique na Navegação',
  };
  return labels[event] || event;
}

function sectionLabel(section: string): string {
  const labels: Record<string, string> = {
    hero: 'Hero / Início',
    galeria: 'Galeria de Fotos',
    'como-funciona': 'Como Funciona',
    servicos: 'Serviços',
    confianca: 'Selos de Confiança',
    formulario: 'Formulário Principal',
    faq: 'Perguntas Frequentes',
    parceiros: 'Parceiros',
    rodape: 'Rodapé',
  };
  return labels[section] || section;
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'blue',
  trend,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: 'up' | 'down' | 'neutral';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };

  return (
    <div className={`bg-white rounded-xl border-2 p-5 shadow-sm ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
          <Icon className={`w-5 h-5 ${iconColors[color]}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> :
             trend === 'down' ? <ArrowDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-600">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
      <div className="w-1 h-4 bg-blue-700 rounded-full" />
      {children}
    </h3>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="flex items-center gap-2">
            <span className="font-medium">{p.name}:</span>
            <span>{fmt(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AdminAnalytics() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ totals: Totals; eventsLog: EventRecord[] } | null>(null);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('7dias');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // --- AI Report Agent state ---
  const [showAgent, setShowAgent] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    clientName: '',
    period: '7 dias',
    reportType: 'completo',
    focus: [] as string[],
    additionalNotes: '',
  });
  const [generatedReport, setGeneratedReport] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // --- AI Report: build analytics payload ---
  // Tudo calculado internamente para evitar TDZ (Temporal Dead Zone)
  // com variáveis declaradas mais abaixo no componente.
  const buildAnalyticsPayload = useCallback(() => {
    if (!data) return {};

    const { start, end } = getDateRange(dateRange);
    const dates = getDatesInRange(start, end);

    const getCount = (eventType: string): number => {
      if (dateRange === 'tudo') return data.totals.eventCounts?.[eventType] || 0;
      return dates.reduce((sum, d) => sum + (data.totals.dailyEventCounts?.[d]?.[eventType] || 0), 0);
    };

    const pv = dateRange === 'tudo'
      ? (data.totals.totalPageViews || 0)
      : dates.reduce((s, d) => s + (data.totals.dailyPageViews?.[d] || 0), 0);
    const sess = dateRange === 'tudo'
      ? (data.totals.totalSessions || 0)
      : dates.reduce((s, d) => s + (data.totals.dailySessions?.[d] || 0), 0);

    const ctac  = getCount('cta_click');
    const fs    = getCount('form_start');
    const fsub  = getCount('form_submit');
    const fsucc = getCount('form_success');
    const ferr  = getCount('form_error');
    const ei    = getCount('exit_intent');
    const faqc  = getCount('faq_click');

    const timeEvents = data.eventsLog.filter(e => e.event === 'time_on_page' && e.properties?.seconds);
    const avgTime = timeEvents.length > 0
      ? Math.round(timeEvents.reduce((s, e) => s + Number(e.properties.seconds || 0), 0) / timeEvents.length)
      : 0;

    return {
      pageViews: pv, sessions: sess, ctaClicks: ctac,
      formStarts: fs, formSubmits: fsub, formSuccess: fsucc,
      formErrors: ferr, exitIntents: ei, faqClicks: faqc,
      conversionRate: pv > 0 ? (fsucc / pv) * 100 : 0,
      formSuccessRate: fsub > 0 ? (fsucc / fsub) * 100 : 0,
      ctaRate: pv > 0 ? (ctac / pv) * 100 : 0,
      avgTimeOnPage: avgTime,
      devices: data.totals.devices || {},
      scrollDepths: data.totals.scrollDepths || {},
      topReferrers: Object.entries(data.totals.referrers || {})
        .sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([ref, count]) => ({ ref: ref === 'direct' ? 'Acesso direto' : ref, count })),
      topSections: Object.entries(data.totals.sectionViews || {})
        .sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([section, count]) => ({ section: sectionLabel(section), count })),
      topFaq: Object.entries(data.totals.faqClicks || {})
        .sort((a, b) => b[1] - a[1]).slice(0, 3),
    };
  }, [data, dateRange]);

  const generateReport = async () => {
    if (!reportConfig.clientName.trim()) {
      setReportError('Informe o nome do cliente para gerar o relatório.');
      return;
    }
    setReportLoading(true);
    setReportError('');
    setGeneratedReport('');
    try {
      const res = await fetch(`${BACKEND_URL}/analytics/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Analytics-Password': ADMIN_PASSWORD,
        },
        body: JSON.stringify({
          analyticsData: buildAnalyticsPayload(),
          config: reportConfig,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao gerar relatório');
      setGeneratedReport(json.report);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (e: any) {
      setReportError(e.message || 'Erro ao gerar relatório. Tente novamente.');
    } finally {
      setReportLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/analytics/reports-history`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Analytics-Password': ADMIN_PASSWORD,
        },
      });
      const json = await res.json();
      setReportHistory(json.history || []);
    } catch (e) {
      console.error('Erro ao carregar histórico:', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head>
      <meta charset="UTF-8"/>
      <title>Relatório — ${reportConfig.clientName}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 24px; color: #1a202c; }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 12px; }
        h2 { color: #1e3a8a; margin-top: 32px; }
        h3 { color: #374151; }
        strong { color: #111827; }
        ul, ol { padding-left: 20px; }
        li { margin-bottom: 6px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .badge { background: #1e3a8a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        @media print { body { margin: 20px; } }
      </style>
    </head><body>
      <div class="header">
        <h1>Relatório de Marketing Digital</h1>
        <span class="badge">PlacaMercosul</span>
      </div>
      <p><strong>Cliente:</strong> ${reportConfig.clientName} &nbsp;|&nbsp; <strong>Período:</strong> ${reportConfig.period} &nbsp;|&nbsp; <strong>Gerado em:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      <hr/>
      <div>${generatedReport
        .replace(/## (.+)/g, '<h2>$1</h2>')
        .replace(/### (.+)/g, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\n/g, '<br/>')
      }</div>
    </body></html>`);
    win.document.close();
    win.print();
  };

  // Format markdown-like report to basic HTML for display
  const formatReport = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-blue-900 mt-8 mb-3 pb-2 border-b border-blue-100">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-gray-800 mt-5 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-blue-900 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '{{BOLD:$1}}');
        return <li key={i} className="ml-4 mb-1 text-gray-700 list-disc">{content.split(/(\{\{BOLD:.+?\}\})/).map((part, j) => {
          if (part.startsWith('{{BOLD:')) return <strong key={j} className="text-gray-900">{part.slice(7, -2)}</strong>;
          return part;
        })}</li>;
      }
      if (line.match(/^\d+\. /)) {
        const content = line.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, '{{BOLD:$1}}');
        return <li key={i} className="ml-4 mb-1 text-gray-700 list-decimal">{content.split(/(\{\{BOLD:.+?\}\})/).map((part, j) => {
          if (part.startsWith('{{BOLD:')) return <strong key={j} className="text-gray-900">{part.slice(7, -2)}</strong>;
          return part;
        })}</li>;
      }
      if (line.trim() === '' || line.trim() === '---') return <div key={i} className="h-3" />;
      const processed = line.replace(/\*\*(.+?)\*\*/g, '{{BOLD:$1}}');
      return <p key={i} className="text-gray-700 mb-2 leading-relaxed">{processed.split(/(\{\{BOLD:.+?\}\})/).map((part, j) => {
        if (part.startsWith('{{BOLD:')) return <strong key={j} className="text-gray-900 font-semibold">{part.slice(7, -2)}</strong>;
        return part;
      })}</p>;
    });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Analytics-Password': ADMIN_PASSWORD,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao buscar dados');
      }
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  useEffect(() => {
    if (!authenticated || !autoRefresh) return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [authenticated, autoRefresh, fetchData]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Senha incorreta. Tente novamente.');
    }
  };

  // --- Compute filtered metrics ---
  const { start, end } = getDateRange(dateRange);

  const getFilteredEventCount = (eventType: string): number => {
    if (!data) return 0;
    if (dateRange === 'tudo') return data.totals.eventCounts?.[eventType] || 0;
    const dates = getDatesInRange(start, end);
    return dates.reduce((sum, d) => sum + (data.totals.dailyEventCounts?.[d]?.[eventType] || 0), 0);
  };

  const filteredPageViews = dateRange === 'tudo'
    ? (data?.totals.totalPageViews || 0)
    : getDatesInRange(start, end).reduce((s, d) => s + (data?.totals.dailyPageViews?.[d] || 0), 0);

  const filteredSessions = dateRange === 'tudo'
    ? (data?.totals.totalSessions || 0)
    : getDatesInRange(start, end).reduce((s, d) => s + (data?.totals.dailySessions?.[d] || 0), 0);

  const filteredCtaClicks = getFilteredEventCount('cta_click');
  const filteredFormStarts = getFilteredEventCount('form_start');
  const filteredFormSubmits = getFilteredEventCount('form_submit');
  const filteredFormSuccess = getFilteredEventCount('form_success');
  const filteredExitIntent = getFilteredEventCount('exit_intent');

  const conversionRate = filteredPageViews > 0 ? (filteredFormSuccess / filteredPageViews) * 100 : 0;
  const formSuccessRate = filteredFormSubmits > 0 ? (filteredFormSuccess / filteredFormSubmits) * 100 : 0;
  const ctaRate = filteredPageViews > 0 ? (filteredCtaClicks / filteredPageViews) * 100 : 0;

  // --- Daily trend chart data ---
  const dailyChartData = (() => {
    if (!data) return [];
    const dates = getDatesInRange(
      dateRange === 'hoje' ? start :
      dateRange === '7dias' ? new Date(Date.now() - 7 * 86400000) :
      dateRange === '30dias' ? new Date(Date.now() - 30 * 86400000) :
      new Date(Date.now() - 30 * 86400000),
      end
    );
    return dates.map(d => ({
      date: d.slice(5), // MM-DD
      'Visitas': data.totals.dailyPageViews?.[d] || 0,
      'Sessões': data.totals.dailySessions?.[d] || 0,
      'CTAs': data.totals.dailyEventCounts?.[d]?.['cta_click'] || 0,
      'Form Envios': data.totals.dailyEventCounts?.[d]?.['form_submit'] || 0,
    }));
  })();

  // --- Hourly chart (only for "hoje") ---
  const hourlyChartData = (() => {
    if (!data || dateRange !== 'hoje') return [];
    const today = new Date().toISOString().split('T')[0];
    return Array.from({ length: 24 }, (_, h) => ({
      hora: `${String(h).padStart(2, '0')}h`,
      Visitas: data.totals.hourlyPageViews?.[`${today}_${String(h).padStart(2, '0')}`] || 0,
    }));
  })();

  // --- Device data ---
  const deviceData = data ? [
    { name: 'Desktop', value: data.totals.devices?.desktop || 0 },
    { name: 'Mobile', value: data.totals.devices?.mobile || 0 },
    { name: 'Tablet', value: data.totals.devices?.tablet || 0 },
  ].filter(d => d.value > 0) : [];

  // --- Scroll depth data ---
  const scrollData = data ? [
    { profundidade: '25%', Visitas: data.totals.scrollDepths?.['25'] || 0 },
    { profundidade: '50%', Visitas: data.totals.scrollDepths?.['50'] || 0 },
    { profundidade: '75%', Visitas: data.totals.scrollDepths?.['75'] || 0 },
    { profundidade: '100%', Visitas: data.totals.scrollDepths?.['100'] || 0 },
  ] : [];

  // --- Top sections ---
  const sectionsData = data ? Object.entries(data.totals.sectionViews || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([section, count]) => ({ section: sectionLabel(section), count })) : [];

  // --- Top referrers ---
  const referrersData = data ? Object.entries(data.totals.referrers || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([ref, count]) => ({ ref: ref === 'direct' ? 'Acesso direto' : ref, count })) : [];

  // --- FAQ data ---
  const faqData = data ? Object.entries(data.totals.faqClicks || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8) : [];

  // --- Top events ---
  const eventsData = data ? Object.entries(data.totals.eventCounts || {})
    .sort((a, b) => b[1] - a[1])
    .map(([evt, count]) => ({ evento: eventLabel(evt), count })) : [];

  // --- Conversion funnel ---
  const funnelData = [
    { etapa: 'Visitas', count: filteredPageViews, color: CHART_COLORS.blue900 },
    { etapa: 'CTA Click', count: filteredCtaClicks, color: CHART_COLORS.blue700 },
    { etapa: 'Form Start', count: filteredFormStarts, color: CHART_COLORS.blue500 },
    { etapa: 'Form Submit', count: filteredFormSubmits, color: CHART_COLORS.yellow },
    { etapa: 'Sucesso', count: filteredFormSuccess, color: CHART_COLORS.green },
  ];

  // --- Avg time on page from events log ---
  const avgTimeOnPage = (() => {
    if (!data) return 0;
    const timeEvents = data.eventsLog.filter(e => e.event === 'time_on_page' && e.properties?.seconds);
    if (timeEvents.length === 0) return 0;
    const total = timeEvents.reduce((s, e) => s + Number(e.properties.seconds || 0), 0);
    return Math.round(total / timeEvents.length);
  })();

  // --- Login screen ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Analítico</h1>
            <p className="text-gray-500 text-sm mt-1">PlacaMercosul — Acesso restrito</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha de acesso</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite a senha"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {passwordError}
                </p>
              )}
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              Acessar Painel
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            Apenas administradores autorizados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Painel Analítico</h1>
                <p className="text-blue-200 text-xs">PlacaMercosul — Monitoramento de Tráfego</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-blue-200 text-xs hidden sm:block">
                  Atualizado: {lastUpdated.toLocaleTimeString('pt-BR')}
                </span>
              )}
              <button
                onClick={() => setAutoRefresh(r => !r)}
                className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border font-semibold transition-all ${
                  autoRefresh
                    ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/30 animate-pulse'
                    : 'border-blue-300 text-white bg-white/10 hover:bg-white/20'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? '🟢 Ao Vivo (30s)' : '⏸ Ao Vivo'}
              </button>
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-blue-400 text-blue-200 hover:bg-white/10 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <button
                onClick={() => setAuthenticated(false)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-blue-400 text-blue-200 hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Date Range Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">Período:</span>
          {(['hoje', '7dias', '30dias', 'tudo'] as DateRange[]).map(r => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                dateRange === r
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {r === 'hoje' ? 'Hoje' : r === '7dias' ? '7 Dias' : r === '30dias' ? '30 Dias' : 'Tudo'}
            </button>
          ))}
          {loading && <span className="text-xs text-blue-600 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Carregando...</span>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={fetchData} className="ml-auto text-sm text-red-600 underline">Tentar novamente</button>
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div>
          <SectionTitle>Métricas Principais</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <KpiCard
              icon={Eye}
              label="Visualizações"
              value={fmt(filteredPageViews)}
              sub="Total de page views"
              color="blue"
            />
            <KpiCard
              icon={Users}
              label="Sessões Únicas"
              value={fmt(filteredSessions)}
              sub="Visitantes distintos"
              color="blue"
            />
            <KpiCard
              icon={MousePointerClick}
              label="Cliques em CTA"
              value={fmt(filteredCtaClicks)}
              sub={`Taxa: ${fmtPct(ctaRate)} das visitas`}
              color="yellow"
            />
            <KpiCard
              icon={FileText}
              label="Form. Enviados"
              value={fmt(filteredFormSubmits)}
              sub={`${fmt(filteredFormSuccess)} com sucesso`}
              color="purple"
            />
            <KpiCard
              icon={TrendingUp}
              label="Taxa de Conversão"
              value={fmtPct(conversionRate)}
              sub="Sucesso / Visitas"
              color="green"
            />
            <KpiCard
              icon={Clock}
              label="Tempo Médio"
              value={avgTimeOnPage > 0 ? `${avgTimeOnPage}s` : '—'}
              sub="Tempo na página"
              color="blue"
            />
          </div>
        </div>

        {/* ── Secondary KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={Activity} label="Início de Formulário" value={fmt(filteredFormStarts)} sub="Interações com form" color="blue" />
          <KpiCard icon={Percent} label="Taxa Form → Sucesso" value={fmtPct(formSuccessRate)} sub="Eficiência do formulário" color="green" />
          <KpiCard icon={AlertCircle} label="Intenção de Saída" value={fmt(filteredExitIntent)} sub="Exit intent detectado" color="red" />
          <KpiCard icon={MessageSquare} label="Cliques no FAQ" value={fmt(getFilteredEventCount('faq_click'))} sub="Dúvidas consultadas" color="purple" />
        </div>

        {/* ── Trend Chart ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <SectionTitle>
            {dateRange === 'hoje' ? 'Visitas por Hora (Hoje)' : `Tendência de Tráfego (${dateRange === '7dias' ? '7 dias' : dateRange === '30dias' ? '30 dias' : 'Histórico'})`}
          </SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            {dateRange === 'hoje' ? (
              <BarChart data={hourlyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hora" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Visitas" fill={CHART_COLORS.blue700} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={dailyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} />
                <Line type="monotone" dataKey="Visitas" stroke={CHART_COLORS.blue900} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Sessões" stroke={CHART_COLORS.blue500} strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="CTAs" stroke={CHART_COLORS.yellow} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Form Envios" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* ── Mid Row: Funnel + Devices ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SectionTitle>Funil de Conversão</SectionTitle>
            <div className="space-y-3">
              {funnelData.map((step, i) => {
                const pct = funnelData[0].count > 0 ? (step.count / funnelData[0].count) * 100 : 0;
                const dropoff = i > 0 && funnelData[i - 1].count > 0
                  ? ((funnelData[i - 1].count - step.count) / funnelData[i - 1].count * 100)
                  : 0;
                return (
                  <div key={step.etapa}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ backgroundColor: step.color }}>
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{step.etapa}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {i > 0 && dropoff > 0 && (
                          <span className="text-xs text-red-500">-{fmtPct(dropoff)}</span>
                        )}
                        <span className="text-sm font-bold text-gray-900">{fmt(step.count)}</span>
                        <span className="text-xs text-gray-500 w-12 text-right">{fmtPct(pct)}</span>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(pct, 0.5)}%`, backgroundColor: step.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SectionTitle>Dispositivos</SectionTitle>
            {deviceData.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {deviceData.map((_, index) => (
                        <Cell key={index} fill={DEVICE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [fmt(v), '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {deviceData.map((d, i) => {
                    const total = deviceData.reduce((s, x) => s + x.value, 0);
                    const pct = total > 0 ? (d.value / total * 100).toFixed(1) : '0';
                    const Icon = d.name === 'Mobile' ? Smartphone : d.name === 'Tablet' ? Tablet : Monitor;
                    return (
                      <div key={d.name} className="flex items-center gap-3">
                        <Icon className="w-4 h-4" style={{ color: DEVICE_COLORS[i] }} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{d.name}</span>
                            <span className="text-gray-900 font-bold">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: DEVICE_COLORS[i] }} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{fmt(d.value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Sem dados disponíveis</div>
            )}
          </div>
        </div>

        {/* ── Scroll Depth + Sections ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scroll Depth */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SectionTitle>Profundidade de Rolagem Atingida</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scrollData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="profundidade" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Visitas" radius={[6, 6, 0, 0]}>
                  {scrollData.map((_, i) => (
                    <Cell key={i} fill={[CHART_COLORS.blue900, CHART_COLORS.blue700, CHART_COLORS.blue500, CHART_COLORS.blue300][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-2 text-center">Quantos usuários chegaram até cada ponto da página</p>
          </div>

          {/* Top Sections */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SectionTitle>Seções Mais Visualizadas</SectionTitle>
            {sectionsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sectionsData} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="section" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Visualizações" fill={CHART_COLORS.blue700} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Sem dados disponíveis</div>
            )}
          </div>
        </div>

        {/* ── Events + Referrers ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Events */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SectionTitle>Todos os Eventos (Acumulado)</SectionTitle>
            {eventsData.length > 0 ? (
              <div className="space-y-2">
                {eventsData.map((e, i) => {
                  const max = eventsData[0]?.count || 1;
                  return (
                    <div key={e.evento} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-0.5">
                          <span className="text-gray-700 font-medium">{e.evento}</span>
                          <span className="font-bold text-gray-900">{fmt(e.count)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full rounded-full bg-blue-700 transition-all" style={{ width: `${(e.count / max) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Sem dados disponíveis</div>
            )}
          </div>

          {/* Top Referrers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SectionTitle>Origens de Tráfego</SectionTitle>
            {referrersData.length > 0 ? (
              <div className="space-y-2">
                {referrersData.map((r, i) => {
                  const max = referrersData[0]?.count || 1;
                  return (
                    <div key={r.ref} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-0.5">
                          <span className="text-gray-700 font-medium truncate max-w-[200px]">{r.ref}</span>
                          <span className="font-bold text-gray-900">{fmt(r.count)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full rounded-full bg-yellow-500 transition-all" style={{ width: `${(r.count / max) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Sem dados disponíveis</div>
            )}
          </div>
        </div>

        {/* ── FAQ Clicks ── */}
        {faqData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SectionTitle>FAQ — Perguntas Mais Acessadas</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">#</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Pergunta</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">Cliques</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {faqData.map(([q, count], i) => {
                    const total = faqData.reduce((s, [, c]) => s + c, 0);
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 px-3 text-gray-400">{i + 1}</td>
                        <td className="py-2.5 px-3 text-gray-700">{q}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-gray-900">{count}</td>
                        <td className="py-2.5 px-3 text-right text-gray-500">{fmtPct((count / total) * 100)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Recent Events Log ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Feed de Eventos Recentes</SectionTitle>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              Últimos {Math.min(data?.eventsLog.length || 0, 50)} eventos
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium rounded-l-lg">Evento</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Dispositivo</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Origem</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Detalhes</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium rounded-r-lg">Horário</th>
                </tr>
              </thead>
              <tbody>
                {(data?.eventsLog || []).slice(0, 50).map((evt) => {
                  const DeviceIcon = evt.device === 'mobile' ? Smartphone : evt.device === 'tablet' ? Tablet : Monitor;
                  const eventBadgeColor: Record<string, string> = {
                    page_view: 'bg-blue-100 text-blue-700',
                    cta_click: 'bg-yellow-100 text-yellow-700',
                    form_start: 'bg-purple-100 text-purple-700',
                    form_submit: 'bg-orange-100 text-orange-700',
                    form_success: 'bg-green-100 text-green-700',
                    form_error: 'bg-red-100 text-red-700',
                    faq_click: 'bg-indigo-100 text-indigo-700',
                    scroll_depth: 'bg-gray-100 text-gray-600',
                    section_view: 'bg-teal-100 text-teal-700',
                    exit_intent: 'bg-red-100 text-red-600',
                    time_on_page: 'bg-slate-100 text-slate-600',
                    nav_click: 'bg-cyan-100 text-cyan-700',
                  };
                  const details = (() => {
                    if (evt.event === 'faq_click') return evt.properties?.question?.substring(0, 40) + '...' || '';
                    if (evt.event === 'section_view') return sectionLabel(evt.properties?.section || '');
                    if (evt.event === 'scroll_depth') return `${evt.properties?.depth}% da página`;
                    if (evt.event === 'time_on_page') return `${evt.properties?.seconds}s`;
                    if (evt.event === 'cta_click') return evt.properties?.location || '';
                    if (evt.event === 'form_start' || evt.event === 'form_submit' || evt.event === 'form_success') return evt.properties?.formId || '';
                    if (evt.event === 'nav_click') return evt.properties?.destination || '';
                    return '';
                  })();
                  return (
                    <tr key={evt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${eventBadgeColor[evt.event] || 'bg-gray-100 text-gray-600'}`}>
                          {eventLabel(evt.event)}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1 text-gray-500">
                          <DeviceIcon className="w-3.5 h-3.5" />
                          <span className="text-xs capitalize">{evt.device}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-500 max-w-[150px] truncate">
                        {evt.referrer === 'direct' ? 'Acesso direto' : evt.referrer}
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-500 max-w-[200px] truncate">
                        {details || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-2 px-3 text-right text-xs text-gray-400 whitespace-nowrap">
                        {new Date(evt.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        <br />
                        <span className="text-gray-300">{evt.date}</span>
                      </td>
                    </tr>
                  );
                })}
                {(!data || data.eventsLog.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Nenhum evento registrado ainda. Os eventos aparecerão aqui assim que o site receber visitas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 🤖 AI REPORT AGENT ── */}
        <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-purple-200">
          {/* Agent Header Banner */}
          <button
            onClick={() => setShowAgent(a => !a)}
            className="w-full bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white p-6 flex items-center justify-between hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <Bot className="w-7 h-7 text-purple-300" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Agente IA — Gerador de Relatórios</h2>
                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">GPT-4o</span>
                </div>
                <p className="text-blue-200 text-sm mt-0.5">Gere relatórios profissionais de marketing em segundos para enviar ao cliente</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setShowHistory(h => !h); if (!showHistory) loadHistory(); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setShowHistory(h => !h); if (!showHistory) loadHistory(); }}}
                className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                Histórico
              </span>
              {showAgent ? <ChevronUp className="w-5 h-5 text-blue-300" /> : <ChevronDown className="w-5 h-5 text-blue-300" />}
            </div>
          </button>

          {/* History drawer */}
          {showHistory && (
            <div className="bg-gray-900 border-b border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white text-sm font-semibold flex items-center gap-2"><History className="w-4 h-4 text-purple-400" /> Relatórios Anteriores</h4>
                <button onClick={() => setShowHistory(false)}><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              {historyLoading ? (
                <div className="flex items-center justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-purple-400" /></div>
              ) : reportHistory.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Nenhum relatório gerado ainda.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {reportHistory.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setGeneratedReport(r.report); setShowHistory(false); setShowAgent(true); }}
                      className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">{r.clientName}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{r.period} · {r.reportType} · {new Date(r.generatedAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <FileBarChart className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Agent Body */}
          {showAgent && (
            <div className="bg-white p-6 space-y-6">
              {/* Config Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <FileBarChart className="w-4 h-4 text-purple-600" />
                    Configuração do Relatório
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Cliente <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={reportConfig.clientName}
                      onChange={e => setReportConfig(c => ({ ...c, clientName: e.target.value }))}
                      placeholder="Ex: Empresa X, João Silva..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Período Analisado</label>
                    <select
                      value={reportConfig.period}
                      onChange={e => setReportConfig(c => ({ ...c, period: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Hoje">Hoje</option>
                      <option value="7 dias">Últimos 7 dias</option>
                      <option value="15 dias">Últimos 15 dias</option>
                      <option value="30 dias">Últimos 30 dias</option>
                      <option value="2 meses">Últimos 2 meses</option>
                      <option value="3 meses">Último trimestre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Relatório</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'completo', label: 'Completo', desc: 'Todas as seções' },
                        { id: 'executivo', label: 'Executivo', desc: 'Resumido' },
                        { id: 'tecnico', label: 'Técnico', desc: 'Aprofundado' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setReportConfig(c => ({ ...c, reportType: t.id }))}
                          className={`p-2.5 rounded-lg border-2 text-center transition-all ${
                            reportConfig.reportType === t.id
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 text-gray-600 hover:border-purple-200'
                          }`}
                        >
                          <div className="font-semibold text-xs">{t.label}</div>
                          <div className="text-xs opacity-70 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Foco e Instruções
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Áreas de Foco (opcional)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Conversão', 'Tráfego', 'Engajamento', 'Mobile', 'FAQ', 'Formulários', 'Origens', 'Retenção'].map(f => (
                        <button
                          key={f}
                          onClick={() => setReportConfig(c => ({
                            ...c,
                            focus: c.focus.includes(f) ? c.focus.filter(x => x !== f) : [...c.focus, f]
                          }))}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                            reportConfig.focus.includes(f)
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações Adicionais (opcional)</label>
                    <textarea
                      value={reportConfig.additionalNotes}
                      onChange={e => setReportConfig(c => ({ ...c, additionalNotes: e.target.value }))}
                      placeholder="Ex: Houve campanha no Instagram essa semana. Cliente quer focar em conversões mobile..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-2">📊 Dados que serão enviados para a IA:</p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="bg-white rounded p-1.5"><span className="font-bold text-blue-700">{fmt(filteredPageViews)}</span><br/><span className="text-gray-500">Visitas</span></div>
                      <div className="bg-white rounded p-1.5"><span className="font-bold text-green-600">{fmt(filteredFormSuccess)}</span><br/><span className="text-gray-500">Conversões</span></div>
                      <div className="bg-white rounded p-1.5"><span className="font-bold text-purple-600">{fmtPct(conversionRate)}</span><br/><span className="text-gray-500">Taxa conv.</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {reportError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {reportError}
                </div>
              )}

              <button
                onClick={generateReport}
                disabled={reportLoading || !data}
                className="w-full bg-gradient-to-r from-blue-900 to-purple-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {reportLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando relatório com GPT-4o... aguarde ~15s
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Relatório com IA
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {generatedReport && (
                <div ref={reportRef} className="border-2 border-purple-100 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileBarChart className="w-5 h-5 text-purple-300" />
                      <div>
                        <p className="text-white font-bold text-sm">Relatório — {reportConfig.clientName}</p>
                        <p className="text-blue-200 text-xs">{reportConfig.period} · {reportConfig.reportType} · {new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-lg transition-colors"
                      >
                        {copied ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copiado!' : 'Copiar texto'}
                      </button>
                      <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                        Imprimir / PDF
                      </button>
                      <button
                        onClick={() => setGeneratedReport('')}
                        className="text-white bg-white/10 hover:bg-white/20 border border-white/20 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-8 max-h-[800px] overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                      <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-blue-900">
                        <div>
                          <h1 className="text-2xl font-bold text-blue-900">Relatório de Marketing Digital</h1>
                          <p className="text-gray-500 text-sm mt-1">
                            <strong>Cliente:</strong> {reportConfig.clientName} &nbsp;·&nbsp;
                            <strong>Período:</strong> {reportConfig.period} &nbsp;·&nbsp;
                            <strong>Gerado em:</strong> {new Date().toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right hidden sm:block flex-shrink-0 ml-4">
                          <p className="text-xs text-gray-400 font-medium">PlacaMercosul</p>
                          <p className="text-xs text-gray-400">Portal de Emplacamentos</p>
                        </div>
                      </div>
                      <div>{formatReport(generatedReport)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-6">
          PlacaMercosul Analytics — {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}