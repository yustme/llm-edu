import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { FormulaDisplay } from "@/components/similarity/FormulaDisplay";
import { CodeBlock } from "@/components/presentation/CodeBlock";

/** Example vectors used to demonstrate the formula */
const EXAMPLE_VECTOR_A = { x: 3, y: 4 };
const EXAMPLE_VECTOR_B = { x: 4, y: 3 };

const TYPESCRIPT_FORMULA = `function cosineSimilarity(a: number[], b: number[]): number {
  // Dot product: sum of element-wise multiplication
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);

  // Magnitudes: sqrt of sum of squares
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

  // Avoid division by zero
  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

// Example usage
const embedding1 = [0.2, 0.8, 0.1, 0.5];
const embedding2 = [0.3, 0.7, 0.2, 0.6];
const similarity = cosineSimilarity(embedding1, embedding2);
// => 0.9887`;

export function Step2Formula() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="The Cosine Formula"
          highlights={["Dot Product", "Magnitude", "Angle"]}
        >
          <p>
            <strong>Cosine similarity</strong> measures the cosine of the angle
            between two vectors. It is computed as the dot product divided by
            the product of their magnitudes.
          </p>
          <p>The result ranges from <strong>-1 to 1</strong>:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>1.0</strong> - identical direction (maximum similarity)
            </li>
            <li>
              <strong>0.0</strong> - perpendicular (no similarity)
            </li>
            <li>
              <strong>-1.0</strong> - opposite direction (maximum dissimilarity)
            </li>
          </ul>
          <p>
            A key property is that cosine similarity is{" "}
            <strong>scale-invariant</strong>: it only cares about the direction,
            not the length of the vectors. This makes it ideal for comparing
            text embeddings where document length varies.
          </p>
          <p>
            In practice, most embedding models produce normalized vectors, so
            cosine similarity simplifies to just the{" "}
            <strong>dot product</strong>.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Formula with step-by-step calculation */}
          <FormulaDisplay
            vectorA={EXAMPLE_VECTOR_A}
            vectorB={EXAMPLE_VECTOR_B}
          />

          {/* TypeScript implementation */}
          <CodeBlock
            code={TYPESCRIPT_FORMULA}
            language="typescript"
            title="cosine-similarity.ts"
            showLineNumbers
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
