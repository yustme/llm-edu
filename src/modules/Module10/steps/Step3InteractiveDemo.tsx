import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CosineSimilarityDemo } from "@/components/similarity/CosineSimilarityDemo";

export function Step3InteractiveDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Interactive Vector Demo"
          highlights={["Drag", "Real-Time", "Presets"]}
        >
          <p>
            <strong>Drag the vector tips</strong> (the circles) in the SVG
            canvas and observe how cosine similarity changes in real time.
          </p>
          <p>Key observations:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Parallel vectors</strong> (same direction) have cosine
              similarity close to <strong>1.0</strong>
            </li>
            <li>
              <strong>Perpendicular vectors</strong> (90 degrees) have cosine
              similarity of <strong>0.0</strong>
            </li>
            <li>
              <strong>Opposite vectors</strong> (180 degrees) have cosine
              similarity of <strong>-1.0</strong>
            </li>
          </ul>
          <p>
            Use the <strong>preset buttons</strong> below the canvas to jump
            to common configurations and see the exact values.
          </p>
          <p>
            Notice how the <strong>length of the vectors does not matter</strong>{" "}
            - only the angle between them affects cosine similarity. This is the
            key advantage over Euclidean distance.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea>
          <CosineSimilarityDemo />
        </InteractiveArea>
      </div>
    </div>
  );
}
