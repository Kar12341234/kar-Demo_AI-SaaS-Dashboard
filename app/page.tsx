"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  Download,
  Gauge,
  Globe2,
  LayoutDashboard,
  Menu,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  WandSparkles,
  X,
  Zap
} from "lucide-react";
import clsx from "clsx";

type NavKey = "Dashboard" | "Analytics" | "AI Assistant" | "Projects" | "Settings";
type Lang = "en" | "zh-Hant" | "zh-Hans";
type Tone = "blue" | "violet" | "cyan" | "emerald";
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

type ProjectStatus = "Live" | "Training" | "Review" | "Paused";
type ProjectCategory = "Lead Gen" | "Client Success" | "Revenue Ops" | "Delivery Ops";

type Project = {
  id: number;
  name: string;
  client: string;
  category: ProjectCategory;
  status: ProjectStatus;
  progress: number;
  updated: string;
};

type AutomationState = "Running" | "Queued" | "Paused";

type Automation = {
  id: number;
  name: string;
  owner: string;
  state: AutomationState;
  runs: number;
};

type Message = {
  id: number;
  role: "User" | "AI";
  body: string;
};

type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

const navigation: Array<{ label: NavKey; icon: LucideIcon }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Analytics", icon: BarChart3 },
  { label: "AI Assistant", icon: Bot },
  { label: "Projects", icon: PanelLeft },
  { label: "Settings", icon: Settings }
];

const languageOptions: Array<DropdownOption<Lang>> = [
  { value: "zh-Hant", label: "繁中" },
  { value: "zh-Hans", label: "简中" },
  { value: "en", label: "EN" }
];

const workspaceOptions = ["Acme Growth Cloud", "Nova Labs AI", "Orbit Finance Ops"] as const;
const modelOptions = ["GrowthOps Reasoner", "Fast Support Copilot", "Revenue Analyst"] as const;
const dataRegionOptions = ["United States", "European Union", "Asia Pacific"] as const;
const projectCategories: ProjectCategory[] = ["Lead Gen", "Client Success", "Revenue Ops", "Delivery Ops"];
const projectStatuses: ProjectStatus[] = ["Live", "Training", "Review", "Paused"];

