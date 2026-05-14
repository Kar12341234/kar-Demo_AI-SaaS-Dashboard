"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Clock3,
  DatabaseZap,
  Gauge,
  LayoutDashboard,
  Menu,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X
} from "lucide-react";
import clsx from "clsx";

type NavKey = "Dashboard" | "Analytics" | "AI Assistant" | "Projects" | "Settings";
type Tone = "blue" | "violet" | "cyan" | "emerald";

type Metric = {
  label: string;
  value: string;
  change: string;
  tone: Tone;
  icon: LucideIcon;
};

type ActivityItem = {
  id: number;
  title: string;
  detail: string;
  time: string;
  tone: "cyan" | "violet" | "emerald" | "amber";
};

type Project = {
  id: number;
  name: string;
  category: string;
  status: "Live" | "Training" | "Review" | "Paused";
  progress: number;
  updated: string;
};

type WorkflowStep = {
  label: string;
  description: string;
  state: "Done" | "Running" | "Queued";
};

type Message = {
  id: number;
  role: "User" | "AI";
  body: string;
};

const navigation: Array<{ label: NavKey; icon: LucideIcon }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Analytics", icon: BarChart3 },
  { label: "AI Assistant", icon: Bot },
  { label: "Projects", icon: PanelLeft },
  { label: "Settings", icon: Settings }
];

const initialMetrics: Metric[] = [
  { label: "Total Users", value: "24,892", change: "+18.4%", tone: "blue", icon: Users },
  { label: "Revenue", value: "$128.6K", change: "+12.8%", tone: "emerald", icon: ArrowUpRight },
  { label: "AI Requests", value: "1.82M", change: "+31.2%", tone: "violet", icon: BrainCircuit },
  { label: "Conversion Rate", value: "8.74%", change: "+4.6%", tone: "cyan", icon: Gauge }
];

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    title: "Model routing optimized",
    detail: "Latency dropped by 18% across assistant tasks.",
    time: "2 min ago",
    tone: "cyan"
  },
  {
    id: 2,
    title: "Enterprise workspace upgraded",
    detail: "Nova Labs moved to the Scale plan.",
    time: "18 min ago",
    tone: "emerald"
  },
  {
    id: 3,
    title: "Automation queued",
    detail: "42 invoices are ready for AI extraction.",
    time: "41 min ago",
    tone: "violet"
  },
  {
    id: 4,
    title: "Usage threshold reached",
    detail: "Request volume is above weekday baseline.",
    time: "1 hr ago",
    tone: "amber"
  }
];

const initialProjects: Project[] = [
  { id: 1, name: "Smart Lead Scoring", category: "Sales AI", status: "Live", progress: 92, updated: "Today" },
  { id: 2, name: "Support Copilot", category: "Customer Ops", status: "Training", progress: 68, updated: "Yesterday" },
  { id: 3, name: "Revenue Forecasting", category: "Analytics", status: "Review", progress: 81, updated: "May 10" },
  { id: 4, name: "Document Intelligence", category: "Back Office", status: "Paused", progress: 45, updated: "May 8" }
];

const initialWorkflow: WorkflowStep[] = [
  { label: "Collect data", description: "Sync CRM, billing, and app events.", state: "Done" },
  { label: "Generate insights", description: "Cluster users and detect churn risk.", state: "Running" },
  { label: "Send actions", description: "Create tasks for success managers.", state: "Queued" }
];

const initialMessages: Message[] = [
  { id: 1, role: "AI", body: "Daily revenue is trending up 12.8%. Churn risk is concentrated in trial accounts." },
  { id: 2, role: "User", body: "Create an action plan for the at-risk segment." },
  { id: 3, role: "AI", body: "I prepared 3 automation tasks: onboarding email, usage alert, and customer success follow-up." }
];

const chartSets = {
  "7D": [116, 90, 97, 58, 68, 34, 46, 18, 28],
  "30D": [128, 112, 99, 104, 86, 76, 64, 52, 42],
  "90D": [135, 118, 124, 96, 86, 72, 58, 46, 32]
};

