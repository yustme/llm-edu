import { useMemo } from "react";
import { motion } from "framer-motion";
import { Monitor, Plug, Database, Globe, FileText, Server } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { KEY_TAKEAWAYS } from "../data";
import { cn } from "@/lib/utils";

const ANIMATION_DURATION = 0.4;
const STAGGER_DELAY = 0.15;

/** Static summary architecture diagram */
function SummaryDiagram() {
  const servers = [
    {
      Icon: Database,
      label: "Database",
      colorBg: "bg-blue-100 border-blue-300",
      colorText: "text-blue-600",
    },
    {
      Icon: Globe,
      label: "API",
      colorBg: "bg-green-100 border-green-300",
      colorText: "text-green-600",
    },
    {
      Icon: FileText,
      label: "Files",
      colorBg: "bg-amber-100 border-amber-300",
      colorText: "text-amber-600",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: ANIMATION_DURATION }}
        className="text-sm font-medium text-muted-foreground"
      >
        MCP Architecture Overview
      </motion.p>

      <div className="flex items-center gap-6">
        {/* Host Application */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
          className="flex flex-col items-center gap-2 rounded-xl border-2 border-slate-300 bg-slate-50 px-4 py-3"
        >
          <Monitor className="h-6 w-6 text-slate-600" />
          <span className="text-xs font-semibold text-slate-700">
            Host App
          </span>
          <div className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1">
            <span className="text-[10px] font-medium text-indigo-700">
              MCP Client
            </span>
          </div>
        </motion.div>

        {/* Protocol connection */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-0.5 w-16 bg-indigo-400" />
          <div className="flex items-center gap-1">
            <Plug className="h-3 w-3 text-indigo-500" />
            <span className="text-[9px] font-medium text-indigo-600">MCP</span>
          </div>
        </motion.div>

        {/* Servers column */}
        <div className="flex flex-col gap-2">
          {servers.map((server, i) => (
            <motion.div
              key={server.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.7 + i * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
              className="flex items-center gap-2"
            >
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border-2 px-3 py-2",
                  server.colorBg,
                )}
              >
                <Server className={cn("h-3.5 w-3.5", server.colorText)} />
                <span className="text-[10px] font-medium">{server.label}</span>
              </div>
              <div className="h-px w-4 bg-gray-300" />
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded border",
                  server.colorBg,
                )}
              >
                <server.Icon className={cn("h-3.5 w-3.5", server.colorText)} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="max-w-md text-center text-xs text-muted-foreground"
      >
        One protocol connects any AI application to any data source or tool.
        Build once, use everywhere.
      </motion.p>
    </div>
  );
}

export function Step6Summary() {
  const takeaways = useMemo(() => KEY_TAKEAWAYS, []);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["MCP", "Standardization", "Security"]}
        >
          <ul className="list-none space-y-4 pl-0">
            {takeaways.map((takeaway, i) => (
              <motion.li
                key={takeaway.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2 + i * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
              >
                <span className="font-semibold text-foreground">
                  {takeaway.title}.
                </span>{" "}
                {takeaway.description}
              </motion.li>
            ))}
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center">
          <SummaryDiagram />
        </InteractiveArea>
      </div>
    </div>
  );
}
