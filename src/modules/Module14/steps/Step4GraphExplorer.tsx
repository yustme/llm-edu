import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { GraphExplorer } from "@/components/knowledge-graph/GraphExplorer";
import { KG_NODES, KG_EDGES } from "@/data/mock-knowledge-graph";

export function Step4GraphExplorer() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Interactive Graph Explorer"
          highlights={[
            "Click to Select",
            "Search & Filter",
            "Color-coded Types",
          ]}
        >
          <p>
            Explore the knowledge graph interactively. This graph contains 15
            entities (scientists, places, concepts, and organizations) connected
            by typed relationships.
          </p>
          <p>How to interact:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Click a node</strong> to select it and highlight its direct
              connections. All other nodes are dimmed. Click again to deselect.
            </li>
            <li>
              <strong>Hover over a node</strong> to see a tooltip with its type
              and description.
            </li>
            <li>
              <strong>Type in the search box</strong> to filter and highlight
              nodes by name or type (e.g., try &quot;person&quot; or
              &quot;curie&quot;).
            </li>
          </ul>
          <p>
            Node colors indicate entity type:{" "}
            <strong className="text-blue-500">blue</strong> for people,{" "}
            <strong className="text-green-500">green</strong> for places,{" "}
            <strong className="text-purple-500">purple</strong> for concepts,
            and <strong className="text-amber-500">amber</strong> for
            organizations.
          </p>
          <p>
            Notice how the graph structure makes it easy to see connections that
            would be hidden in a flat table or document.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea>
          <GraphExplorer nodes={KG_NODES} edges={KG_EDGES} />
        </InteractiveArea>
      </div>
    </div>
  );
}
