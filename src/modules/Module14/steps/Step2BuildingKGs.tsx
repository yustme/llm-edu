import { useEffect } from "react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { TripleExtractor } from "@/components/knowledge-graph/TripleExtractor";
import { usePresentationStore } from "@/stores/presentation.store";
import {
  NER_EXAMPLE_TEXT,
  NER_ENTITY_SPANS,
  NER_EXTRACTED_TRIPLES,
} from "@/data/mock-knowledge-graph";

const PHASE_COUNT = 4;

export function Step2BuildingKGs() {
  const queryIndex = usePresentationStore((s) => s.queryIndex);
  const registerQueries = usePresentationStore((s) => s.registerQueries);
  const setQueryIndex = usePresentationStore((s) => s.setQueryIndex);

  useEffect(() => {
    registerQueries(PHASE_COUNT);
    return () => registerQueries(0);
  }, [registerQueries]);
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Building KGs from Text"
          highlights={[
            "NER",
            "Relation Extraction",
            "Triple Generation",
            "Pipeline",
          ]}
        >
          <p>
            Knowledge graphs are typically built from unstructured text through a
            multi-step pipeline. The process transforms raw text into structured,
            queryable knowledge.
          </p>
          <p>The extraction pipeline:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <strong>Named Entity Recognition (NER)</strong> -- identify
              entities (people, places, organizations, concepts) in the text
            </li>
            <li>
              <strong>Relation Extraction</strong> -- determine the relationships
              between identified entities
            </li>
            <li>
              <strong>Triple Generation</strong> -- convert entity-relation pairs
              into (subject, predicate, object) triples
            </li>
            <li>
              <strong>Graph Construction</strong> -- merge triples into a
              connected graph, resolving duplicates and aliases
            </li>
          </ol>
          <p>
            Modern LLMs can perform all these steps in a single prompt, though
            specialized NER models (like spaCy or REBEL) are often more accurate
            for production systems.
          </p>
          <p>
            Use the <strong>Next</strong> button on the right to step through the
            extraction pipeline on a sample paragraph.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Text-to-Knowledge-Graph Pipeline
          </p>
          <TripleExtractor
            text={NER_EXAMPLE_TEXT}
            entitySpans={NER_ENTITY_SPANS}
            triples={NER_EXTRACTED_TRIPLES}
            phaseIndex={queryIndex}
            onPhaseChange={setQueryIndex}
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