const toneMap: Record<Tone, string> = {
  blue: "from-blue-500/22 to-sky-400/8 text-sky-200",
  violet: "from-violet-500/24 to-fuchsia-400/8 text-violet-200",
  cyan: "from-cyan-400/22 to-blue-500/8 text-cyan-100",
  emerald: "from-emerald-400/22 to-teal-400/8 text-emerald-100"
};

const activityTone: Record<ActivityItem["tone"], string> = {
  amber: "bg-amber-300",
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-300",
  violet: "bg-violet-300"
};

const statusStyle: Record<Project["status"], string> = {
  Live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Training: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  Review: "border-violet-400/30 bg-violet-400/10 text-violet-100",
  Paused: "border-slate-400/30 bg-slate-400/10 text-slate-300"
};

const pageCopy: Record<NavKey, { title: string; description: string }> = {
  Dashboard: {
    title: "Dashboard Overview",
    description: "Monitor product growth, AI request volume, automation health, and active SaaS projects from one control center."
  },
  Analytics: {
    title: "Analytics",
    description: "Explore usage, revenue, request quality, and operational performance across the AI platform."
  },
  "AI Assistant": {
    title: "AI Assistant",
    description: "Chat with the assistant, run automation workflows, and track task execution status."
  },
  Projects: {
    title: "Projects",
    description: "Create, update, filter, and manage AI product workstreams from the project pipeline."
  },
  Settings: {
    title: "Settings",
    description: "Manage workspace preferences, notifications, AI model routing, and security options."
  }
};