const translations: Record<Lang, Record<string, string>> = {
  en: {},
  "zh-Hant": {
    Dashboard: "儀表板",
    Analytics: "分析",
    "AI Assistant": "AI 助手",
    Projects: "專案",
    Settings: "設定",
    Language: "語言",
    Workspace: "工作區",
    "Run AI Report": "產生 AI 報告",
    "Generating Report": "產生中...",
    "AI Report Ready": "AI 報告已就緒",
    "Report generated for {workspace}": "{workspace} 的報告已產生",
    "Open assistant": "開啟助手",
    "Close assistant": "關閉助手",
    "ClientFlow AI": "ClientFlow AI",
    "AI GrowthOps for service businesses": "服務型企業的 AI GrowthOps",
    "AI operations live": "AI 營運即時監控",
    "SaaS Control Center": "SaaS 控制中心",
    "Control Center": "控制中心",
    "Scale Plan": "Scale 方案",
    "82% of monthly AI compute used. Capacity forecast remains healthy.": "本月 AI 運算量已使用 82%。容量預測仍保持健康。",
    Expand: "展開",
    Collapse: "收合",
    "Expand sidebar": "展開側邊欄",
    "Collapse sidebar": "收合側邊欄",
    "Executive command center": "營運指揮中心",
    "Monitor lead intake, delivery risk, AI automation, and client revenue health for ClientFlow AI.": "監控 ClientFlow AI 的名單流入、交付風險、AI 自動化與客戶營收健康度。",
    "Growth analytics": "成長分析",
    "Analyze funnel quality, revenue movement, AI usage, and churn risk across service-client workspaces.": "分析服務型客戶工作區的漏斗品質、營收變化、AI 使用與流失風險。",
    "Automation control": "自動化控制",
    "Run playbooks, monitor AI tasks, and open the assistant from a compact floating panel.": "執行 playbook、監控 AI 任務，並從浮動小窗開啟助手。",
    "Client delivery projects": "客戶交付專案",
    "Manage AI-powered delivery pipelines, project progress, client status, and operational ownership.": "管理 AI 驅動的交付管線、專案進度、客戶狀態與營運負責人。",
    "Platform settings": "平台設定",
    "Configure model routing, reporting cadence, notification rules, and data residency for ClientFlow AI.": "設定 ClientFlow AI 的模型路由、報告節奏、通知規則與資料所在地。",
    "Qualified Leads": "合格名單",
    "Client Revenue": "客戶營收",
    "AI Tasks Run": "AI 任務執行",
    "Delivery Health": "交付健康度",
    "Total Users": "總用戶",
    "AI Requests": "AI 請求",
    "Conversion Rate": "轉換率",
    "AI Usage": "AI 使用量",
    "Token Usage": "Token 使用量",
    "Used this month": "本月已使用",
    "Remaining quota": "剩餘配額",
    "Recent AI Tasks": "最近 AI 任務",
    "AI Workflow Panel": "AI 工作流面板",
    "Project Status Table": "專案狀態表",
    "User Profile": "使用者",
    Notifications: "通知",
    "2 workflow alerts": "2 個工作流提醒",
    "New client report ready": "新客戶報告已就緒",
    "Model routing was optimized": "模型路由已最佳化",
    "Account manager": "客戶經理",
    Online: "在線",
    "Summarize support tickets": "摘要客服票據",
    "Generate client proposal": "產生客戶提案",
    "Detect churn risk": "偵測流失風險",
    "Route hot leads": "分配熱門名單",
    "Completed 3 minutes ago": "3 分鐘前完成",
    "Running now": "正在執行",
    "Queued for review": "等待審核",
    "Ready to send": "準備發送",
    "Data ingestion": "資料匯入",
    "AI enrichment": "AI 強化",
    "Human approval": "人工審核",
    "Client delivery": "客戶交付",
    "Project Status": "專案狀態",
    "vs last month": "較上月",
    "Service Snapshot": "服務快照",
    "Hot leads routed": "熱門名單已分配",
    "Delivery risks": "交付風險",
    "AI hours saved": "AI 節省時數",
    "Generate outreach tasks": "產生開發任務",
    "Review delivery risks": "檢視交付風險",
    "Open analytics": "開啟分析",
    "Priority Queue": "優先佇列",
    "Lead response SLA": "名單回覆 SLA",
    "Proposal follow-ups": "提案跟進",
    "Client health review": "客戶健康度檢查",
    "Complete": "完成",
    "In progress": "進行中",
    "Needs review": "需要檢查",
    Funnel: "漏斗",
    Revenue: "營收",
    Retention: "留存",
    Segment: "分群",
    "Date range": "日期範圍",
    "Export CSV": "匯出 CSV",
    "Refresh forecast": "刷新預測",
    "Pipeline Value": "管線價值",
    "Win Rate": "成交率",
    "Churn Risk": "流失風險",
    "Avg Response": "平均回覆",
    "Automation Playbooks": "自動化 Playbook",
    "Prompt Library": "提示詞庫",
    "Run playbook": "執行 Playbook",
    Pause: "暫停",
    Resume: "恢復",
    Running: "執行中",
    Queued: "排隊中",
    Paused: "暫停",
    "Lead qualification": "名單篩選",
    "Proposal writer": "提案撰寫",
    "Client check-in": "客戶回訪",
    "New Project": "新增專案",
    "Search projects": "搜尋專案",
    "Project name": "專案名稱",
    Client: "客戶",
    Category: "類別",
    Status: "狀態",
    Progress: "進度",
    "Last updated": "最後更新",
    Actions: "操作",
    Add: "新增",
    Delete: "刪除",
    Live: "上線",
    Training: "訓練中",
    Review: "審核",
    "Lead Gen": "名單開發",
    "Client Success": "客戶成功",
    "Revenue Ops": "營收營運",
    "Delivery Ops": "交付營運",
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
    "AI model route": "AI 模型路由",
    "Data region": "資料區域",
    "Email alerts": "Email 通知",
    "Weekly client reports": "每週客戶報告",
    "Auto-assign hot leads": "自動分配熱門名單",
    "Save Settings": "儲存設定",
    Saved: "已儲存",
    "GrowthOps Reasoner": "GrowthOps 推理模型",
    "Fast Support Copilot": "快速客服 Copilot",
    "Revenue Analyst": "營收分析模型",
    "United States": "美國",
    "European Union": "歐盟",
    "Asia Pacific": "亞太",
    Opportunity: "機會",
    Risk: "風險",
    "Next action": "下一步",
    "Revenue is up 12.8% with strongest growth from automation-heavy teams.": "營收上升 12.8%，成長主要來自高度使用自動化的團隊。",
    "Trial accounts with low AI usage show the highest churn probability this week.": "本週 AI 使用量偏低的試用帳戶流失機率最高。",
    "Queue a customer success workflow and review the 30D analytics trend.": "排入客戶成功工作流，並檢視 30D 分析趨勢。",
    "View Analytics": "查看分析",
    "Queue Workflow": "排入流程",
    "Export Report CSV": "匯出報告 CSV",
    "Close report": "關閉報告",
    "Ask ClientFlow about leads, projects, or churn...": "詢問 ClientFlow 名單、專案或流失...",
    User: "使用者",
    AI: "AI",
    "Send message": "送出訊息",
    "ClientFlow found 4 hot leads and 2 delivery risks that need attention today.": "ClientFlow 找到 4 個熱門名單與 2 個今日需要處理的交付風險。",
    "Draft a recovery plan for risky delivery accounts.": "為高風險交付帳戶草擬恢復計畫。",
    "I created a 3-step recovery workflow: owner assignment, client update, and delivery checkpoint.": "我建立了 3 步恢復流程：指派負責人、更新客戶、交付檢查點。",
    "I routed this to the right workflow and added an activity note.": "我已把它分配到正確工作流，並新增活動紀錄。"
  },
  "zh-Hans": {
    Dashboard: "仪表盘",
    Analytics: "分析",
    "AI Assistant": "AI 助手",
    Projects: "项目",
    Settings: "设置",
    Language: "语言",
    Workspace: "工作区",
    "Run AI Report": "生成 AI 报告",
    "Generating Report": "生成中...",
    "AI Report Ready": "AI 报告已就绪",
    "Report generated for {workspace}": "{workspace} 的报告已生成",
    "Open assistant": "打开助手",
    "Close assistant": "关闭助手",
    "ClientFlow AI": "ClientFlow AI",
    "AI GrowthOps for service businesses": "服务型企业的 AI GrowthOps",
    "AI operations live": "AI 运营实时监控",
    "SaaS Control Center": "SaaS 控制中心",
    "Control Center": "控制中心",
    "Scale Plan": "Scale 方案",
    "82% of monthly AI compute used. Capacity forecast remains healthy.": "本月 AI 算力已使用 82%。容量预测仍保持健康。",
    Expand: "展开",
    Collapse: "收起",
    "Expand sidebar": "展开侧边栏",
    "Collapse sidebar": "收起侧边栏",
    "Executive command center": "运营指挥中心",
    "Monitor lead intake, delivery risk, AI automation, and client revenue health for ClientFlow AI.": "监控 ClientFlow AI 的名单流入、交付风险、AI 自动化与客户收入健康度。",
    "Growth analytics": "增长分析",
    "Analyze funnel quality, revenue movement, AI usage, and churn risk across service-client workspaces.": "分析服务型客户工作区的漏斗质量、收入变化、AI 使用与流失风险。",
    "Automation control": "自动化控制",
    "Run playbooks, monitor AI tasks, and open the assistant from a compact floating panel.": "运行 playbook、监控 AI 任务，并从浮动小窗打开助手。",
    "Client delivery projects": "客户交付项目",
    "Manage AI-powered delivery pipelines, project progress, client status, and operational ownership.": "管理 AI 驱动的交付管线、项目进度、客户状态与运营负责人。",
    "Platform settings": "平台设置",
    "Configure model routing, reporting cadence, notification rules, and data residency for ClientFlow AI.": "配置 ClientFlow AI 的模型路由、报告节奏、通知规则与数据所在地。",
    "Qualified Leads": "合格名单",
    "Client Revenue": "客户收入",
    "AI Tasks Run": "AI 任务运行",
    "Delivery Health": "交付健康度",
    "Total Users": "总用户",
    "AI Requests": "AI 请求",
    "Conversion Rate": "转化率",
    "AI Usage": "AI 使用量",
    "Token Usage": "Token 使用量",
    "Used this month": "本月已使用",
    "Remaining quota": "剩余配额",
    "Recent AI Tasks": "最近 AI 任务",
    "AI Workflow Panel": "AI 工作流面板",
    "Project Status Table": "项目状态表",
    "User Profile": "用户",
    Notifications: "通知",
    "2 workflow alerts": "2 个工作流提醒",
    "New client report ready": "新客户报告已就绪",
    "Model routing was optimized": "模型路由已优化",
    "Account manager": "客户经理",
    Online: "在线",
    "Summarize support tickets": "摘要客服工单",
    "Generate client proposal": "生成客户提案",
    "Detect churn risk": "检测流失风险",
    "Route hot leads": "分配热门名单",
    "Completed 3 minutes ago": "3 分钟前完成",
    "Running now": "正在运行",
    "Queued for review": "等待审核",
    "Ready to send": "准备发送",
    "Data ingestion": "数据导入",
    "AI enrichment": "AI 强化",
    "Human approval": "人工审核",
    "Client delivery": "客户交付",
    "Project Status": "项目状态",
    "vs last month": "较上月",
    "Service Snapshot": "服务快照",
    "Hot leads routed": "热门名单已分配",
    "Delivery risks": "交付风险",
    "AI hours saved": "AI 节省时数",
    "Generate outreach tasks": "生成开发任务",
    "Review delivery risks": "查看交付风险",
    "Open analytics": "打开分析",
    "Priority Queue": "优先队列",
    "Lead response SLA": "名单回复 SLA",
    "Proposal follow-ups": "提案跟进",
    "Client health review": "客户健康度检查",
    "Complete": "完成",
    "In progress": "进行中",
    "Needs review": "需要检查",
    Funnel: "漏斗",
    Revenue: "收入",
    Retention: "留存",
    Segment: "分群",
    "Date range": "日期范围",
    "Export CSV": "导出 CSV",
    "Refresh forecast": "刷新预测",
    "Pipeline Value": "管线价值",
    "Win Rate": "成交率",
    "Churn Risk": "流失风险",
    "Avg Response": "平均回复",
    "Automation Playbooks": "自动化 Playbook",
    "Prompt Library": "提示词库",
    "Run playbook": "运行 Playbook",
    Pause: "暂停",
    Resume: "恢复",
    Running: "运行中",
    Queued: "排队中",
    Paused: "暂停",
    "Lead qualification": "名单筛选",
    "Proposal writer": "提案撰写",
    "Client check-in": "客户回访",
    "New Project": "新增项目",
    "Search projects": "搜索项目",
    "Project name": "项目名称",
    Client: "客户",
    Category: "类别",
    Status: "状态",
    Progress: "进度",
    "Last updated": "最后更新",
    Actions: "操作",
    Add: "新增",
    Delete: "删除",
    Live: "上线",
    Training: "训练中",
    Review: "审核",
    "Lead Gen": "名单开发",
    "Client Success": "客户成功",
    "Revenue Ops": "收入运营",
    "Delivery Ops": "交付运营",
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
    "AI model route": "AI 模型路由",
    "Data region": "数据区域",
    "Email alerts": "Email 通知",
    "Weekly client reports": "每周客户报告",
    "Auto-assign hot leads": "自动分配热门名单",
    "Save Settings": "保存设置",
    Saved: "已保存",
    "GrowthOps Reasoner": "GrowthOps 推理模型",
    "Fast Support Copilot": "快速客服 Copilot",
    "Revenue Analyst": "收入分析模型",
    "United States": "美国",
    "European Union": "欧盟",
    "Asia Pacific": "亚太",
    Opportunity: "机会",
    Risk: "风险",
    "Next action": "下一步",
    "Revenue is up 12.8% with strongest growth from automation-heavy teams.": "收入上升 12.8%，增长主要来自高度使用自动化的团队。",
    "Trial accounts with low AI usage show the highest churn probability this week.": "本周 AI 使用量偏低的试用账户流失概率最高。",
    "Queue a customer success workflow and review the 30D analytics trend.": "排入客户成功工作流，并查看 30D 分析趋势。",
    "View Analytics": "查看分析",
    "Queue Workflow": "排入流程",
    "Export Report CSV": "导出报告 CSV",
    "Close report": "关闭报告",
    "Ask ClientFlow about leads, projects, or churn...": "询问 ClientFlow 名单、项目或流失...",
    User: "用户",
    AI: "AI",
    "Send message": "发送消息",
    "ClientFlow found 4 hot leads and 2 delivery risks that need attention today.": "ClientFlow 找到 4 个热门名单与 2 个今天需要处理的交付风险。",
    "Draft a recovery plan for risky delivery accounts.": "为高风险交付账户草拟恢复计划。",
    "I created a 3-step recovery workflow: owner assignment, client update, and delivery checkpoint.": "我创建了 3 步恢复流程：指派负责人、更新客户、交付检查点。",
    "I routed this to the right workflow and added an activity note.": "我已把它分配到正确工作流，并新增活动记录。"
  }
};

