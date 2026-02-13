import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { AgentCard } from "@/components/agents/AgentCard";
import { AGENTS } from "@/config/multi-agent.config";

const STAGGER_DELAY = 0.3;

const agentList = [
  AGENTS["data-analyst"],
  AGENTS["data-engineer"],
  AGENTS["reporting-agent"],
];

export function Step2MeetAgents() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Meet the Team"
          highlights={["Data Analyst", "Data Engineer", "Reporting Agent"]}
        >
          <p>
            Our multi-agent system consists of three specialized agents, each
            with distinct capabilities and tools. They work together to handle
            complex data tasks that no single agent could efficiently manage
            alone.
          </p>
          <p>
            Each agent has its own set of tools and expertise. When a task
            arrives, agents communicate with each other, passing results and
            instructions to produce a final output.
          </p>
          <p>
            Explore each agent card on the right to see their roles, tools,
            and responsibilities.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col gap-4 overflow-auto">
          {agentList.map((agent, index) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              animationDelay={index * STAGGER_DELAY}
            />
          ))}
        </InteractiveArea>
      </div>
    </div>
  );
}