function pointsFrom(values: number[]) {
  const gap = 440 / (values.length - 1);
  return values.map((value, index) => `${Math.round(index * gap)},${value}`).join(" ");
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavKey>("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [activities, setActivities] = useState(initialActivities);
  const [projects, setProjects] = useState(initialProjects);
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [messages, setMessages] = useState(initialMessages);
  const [workspace, setWorkspace] = useState("Acme Growth Cloud");
  const [range, setRange] = useState<keyof typeof chartSets>("7D");

  const addActivity = (item: Omit<ActivityItem, "id" | "time">) => {
    setActivities((current) => [{ ...item, id: Date.now(), time: "Just now" }, ...current].slice(0, 7));
  };

  const runReport = () => {
    setMetrics((current) =>
      current.map((metric) =>
        metric.label === "AI Requests" ? { ...metric, value: "1.86M", change: "+33.9%" } : metric
      )
    );
    addActivity({
      title: "AI report generated",
      detail: "Executive summary, churn signals, and revenue notes are ready.",
      tone: "cyan"
    });
  };

  const runAutomation = () => {
    setWorkflow((current) => current.map((step) => ({ ...step, state: step.label === "Send actions" ? "Running" : "Done" })));
    addActivity({
      title: "Automation workflow started",
      detail: "Customer success tasks are being generated from assistant insights.",
      tone: "violet"
    });
    window.setTimeout(() => {
      setWorkflow((current) => current.map((step) => ({ ...step, state: "Done" })));
      addActivity({
        title: "Automation workflow completed",
        detail: "Follow-up tasks were created for the at-risk customer segment.",
        tone: "emerald"
      });
    }, 1400);
  };

  const exportAnalytics = () => {
    const rows = ["range,users,revenue,ai_requests,conversion", `${range},24892,128600,1860000,8.74`];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `neuraldesk-analytics-${range}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    addActivity({
      title: "Analytics exported",
      detail: `${range} performance data was downloaded as CSV.`,
      tone: "cyan"
    });
  };

  const renderContent = () => {
    if (activeNav === "Analytics") {
      return (
        <>
          <AnalyticsPanel range={range} setRange={setRange} onExport={exportAnalytics} />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
          <div className="mt-5">
            <ActivityPanel activities={activities} onClear={() => setActivities([])} />
          </div>
        </>
      );
    }

    if (activeNav === "AI Assistant") {
      return (
        <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <AssistantPanel
            messages={messages}
            setMessages={setMessages}
            workflow={workflow}
            onRunAutomation={runAutomation}
            addActivity={addActivity}
          />
          <ActivityPanel activities={activities} onClear={() => setActivities([])} />
        </div>
      );
    }

    if (activeNav === "Projects") {
      return (
        <div className="mt-6">
          <ProjectsTable projects={projects} setProjects={setProjects} addActivity={addActivity} />
        </div>
      );
    }

    if (activeNav === "Settings") {
      return (
        <div className="mt-6">
          <SettingsPanel workspace={workspace} setWorkspace={setWorkspace} addActivity={addActivity} />
        </div>
      );
    }

    return (
      <>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <AnalyticsPanel range={range} setRange={setRange} onExport={exportAnalytics} compact />
          <AssistantPanel
            messages={messages}
            setMessages={setMessages}
            workflow={workflow}
            onRunAutomation={runAutomation}
            addActivity={addActivity}
            compact
          />
        </div>

        <div className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]">
          <ProjectsTable projects={projects} setProjects={setProjects} addActivity={addActivity} compact />
          <ActivityPanel activities={activities} onClear={() => setActivities([])} />
        </div>
      </>
    );
  };

  return (
    <main className="dashboard-grid min-h-screen overflow-hidden px-4 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] gap-5">
        <Sidebar
          activeNav={activeNav}
          collapsed={sidebarCollapsed}
          setActiveNav={setActiveNav}
          setCollapsed={setSidebarCollapsed}
        />

        <section className="min-w-0 flex-1 pb-8 lg:pl-0">
          <MobileHeader
            activeNav={activeNav}
            isOpen={mobileNavOpen}
            setActiveNav={setActiveNav}
            setIsOpen={setMobileNavOpen}
          />
          <Header activeNav={activeNav} workspace={workspace} onRunReport={runReport} />
          {renderContent()}
        </section>
      </div>
    </main>
  );
}

function Sidebar({
  activeNav,
  collapsed,
  setActiveNav,
  setCollapsed
}: {
  activeNav: NavKey;
  collapsed: boolean;
  setActiveNav: (nav: NavKey) => void;
  setCollapsed: (collapsed: boolean) => void;
}) {
  return (
    <aside
      className={clsx(
        "glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 rounded-2xl p-4 transition-all duration-300 lg:block",
        collapsed ? "w-[104px]" : "w-72"
      )}
    >
      <div className="flex h-full flex-col">
        <div className={clsx("flex items-center gap-3 px-2 py-3", collapsed && "justify-center px-0")}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div className={clsx("min-w-0 transition-opacity", collapsed && "sr-only")}>
            <p className="text-sm font-semibold text-white">NeuralDesk AI</p>
            <p className="text-xs text-slate-400">SaaS Control Center</p>
          </div>
        </div>

        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={clsx(
            "mt-3 flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white",
            collapsed ? "w-full" : "px-3"
          )}
          onClick={() => setCollapsed(!collapsed)}
          type="button"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          <span className={clsx(collapsed && "sr-only")}>{collapsed ? "Expand" : "Collapse"}</span>
        </button>

        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <button
              aria-label={item.label}
              title={collapsed ? item.label : undefined}
              className={clsx(
                "flex w-full items-center rounded-xl py-3 text-left text-sm font-medium transition",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                activeNav === item.label
                  ? "border border-cyan-300/20 bg-cyan-300/10 text-white shadow-glow"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              )}
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              type="button"
            >
              <item.icon className="h-4 w-4" />
              <span className={clsx(collapsed && "sr-only")}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div
          className={clsx(
            "mt-auto rounded-2xl border border-violet-300/18 bg-violet-300/8 transition-all",
            collapsed ? "p-3" : "p-4"
          )}
        >
          <div className={clsx("flex items-center gap-2 text-sm font-semibold text-violet-100", collapsed && "justify-center")}>
            <Rocket className="h-4 w-4" />
            <span className={clsx(collapsed && "sr-only")}>Scale Plan</span>
          </div>
          <p className={clsx("mt-2 text-sm leading-6 text-slate-400", collapsed && "sr-only")}>
            82% of monthly AI compute used. Capacity forecast remains healthy.
          </p>
          <div className={clsx("h-2 rounded-full bg-slate-800", collapsed ? "mt-3" : "mt-4")}>
            <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({
  activeNav,
  isOpen,
  setActiveNav,
  setIsOpen
}: {
  activeNav: NavKey;
  isOpen: boolean;
  setActiveNav: (nav: NavKey) => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="glass-panel rounded-2xl p-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">NeuralDesk AI</p>
            <p className="text-xs text-slate-400">Control Center</p>
          </div>
        </div>
        <button
          aria-label="Toggle navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isOpen ? (
        <nav className="mt-3 grid gap-2 sm:grid-cols-3">
          {navigation.map((item) => (
            <button
              className={clsx(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium",
                activeNav === item.label ? "bg-cyan-300/12 text-cyan-100" : "bg-white/5 text-slate-300"
              )}
              key={item.label}
              onClick={() => {
                setActiveNav(item.label);
                setIsOpen(false);
              }}
              type="button"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

function Header({
  activeNav,
  workspace,
  onRunReport
}: {
  activeNav: NavKey;
  workspace: string;
  onRunReport: () => void;
}) {
  return (
    <header className="mt-5 flex flex-col gap-4 lg:mt-0 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs font-medium text-cyan-100">
          <CircleDot className="h-3.5 w-3.5" />
          AI operations live
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">{pageCopy[activeNav].title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{pageCopy[activeNav].description}</p>
      </div>

      <div className="glass-panel flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs text-slate-400">Workspace</p>
          <p className="text-sm font-semibold text-white">{workspace}</p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          onClick={onRunReport}
          type="button"
        >
          <Sparkles className="h-4 w-4" />
          Run AI Report
        </button>
      </div>
    </header>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{metric.label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
        </div>
        <div className={clsx("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br", toneMap[metric.tone])}>
          <metric.icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
          {metric.change}
        </span>
        <span className="text-xs text-slate-500">vs last month</span>
      </div>
    </article>
  );
}

function AnalyticsPanel({
  range,
  setRange,
  onExport,
  compact = false
}: {
  range: keyof typeof chartSets;
  setRange: (range: keyof typeof chartSets) => void;
  onExport: () => void;
  compact?: boolean;
}) {
  const chartPoints = pointsFrom(chartSets[range]);
  const chartArea = `${chartPoints} 440,150 0,150`;

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">Analytics Section</p>
          <h2 className="mt-2 text-xl font-semibold text-white">AI request growth</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(chartSets) as Array<keyof typeof chartSets>).map((item) => (
            <button
              className={clsx(
                "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                range === item ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100" : "border-white/10 bg-white/5 text-slate-300"
              )}
              key={item}
              onClick={() => setRange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
          <button
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
            onClick={onExport}
            type="button"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className={clsx("mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4", compact ? "h-72" : "h-[360px]")}>
        <svg
          aria-label="Simulated AI request line chart"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 440 150"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.34" />
              <stop offset="65%" stopColor="#7c3aed" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 60, 90, 120].map((y) => (
            <line key={y} stroke="rgba(148, 163, 184, 0.16)" strokeWidth="1" x1="0" x2="440" y1={y} y2={y} />
          ))}
          <polygon fill="url(#areaGradient)" points={chartArea} />
          <polyline
            fill="none"
            points={chartPoints}
            stroke="#22d3ee"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <polyline
            fill="none"
            points={pointsFrom([128, 122, 112, 104, 86, 76, 64, 52, 42])}
            stroke="#8b5cf6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            opacity="0.82"
          />
        </svg>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ["Automation runs", range === "7D" ? "12,480" : range === "30D" ? "44,120" : "129,840", "+22%"],
          ["Active agents", "186", "+14%"],
          ["Saved hours", range === "90D" ? "11,760" : "3,920", "+37%"]
        ].map(([label, value, change]) => (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4" key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-xl font-semibold text-white">{value}</p>
              <p className="text-xs font-semibold text-emerald-200">{change}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AssistantPanel({
  messages,
  setMessages,
  workflow,
  onRunAutomation,
  addActivity,
  compact = false
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  workflow: WorkflowStep[];
  onRunAutomation: () => void;
  addActivity: (item: Omit<ActivityItem, "id" | "time">) => void;
  compact?: boolean;
}) {
  const [prompt, setPrompt] = useState("");

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      return;
    }
    const nextId = Date.now();
    setMessages((current) => [
      ...current,
      { id: nextId, role: "User", body: cleanPrompt },
      {
        id: nextId + 1,
        role: "AI",
        body: "I found 3 priority segments, queued a follow-up workflow, and updated the project risk score."
      }
    ]);
    setPrompt("");
    addActivity({
      title: "Assistant response created",
      detail: "A new AI recommendation was added to the workspace thread.",
      tone: "violet"
    });
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-100">AI Assistant Panel</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Task command queue</h2>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-300/15"
          onClick={onRunAutomation}
          type="button"
        >
          <Play className="h-4 w-4" />
          Run
        </button>
      </div>

      <div className={clsx("mt-6 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/50 p-4", compact ? "max-h-56" : "max-h-[420px]")}>
        {messages.map((message) => (
          <div
            className={clsx(
              "rounded-xl border px-4 py-3 text-sm leading-6",
              message.role === "AI"
                ? "border-cyan-300/18 bg-cyan-300/8 text-cyan-50"
                : "ml-auto max-w-[88%] border-violet-300/18 bg-violet-300/10 text-violet-50"
            )}
            key={message.id}
          >
            <p className="mb-1 text-xs font-semibold text-slate-400">{message.role}</p>
            {message.body}
          </div>
        ))}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
        <input
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask about churn, revenue, or automation..."
          value={prompt}
        />
        <button
          aria-label="Send message"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 text-slate-950 transition hover:brightness-110"
          type="submit"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-5 space-y-4">
        {workflow.map((step, index) => (
          <div className="flex gap-3" key={step.label}>
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full border",
                  step.state === "Done" && "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
                  step.state === "Running" && "border-cyan-300/40 bg-cyan-300/10 text-cyan-100",
                  step.state === "Queued" && "border-slate-500/40 bg-slate-500/10 text-slate-300"
                )}
              >
                {step.state === "Done" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : step.state === "Running" ? (
                  <DatabaseZap className="h-4 w-4" />
                ) : (
                  <Clock3 className="h-4 w-4" />
                )}
              </div>
              {index < workflow.length - 1 ? <div className="mt-2 h-10 w-px bg-white/10" /> : null}
            </div>
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                  {step.state}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsTable({
  projects,
  setProjects,
  addActivity,
  compact = false
}: {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addActivity: (item: Omit<ActivityItem, "id" | "time">) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(!compact);
  const [draft, setDraft] = useState({ name: "", category: "Automation", progress: 50 });

  const filteredProjects = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return projects;
    }
    return projects.filter((project) =>
      [project.name, project.category, project.status].some((value) => value.toLowerCase().includes(cleanQuery))
    );
  }, [projects, query]);

  const addProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      return;
    }
    const project: Project = {
      id: Date.now(),
      name,
      category: draft.category,
      status: "Training",
      progress: draft.progress,
      updated: "Just now"
    };
    setProjects((current) => [project, ...current]);
    setDraft({ name: "", category: "Automation", progress: 50 });
    setIsAdding(false);
    addActivity({
      title: "Project created",
      detail: `${project.name} was added to the AI product pipeline.`,
      tone: "emerald"
    });
  };

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects((current) => current.map((project) => (project.id === id ? { ...project, ...updates, updated: "Just now" } : project)));
  };

  const deleteProject = (project: Project) => {
    setProjects((current) => current.filter((item) => item.id !== project.id));
    addActivity({
      title: "Project removed",
      detail: `${project.name} was removed from the dashboard.`,
      tone: "amber"
    });
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">Projects</p>
          <h2 className="mt-2 text-xl font-semibold text-white">AI product pipeline</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              className="min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              value={query}
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            onClick={() => setIsAdding((current) => !current)}
            type="button"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {isAdding ? (
        <form className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_180px_180px_auto]" onSubmit={addProject}>
          <input
            className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Project name"
            value={draft.name}
          />
          <select
            className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
            value={draft.category}
          >
            <option>Automation</option>
            <option>Analytics</option>
            <option>Sales AI</option>
            <option>Customer Ops</option>
          </select>
          <input
            className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            max="100"
            min="0"
            onChange={(event) => setDraft((current) => ({ ...current, progress: Number(event.target.value) }))}
            type="number"
            value={draft.progress}
          />
          <button className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950" type="submit">
            Add
          </button>
        </form>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-500">
              <th className="px-3 py-2 font-medium">Project name</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Progress</th>
              <th className="px-3 py-2 font-medium">Last updated</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr className="bg-white/[0.035] text-sm" key={project.id}>
                <td className="rounded-l-xl border-y border-l border-white/10 px-3 py-4">
                  <p className="font-semibold text-white">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{project.category}</p>
                </td>
                <td className="border-y border-white/10 px-3 py-4">
                  <select
                    className={clsx("rounded-full border px-2.5 py-1 text-xs font-medium outline-none", statusStyle[project.status])}
                    onChange={(event) => updateProject(project.id, { status: event.target.value as Project["status"] })}
                    value={project.status}
                  >
                    <option>Live</option>
                    <option>Training</option>
                    <option>Review</option>
                    <option>Paused</option>
                  </select>
                </td>
                <td className="border-y border-white/10 px-3 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      className="w-28 accent-cyan-300"
                      max="100"
                      min="0"
                      onChange={(event) => updateProject(project.id, { progress: Number(event.target.value) })}
                      type="range"
                      value={project.progress}
                    />
                    <span className="w-9 text-xs text-slate-300">{project.progress}%</span>
                  </div>
                </td>
                <td className="border-y border-white/10 px-3 py-4 text-slate-400">{project.updated}</td>
                <td className="rounded-r-xl border-y border-r border-white/10 px-3 py-4">
                  <button
                    aria-label={`Delete ${project.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-rose-300/30 hover:bg-rose-300/10 hover:text-rose-100"
                    onClick={() => deleteProject(project)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActivityPanel({
  activities,
  onClear
}: {
  activities: ActivityItem[];
  onClear: () => void;
}) {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-100">Recent Activity</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Operations feed</h2>
        </div>
        <button
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
          onClick={onClear}
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-400">No recent activity.</div>
        ) : (
          activities.map((item) => (
            <article className="rounded-xl border border-white/10 bg-white/[0.035] p-4" key={item.id}>
              <div className="flex items-start gap-3">
                <span className={clsx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", activityTone[item.tone])} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold leading-6 text-white">{item.title}</p>
                    <p className="shrink-0 whitespace-nowrap text-xs leading-6 text-slate-500">{item.time}</p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function SettingsPanel({
  workspace,
  setWorkspace,
  addActivity
}: {
  workspace: string;
  setWorkspace: (workspace: string) => void;
  addActivity: (item: Omit<ActivityItem, "id" | "time">) => void;
}) {
  const [draftWorkspace, setDraftWorkspace] = useState(workspace);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoReports, setAutoReports] = useState(true);
  const [model, setModel] = useState("GPT-5 Automation");

  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWorkspace(draftWorkspace.trim() || workspace);
    addActivity({
      title: "Settings saved",
      detail: `${draftWorkspace.trim() || workspace} preferences were updated.`,
      tone: "emerald"
    });
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100">Settings</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Workspace controls</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={saveSettings}>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-300">Workspace name</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            onChange={(event) => setDraftWorkspace(event.target.value)}
            value={draftWorkspace}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-300">AI model route</span>
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            onChange={(event) => setModel(event.target.value)}
            value={model}
          >
            <option>GPT-5 Automation</option>
            <option>Fast Support Copilot</option>
            <option>Analytics Reasoner</option>
          </select>
        </label>

        <Toggle label="Email alerts" icon={Bell} checked={emailAlerts} onChange={setEmailAlerts} />
        <Toggle label="Auto reports" icon={Activity} checked={autoReports} onChange={setAutoReports} />

        <div className="lg:col-span-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            type="submit"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
}

function Toggle({
  label,
  icon: Icon,
  checked,
  onChange
}: {
  label: string;
  icon: LucideIcon;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <span className="flex items-center gap-3 text-sm font-semibold text-white">
        <Icon className="h-4 w-4 text-cyan-100" />
        {label}
      </span>
      <button
        aria-pressed={checked}
        className={clsx(
          "relative h-7 w-12 rounded-full border transition",
          checked ? "border-cyan-300/40 bg-cyan-300/30" : "border-white/10 bg-slate-800"
        )}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={clsx(
            "absolute top-1 h-5 w-5 rounded-full bg-white transition",
            checked ? "left-6" : "left-1"
          )}
        />
      </button>
    </label>
  );
}
