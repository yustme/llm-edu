import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ScenarioTabs } from "@/components/self-healing/ScenarioTabs";
import { SELF_HEALING_SCENARIOS } from "@/data/mock-self-healing";

export function Step5BroaderPatterns() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Broader Self-Healing Patterns"
          highlights={["SQL", "API Calls", "Code Generation"]}
        >
          <p>
            Self-healing is not limited to SQL queries. The same
            error-fix-retry pattern applies across many agent domains.
          </p>
          <p>Common self-healing scenarios:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>SQL Queries</strong> - wrong table names, missing JOINs,
              syntax errors corrected by inspecting the database schema
            </li>
            <li>
              <strong>API Calls</strong> - deprecated endpoints, changed
              response formats, authentication failures handled by reading
              updated documentation
            </li>
            <li>
              <strong>Code Generation</strong> - runtime type errors, null
              pointer exceptions, missing imports fixed by analyzing stack
              traces
            </li>
          </ul>
          <p>
            The key insight: the agent uses <strong>error messages as
            feedback</strong> to improve its next attempt, just like a human
            developer would.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Self-Healing Across Domains
          </p>
          <ScenarioTabs scenarios={SELF_HEALING_SCENARIOS} />
        </InteractiveArea>
      </div>
    </div>
  );
}
