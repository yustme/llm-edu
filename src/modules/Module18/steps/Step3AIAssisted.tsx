import { motion } from "framer-motion";
import { ArrowRight, Check, GitMerge, Search, AlertTriangle, Wand2, ShieldCheck, FileText } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { AI_CAPABILITIES } from "../data";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const ICONS: Record<string, React.ElementType> = {
  GitMerge,
  Search,
  AlertTriangle,
  Wand2,
  ShieldCheck,
  FileText,
};

export function Step3AIAssisted() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="AI Agent Capabilities"
          highlights={["Auto-Mapping", "Inference", "Recovery"]}
        >
          <p>
            AI agents bring several capabilities that transform ETL from a
            manual coding task into an <strong>intelligent, adaptive</strong>{" "}
            process.
          </p>
          <p>
            Instead of hardcoding column mappings, the agent uses{" "}
            <strong>semantic understanding</strong> to automatically match
            source columns to target columns - even when names differ.
          </p>
          <p>
            When schemas change, the agent can <strong>adapt
            automatically</strong> instead of breaking. It detects new columns,
            suggests mappings, and flags ambiguous cases for human review.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          {/* Pipeline overview */}
          <p className="text-center text-sm font-medium text-muted-foreground">
            AI-Assisted Pipeline
          </p>
          <div className="flex items-center justify-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
              className="rounded-lg border-2 border-blue-300 bg-blue-100 px-4 py-2 text-center"
            >
              <p className="text-sm font-bold text-blue-700">Source</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: ANIMATION_DURATION }}
              className="rounded-lg border-2 border-primary bg-primary/10 px-6 py-3 text-center"
            >
              <p className="text-sm font-bold text-primary">AI Agent</p>
              <p className="text-[10px] text-muted-foreground">Map + Transform + Validate</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: ANIMATION_DURATION }}
              className="rounded-lg border-2 border-green-300 bg-green-100 px-4 py-2 text-center"
            >
              <p className="text-sm font-bold text-green-700">Target</p>
            </motion.div>
          </div>

          {/* Capabilities */}
          <p className="text-center text-sm font-medium text-muted-foreground mt-2">
            Agent Capabilities
          </p>
          <div className="space-y-2">
            {AI_CAPABILITIES.map((cap, index) => {
              const Icon = ICONS[cap.iconName] ?? Check;
              return (
                <motion.div
                  key={cap.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 1.0 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {cap.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
