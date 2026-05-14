import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Clock3,
  DatabaseZap,
  Gauge,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  PanelLeft,
  Rocket,
  Settings,
  Sparkles,
  Users
} from "lucide-react";
import clsx from "clsx";

type Metric = {
  label: string;
  value: string;
  change: string;
  tone: "blue" | "violet" | "cyan" | "emerald";
  icon: LucideIcon;
};

type ActivityItem = {
  title: string;
  detail: string;
  time: string;
  tone: "cyan" | "violet" | "emerald" | "amber";
};

type Project = {
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

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Analytics", icon: BarChart3 },
  { label: "AI Assistant", icon: Bot },
  { label: "Projects", icon: PanelLeft },
  { label: "Settings", icon: Settings }
];

const metrics: Metric[] = [
  {
    label: "Total Users",
    value: "24,892",
    change: "+18.4%",
    tone: "blue",
    icon: Users
  },
  {
    label: "Revenue",
    value: "$128.6K",
    change: "+12.8%",
    tone: "emerald",
    icon: ArrowUpRight
  },
  {
    label: "AI Requests",
    value: "1.82M",
    change: "+31.2%",
    tone: "violet",
    icon: BrainCircuit
  },
  {
    label: "Conversion Rate",
    value: "8.74%",
    change: "+4.6%",
    tone: "cyan",
    icon: Gauge
  }
];

const activities: ActivityItem[] = [
  {
    title: "Model routing optimized",
    detail: "Latency dropped by 18% across assistant tasks.",
    time: "2 min ago",
    tone: "cyan"
  },
  {
    title: "Enterprise workspace upgraded",
    detail: "Nova Labs moved to the Scale plan.",
    time: "18 min ago",
    tone: "emerald"
  },
  {
    title: "Automation queued",
    detail: "42 invoices are ready for AI extraction.",
    time: "41 min ago",
    tone: "violet"
  },
  {
    title: "Usage threshold reached",
    detail: "Request volume is above weekday baseline.",
    time: "1 hr ago",
    tone: "amber"
  }
];

const projects: Project[] = [
  {
    name: "Smart Lead Scoring",
    category: "Sales AI",
    status: "Live",
    progress: 92,
    updated: "Today"
  },
  {
    name: "Support Copilot",
    category: "Customer Ops",
    status: "Training",
    progress: 68,
    updated: "Yesterday"
  },
  {
    name: "Revenue Forecasting",
    category: "Analytics",
    status: "Review",
    progress: 81,
    updated: "May 10"
  },
  {
    name: "Document Intelligence",
    category: "Back Office",
    status: "Paused",
    progress: 45,
    updated: "May 8"
  }
];

const workflow: WorkflowStep[] = [
  {
    label: "Collect data",
    description: "Sync CRM, billing, and app events.",
    state: "Done"
  },
  {
    label: "Generate insights",
    description: "Cluster users and detect churn risk.",
    state: "Running"
  },
  {
    label: "Send actions",
    description: "Create tasks for success managers.",
    state: "Queued"
  }
];

const chartPoints = "0,116 55,90 110,97 165,58 220,68 275,34 330,46 385,18 440,28";
const chartArea = `${chartPoints} 440,150 0,150`;

const toneMap: Record<Metric["tone"], string> = {
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

export default function Home() {
  return (
    <main className="dashboard-grid min-h-screen overflow-hidden px-4 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] gap-5">
        <Sidebar />

        <section className="min-w-0 flex-1 pb-8 lg:pl-0">
          <MobileHeader />
          <Header />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
            <AnalyticsPanel />
            <AssistantPanel />
          </div>

          <div className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]">
            <ProjectsTable />
            <ActivityPanel />
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar() {
  return (
    <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-2xl p-4 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">NeuralDesk AI</p>
            <p className="text-xs text-slate-400">SaaS Control Center</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navigation.map((item) => (
            <a
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                item.active
                  ? "border border-cyan-300/20 bg-cyan-300/10 text-white shadow-glow"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              )}
              href="#"
              key={item.label}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-violet-300/18 bg-violet-300/8 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-100">
            <Rocket className="h-4 w-4" />
            Scale Plan
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            82% of monthly AI compute used. Capacity forecast remains healthy.
          </p>
          <div className="mt-4 h-2 rounded-full bg-slate-800">
            <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader() {
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
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {navigation.map((item) => (
          <a
            className={clsx(
              "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium",
              item.active ? "bg-cyan-300/12 text-cyan-100" : "bg-white/5 text-slate-300"
            )}
            href="#"
            key={item.label}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function Header() {
  return (
    <header className="mt-5 flex flex-col gap-4 lg:mt-0 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs font-medium text-cyan-100">
          <CircleDot className="h-3.5 w-3.5" />
          AI operations live
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
          Dashboard Overview
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Monitor product growth, AI request volume, automation health, and active SaaS projects from one polished control center.
        </p>
      </div>

      <div className="glass-panel flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs text-slate-400">Workspace</p>
          <p className="text-sm font-semibold text-white">Acme Growth Cloud</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110">
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
        <div
          className={clsx(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br",
            toneMap[metric.tone]
          )}
        >
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

function AnalyticsPanel() {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">Analytics Section</p>
          <h2 className="mt-2 text-xl font-semibold text-white">AI request growth</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Avg latency", "0.82s"],
            ["Success", "99.2%"],
            ["Tokens", "48.3M"]
          ].map(([label, value]) => (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2" key={label}>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 h-72 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
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
            points="0,128 55,122 110,112 165,104 220,86 275,76 330,64 385,52 440,42"
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
          ["Automation runs", "12,480", "+22%"],
          ["Active agents", "186", "+14%"],
          ["Saved hours", "3,920", "+37%"]
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

function AssistantPanel() {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-100">AI Assistant Panel</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Task command queue</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/10">
          <Bot className="h-5 w-5 text-violet-100" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Customer insight assistant</p>
            <p className="text-xs text-slate-400">Analyzing user segments and churn signals</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/8 px-3 py-2 text-sm text-cyan-100">
          <Activity className="h-4 w-4" />
          Running automation workflow
        </div>
      </div>

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

function ProjectsTable() {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">Projects</p>
          <h2 className="mt-2 text-xl font-semibold text-white">AI product pipeline</h2>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
          <Rocket className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-500">
              <th className="px-3 py-2 font-medium">Project name</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Progress</th>
              <th className="px-3 py-2 font-medium">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr className="bg-white/[0.035] text-sm" key={project.name}>
                <td className="rounded-l-xl border-y border-l border-white/10 px-3 py-4">
                  <p className="font-semibold text-white">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{project.category}</p>
                </td>
                <td className="border-y border-white/10 px-3 py-4">
                  <span className={clsx("rounded-full border px-2.5 py-1 text-xs font-medium", statusStyle[project.status])}>
                    {project.status}
                  </span>
                </td>
                <td className="border-y border-white/10 px-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-20 rounded-full bg-slate-800 sm:w-28">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="w-9 text-xs text-slate-300">{project.progress}%</span>
                  </div>
                </td>
                <td className="rounded-r-xl border-y border-r border-white/10 px-3 py-4 text-slate-400">
                  {project.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActivityPanel() {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-100">Recent Activity</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Operations feed</h2>
        </div>
        <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
          Live
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {activities.map((item) => (
          <article className="rounded-xl border border-white/10 bg-white/[0.035] p-4" key={item.title}>
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
        ))}
      </div>
    </section>
  );
}