const pageCopy: Record<NavKey, { title: string; description: string }> = {
  Dashboard: {
    title: "Executive command center",
    description: "Monitor lead intake, delivery risk, AI automation, and client revenue health for ClientFlow AI."
  },
  Analytics: {
    title: "Growth analytics",
    description: "Analyze funnel quality, revenue movement, AI usage, and churn risk across service-client workspaces."
  },
  "AI Assistant": {
    title: "Automation control",
    description: "Run playbooks, monitor AI tasks, and open the assistant from a compact floating panel."
  },
  Projects: {
    title: "Client delivery projects",
    description: "Manage AI-powered delivery pipelines, project progress, client status, and operational ownership."
  },
  Settings: {
    title: "Platform settings",
    description: "Configure model routing, reporting cadence, notification rules, and data residency for ClientFlow AI."
  }
};

const initialMetrics: Metric[] = [
  { label: "Total Users", value: "24,892", change: "+18.4%", tone: "blue", icon: Users },
  { label: "Revenue", value: "$128.6K", change: "+12.8%", tone: "emerald", icon: ArrowUpRight },
  { label: "AI Requests", value: "1.86M", change: "+31.2%", tone: "violet", icon: BrainCircuit },
  { label: "Conversion Rate", value: "8.74%", change: "+4.6%", tone: "cyan", icon: Gauge }
];

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    titleKey: "Lead response SLA",
    detailKey: "4 hot leads were assigned to delivery owners.",
    timeKey: "2 min ago",
    tone: "cyan"
  },
  {
    id: 2,
    titleKey: "Proposal follow-ups",
    detailKey: "ClientFlow drafted follow-up emails for 8 proposals.",
    timeKey: "18 min ago",
    tone: "emerald"
  },
  {
    id: 3,
    titleKey: "Client health review",
    detailKey: "2 delivery accounts need a recovery workflow.",
    timeKey: "41 min ago",
    tone: "violet"
  }
];

