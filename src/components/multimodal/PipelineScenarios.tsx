import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Image, BarChart3, FileText, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import type { PipelineScenario } from "@/data/mock-multimodal";

const STAGGER_DELAY = 0.6;
const STEP_REVEAL_INTERVAL_MS = 1200;

const ICON_MAP: Record<string, typeof Image> = {
  PHOTO: Image,
  CHART: BarChart3,
  FORM: FileText,
};

const INPUT_COLORS: Record<string, string> = {
  PHOTO: "bg-emerald-50 border-emerald-200 text-emerald-700",
  CHART: "bg-blue-50 border-blue-200 text-blue-700",
  FORM: "bg-amber-50 border-amber-200 text-amber-700",
};

interface PipelineScenariosProps {
  scenarios: readonly PipelineScenario[];
}

function ScenarioContent({ scenario }: { scenario: PipelineScenario }) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const totalSteps = scenario.processingSteps.length;
  const isComplete = visibleSteps >= totalSteps;

  const IconComponent = ICON_MAP[scenario.inputIcon] ?? FileText;
  const inputColor = INPUT_COLORS[scenario.inputIcon] ?? INPUT_COLORS.FORM;

  function handleRun() {
    setVisibleSteps(0);
    setIsRunning(true);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setVisibleSteps(step);
      if (step >= totalSteps) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, STEP_REVEAL_INTERVAL_MS);
  }

  function handleReset() {
    setVisibleSteps(0);
    setIsRunning(false);
  }

  return (
    <div className="space-y-5">
      {/* Input representation */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Input
        </p>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border-2 border-dashed p-4",
            inputColor,
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white/60">
            <IconComponent className="h-6 w-6" />
          </div>
          <div className="text-sm">{scenario.inputDescription}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleRun}
          disabled={isRunning}
          className="gap-2"
        >
          <Play className="h-3.5 w-3.5" />
          {isComplete ? "Run Again" : "Run Pipeline"}
        </Button>
        {visibleSteps > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isRunning}
            className="gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Processing steps */}
      {visibleSteps > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Processing Steps
          </p>
          <div className="space-y-3">
            {scenario.processingSteps.map((step, index) => {
              if (index >= visibleSteps) return null;
              const stepStatus =
                index < visibleSteps - 1
                  ? "done"
                  : isRunning
                    ? "active"
                    : "done";

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.05,
                  }}
                >
                  <ReasoningStep
                    stepNumber={index + 1}
                    title={step.title}
                    content={step.content}
                    status={stepStatus}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Output */}
      {isComplete && !isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY * 0.3 }}
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Output
          </p>
          <CodeBlock
            code={scenario.outputData}
            language={scenario.outputLanguage}
            title="Extracted Structured Data"
          />
        </motion.div>
      )}
    </div>
  );
}

export function PipelineScenarios({ scenarios }: PipelineScenariosProps) {
  const [activeTab, setActiveTab] = useState(scenarios[0].id);

  const tabIndex = scenarios.findIndex((s) => s.id === activeTab);
  const setTabByIndex = useCallback(
    (i: number) => setActiveTab(scenarios[i].id),
    [scenarios],
  );
  useFullscreenStepper(
    tabIndex === -1 ? 0 : tabIndex,
    scenarios.length,
    setTabByIndex,
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        {scenarios.map((scenario) => (
          <TabsTrigger key={scenario.id} value={scenario.id}>
            {scenario.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {scenarios.map((scenario) => (
        <TabsContent key={scenario.id} value={scenario.id} className="mt-4">
          <ScenarioContent scenario={scenario} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
