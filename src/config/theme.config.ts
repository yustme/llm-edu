/** Colors assigned to each agent role */
export const AGENT_COLORS = {
  dataAnalyst: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
    accent: "#9333ea",
  },
  dataEngineer: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    accent: "#16a34a",
  },
  reportingAgent: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
    accent: "#d97706",
  },
  user: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    accent: "#2563eb",
  },
} as const;

/** Colors for simulation step statuses */
export const STATUS_COLORS = {
  idle: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
  working: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  done: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-400",
  },
} as const;

/** Layout dimensions */
export const LAYOUT = {
  sidebarWidthPx: 280,
  /** Minimum content area width before sidebar auto-collapses */
  contentMinWidthPx: 700,
} as const;

/** Font scale levels cycled by +/- keys */
export const FONT_SCALE_LEVELS = [80, 90, 100, 110, 120, 130, 140, 150, 160] as const;
export type FontScaleLevel = (typeof FONT_SCALE_LEVELS)[number];
