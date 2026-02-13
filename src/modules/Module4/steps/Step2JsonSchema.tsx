import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CodeBlock } from "@/components/presentation/CodeBlock";

const ANIMATION_DURATION = 0.4;

const SCHEMA_EXAMPLE = `{
  "type": "object",
  "properties": {
    "sentiment": {
      "type": "string",
      "enum": ["positive", "negative", "neutral"]
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    },
    "topics": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    }
  },
  "required": ["sentiment", "confidence", "topics"],
  "additionalProperties": false
}`;

const CONFORMING_OUTPUT = `{
  "sentiment": "positive",
  "confidence": 0.92,
  "topics": ["battery life", "display"]
}`;

const SCHEMA_FEATURES = [
  {
    keyword: "type",
    description: "Specifies the data type: string, number, integer, boolean, array, object",
    example: '"type": "string"',
  },
  {
    keyword: "enum",
    description: "Restricts a value to a fixed set of allowed options",
    example: '"enum": ["positive", "negative", "neutral"]',
  },
  {
    keyword: "required",
    description: "Lists field names that must be present in the object",
    example: '"required": ["sentiment", "confidence"]',
  },
  {
    keyword: "minimum / maximum",
    description: "Sets numeric bounds for number or integer fields",
    example: '"minimum": 0, "maximum": 1',
  },
  {
    keyword: "items",
    description: "Defines the schema for each element inside an array",
    example: '"items": { "type": "string" }',
  },
  {
    keyword: "additionalProperties",
    description: "When false, rejects any fields not listed in properties",
    example: '"additionalProperties": false',
  },
] as const;

export function Step2JsonSchema() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="JSON Schema"
          highlights={["Properties", "Required", "Types", "Enum"]}
        >
          <p>
            <strong>JSON Schema</strong> is the standard way to describe the
            structure of JSON data. When using structured output, you provide a
            JSON Schema that defines:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Properties</strong> - field names and their descriptions
            </li>
            <li>
              <strong>Types</strong> - string, number, integer, boolean, array,
              object
            </li>
            <li>
              <strong>Constraints</strong> - enums, min/max, patterns, required
              fields
            </li>
            <li>
              <strong>Nested structures</strong> - arrays of objects, objects
              within objects
            </li>
          </ul>
          <p>
            The LLM uses the schema as a contract: it must produce output that
            conforms to this definition. The schema also serves as{" "}
            <strong>documentation</strong> for downstream consumers of the data.
          </p>
          <p>
            Key JSON Schema keywords are listed on the right, along with an
            example showing how a schema maps to conforming output.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Schema -> Output flow */}
          <p className="text-center text-sm font-medium text-muted-foreground">
            Schema Definition to Conforming Output
          </p>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
            {/* Schema */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <CodeBlock
                code={SCHEMA_EXAMPLE}
                language="json"
                title="JSON Schema"
                showLineNumbers
              />
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <ArrowRight className="h-6 w-6 text-primary" />
            </motion.div>

            {/* Output */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: ANIMATION_DURATION }}
            >
              <CodeBlock
                code={CONFORMING_OUTPUT}
                language="json"
                title="Conforming Output"
                showLineNumbers
              />
            </motion.div>
          </div>

          {/* Schema keywords table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: ANIMATION_DURATION }}
          >
            <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
              Key Schema Keywords
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Keyword
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Purpose
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SCHEMA_FEATURES.map((feature, index) => (
                    <motion.tr
                      key={feature.keyword}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 1.4 + index * 0.08,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-3 py-2 text-sm font-medium font-mono text-primary">
                        {feature.keyword}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {feature.description}
                      </td>
                      <td className="px-3 py-2 text-xs font-mono text-muted-foreground">
                        {feature.example}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
