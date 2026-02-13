import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { DatasetTable } from "@/components/semantic/DatasetTable";
import { DATASET_TABLES, HIGHLIGHT_COLUMNS } from "@/data/sample-dataset";
import { HALLUCINATED_SQL, CORRECT_SQL } from "@/data/mock-text-to-sql";

export function Step3SchemaContext() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Schema Context Matters"
          highlights={["Hallucination", "Schema Injection", "Validation"]}
        >
          <p>
            Without schema context, the LLM will <strong>hallucinate</strong>{" "}
            table and column names based on its training data. This produces
            SQL that looks correct but fails on execution.
          </p>
          <p>
            With schema context, the LLM knows exactly which tables, columns,
            and data types are available. This dramatically improves SQL accuracy.
          </p>
          <p>Best practices:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Include <strong>table names and column definitions</strong> in the
              system prompt
            </li>
            <li>
              Add <strong>column descriptions</strong> and business rules
            </li>
            <li>
              Specify <strong>relationships</strong> (foreign keys, JOINs)
            </li>
            <li>
              <strong>Validate generated SQL</strong> against the schema before
              execution
            </li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <ComparisonView
            leftLabel="Without Schema Context"
            rightLabel="With Schema Context"
            leftContent={
              <CodeBlock code={HALLUCINATED_SQL} language="sql" />
            }
            rightContent={
              <CodeBlock code={CORRECT_SQL} language="sql" />
            }
          />

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              TechShop Database Schema
            </p>
            <DatasetTable
              tables={DATASET_TABLES}
              highlightColumns={HIGHLIGHT_COLUMNS}
            />
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
