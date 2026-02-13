import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { GraphBuildingPipeline } from "@/components/graph-rag/GraphBuildingPipeline";

export function Step2Construction() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="From Text to Knowledge Graph"
          highlights={[
            "Entity Extraction",
            "Relationship Extraction",
            "Graph Construction",
          ]}
        >
          <p>
            The first step in GraphRAG is constructing a knowledge graph from
            raw documents. This is typically done using an LLM to extract
            structured information from unstructured text.
          </p>
          <p>The pipeline has three main stages:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <span className="font-medium">Entity Extraction</span> - The LLM
              identifies named entities (people, organizations, concepts,
              locations) in the text and classifies them by type.
            </li>
            <li>
              <span className="font-medium">Relationship Extraction</span> -
              For each pair of entities, the LLM determines if a meaningful
              relationship exists and labels it (e.g., "CEO of", "leads",
              "based in").
            </li>
            <li>
              <span className="font-medium">Graph Construction</span> -
              Entities become nodes and relationships become edges in a
              knowledge graph. This structured representation preserves the
              connections between concepts.
            </li>
          </ol>
          <p>
            Use the controls on the right to step through each phase and see
            how raw text transforms into a structured graph.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive pipeline */}
      <div className="flex-1">
        <InteractiveArea>
          <GraphBuildingPipeline />
        </InteractiveArea>
      </div>
    </div>
  );
}