const initialProjects: Project[] = [
  { id: 1, name: "Lead Scoring Engine", client: "Acme Growth Cloud", category: "Lead Gen", status: "Live", progress: 92, updated: "Today" },
  { id: 2, name: "Support Copilot Launch", client: "Nova Labs AI", category: "Client Success", status: "Training", progress: 68, updated: "Yesterday" },
  { id: 3, name: "Revenue Forecasting", client: "Orbit Finance Ops", category: "Revenue Ops", status: "Review", progress: 81, updated: "May 10" },
  { id: 4, name: "Delivery Risk Monitor", client: "Acme Growth Cloud", category: "Delivery Ops", status: "Paused", progress: 45, updated: "May 8" }
];

const initialAutomations: Automation[] = [
  { id: 1, name: "Lead qualification", owner: "Sales Ops", state: "Running", runs: 1248 },
  { id: 2, name: "Proposal writer", owner: "Growth Team", state: "Queued", runs: 486 },
  { id: 3, name: "Client check-in", owner: "Success Team", state: "Paused", runs: 722 }
];

const initialMessages: Message[] = [
  { id: 1, role: "AI", body: "ClientFlow found 4 hot leads and 2 delivery risks that need attention today." },
  { id: 2, role: "User", body: "Draft a recovery plan for risky delivery accounts." },
  { id: 3, role: "AI", body: "I created a 3-step recovery workflow: owner assignment, client update, and delivery checkpoint." }
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

const statusStyle: Record<ProjectStatus, string> = {
  Live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Training: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  Review: "border-violet-400/30 bg-violet-400/10 text-violet-100",
  Paused: "border-slate-400/30 bg-slate-400/10 text-slate-300"
};

function pointsFrom(values: number[]) {
  const gap = 440 / (values.length - 1);
  return values.map((value, index) => `${Math.round(index * gap)},${value}`).join(" ");
}

function downloadCsv(filename: string, rows: string[]) {
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavKey>("Dashboard");
  const [language, setLanguage] = useState<Lang>("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [activities, setActivities] = useState(initialActivities);
  const [projects, setProjects] = useState(initialProjects);
  const [automations, setAutomations] = useState(initialAutomations);
  const [messages, setMessages] = useState(initialMessages);
  const [workspace, setWorkspace] = useState("Acme Growth Cloud");
  const [range, setRange] = useState<keyof typeof chartSets>("7D");
  const [segment, setSegment] = useState("Funnel");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportRunning, setReportRunning] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [modelRoute, setModelRoute] = useState("GrowthOps Reasoner");
  const [dataRegion, setDataRegion] = useState("United States");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);

  const t: Translate = (key, values) => {
    const template = translations[language][key] ?? key;
    return Object.entries(values ?? {}).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
  };

  const addActivity = (item: Omit<ActivityItem, "id" | "timeKey">) => {
    setActivities((current) => [{ ...item, id: Date.now(), timeKey: "Just now" }, ...current].slice(0, 8));
  };

  const runReport = () => {
    setReportOpen(true);
    setReportRunning(true);
    setMetrics((current) =>
      current.map((metric) =>
        metric.label === "AI Tasks Run" ? { ...metric, value: "43,280", change: "+34.8%" } : metric
      )
    );
    addActivity({
      titleKey: "AI Report Ready",
      detailKey: "Report generated for {workspace}",
      values: { workspace },
      tone: "cyan"
    });
    window.setTimeout(() => setReportRunning(false), 650);
  };

  const exportAnalytics = () => {
    downloadCsv("clientflow-growth-analytics.csv", [
      "range,segment,qualified_leads,revenue,win_rate,churn_risk",
      `${range},${segment},1284,128600,38,7`
    ]);
    addActivity({
      titleKey: "Export CSV",
      detailKey: "Growth analytics export is ready for ClientFlow AI.",
      tone: "cyan"
    });
  };

  const runAutomation = (automationId?: number) => {
    setAutomations((current) =>
      current.map((automation) =>
        automationId === undefined || automation.id === automationId
          ? { ...automation, state: "Running", runs: automation.runs + 1 }
          : automation
      )
    );
    addActivity({
      titleKey: "Run playbook",
      detailKey: "I routed this to the right workflow and added an activity note.",
      tone: "violet"
    });
  };

  const saveSettings = () => {
    setSettingsSaved(true);
    addActivity({
      titleKey: "Save Settings",
      detailKey: "{workspace} preferences were updated.",
      values: { workspace },
      tone: "emerald"
    });
    window.setTimeout(() => setSettingsSaved(false), 1400);
  };

  const renderContent = () => {
    if (activeNav === "Analytics") {
      return (
        <AnalyticsPage
          onExport={exportAnalytics}
          onRefresh={() => {
            setRange("30D");
            addActivity({
              titleKey: "Refresh forecast",
              detailKey: "Growth forecast refreshed with latest funnel quality signals.",
              tone: "cyan"
            });
          }}
          range={range}
          segment={segment}
          setRange={setRange}
          setSegment={setSegment}
          t={t}
        />
      );
    }

    if (activeNav === "AI Assistant") {
      return (
        <AutomationPage
          automations={automations}
          onOpenAssistant={() => setAssistantOpen(true)}
          onRunAutomation={runAutomation}
          setAutomations={setAutomations}
          t={t}
        />
      );
    }

    if (activeNav === "Projects") {
      return (
        <ProjectsPage
          addActivity={addActivity}
          projects={projects}
          setProjects={setProjects}
          t={t}
        />
      );
    }

    if (activeNav === "Settings") {
      return (
        <SettingsPage
          autoAssign={autoAssign}
          dataRegion={dataRegion}
          emailAlerts={emailAlerts}
          modelRoute={modelRoute}
          onSave={saveSettings}
          saved={settingsSaved}
          setAutoAssign={setAutoAssign}
          setDataRegion={setDataRegion}
          setEmailAlerts={setEmailAlerts}
          setModelRoute={setModelRoute}
          setWeeklyReports={setWeeklyReports}
          t={t}
          weeklyReports={weeklyReports}
        />
      );
    }

    return (
      <DashboardPage
        activities={activities}
        metrics={metrics}
        onClearActivities={() => setActivities([])}
        onGenerateTasks={() => {
          runAutomation();
          setAssistantOpen(true);
        }}
        onOpenAnalytics={() => setActiveNav("Analytics")}
        onReviewRisks={() => setActiveNav("Projects")}
        t={t}
      />
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
            onRunReport={runReport}
            reportRunning={reportRunning}
            setLanguage={setLanguage}
            setWorkspace={setWorkspace}
            t={t}
            workspace={workspace}
          />
          {reportOpen ? (
            <ReportPanel
              isRunning={reportRunning}
              onClose={() => setReportOpen(false)}
              onExport={exportAnalytics}
              onQueueWorkflow={() => runAutomation()}
              onViewAnalytics={() => setActiveNav("Analytics")}
              t={t}
              workspace={workspace}
            />
          ) : null}
          {renderContent()}
        </section>
      </div>

      <AssistantBubble onClick={() => setAssistantOpen(true)} t={t} />
      {assistantOpen ? (
        <AssistantWindow
          addActivity={addActivity}
          messages={messages}
          onClose={() => setAssistantOpen(false)}
          setMessages={setMessages}
          t={t}
        />
      ) : null}
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
  const labelClass = collapsed ? "max-w-0 overflow-hidden opacity-0 delay-0" : "max-w-44 opacity-100 delay-200";

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
            <WandSparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div className={clsx("min-w-0 whitespace-nowrap transition-all duration-150", labelClass)}>
            <p className="text-sm font-semibold text-white">{t("ClientFlow AI")}</p>
            <p className="text-xs text-slate-400">{t("SaaS Control Center")}</p>
          </div>
        </div>

        <nav className="mt-10 space-y-1">
          {navigation.map((item) => (
            <button
              aria-label={t(item.label)}
              className={clsx(
                "flex w-full items-center rounded-xl py-3 text-left text-sm font-medium transition",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                activeNav === item.label
                  ? "border border-cyan-300/20 bg-cyan-300/10 text-white shadow-glow"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              )}
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              title={collapsed ? t(item.label) : undefined}
              type="button"
            >
              <item.icon className="h-4 w-4" />
              <span className={clsx("whitespace-nowrap transition-all duration-150", labelClass)}>{t(item.label)}</span>
            </button>
          ))}
        </nav>

        <div className={clsx("mt-auto rounded-2xl border border-violet-300/18 bg-violet-300/8 transition-all", collapsed ? "p-3" : "p-4")}>
          <div className={clsx("flex items-center gap-2 text-sm font-semibold text-violet-100", collapsed && "justify-center")}>
            <Rocket className="h-4 w-4" />
            <span className={clsx("whitespace-nowrap transition-all duration-150", labelClass)}>{t("Scale Plan")}</span>
          </div>
          <p className={clsx("mt-2 text-sm leading-6 text-slate-400 transition-all duration-150", collapsed ? "max-h-0 overflow-hidden opacity-0 delay-0" : "max-h-24 opacity-100 delay-200")}>
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
            <WandSparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{t("ClientFlow AI")}</p>
            <p className="text-xs text-slate-400">{t("Control Center")}</p>
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
  onRunReport,
  reportRunning,
  setLanguage,
  setWorkspace,
  t,
  workspace
}: {
  activeNav: NavKey;
  language: Lang;
  onRunReport: () => void;
  reportRunning: boolean;
  setLanguage: (language: Lang) => void;
  setWorkspace: (workspace: string) => void;
  t: Translate;
  workspace: string;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
        <BubbleDropdown
          icon={Globe2}
          label={t("Language")}
          onChange={setLanguage}
          options={languageOptions}
          value={language}
          widthClass="min-w-36"
        />
        <BubbleDropdown
          icon={Building2}
          label={t("Workspace")}
          onChange={setWorkspace}
          options={workspaceOptions.map((option) => ({ value: option, label: option }))}
          value={workspace}
          widthClass="min-w-56"
        />
        <button
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          onClick={onRunReport}
          type="button"
        >
          <Sparkles className="h-4 w-4" />
          {reportRunning ? t("Generating Report") : t("Run AI Report")}
        </button>

        <div className="relative z-50">
          <button
            aria-expanded={notificationsOpen}
            aria-label={t("Notifications")}
            className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            type="button"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-400 ring-2 ring-slate-950" />
          </button>
          {notificationsOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-72 rounded-xl border border-cyan-300/20 bg-slate-950/95 p-2 shadow-glow backdrop-blur-xl">
              {["2 workflow alerts", "New client report ready", "Model routing was optimized"].map((item) => (
                <button
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  key={item}
                  onClick={() => setNotificationsOpen(false)}
                  type="button"
                >
                  {t(item)}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          className="flex h-14 min-w-44 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 text-left transition hover:bg-white/10"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          type="button"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-sm font-bold text-slate-950">
            KS
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">Kar Studio</span>
            <span className="block text-xs text-emerald-200">{t("Online")}</span>
          </span>
        </button>
      </div>
    </header>
  );
}

function BubbleDropdown<T extends string>({
  icon: Icon,
  label,
  onChange,
  options,
  value,
  widthClass = "min-w-44",
  valueClassName
}: {
  icon: LucideIcon;
  label: string;
  onChange: (value: T) => void;
  options: Array<DropdownOption<T>>;
  value: T;
  widthClass?: string;
  valueClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className={clsx("relative z-50", widthClass)}>
      <button
        aria-expanded={open}
        className="flex h-14 w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-left transition hover:bg-white/10"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <Icon className="h-4 w-4 shrink-0 text-cyan-100" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-slate-500">{label}</p>
          <p className={clsx("truncate text-sm font-semibold text-white", valueClassName)}>{selected.label}</p>
        </div>
        <ChevronDown className={clsx("h-4 w-4 text-slate-400 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-full min-w-full rounded-xl border border-cyan-300/20 bg-slate-950/95 p-1 shadow-glow backdrop-blur-xl">
          {options.map((option) => (
            <button
              className={clsx(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                value === option.value ? "bg-cyan-300 text-slate-950" : "text-slate-200 hover:bg-white/10"
              )}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              type="button"
            >
              <span className="truncate">{option.label}</span>
              {value === option.value ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DashboardPage({
  activities,
  metrics,
  onClearActivities,
  onGenerateTasks,
  onOpenAnalytics,
  onReviewRisks,
  t
}: {
  activities: ActivityItem[];
  metrics: Metric[];
  onClearActivities: () => void;
  onGenerateTasks: () => void;
  onOpenAnalytics: () => void;
  onReviewRisks: () => void;
  t: Translate;
}) {
  const recentTasks = [
    ["Summarize support tickets", "Completed 3 minutes ago", "Complete"],
    ["Generate client proposal", "Running now", "In progress"],
    ["Detect churn risk", "Queued for review", "Needs review"],
    ["Route hot leads", "Ready to send", "Complete"]
  ];
  const workflowSteps = [
    ["Data ingestion", "Complete", "100%"],
    ["AI enrichment", "In progress", "68%"],
    ["Human approval", "Needs review", "2 items"],
    ["Client delivery", "Queued", "Next"]
  ];
  const projectRows = [
    ["Lead Scoring Engine", "Live", "92%"],
    ["Support Copilot Launch", "Training", "68%"],
    ["Revenue Forecasting", "Review", "81%"]
  ];

  return (
    <section className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} t={t} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">{t("Service Snapshot")}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{t("ClientFlow AI")}</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button className="shrink-0 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10" onClick={onGenerateTasks} type="button">
                {t("Generate outreach tasks")}
              </button>
              <button className="shrink-0 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10" onClick={onReviewRisks} type="button">
                {t("Review delivery risks")}
              </button>
              <button className="shrink-0 whitespace-nowrap rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110" onClick={onOpenAnalytics} type="button">
                {t("Open analytics")}
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ["Hot leads routed", "42", "+19%"],
              ["Delivery risks", "2", "-31%"],
              ["AI hours saved", "386", "+44%"]
            ].map(([label, value, change]) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                <p className="text-sm text-slate-400">{t(label)}</p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold text-white">{value}</p>
                  <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">{change}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-100">{t("AI Usage")}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{t("Token Usage")}</h2>
            </div>
            <BrainCircuit className="h-5 w-5 text-violet-200" />
          </div>
          <div className="mt-6 space-y-5">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-white">48.3M</p>
                  <p className="mt-1 text-sm text-slate-500">{t("Used this month")}</p>
                </div>
                <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">76%</span>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-slate-800">
                <div className="h-2.5 w-[76%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-slate-400">{t("AI Requests")}</p>
                <p className="mt-2 text-xl font-semibold text-white">1.86M</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-slate-400">{t("Remaining quota")}</p>
                <p className="mt-2 text-xl font-semibold text-white">15.2M</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-cyan-100">{t("Recent AI Tasks")}</p>
            <Clock3 className="h-5 w-5 text-cyan-100" />
          </div>
          <div className="mt-4 space-y-3">
            {recentTasks.map(([task, meta, state]) => (
              <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4" key={task}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{t(task)}</p>
                    <p className="mt-1 text-xs text-slate-500">{t(meta)}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">{t(state)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-violet-100">{t("AI Workflow Panel")}</p>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10" onClick={onGenerateTasks} type="button">
              {t("Run playbook")}
            </button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {workflowSteps.map(([step, state, meta], index) => (
              <article className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4" key={step}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{t(step)}</p>
                <p className="mt-1 text-xs text-slate-500">{t(state)} · {meta}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-cyan-100">{t("Project Status Table")}</p>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10" onClick={onReviewRisks} type="button">
              {t("Projects")}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-medium">{t("Project name")}</th>
                  <th className="px-3 py-2 font-medium">{t("Status")}</th>
                  <th className="px-3 py-2 font-medium">{t("Progress")}</th>
                </tr>
              </thead>
              <tbody>
                {projectRows.map(([name, status, progress]) => (
                  <tr className="bg-white/[0.035]" key={name}>
                    <td className="rounded-l-xl border-y border-l border-white/10 px-3 py-4 font-semibold text-white">{name}</td>
                    <td className="border-y border-white/10 px-3 py-4 text-slate-300">{t(status)}</td>
                    <td className="rounded-r-xl border-y border-r border-white/10 px-3 py-4 text-slate-300">{progress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ActivityPanel activities={activities} onClear={onClearActivities} t={t} />
      </div>

    </section>
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
        <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">{metric.change}</span>
        <span className="text-xs text-slate-500">{t("vs last month")}</span>
      </div>
    </article>
  );
}

function AnalyticsPage({
  onExport,
  onRefresh,
  range,
  segment,
  setRange,
  setSegment,
  t
}: {
  onExport: () => void;
  onRefresh: () => void;
  range: keyof typeof chartSets;
  segment: string;
  setRange: (range: keyof typeof chartSets) => void;
  setSegment: (segment: string) => void;
  t: Translate;
}) {
  const chartPoints = pointsFrom(chartSets[range]);
  const chartArea = `${chartPoints} 440,150 0,150`;

  return (
    <section className="mt-6 space-y-5">
      <section className="glass-panel rounded-2xl p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-100">{t("Growth analytics")}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{t(segment)}</h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <BubbleDropdown
              icon={Clock3}
              label={t("Date range")}
              onChange={setRange}
              options={(Object.keys(chartSets) as Array<keyof typeof chartSets>).map((item) => ({ value: item, label: item }))}
              value={range}
              widthClass="min-w-32"
            />
            <BubbleDropdown
              icon={TrendingUp}
              label={t("Segment")}
              onChange={setSegment}
              options={["Funnel", "Revenue", "Retention"].map((item) => ({ value: item, label: t(item) }))}
              value={segment}
              widthClass="min-w-40"
            />
            <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10" onClick={onRefresh} type="button">
              <RefreshCw className="h-4 w-4" />
              {t("Refresh forecast")}
            </button>
            <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110" onClick={onExport} type="button">
              <Download className="h-4 w-4" />
              {t("Export CSV")}
            </button>
          </div>
        </div>

        <div className="mt-6 h-[360px] rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <svg aria-label="ClientFlow growth chart" className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 440 150">
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
            <polyline fill="none" points={chartPoints} stroke="#22d3ee" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            <polyline fill="none" points={pointsFrom([128, 122, 112, 104, 86, 76, 64, 52, 42])} stroke="#8b5cf6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" opacity="0.82" />
          </svg>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Pipeline Value", "$486K", "+22%"],
          ["Win Rate", "38%", "+6%"],
          ["Churn Risk", "7%", "-3%"],
          ["Avg Response", "42m", "-18%"]
        ].map(([label, value, change]) => (
          <article className="glass-panel rounded-2xl p-5" key={label}>
            <p className="text-sm text-slate-400">{t(label)}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-3 text-xs font-semibold text-emerald-200">{change}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AutomationPage({
  automations,
  onOpenAssistant,
  onRunAutomation,
  setAutomations,
  t
}: {
  automations: Automation[];
  onOpenAssistant: () => void;
  onRunAutomation: (id?: number) => void;
  setAutomations: Dispatch<SetStateAction<Automation[]>>;
  t: Translate;
}) {
  const promptCards = ["Lead qualification", "Proposal writer", "Client check-in"];

  const toggleAutomation = (automation: Automation) => {
    setAutomations((current) =>
      current.map((item) =>
        item.id === automation.id ? { ...item, state: item.state === "Paused" ? "Queued" : "Paused" } : item
      )
    );
  };

  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="glass-panel rounded-2xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-100">{t("Automation Playbooks")}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{t("Automation control")}</h2>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-semibold text-slate-950" onClick={onOpenAssistant} type="button">
            <Bot className="h-4 w-4" />
            {t("Open assistant")}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {automations.map((automation) => (
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4" key={automation.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{t(automation.name)}</p>
                  <p className="mt-1 text-sm text-slate-500">{automation.owner} · {automation.runs.toLocaleString()} runs</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={clsx("rounded-full border px-3 py-2 text-xs font-semibold", automation.state === "Running" ? statusStyle.Live : automation.state === "Queued" ? statusStyle.Training : statusStyle.Paused)}>
                    {t(automation.state)}
                  </span>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10" onClick={() => onRunAutomation(automation.id)} type="button">
                    {t("Run playbook")}
                  </button>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10" onClick={() => toggleAutomation(automation)} type="button">
                    {automation.state === "Paused" ? t("Resume") : t("Pause")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-5">
        <p className="text-sm font-medium text-cyan-100">{t("Prompt Library")}</p>
        <div className="mt-5 grid gap-3">
          {promptCards.map((prompt) => (
            <button className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/10" key={prompt} onClick={onOpenAssistant} type="button">
              <p className="font-semibold text-white">{t(prompt)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{t("Open assistant")}</p>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function ProjectsPage({
  addActivity,
  projects,
  setProjects,
  t
}: {
  addActivity: (item: Omit<ActivityItem, "id" | "timeKey">) => void;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  t: Translate;
}) {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", client: "Acme Growth Cloud", category: "Lead Gen" as ProjectCategory });

  const filteredProjects = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return projects;
    }
    return projects.filter((project) =>
      [project.name, project.client, project.category, project.status].some((value) => value.toLowerCase().includes(cleanQuery))
    );
  }, [projects, query]);

  const addProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim()) {
      return;
    }
    const project: Project = {
      id: Date.now(),
      name: draft.name.trim(),
      client: draft.client,
      category: draft.category,
      status: "Training",
      progress: 35,
      updated: "Just now"
    };
    setProjects((current) => [project, ...current]);
    setDraft({ name: "", client: "Acme Growth Cloud", category: "Lead Gen" });
    setIsAdding(false);
    addActivity({
      titleKey: "New Project",
      detailKey: "{workspace} preferences were updated.",
      values: { workspace: project.name },
      tone: "emerald"
    });
  };

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects((current) => current.map((project) => (project.id === id ? { ...project, ...updates, updated: "Just now" } : project)));
  };

  const deleteProject = (project: Project) => {
    setProjects((current) => current.filter((item) => item.id !== project.id));
    addActivity({
      titleKey: "Delete",
      detailKey: "{workspace} preferences were updated.",
      values: { workspace: project.name },
      tone: "amber"
    });
  };

  return (
    <section className="mt-6 glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-100">{t("Projects")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{t("Client delivery projects")}</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-14 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              className="min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search projects")}
              value={query}
            />
          </label>
          <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10" onClick={() => setIsAdding(!isAdding)} type="button">
            <Plus className="h-4 w-4" />
            {t("New Project")}
          </button>
        </div>
      </div>

      {isAdding ? (
        <form className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 lg:grid-cols-[1fr_220px_220px_auto]" onSubmit={addProject}>
          <input
            className="h-14 rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder={t("Project name")}
            value={draft.name}
          />
          <BubbleDropdown
            icon={Building2}
            label={t("Client")}
            onChange={(client) => setDraft((current) => ({ ...current, client }))}
            options={workspaceOptions.map((option) => ({ value: option, label: option }))}
            value={draft.client}
            widthClass="min-w-full"
          />
          <BubbleDropdown
            icon={BriefcaseBusiness}
            label={t("Category")}
            onChange={(category) => setDraft((current) => ({ ...current, category }))}
            options={projectCategories.map((category) => ({ value: category, label: t(category) }))}
            value={draft.category}
            widthClass="min-w-full"
          />
          <button className="h-14 rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950" type="submit">
            {t("Add")}
          </button>
        </form>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-500">
              <th className="px-3 py-2 font-medium">{t("Project name")}</th>
              <th className="px-3 py-2 font-medium">{t("Client")}</th>
              <th className="px-3 py-2 font-medium">{t("Category")}</th>
              <th className="px-3 py-2 font-medium">{t("Status")}</th>
              <th className="px-3 py-2 font-medium">{t("Progress")}</th>
              <th className="px-3 py-2 font-medium">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr className="bg-white/[0.035] text-sm" key={project.id}>
                <td className="rounded-l-xl border-y border-l border-white/10 px-3 py-4">
                  <p className="font-semibold text-white">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{t(project.updated)}</p>
                </td>
                <td className="border-y border-white/10 px-3 py-4 text-slate-300">{project.client}</td>
                <td className="border-y border-white/10 px-3 py-4 text-slate-300">{t(project.category)}</td>
                <td className="border-y border-white/10 px-3 py-4">
                  <BubbleDropdown
                    icon={Activity}
                    label={t("Status")}
                    onChange={(status) => updateProject(project.id, { status })}
                    options={projectStatuses.map((status) => ({ value: status, label: t(status) }))}
                    value={project.status}
                    widthClass="min-w-40"
                  />
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
                <td className="rounded-r-xl border-y border-r border-white/10 px-3 py-4">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-rose-300/30 hover:bg-rose-300/10 hover:text-rose-100" onClick={() => deleteProject(project)} type="button">
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

function SettingsPage({
  autoAssign,
  dataRegion,
  emailAlerts,
  modelRoute,
  onSave,
  saved,
  setAutoAssign,
  setDataRegion,
  setEmailAlerts,
  setModelRoute,
  setWeeklyReports,
  t,
  weeklyReports
}: {
  autoAssign: boolean;
  dataRegion: string;
  emailAlerts: boolean;
  modelRoute: string;
  onSave: () => void;
  saved: boolean;
  setAutoAssign: (value: boolean) => void;
  setDataRegion: (value: string) => void;
  setEmailAlerts: (value: boolean) => void;
  setModelRoute: (value: string) => void;
  setWeeklyReports: (value: boolean) => void;
  t: Translate;
  weeklyReports: boolean;
}) {
  return (
    <section className="mt-6 glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-100">{t("Settings")}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{t("Workspace controls")}</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BubbleDropdown
          icon={BrainCircuit}
          label={t("AI model route")}
          onChange={setModelRoute}
          options={modelOptions.map((option) => ({ value: option, label: t(option) }))}
          value={modelRoute}
          widthClass="min-w-full"
        />
        <BubbleDropdown
          icon={Globe2}
          label={t("Data region")}
          onChange={setDataRegion}
          options={dataRegionOptions.map((option) => ({ value: option, label: t(option) }))}
          value={dataRegion}
          widthClass="min-w-full"
        />
        <Toggle label={t("Email alerts")} icon={Bell} checked={emailAlerts} onChange={setEmailAlerts} />
        <Toggle label={t("Weekly client reports")} icon={Activity} checked={weeklyReports} onChange={setWeeklyReports} />
        <Toggle label={t("Auto-assign hot leads")} icon={Zap} checked={autoAssign} onChange={setAutoAssign} />
      </div>

      <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110" onClick={onSave} type="button">
        <Save className="h-4 w-4" />
        {saved ? t("Saved") : t("Save Settings")}
      </button>
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
        <button className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10" onClick={onClear} type="button">
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

function ReportPanel({
  isRunning,
  onClose,
  onExport,
  onQueueWorkflow,
  onViewAnalytics,
  t,
  workspace
}: {
  isRunning: boolean;
  onClose: () => void;
  onExport: () => void;
  onQueueWorkflow: () => void;
  onViewAnalytics: () => void;
  t: Translate;
  workspace: string;
}) {
  const reportItems = [
    {
      label: "Opportunity",
      body: "Revenue is up 12.8% with strongest growth from automation-heavy teams.",
      icon: ArrowUpRight,
      tone: "text-emerald-100 bg-emerald-300/10 border-emerald-300/20"
    },
    {
      label: "Risk",
      body: "Trial accounts with low AI usage show the highest churn probability this week.",
      icon: BrainCircuit,
      tone: "text-amber-100 bg-amber-300/10 border-amber-300/20"
    },
    {
      label: "Next action",
      body: "Queue a customer success workflow and review the 30D analytics trend.",
      icon: Activity,
      tone: "text-cyan-100 bg-cyan-300/10 border-cyan-300/20"
    }
  ];

  return (
    <section className="glass-panel relative z-20 mt-5 rounded-2xl p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs font-semibold text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            {isRunning ? t("Generating Report") : t("AI Report Ready")}
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">{t("AI Report Ready")}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{t("Report generated for {workspace}", { workspace })}</p>
        </div>

        <button aria-label={t("Close report")} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white lg:static" onClick={onClose} type="button">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {reportItems.map((item) => (
          <article className="rounded-xl border border-white/10 bg-white/[0.035] p-4" key={item.label}>
            <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl border", item.tone)}>
              <item.icon className="h-4 w-4" />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">{t(item.label)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{t(item.body)}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10" onClick={onViewAnalytics} type="button">
          <BarChart3 className="h-4 w-4" />
          {t("View Analytics")}
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/10 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-300/15" onClick={onQueueWorkflow} type="button">
          <Play className="h-4 w-4" />
          {t("Queue Workflow")}
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110" onClick={onExport} type="button">
          <ArrowUpRight className="h-4 w-4" />
          {t("Export Report CSV")}
        </button>
      </div>
    </section>
  );
}

function AssistantBubble({ onClick, t }: { onClick: () => void; t: Translate }) {
  return (
    <button
      aria-label={t("Open assistant")}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/25 bg-slate-950/95 text-cyan-100 shadow-glow transition hover:scale-105 hover:bg-cyan-300/10"
      onClick={onClick}
      type="button"
    >
      <Bot className="h-6 w-6" />
    </button>
  );
}

function AssistantWindow({
  addActivity,
  messages,
  onClose,
  setMessages,
  t
}: {
  addActivity: (item: Omit<ActivityItem, "id" | "timeKey">) => void;
  messages: Message[];
  onClose: () => void;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  t: Translate;
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
      { id: nextId + 1, role: "AI", body: "I routed this to the right workflow and added an activity note." }
    ]);
    setPrompt("");
    addActivity({
      titleKey: "AI Assistant",
      detailKey: "I routed this to the right workflow and added an activity note.",
      tone: "violet"
    });
  };

  return (
    <div className="fixed bottom-24 right-5 z-50 w-[min(420px,calc(100vw-2rem))]">
      <section className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t("AI Assistant")}</p>
              <p className="text-xs text-slate-500">{t("ClientFlow AI")}</p>
            </div>
          </div>
          <button aria-label={t("Close assistant")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3">
          {messages.map((message) => (
            <div
              className={clsx(
                "rounded-xl border px-4 py-3 text-sm leading-6",
                message.role === "AI" ? "border-cyan-300/18 bg-cyan-300/8 text-cyan-50" : "ml-auto max-w-[88%] border-violet-300/18 bg-violet-300/10 text-violet-50"
              )}
              key={message.id}
            >
              <p className="mb-1 text-xs font-semibold text-slate-400">{t(message.role)}</p>
              {t(message.body)}
            </div>
          ))}
        </div>

        <form className="mt-3 flex gap-2" onSubmit={sendMessage}>
          <input
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={t("Ask ClientFlow about leads, projects, or churn...")}
            value={prompt}
          />
          <button aria-label={t("Send message")} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 text-slate-950 transition hover:brightness-110" type="submit">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
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
        className={clsx("relative h-7 w-12 rounded-full border transition", checked ? "border-cyan-300/40 bg-cyan-300/30" : "border-white/10 bg-slate-800")}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className={clsx("absolute top-1 h-5 w-5 rounded-full bg-white transition", checked ? "left-6" : "left-1")} />
      </button>
    </label>
  );
}
