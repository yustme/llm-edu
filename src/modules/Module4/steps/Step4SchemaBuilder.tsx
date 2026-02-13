import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { SchemaBuilder } from "@/components/structured-output/SchemaBuilder";

export function Step4SchemaBuilder() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Interactive Schema Builder"
          highlights={["Templates", "Valid vs Invalid", "Schema Contract"]}
        >
          <p>
            Try different schema templates and see how each one defines a{" "}
            <strong>contract</strong> for the LLM output. The schema dictates
            field names, types, and constraints.
          </p>
          <p>For each template you can:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>View the schema</strong> - see the JSON Schema definition
              with all its constraints
            </li>
            <li>
              <strong>See valid output</strong> - an example that fully conforms
              to the schema
            </li>
            <li>
              <strong>Toggle to invalid output</strong> - an example that
              violates the schema (wrong field names, incorrect types, missing
              fields)
            </li>
          </ul>
          <p>
            Notice how the <strong>invalid output</strong> often looks reasonable
            to a human but fails machine parsing. Common issues include:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Different field names than specified</li>
            <li>Strings where numbers are expected</li>
            <li>Missing required fields</li>
            <li>Values not in the allowed enum set</li>
          </ul>
          <p>
            This is why <strong>schema validation</strong> is critical - it
            catches issues that look fine to humans but break code.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Select a Schema Template
          </p>
          <SchemaBuilder />
        </InteractiveArea>
      </div>
    </div>
  );
}
