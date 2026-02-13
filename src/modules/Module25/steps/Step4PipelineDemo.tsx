import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { PipelineScenarios } from "@/components/multimodal/PipelineScenarios";
import { PIPELINE_SCENARIOS } from "@/data/mock-multimodal";

export function Step4PipelineDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Multimodal Pipeline Demo"
          highlights={[
            "Image Description",
            "Chart Extraction",
            "Form Parsing",
          ]}
        >
          <p>
            In practice, multimodal processing follows a consistent pipeline
            pattern regardless of the input type:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Input encoding</strong> -- the raw input (image, chart,
              or document) is converted into a format the model can process
            </li>
            <li>
              <strong>Feature extraction</strong> -- the model identifies
              relevant elements: objects, text, data points, or form fields
            </li>
            <li>
              <strong>Semantic interpretation</strong> -- extracted features
              are combined into a coherent understanding using language reasoning
            </li>
            <li>
              <strong>Structured output</strong> -- the final result is
              formatted as clean JSON for downstream consumption
            </li>
          </ul>
          <p>
            Explore three scenarios on the right. Click <strong>Run
            Pipeline</strong> to see each step animate in sequence, then
            view the structured output produced.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea>
          <PipelineScenarios scenarios={PIPELINE_SCENARIOS} />
        </InteractiveArea>
      </div>
    </div>
  );
}
