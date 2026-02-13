import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CodeBlock } from "@/components/presentation/CodeBlock";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const MANUAL_ETL_SCRIPT = `# Traditional ETL script - brittle and manual
import pandas as pd

def transform_orders(df):
    # Hardcoded column mappings
    df = df.rename(columns={
        'cust_nm': 'customer_name',
        'ord_dt': 'order_date',
        'prd_id': 'product_id',
        'ord_amt': 'order_amount',
        'dsc_pct': 'discount_percentage',
        'tx_amt': 'tax_amount',
        'sts': 'status',
        'eml_addr': 'email_address',
    })

    # Hardcoded status mapping
    status_map = {'C': 'completed', 'X': 'cancelled',
                  'R': 'returned', 'P': 'pending'}
    df['status'] = df['status'].map(status_map)

    # Date conversion - breaks if format changes
    df['order_date'] = pd.to_datetime(df['order_date'],
                                       format='%Y/%m/%d')

    return df`;

const PROBLEMS = [
  {
    id: "schema-changes",
    title: "Schema changes break pipeline",
    description: "Adding or renaming a column in the source requires manual code changes in every downstream script.",
  },
  {
    id: "no-recovery",
    title: "No automatic error recovery",
    description: "When a transformation fails, the entire pipeline stops and requires manual intervention to debug.",
  },
  {
    id: "manual-mapping",
    title: "Manual column mapping",
    description: "Every new source system requires a developer to manually write column mappings and type conversions.",
  },
  {
    id: "no-validation",
    title: "No built-in data validation",
    description: "Quality issues pass through silently - duplicates, nulls, and outliers are not detected automatically.",
  },
] as const;

export function Step2TraditionalETL() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Manual Pipeline Problems"
          highlights={["Brittle", "Maintenance", "No Recovery"]}
        >
          <p>
            Traditional ETL pipelines are written as <strong>hardcoded
            scripts</strong> that map source columns to target columns manually.
          </p>
          <p>This approach has several major problems:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Brittle</strong> - any schema change breaks the pipeline
            </li>
            <li>
              <strong>High maintenance</strong> - requires developer time for
              every new source
            </li>
            <li>
              <strong>No error recovery</strong> - failures require manual
              debugging
            </li>
            <li>
              <strong>No validation</strong> - quality issues pass through
              silently
            </li>
          </ul>
          <p>
            AI agents can automate the most tedious parts of ETL while being
            more resilient to schema changes.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Traditional ETL Script
          </p>

          <CodeBlock code={MANUAL_ETL_SCRIPT} language="typescript" title="transform_orders.py" />

          <p className="text-center text-sm font-medium text-muted-foreground mt-4">
            Pain Points
          </p>

          <div className="grid grid-cols-2 gap-2">
            {PROBLEMS.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="rounded-lg border-2 border-red-200 bg-red-50 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <p className="text-xs font-bold text-red-700">{problem.title}</p>
                </div>
                <p className="text-[10px] text-red-600 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
