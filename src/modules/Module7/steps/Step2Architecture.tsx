import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { MCPArchitecture } from "@/components/mcp/MCPArchitecture";
import { ARCHITECTURE_LAYERS } from "../data";

export function Step2Architecture() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="3 Layers of MCP"
          highlights={["Host", "Client", "Server"]}
        >
          <p>
            The Model Context Protocol defines three distinct architectural
            layers, each with a clear responsibility. This separation ensures
            clean boundaries and easy extensibility.
          </p>

          <ul className="list-none space-y-3 pl-0">
            {Object.entries(ARCHITECTURE_LAYERS).map(([key, layer]) => (
              <li key={key}>
                <span className="font-semibold text-foreground">
                  {layer.title}:
                </span>{" "}
                {layer.description}
              </li>
            ))}
          </ul>

          <p>
            The host can connect to multiple servers simultaneously, giving the
            AI model access to diverse tools and data sources through a single
            standardized protocol.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
            MCP Architecture Diagram
          </p>
          <MCPArchitecture />
        </InteractiveArea>
      </div>
    </div>
  );
}
