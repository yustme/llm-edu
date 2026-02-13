import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { DatasetTable } from "@/components/semantic/DatasetTable";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { RAW_DATA, TRANSFORMED_DATA, TRANSFORM_SQL } from "@/data/mock-etl";

export function Step5TransformDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Transform Demo"
          highlights={["Clean Names", "Type Convert", "Code Map"]}
        >
          <p>
            The AI agent generates a SQL transformation query that handles all
            the conversions identified during schema mapping.
          </p>
          <p>Transformations applied:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Column renaming</strong> - abbreviated names to descriptive
              names (cust_nm → customer_name)
            </li>
            <li>
              <strong>Date conversion</strong> - text dates (YYYY/MM/DD) to
              proper DATE type
            </li>
            <li>
              <strong>Status mapping</strong> - single-letter codes (C, X, R, P)
              to full status names
            </li>
            <li>
              <strong>Type casting</strong> - REAL to DECIMAL with proper
              precision
            </li>
          </ul>
          <p>
            Compare the raw data (left) with the transformed result (right) to
            see the improvements.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <ComparisonView
            leftLabel="Raw Source Data"
            rightLabel="Transformed Target Data"
            leftContent={<DatasetTable tables={[RAW_DATA]} />}
            rightContent={<DatasetTable tables={[TRANSFORMED_DATA]} />}
          />

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Generated Transformation SQL
            </p>
            <CodeBlock code={TRANSFORM_SQL} language="sql" title="transform_orders.sql" />
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
