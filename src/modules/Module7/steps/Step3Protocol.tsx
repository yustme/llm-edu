import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ProtocolFlow } from "@/components/mcp/ProtocolFlow";

export function Step3Protocol() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="JSON-RPC 2.0 Protocol"
          highlights={["JSON-RPC", "Request/Response", "Stateful"]}
        >
          <p>
            MCP uses JSON-RPC 2.0 as its message format. Every interaction
            follows a simple request/response pattern where the client sends a
            request and the server responds.
          </p>

          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-foreground">Initialize:</span>{" "}
              Client and server negotiate protocol version and exchange
              capabilities.
            </li>
            <li>
              <span className="font-medium text-foreground">
                tools/list:
              </span>{" "}
              Client discovers what tools the server provides, including their
              input schemas.
            </li>
            <li>
              <span className="font-medium text-foreground">
                tools/call:
              </span>{" "}
              Client invokes a specific tool with arguments and receives the
              result.
            </li>
          </ul>

          <p>
            Each message has a unique <code className="text-xs bg-muted px-1 rounded">id</code> field
            that links requests to their responses, enabling reliable
            communication even with concurrent operations.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
            Protocol Message Exchange
          </p>
          <ProtocolFlow />
        </InteractiveArea>
      </div>
    </div>
  );
}
