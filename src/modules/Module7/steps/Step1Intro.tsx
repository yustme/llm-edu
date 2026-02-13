import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plug, Unplug, ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Button } from "@/components/ui/button";
import { usePresentationStore } from "@/stores/presentation.store";
import { NM_PROBLEM_TEXT } from "../data";
import { NM_PROBLEM } from "@/config/mcp.config";

const ANIMATION_DURATION = 0.4;
const STAGGER_DELAY = 0.08;

/** Colors for apps and tools */
const APP_COLORS = [
  "bg-indigo-100 border-indigo-300 text-indigo-700",
  "bg-purple-100 border-purple-300 text-purple-700",
  "bg-pink-100 border-pink-300 text-pink-700",
  "bg-rose-100 border-rose-300 text-rose-700",
  "bg-orange-100 border-orange-300 text-orange-700",
];

const TOOL_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-700",
  "bg-green-100 border-green-300 text-green-700",
  "bg-amber-100 border-amber-300 text-amber-700",
  "bg-cyan-100 border-cyan-300 text-cyan-700",
];

/** The "Before MCP" spaghetti diagram */
function BeforeDiagram() {
  const apps = NM_PROBLEM.beforeApps;
  const tools = NM_PROBLEM.beforeTools;

  return (
    <div className="relative flex justify-between px-4 py-6">
      {/* Apps column */}
      <div className="flex flex-col gap-2">
        {apps.map((app, i) => (
          <motion.div
            key={app}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * STAGGER_DELAY, duration: ANIMATION_DURATION }}
            className={`rounded-md border px-3 py-1.5 text-[11px] font-medium ${APP_COLORS[i]}`}
          >
            {app}
          </motion.div>
        ))}
      </div>

      {/* Spaghetti lines (SVG) */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
      >
        {apps.map((_, ai) =>
          tools.map((_, ti) => (
            <motion.line
              key={`line-${ai}-${ti}`}
              x1="35%"
              y1={`${15 + ai * 18}%`}
              x2="65%"
              y2={`${15 + ti * 22}%`}
              stroke="#f87171"
              strokeWidth="1"
              strokeOpacity="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.5 + (ai * tools.length + ti) * 0.03,
                duration: 0.3,
              }}
            />
          )),
        )}
      </svg>

      {/* Tools column */}
      <div className="flex flex-col gap-2">
        {tools.map((tool, i) => (
          <motion.div
            key={tool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: apps.length * STAGGER_DELAY + i * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className={`rounded-md border px-3 py-1.5 text-[11px] font-medium ${TOOL_COLORS[i]}`}
          >
            {tool}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** The "After MCP" star topology diagram */
function AfterDiagram() {
  const apps = NM_PROBLEM.afterApps;
  const tools = NM_PROBLEM.afterTools;

  return (
    <div className="relative flex items-center justify-between px-4 py-6">
      {/* Apps column */}
      <div className="flex flex-col gap-2">
        {apps.map((app, i) => (
          <motion.div
            key={app}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * STAGGER_DELAY, duration: ANIMATION_DURATION }}
            className={`rounded-md border px-3 py-1.5 text-[11px] font-medium ${APP_COLORS[i]}`}
          >
            {app}
          </motion.div>
        ))}
      </div>

      {/* Lines to MCP hub */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
      >
        {/* App -> MCP lines */}
        {apps.map((_, ai) => (
          <motion.line
            key={`app-line-${ai}`}
            x1="30%"
            y1={`${15 + ai * 18}%`}
            x2="47%"
            y2="50%"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5 + ai * 0.08, duration: 0.3 }}
          />
        ))}
        {/* MCP -> Tool lines */}
        {tools.map((_, ti) => (
          <motion.line
            key={`tool-line-${ti}`}
            x1="53%"
            y1="50%"
            x2="70%"
            y2={`${15 + ti * 22}%`}
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              delay: 0.5 + apps.length * 0.08 + ti * 0.08,
              duration: 0.3,
            }}
          />
        ))}
      </svg>

      {/* MCP Hub */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="z-10 flex flex-col items-center gap-1 rounded-xl border-2 border-indigo-400 bg-indigo-100 px-4 py-3"
      >
        <Plug className="h-5 w-5 text-indigo-600" />
        <span className="text-[11px] font-bold text-indigo-700">MCP</span>
      </motion.div>

      {/* Tools column */}
      <div className="flex flex-col gap-2">
        {tools.map((tool, i) => (
          <motion.div
            key={tool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: apps.length * STAGGER_DELAY + i * STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className={`rounded-md border px-3 py-1.5 text-[11px] font-medium ${TOOL_COLORS[i]}`}
          >
            {tool}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const QUERY_COUNT = 2;

export function Step1Intro() {
  const queryIndex = usePresentationStore((s) => s.queryIndex);
  const registerQueries = usePresentationStore((s) => s.registerQueries);
  const setQueryIndex = usePresentationStore((s) => s.setQueryIndex);

  useEffect(() => {
    registerQueries(QUERY_COUNT);
    return () => registerQueries(0);
  }, [registerQueries]);

  const showAfter = queryIndex >= 1;

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="The Integration Problem"
          highlights={["N*M Problem", "Universal Standard", "USB-C Analogy"]}
        >
          <p>{NM_PROBLEM_TEXT.before}</p>
          <p>{NM_PROBLEM_TEXT.after}</p>

          <div className="mt-2 rounded-lg border bg-amber-50 p-3 border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Plug className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">
                USB-C Analogy
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {NM_PROBLEM_TEXT.analogy}
            </p>
          </div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col">
          {/* Toggle button */}
          <div className="mb-3 flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant={!showAfter ? "default" : "outline"}
              onClick={() => setQueryIndex(0)}
              className="gap-1.5"
            >
              <Unplug className="h-3.5 w-3.5" />
              Before MCP
            </Button>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Button
              size="sm"
              variant={showAfter ? "default" : "outline"}
              onClick={() => setQueryIndex(1)}
              className="gap-1.5"
            >
              <Plug className="h-3.5 w-3.5" />
              After MCP
            </Button>
          </div>

          {/* Connection count */}
          <motion.div
            key={showAfter ? "after-label" : "before-label"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-2 text-center"
          >
            <span
              className={`text-xs font-medium ${
                showAfter ? "text-green-600" : "text-red-600"
              }`}
            >
              {showAfter
                ? `${NM_PROBLEM.afterApps.length} + ${NM_PROBLEM.afterTools.length} = ${NM_PROBLEM.afterApps.length + NM_PROBLEM.afterTools.length} integrations`
                : `${NM_PROBLEM.beforeApps.length} x ${NM_PROBLEM.beforeTools.length} = ${NM_PROBLEM.beforeApps.length * NM_PROBLEM.beforeTools.length} integrations`}
            </span>
          </motion.div>

          {/* Diagram */}
          <div className="flex-1 min-h-[250px]">
            <AnimatePresence mode="wait">
              {showAfter ? (
                <motion.div
                  key="after"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AfterDiagram />
                </motion.div>
              ) : (
                <motion.div
                  key="before"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BeforeDiagram />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-2 text-center text-[10px] text-muted-foreground"
          >
            {showAfter
              ? "MCP acts as a universal adapter between AI apps and tools"
              : "Each connection requires a custom integration"}
          </motion.p>
        </InteractiveArea>
      </div>
    </div>
  );
}
