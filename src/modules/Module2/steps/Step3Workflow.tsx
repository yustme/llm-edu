import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { AgentWorkflow } from "@/components/agents/AgentWorkflow";
import { MULTI_AGENT_STEPS } from "@/data/mock-multi-agent";

const STATIC_VIEW_INDEX = -1;

export function Step3Workflow() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="How Collaboration Flows"
          highlights={["Orchestration", "Message Passing", "Pipeline"]}
        >
          <p>
            The diagram on the right shows how our three agents are connected.
            Each arrow represents a communication channel between agents.
          </p>
          <p>The workflow follows a clear pattern:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-medium text-foreground">User</span> sends
              a business question to the Data Analyst
            </li>
            <li>
              <span className="font-medium text-foreground">Data Analyst</span>{" "}
              interprets the request and sends data requirements to the Data
              Engineer
            </li>
            <li>
              <span className="font-medium text-foreground">Data Engineer</span>{" "}
              writes and executes SQL queries, returns results to the Analyst
            </li>
            <li>
              <span className="font-medium text-foreground">Data Analyst</span>{" "}
              interprets results and sends analysis to the Reporting Agent
            </li>
            <li>
              <span className="font-medium text-foreground">
                Reporting Agent
              </span>{" "}
              creates visualizations and delivers the final report to the User
            </li>
          </ol>
          <p>
            Each agent only needs to know about its immediate neighbors, not
            the entire system. This makes the architecture modular and easy to
            extend.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="h-[420px]">
          <AgentWorkflow
            messages={MULTI_AGENT_STEPS}
            activeMessageIndex={STATIC_VIEW_INDEX}
            className="h-full w-full"
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
