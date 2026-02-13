import { useState, useCallback } from "react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ApprovalFlowDiagram } from "@/components/human-loop/ApprovalFlowDiagram";
import { APPROVAL_PATTERNS } from "@/data/mock-human-loop";
import type { ApprovalPattern } from "@/data/mock-human-loop";
import { cn } from "@/lib/utils";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";

const TAB_STYLES: Record<
  ApprovalPattern["id"],
  { active: string; inactive: string }
> = {
  "pre-action": {
    active: "bg-blue-600 text-white",
    inactive: "text-blue-700 hover:bg-blue-50",
  },
  "post-action": {
    active: "bg-purple-600 text-white",
    inactive: "text-purple-700 hover:bg-purple-50",
  },
  escalation: {
    active: "bg-orange-600 text-white",
    inactive: "text-orange-700 hover:bg-orange-50",
  },
};

export function Step2ApprovalPatterns() {
  const [activePattern, setActivePattern] =
    useState<ApprovalPattern["id"]>("pre-action");

  // Fullscreen stepper: cycle through approval patterns
  const PATTERN_IDS = APPROVAL_PATTERNS.map((p) => p.id);
  const patternIndex = PATTERN_IDS.indexOf(activePattern);
  const setPatternByIndex = useCallback(
    (i: number) => setActivePattern(PATTERN_IDS[i]),
    [],
  );
  useFullscreenStepper(patternIndex, PATTERN_IDS.length, setPatternByIndex);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Approval Patterns"
          highlights={[
            "Pre-Action",
            "Post-Action",
            "Escalation",
          ]}
        >
          <p>
            There are three fundamental patterns for incorporating human
            oversight into agent workflows. Each balances{" "}
            <strong>speed</strong> against <strong>safety</strong> differently.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Pre-Action Approval</strong> - The agent proposes an action
              and waits for human approval before executing. Safest but slowest.
            </li>
            <li>
              <strong>Post-Action Review</strong> - The agent executes
              immediately, then presents results for human verification. Fast
              but risky for irreversible actions.
            </li>
            <li>
              <strong>Confidence-Based Escalation</strong> - The agent
              auto-executes when confident and escalates to humans when
              uncertain. Best balance of speed and safety.
            </li>
          </ul>
          <p>
            Choose the pattern based on the <strong>reversibility</strong> and{" "}
            <strong>impact</strong> of the action. High-stakes irreversible
            actions should always use pre-action approval.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Approval Flow Patterns
          </p>

          {/* Pattern tabs */}
          <div className="flex justify-center gap-2">
            {APPROVAL_PATTERNS.map((pattern) => {
              const styles = TAB_STYLES[pattern.id];
              const isActive = activePattern === pattern.id;
              return (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setActivePattern(pattern.id)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? styles.active : styles.inactive,
                  )}
                >
                  {pattern.name}
                </button>
              );
            })}
          </div>

          {/* Active flow diagram */}
          <ApprovalFlowDiagram pattern={activePattern} />
        </InteractiveArea>
      </div>
    </div>
  );
}
