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
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  DatabaseZap,
  Gauge,
  Globe2,
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
type Lang = "en" | "zh-Hant" | "zh-Hans";
type Translate = (key: string, values?: Record<string, string>) => string;

type Metric = {
  label: string;
  value: string;
  change: string;
  tone: Tone;
  icon: LucideIcon;
};

type ActivityItem = {
  id: number;
  titleKey: string;
  detailKey: string;
  timeKey: string;
  values?: Record<string, string>;
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
    titleKey: "Model routing optimized",
    detailKey: "Latency dropped by 18% across assistant tasks.",
    timeKey: "2 min ago",
    tone: "cyan"
  },
  {
    id: 2,
    titleKey: "Enterprise workspace upgraded",
    detailKey: "Nova Labs moved to the Scale plan.",
    timeKey: "18 min ago",
    tone: "emerald"
  },
  {
    id: 3,
    titleKey: "Automation queued",
    detailKey: "42 invoices are ready for AI extraction.",
    timeKey: "41 min ago",
    tone: "violet"
  },
  {
    id: 4,
    titleKey: "Usage threshold reached",
    detailKey: "Request volume is above weekday baseline.",
    timeKey: "1 hr ago",
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

const languageOptions: Array<{ value: Lang; label: string }> = [
  { value: "zh-Hant", label: "繁中" },
  { value: "zh-Hans", label: "简中" },
  { value: "en", label: "EN" }
];

const workspaceOptions = ["Acme Growth Cloud", "Nova Labs AI", "Orbit Finance Ops"];

const translations: Record<Lang, Record<string, string>> = {
  en: {},
  "zh-Hant": {
    Dashboard: "儀表板",
    Analytics: "分析",
    "AI Assistant": "AI 助手",
    Projects: "專案",
    Settings: "設定",
    "SaaS Control Center": "SaaS 控制中心",
    "Control Center": "控制中心",
    "Scale Plan": "Scale 方案",
    "82% of monthly AI compute used. Capacity forecast remains healthy.": "本月 AI 運算量已使用 82%。容量預測仍保持健康。",
    Expand: "展開",
    Collapse: "收合",
    "Expand sidebar": "展開側邊欄",
    "Collapse sidebar": "收合側邊欄",
    "AI operations live": "AI 營運即時監控",
    Language: "語言",
    "Select language": "選擇語言",
    "Select workspace": "選擇工作區",
    Workspace: "工作區",
    "Run AI Report": "產生 AI 報告",
    "Dashboard Overview": "儀表板總覽",
    "Monitor product growth, AI request volume, automation health, and active SaaS projects from one control center.": "從同一個控制中心監控產品成長、AI 請求量、自動化健康度和進行中的 SaaS 專案。",
    "Explore usage, revenue, request quality, and operational performance across the AI platform.": "探索 AI 平台的使用量、營收、請求品質與營運表現。",
    "Chat with the assistant, run automation workflows, and track task execution status.": "與 AI 助手對話、執行自動化流程，並追蹤任務執行狀態。",
    "Create, update, filter, and manage AI product workstreams from the project pipeline.": "在專案管線中建立、更新、篩選並管理 AI 產品工作流。",
    "Manage workspace preferences, notifications, AI model routing, and security options.": "管理工作區偏好、通知、AI 模型路由與安全選項。",
    "Total Users": "總用戶",
    Revenue: "營收",
    "AI Requests": "AI 請求",
    "Conversion Rate": "轉換率",
    "vs last month": "較上月",
    "Analytics Section": "分析區",
    "AI request growth": "AI 請求成長",
    "Export CSV": "匯出 CSV",
    "Automation runs": "自動化執行",
    "Active agents": "啟用代理",
    "Saved hours": "節省時數",
    "AI Assistant Panel": "AI 助手面板",
    "Task command queue": "任務指令佇列",
    Run: "執行",
    User: "使用者",
    AI: "AI",
    "Ask about churn, revenue, or automation...": "詢問流失、營收或自動化...",
    "Collect data": "收集資料",
    "Sync CRM, billing, and app events.": "同步 CRM、帳務與應用事件。",
    "Generate insights": "產生洞察",
    "Cluster users and detect churn risk.": "分群使用者並偵測流失風險。",
    "Send actions": "發送行動",
    "Create tasks for success managers.": "為客戶成功經理建立任務。",
    Done: "完成",
    Running: "執行中",
    Queued: "排隊中",
    "AI product pipeline": "AI 產品管線",
    "Search projects": "搜尋專案",
    "New Project": "新增專案",
    "Project name": "專案名稱",
    Status: "狀態",
    Progress: "進度",
    "Last updated": "最後更新",
    Actions: "操作",
    Add: "新增",
    Automation: "自動化",
    "Sales AI": "銷售 AI",
    "Customer Ops": "客戶營運",
    Live: "上線",
    Training: "訓練中",
    Review: "審核",
    Paused: "暫停",
    Today: "今天",
    Yesterday: "昨天",
    "Just now": "剛剛",
    "May 10": "5 月 10 日",
    "May 8": "5 月 8 日",
    "Recent Activity": "最近活動",
    "Operations feed": "營運動態",
    Clear: "清除",
    "No recent activity.": "目前沒有最近活動。",
    "Workspace controls": "工作區控制",
    "Workspace name": "工作區名稱",
    "AI model route": "AI 模型路由",
    "Email alerts": "Email 通知",
    "Auto reports": "自動報告",
    "Save Settings": "儲存設定",
    "GPT-5 Automation": "GPT-5 自動化",
    "Fast Support Copilot": "快速客服 Copilot",
    "Analytics Reasoner": "分析推理模型",
    "Model routing optimized": "模型路由已最佳化",
    "Latency dropped by 18% across assistant tasks.": "助手任務延遲下降 18%。",
    "Enterprise workspace upgraded": "企業工作區已升級",
    "Nova Labs moved to the Scale plan.": "Nova Labs 已升級至 Scale 方案。",
    "Automation queued": "自動化已排程",
    "42 invoices are ready for AI extraction.": "42 張發票已準備進行 AI 擷取。",
    "Usage threshold reached": "使用量已達門檻",
    "Request volume is above weekday baseline.": "請求量高於工作日基準。",
    "2 min ago": "2 分鐘前",
    "18 min ago": "18 分鐘前",
    "41 min ago": "41 分鐘前",
    "1 hr ago": "1 小時前",
    "AI report generated": "AI 報告已產生",
    "Executive summary, churn signals, and revenue notes are ready.": "主管摘要、流失訊號與營收註記已完成。",
    "Automation workflow started": "自動化流程已啟動",
    "Customer success tasks are being generated from assistant insights.": "正在根據助手洞察產生客戶成功任務。",
    "Automation workflow completed": "自動化流程已完成",
    "Follow-up tasks were created for the at-risk customer segment.": "已為高風險客群建立跟進任務。",
    "Analytics exported": "分析資料已匯出",
    "{range} performance data was downloaded as CSV.": "{range} 表現資料已下載為 CSV。",
    "Assistant response created": "助手回覆已建立",
    "A new AI recommendation was added to the workspace thread.": "新的 AI 建議已加入工作區對話串。",
    "Project created": "專案已建立",
    "{name} was added to the AI product pipeline.": "{name} 已加入 AI 產品管線。",
    "Project removed": "專案已移除",
    "{name} was removed from the dashboard.": "{name} 已從儀表板移除。",
    "Settings saved": "設定已儲存",
    "{name} preferences were updated.": "{name} 的偏好設定已更新。",
    "Daily revenue is trending up 12.8%. Churn risk is concentrated in trial accounts.": "每日營收上升 12.8%。流失風險主要集中在試用帳戶。",
    "Create an action plan for the at-risk segment.": "為高風險客群建立行動計畫。",
    "I prepared 3 automation tasks: onboarding email, usage alert, and customer success follow-up.": "我已準備 3 個自動化任務：入門 Email、使用量提醒與客戶成功跟進。",
    "I found 3 priority segments, queued a follow-up workflow, and updated the project risk score.": "我找到 3 個優先客群，已排入跟進流程，並更新專案風險分數。"
  },
  "zh-Hans": {
    Dashboard: "仪表盘",
    Analytics: "分析",
    "AI Assistant": "AI 助手",
    Projects: "项目",
    Settings: "设置",
    "SaaS Control Center": "SaaS 控制中心",
    "Control Center": "控制中心",
    "Scale Plan": "Scale 方案",
    "82% of monthly AI compute used. Capacity forecast remains healthy.": "本月 AI 算力已使用 82%。容量预测仍保持健康。",
    Expand: "展开",
    Collapse: "收起",
    "Expand sidebar": "展开侧边栏",
    "Collapse sidebar": "收起侧边栏",
    "AI operations live": "AI 运营实时监控",
    Language: "语言",
    "Select language": "选择语言",
    "Select workspace": "选择工作区",
    Workspace: "工作区",
    "Run AI Report": "生成 AI 报告",
    "Dashboard Overview": "仪表盘总览",
    "Monitor product growth, AI request volume, automation health, and active SaaS projects from one control center.": "从同一个控制中心监控产品增长、AI 请求量、自动化健康度和进行中的 SaaS 项目。",
    "Explore usage, revenue, request quality, and operational performance across the AI platform.": "探索 AI 平台的使用量、收入、请求质量与运营表现。",
    "Chat with the assistant, run automation workflows, and track task execution status.": "与 AI 助手对话、运行自动化流程，并跟踪任务执行状态。",
    "Create, update, filter, and manage AI product workstreams from the project pipeline.": "在项目管线中创建、更新、筛选并管理 AI 产品工作流。",
    "Manage workspace preferences, notifications, AI model routing, and security options.": "管理工作区偏好、通知、AI 模型路由与安全选项。",
    "Total Users": "总用户",
    Revenue: "收入",
    "AI Requests": "AI 请求",
    "Conversion Rate": "转化率",
    "vs last month": "较上月",
    "Analytics Section": "分析区",
    "AI request growth": "AI 请求增长",
    "Export CSV": "导出 CSV",
    "Automation runs": "自动化运行",
    "Active agents": "启用代理",
    "Saved hours": "节省时数",
    "AI Assistant Panel": "AI 助手面板",
    "Task command queue": "任务指令队列",
    Run: "运行",
    User: "用户",
    AI: "AI",
    "Ask about churn, revenue, or automation...": "询问流失、收入或自动化...",
    "Collect data": "收集数据",
    "Sync CRM, billing, and app events.": "同步 CRM、账务与应用事件。",
    "Generate insights": "生成洞察",
    "Cluster users and detect churn risk.": "对用户分群并检测流失风险。",
    "Send actions": "发送行动",
    "Create tasks for success managers.": "为客户成功经理创建任务。",
    Done: "完成",
    Running: "运行中",
    Queued: "排队中",
    "AI product pipeline": "AI 产品管线",
    "Search projects": "搜索项目",
    "New Project": "新增项目",
    "Project name": "项目名称",
    Status: "状态",
    Progress: "进度",
    "Last updated": "最后更新",
    Actions: "操作",
    Add: "新增",
    Automation: "自动化",
    "Sales AI": "销售 AI",
    "Customer Ops": "客户运营",
    Live: "上线",
    Training: "训练中",
    Review: "审核",
    Paused: "暂停",
    Today: "今天",
    Yesterday: "昨天",
    "Just now": "刚刚",
    "May 10": "5 月 10 日",
    "May 8": "5 月 8 日",
    "Recent Activity": "最近活动",
    "Operations feed": "运营动态",
    Clear: "清除",
    "No recent activity.": "暂无最近活动。",
    "Workspace controls": "工作区控制",
    "Workspace name": "工作区名称",
    "AI model route": "AI 模型路由",
    "Email alerts": "Email 通知",
    "Auto reports": "自动报告",
    "Save Settings": "保存设置",
    "GPT-5 Automation": "GPT-5 自动化",
    "Fast Support Copilot": "快速客服 Copilot",
    "Analytics Reasoner": "分析推理模型",
    "Model routing optimized": "模型路由已优化",
    "Latency dropped by 18% across assistant tasks.": "助手任务延迟下降 18%。",
    "Enterprise workspace upgraded": "企业工作区已升级",
    "Nova Labs moved to the Scale plan.": "Nova Labs 已升级至 Scale 方案。",
    "Automation queued": "自动化已排程",
    "42 invoices are ready for AI extraction.": "42 张发票已准备进行 AI 提取。",
    "Usage threshold reached": "使用量已达阈值",
    "Request volume is above weekday baseline.": "请求量高于工作日基准。",
    "2 min ago": "2 分钟前",
    "18 min ago": "18 分钟前",
    "41 min ago": "41 分钟前",
    "1 hr ago": "1 小时前",
    "AI report generated": "AI 报告已生成",
    "Executive summary, churn signals, and revenue notes are ready.": "管理摘要、流失信号与收入备注已完成。",
    "Automation workflow started": "自动化流程已启动",
    "Customer success tasks are being generated from assistant insights.": "正在根据助手洞察生成客户成功任务。",
    "Automation workflow completed": "自动化流程已完成",
    "Follow-up tasks were created for the at-risk customer segment.": "已为高风险客群创建跟进任务。",
    "Analytics exported": "分析数据已导出",
    "{range} performance data was downloaded as CSV.": "{range} 表现数据已下载为 CSV。",
    "Assistant response created": "助手回复已创建",
    "A new AI recommendation was added to the workspace thread.": "新的 AI 建议已加入工作区对话串。",
    "Project created": "项目已创建",
    "{name} was added to the AI product pipeline.": "{name} 已加入 AI 产品管线。",
    "Project removed": "项目已移除",
    "{name} was removed from the dashboard.": "{name} 已从仪表盘移除。",
    "Settings saved": "设置已保存",
    "{name} preferences were updated.": "{name} 的偏好设置已更新。",
    "Daily revenue is trending up 12.8%. Churn risk is concentrated in trial accounts.": "每日收入上升 12.8%。流失风险主要集中在试用账户。",
    "Create an action plan for the at-risk segment.": "为高风险客群创建行动计划。",
    "I prepared 3 automation tasks: onboarding email, usage alert, and customer success follow-up.": "我已准备 3 个自动化任务：入门 Email、使用量提醒与客户成功跟进。",
    "I found 3 priority segments, queued a follow-up workflow, and updated the project risk score.": "我找到 3 个优先客群，已排入跟进流程，并更新项目风险分数。"
  }
};

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
  const [language, setLanguage] = useState<Lang>("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [activities, setActivities] = useState(initialActivities);
  const [projects, setProjects] = useState(initialProjects);
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [messages, setMessages] = useState(initialMessages);
  const [workspace, setWorkspace] = useState("Acme Growth Cloud");
  const [range, setRange] = useState<keyof typeof chartSets>("7D");
  const t: Translate = (key, values) => {
    const template = translations[language][key] ?? key;
    return Object.entries(values ?? {}).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
  };

  const addActivity = (item: Omit<ActivityItem, "id" | "timeKey">) => {
    setActivities((current) => [{ ...item, id: Date.now(), timeKey: "Just now" }, ...current].slice(0, 7));
  };

  const runReport = () => {
    setMetrics((current) =>
      current.map((metric) =>
        metric.label === "AI Requests" ? { ...metric, value: "1.86M", change: "+33.9%" } : metric
      )
    );
    addActivity({
      titleKey: "AI report generated",
      detailKey: "Executive summary, churn signals, and revenue notes are ready.",
      tone: "cyan"
    });
  };

  const runAutomation = () => {
    setWorkflow((current) => current.map((step) => ({ ...step, state: step.label === "Send actions" ? "Running" : "Done" })));
    addActivity({
      titleKey: "Automation workflow started",
      detailKey: "Customer success tasks are being generated from assistant insights.",
      tone: "violet"
    });
    window.setTimeout(() => {
      setWorkflow((current) => current.map((step) => ({ ...step, state: "Done" })));
      addActivity({
        titleKey: "Automation workflow completed",
        detailKey: "Follow-up tasks were created for the at-risk customer segment.",
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
      titleKey: "Analytics exported",
      detailKey: "{range} performance data was downloaded as CSV.",
      values: { range },
      tone: "cyan"
    });
  };

  const renderContent = () => {
    if (activeNav === "Analytics") {
      return (
        <>
          <AnalyticsPanel range={range} setRange={setRange} onExport={exportAnalytics} t={t} />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} t={t} />
            ))}
          </div>
          <div className="mt-5">
            <ActivityPanel activities={activities} onClear={() => setActivities([])} t={t} />
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
            t={t}
          />
          <ActivityPanel activities={activities} onClear={() => setActivities([])} t={t} />
        </div>
      );
    }

    if (activeNav === "Projects") {
      return (
        <div className="mt-6">
          <ProjectsTable projects={projects} setProjects={setProjects} addActivity={addActivity} t={t} />
        </div>
      );
    }

    if (activeNav === "Settings") {
      return (
        <div className="mt-6">
          <SettingsPanel workspace={workspace} setWorkspace={setWorkspace} addActivity={addActivity} t={t} />
        </div>
      );
    }

    return (
      <>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} t={t} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <AnalyticsPanel range={range} setRange={setRange} onExport={exportAnalytics} compact t={t} />
          <AssistantPanel
            messages={messages}
            setMessages={setMessages}
            workflow={workflow}
            onRunAutomation={runAutomation}
            addActivity={addActivity}
            t={t}
            compact
          />
        </div>

        <div className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]">
          <ProjectsTable projects={projects} setProjects={setProjects} addActivity={addActivity} compact t={t} />
          <ActivityPanel activities={activities} onClear={() => setActivities([])} t={t} />
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
          t={t}
        />

        <section className="min-w-0 flex-1 pb-8 lg:pl-0">
          <MobileHeader
            activeNav={activeNav}
            isOpen={mobileNavOpen}
            setActiveNav={setActiveNav}
            setIsOpen={setMobileNavOpen}
            t={t}
          />
          <Header
            activeNav={activeNav}
            language={language}
            setLanguage={setLanguage}
            workspace={workspace}
            setWorkspace={setWorkspace}
            onRunReport={runReport}
            t={t}
          />
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
  setCollapsed,
  t
}: {
  activeNav: NavKey;
  collapsed: boolean;
  setActiveNav: (nav: NavKey) => void;
  setCollapsed: (collapsed: boolean) => void;
  t: Translate;
}) {
  const labelClass = collapsed
    ? "max-w-0 overflow-hidden opacity-0 delay-0"
    : "max-w-44 opacity-100 delay-200";

  return (
    <aside
      className={clsx(
        "glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 overflow-visible rounded-2xl p-4 transition-all duration-300 lg:block",
        collapsed ? "w-[104px]" : "w-72"
      )}
    >
      <button
        aria-label={collapsed ? t("Expand sidebar") : t("Collapse sidebar")}
        className="absolute -right-4 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/25 bg-slate-950/95 text-cyan-100 shadow-glow transition hover:scale-105 hover:bg-cyan-300/10"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? t("Expand") : t("Collapse")}
        type="button"
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>

      <div className="flex h-full flex-col">
        <div className={clsx("flex items-center gap-3 px-2 py-3", collapsed && "justify-center px-0")}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div className={clsx("min-w-0 whitespace-nowrap transition-all duration-150", labelClass)}>
            <p className="text-sm font-semibold text-white">NeuralDesk AI</p>
            <p className="text-xs text-slate-400">{t("SaaS Control Center")}</p>
          </div>
        </div>

        <nav className="mt-10 space-y-1">
          {navigation.map((item) => (
            <button
              aria-label={t(item.label)}
              title={collapsed ? t(item.label) : undefined}
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
              <span className={clsx("whitespace-nowrap transition-all duration-150", labelClass)}>{t(item.label)}</span>
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
            <span className={clsx("whitespace-nowrap transition-all duration-150", labelClass)}>{t("Scale Plan")}</span>
          </div>
          <p
            className={clsx(
              "mt-2 text-sm leading-6 text-slate-400 transition-all duration-150",
              collapsed ? "max-h-0 overflow-hidden opacity-0 delay-0" : "max-h-24 opacity-100 delay-200"
            )}
          >
            {t("82% of monthly AI compute used. Capacity forecast remains healthy.")}
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
  setIsOpen,
  t
}: {
  activeNav: NavKey;
  isOpen: boolean;
  setActiveNav: (nav: NavKey) => void;
  setIsOpen: (isOpen: boolean) => void;
  t: Translate;
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
            <p className="text-xs text-slate-400">{t("Control Center")}</p>
          </div>
        </div>
        <button
          aria-label={t("Toggle navigation")}
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
              {t(item.label)}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

function Header({
  activeNav,
  language,
  setLanguage,
  workspace,
  setWorkspace,
  onRunReport,
  t
}: {
  activeNav: NavKey;
  language: Lang;
  setLanguage: (language: Lang) => void;
  workspace: string;
  setWorkspace: (workspace: string) => void;
  onRunReport: () => void;
  t: Translate;
}) {
  const [openMenu, setOpenMenu] = useState<"language" | "workspace" | null>(null);

  return (
    <header className="relative z-40 mt-5 flex flex-col gap-4 lg:mt-0 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs font-medium text-cyan-100">
          <CircleDot className="h-3.5 w-3.5" />
          {t("AI operations live")}
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">{t(pageCopy[activeNav].title)}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{t(pageCopy[activeNav].description)}</p>
      </div>

      <div className="glass-panel relative z-40 flex flex-col gap-2 overflow-visible rounded-2xl p-3 sm:flex-row sm:items-center">
        <div className="relative z-50">
          <button
            aria-expanded={openMenu === "language"}
            className="flex h-14 min-w-36 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-left transition hover:bg-white/10"
            onClick={() => setOpenMenu(openMenu === "language" ? null : "language")}
            type="button"
          >
            <Globe2 className="h-4 w-4 shrink-0 text-cyan-100" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-500">{t("Language")}</p>
              <p className="text-sm font-semibold text-white">{languageOptions.find((option) => option.value === language)?.label}</p>
            </div>
            <ChevronDown className={clsx("h-4 w-4 text-slate-400 transition", openMenu === "language" && "rotate-180")} />
          </button>

          {openMenu === "language" ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-full min-w-36 rounded-xl border border-cyan-300/20 bg-slate-950/95 p-1 shadow-glow backdrop-blur-xl">
              {languageOptions.map((option) => (
                <button
                  className={clsx(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                    language === option.value ? "bg-cyan-300 text-slate-950" : "text-slate-200 hover:bg-white/10"
                  )}
                  key={option.value}
                  onClick={() => {
                    setLanguage(option.value);
                    setOpenMenu(null);
                  }}
                  type="button"
                >
                  {option.label}
                  {language === option.value ? <CheckCircle2 className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative z-50">
          <button
            aria-expanded={openMenu === "workspace"}
            className="flex h-14 min-w-56 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-left transition hover:bg-white/10"
            onClick={() => setOpenMenu(openMenu === "workspace" ? null : "workspace")}
            type="button"
          >
            <Building2 className="h-4 w-4 shrink-0 text-violet-100" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-500">{t("Workspace")}</p>
              <p className="truncate text-sm font-semibold text-white">{workspace}</p>
            </div>
            <ChevronDown className={clsx("h-4 w-4 text-slate-400 transition", openMenu === "workspace" && "rotate-180")} />
          </button>

          {openMenu === "workspace" ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-full min-w-64 rounded-xl border border-violet-300/20 bg-slate-950/95 p-1 shadow-glow backdrop-blur-xl">
              {workspaceOptions.map((option) => (
                <button
                  className={clsx(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                    workspace === option ? "bg-violet-300 text-slate-950" : "text-slate-200 hover:bg-white/10"
                  )}
                  key={option}
                  onClick={() => {
                    setWorkspace(option);
                    setOpenMenu(null);
                  }}
                  type="button"
                >
                  <span className="truncate">{option}</span>
                  {workspace === option ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          onClick={onRunReport}
          type="button"
        >
          <Sparkles className="h-4 w-4" />
          {t("Run AI Report")}
        </button>
      </div>
    </header>
  );
}

function MetricCard({ metric, t }: { metric: Metric; t: Translate }) {
  return (
    <article className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{t(metric.label)}</p>
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
        <span className="text-xs text-slate-500">{t("vs last month")}</span>
      </div>
    </article>
  );
}

function AnalyticsPanel({
  range,
  setRange,
  onExport,
  t,
  compact = false
}: {
  range: keyof typeof chartSets;
  setRange: (range: keyof typeof chartSets) => void;
  onExport: () => void;
  t: Translate;
  compact?: boolean;
}) {
  const chartPoints = pointsFrom(chartSets[range]);
  const chartArea = `${chartPoints} 440,150 0,150`;

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">{t("Analytics Section")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{t("AI request growth")}</h2>
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
            {t("Export CSV")}
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
            <p className="text-sm text-slate-400">{t(label)}</p>
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
  t,
  compact = false
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  workflow: WorkflowStep[];
  onRunAutomation: () => void;
  addActivity: (item: Omit<ActivityItem, "id" | "timeKey">) => void;
  t: Translate;
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
      titleKey: "Assistant response created",
      detailKey: "A new AI recommendation was added to the workspace thread.",
      tone: "violet"
    });
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-100">{t("AI Assistant Panel")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{t("Task command queue")}</h2>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-300/15"
          onClick={onRunAutomation}
          type="button"
        >
          <Play className="h-4 w-4" />
          {t("Run")}
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
            <p className="mb-1 text-xs font-semibold text-slate-400">{t(message.role)}</p>
            {t(message.body)}
          </div>
        ))}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
        <input
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={t("Ask about churn, revenue, or automation...")}
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
                <p className="text-sm font-semibold text-white">{t(step.label)}</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                  {t(step.state)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-400">{t(step.description)}</p>
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
  t,
  compact = false
}: {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addActivity: (item: Omit<ActivityItem, "id" | "timeKey">) => void;
  t: Translate;
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
      titleKey: "Project created",
      detailKey: "{name} was added to the AI product pipeline.",
      values: { name: project.name },
      tone: "emerald"
    });
  };

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects((current) => current.map((project) => (project.id === id ? { ...project, ...updates, updated: "Just now" } : project)));
  };

  const deleteProject = (project: Project) => {
    setProjects((current) => current.filter((item) => item.id !== project.id));
    addActivity({
      titleKey: "Project removed",
      detailKey: "{name} was removed from the dashboard.",
      values: { name: project.name },
      tone: "amber"
    });
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">{t("Projects")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{t("AI product pipeline")}</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              className="min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search projects")}
              value={query}
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            onClick={() => setIsAdding((current) => !current)}
            type="button"
          >
            <Plus className="h-4 w-4" />
            {t("New Project")}
          </button>
        </div>
      </div>

      {isAdding ? (
        <form className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_180px_180px_auto]" onSubmit={addProject}>
          <input
            className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder={t("Project name")}
            value={draft.name}
          />
          <select
            className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
            value={draft.category}
          >
            {["Automation", "Analytics", "Sales AI", "Customer Ops"].map((category) => (
              <option key={category} value={category}>
                {t(category)}
              </option>
            ))}
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
            {t("Add")}
          </button>
        </form>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-500">
              <th className="px-3 py-2 font-medium">{t("Project name")}</th>
              <th className="px-3 py-2 font-medium">{t("Status")}</th>
              <th className="px-3 py-2 font-medium">{t("Progress")}</th>
              <th className="px-3 py-2 font-medium">{t("Last updated")}</th>
              <th className="px-3 py-2 font-medium">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr className="bg-white/[0.035] text-sm" key={project.id}>
                <td className="rounded-l-xl border-y border-l border-white/10 px-3 py-4">
                  <p className="font-semibold text-white">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{t(project.category)}</p>
                </td>
                <td className="border-y border-white/10 px-3 py-4">
                  <select
                    className={clsx("rounded-full border px-2.5 py-1 text-xs font-medium outline-none", statusStyle[project.status])}
                    onChange={(event) => updateProject(project.id, { status: event.target.value as Project["status"] })}
                    value={project.status}
                  >
                    {["Live", "Training", "Review", "Paused"].map((status) => (
                      <option key={status} value={status}>
                        {t(status)}
                      </option>
                    ))}
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
                <td className="border-y border-white/10 px-3 py-4 text-slate-400">{t(project.updated)}</td>
                <td className="rounded-r-xl border-y border-r border-white/10 px-3 py-4">
                  <button
                    aria-label={`${t("Delete")} ${project.name}`}
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
  onClear,
  t
}: {
  activities: ActivityItem[];
  onClear: () => void;
  t: Translate;
}) {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-100">{t("Recent Activity")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{t("Operations feed")}</h2>
        </div>
        <button
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
          onClick={onClear}
          type="button"
        >
          {t("Clear")}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-400">{t("No recent activity.")}</div>
        ) : (
          activities.map((item) => (
            <article className="rounded-xl border border-white/10 bg-white/[0.035] p-4" key={item.id}>
              <div className="flex items-start gap-3">
                <span className={clsx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", activityTone[item.tone])} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold leading-6 text-white">{t(item.titleKey)}</p>
                    <p className="shrink-0 whitespace-nowrap text-xs leading-6 text-slate-500">{t(item.timeKey)}</p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{t(item.detailKey, item.values)}</p>
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
  addActivity,
  t
}: {
  workspace: string;
  setWorkspace: (workspace: string) => void;
  addActivity: (item: Omit<ActivityItem, "id" | "timeKey">) => void;
  t: Translate;
}) {
  const [draftWorkspace, setDraftWorkspace] = useState(workspace);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoReports, setAutoReports] = useState(true);
  const [model, setModel] = useState("GPT-5 Automation");

  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWorkspace(draftWorkspace.trim() || workspace);
    addActivity({
      titleKey: "Settings saved",
      detailKey: "{name} preferences were updated.",
      values: { name: draftWorkspace.trim() || workspace },
      tone: "emerald"
    });
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100">{t("Settings")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{t("Workspace controls")}</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={saveSettings}>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-300">{t("Workspace name")}</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            onChange={(event) => setDraftWorkspace(event.target.value)}
            value={draftWorkspace}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-300">{t("AI model route")}</span>
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            onChange={(event) => setModel(event.target.value)}
            value={model}
          >
            {["GPT-5 Automation", "Fast Support Copilot", "Analytics Reasoner"].map((route) => (
              <option key={route} value={route}>
                {t(route)}
              </option>
            ))}
          </select>
        </label>

        <Toggle label={t("Email alerts")} icon={Bell} checked={emailAlerts} onChange={setEmailAlerts} />
        <Toggle label={t("Auto reports")} icon={Activity} checked={autoReports} onChange={setAutoReports} />

        <div className="lg:col-span-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            type="submit"
          >
            <Save className="h-4 w-4" />
            {t("Save Settings")}
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
