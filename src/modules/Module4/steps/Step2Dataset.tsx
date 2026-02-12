import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { DatasetTable } from "@/components/semantic/DatasetTable";
import { DATASET_TABLES, HIGHLIGHT_COLUMNS } from "@/data/sample-dataset";

export function Step2Dataset() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Explore the TechShop Dataset"
          highlights={["E-commerce", "15 Orders", "8 Products", "7 Customers"]}
        >
          <p>
            TechShop is an e-commerce company selling technology products.
            Their database has 3 tables: orders, products, and customers.
          </p>
          <p>
            When an agent is asked about &ldquo;total revenue&rdquo;, it needs
            to decide which columns matter, which statuses to include, and
            whether to account for discounts and taxes.
          </p>
          <p>
            Pay attention to the highlighted columns:{" "}
            <span className="font-semibold text-amber-700">order_amount</span>,{" "}
            <span className="font-semibold text-amber-700">discount</span>, and{" "}
            <span className="font-semibold text-amber-700">status</span>. These
            are the key columns that each agent may interpret differently.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <DatasetTable
            tables={DATASET_TABLES}
            highlightColumns={HIGHLIGHT_COLUMNS}
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
