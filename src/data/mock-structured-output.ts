// ---------------------------------------------------------------------------
// Mock data for Module 18 - Structured Output
// ---------------------------------------------------------------------------

/** A schema template used in the interactive schema builder */
export interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  /** JSON Schema definition as a formatted string */
  schema: string;
  /** Example output that conforms to the schema */
  validOutput: string;
  /** Example output that violates the schema */
  invalidOutput: string;
}

/** Schema templates for the interactive builder step */
export const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    id: "extract-contact",
    name: "Extract Contact",
    description: "Extract structured contact information from unstructured text",
    schema: JSON.stringify(
      {
        type: "object",
        properties: {
          name: { type: "string", description: "Full name of the person" },
          email: { type: "string", format: "email" },
          phone: { type: "string", pattern: "^\\+?[0-9\\-\\s]+$" },
          company: { type: "string" },
          role: { type: "string" },
        },
        required: ["name", "email"],
        additionalProperties: false,
      },
      null,
      2,
    ),
    validOutput: JSON.stringify(
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1-555-0142",
        company: "Acme Corp",
        role: "Engineering Manager",
      },
      null,
      2,
    ),
    invalidOutput: JSON.stringify(
      {
        full_name: "Alice Johnson",
        contact: "alice@example.com",
        notes: "Met at conference, follow up next week",
      },
      null,
      2,
    ),
  },
  {
    id: "classify-sentiment",
    name: "Classify Sentiment",
    description: "Classify the sentiment and extract key topics from a review",
    schema: JSON.stringify(
      {
        type: "object",
        properties: {
          sentiment: { type: "string", enum: ["positive", "negative", "neutral", "mixed"] },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          topics: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 5,
          },
          summary: { type: "string", maxLength: 200 },
        },
        required: ["sentiment", "confidence", "topics", "summary"],
        additionalProperties: false,
      },
      null,
      2,
    ),
    validOutput: JSON.stringify(
      {
        sentiment: "positive",
        confidence: 0.92,
        topics: ["battery life", "display quality", "price"],
        summary: "The reviewer praised the long battery life and vibrant display, noting the price is competitive for the feature set offered.",
      },
      null,
      2,
    ),
    invalidOutput: JSON.stringify(
      {
        sentiment: "very positive",
        confidence: "high",
        topics: "battery life, display",
        summary: 42,
      },
      null,
      2,
    ),
  },
  {
    id: "parse-invoice",
    name: "Parse Invoice",
    description: "Extract structured line items and totals from an invoice document",
    schema: JSON.stringify(
      {
        type: "object",
        properties: {
          invoiceNumber: { type: "string" },
          date: { type: "string", format: "date" },
          vendor: { type: "string" },
          lineItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: { type: "string" },
                quantity: { type: "integer", minimum: 1 },
                unitPrice: { type: "number", minimum: 0 },
              },
              required: ["description", "quantity", "unitPrice"],
            },
          },
          totalAmount: { type: "number", minimum: 0 },
          currency: { type: "string", enum: ["USD", "EUR", "GBP", "CZK"] },
        },
        required: ["invoiceNumber", "date", "vendor", "lineItems", "totalAmount", "currency"],
        additionalProperties: false,
      },
      null,
      2,
    ),
    validOutput: JSON.stringify(
      {
        invoiceNumber: "INV-2025-0042",
        date: "2025-03-15",
        vendor: "Cloud Services Ltd.",
        lineItems: [
          { description: "API Gateway - Pro Plan", quantity: 1, unitPrice: 299.0 },
          { description: "Storage (500 GB)", quantity: 2, unitPrice: 49.99 },
        ],
        totalAmount: 398.98,
        currency: "USD",
      },
      null,
      2,
    ),
    invalidOutput: JSON.stringify(
      {
        invoice_num: 42,
        date: "March 15th",
        vendor: "Cloud Services Ltd.",
        items: "API Gateway, Storage",
        total: "$398.98",
      },
      null,
      2,
    ),
  },
  {
    id: "extract-event",
    name: "Extract Event",
    description: "Parse calendar event details from a natural language message",
    schema: JSON.stringify(
      {
        type: "object",
        properties: {
          title: { type: "string" },
          startTime: { type: "string", format: "date-time" },
          endTime: { type: "string", format: "date-time" },
          location: { type: "string" },
          attendees: {
            type: "array",
            items: { type: "string", format: "email" },
          },
          isRecurring: { type: "boolean" },
        },
        required: ["title", "startTime"],
        additionalProperties: false,
      },
      null,
      2,
    ),
    validOutput: JSON.stringify(
      {
        title: "Q2 Planning Review",
        startTime: "2025-04-10T14:00:00Z",
        endTime: "2025-04-10T15:30:00Z",
        location: "Conference Room B",
        attendees: ["alice@example.com", "bob@example.com"],
        isRecurring: false,
      },
      null,
      2,
    ),
    invalidOutput: JSON.stringify(
      {
        event: "Q2 Planning Review",
        when: "next Thursday at 2pm",
        where: "Conference Room B",
        people: ["Alice", "Bob"],
      },
      null,
      2,
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Function calling flow
// ---------------------------------------------------------------------------

/** A single step in the function calling flow diagram */
export interface FunctionCallingStep {
  id: string;
  label: string;
  description: string;
  actor: "user" | "llm" | "system";
  color: string;
}

/** Steps in the function calling (tool use) process */
export const FUNCTION_CALLING_STEPS: FunctionCallingStep[] = [
  {
    id: "define-tools",
    label: "Define Tools",
    description: "Developer defines available tools with name, description, and JSON Schema for parameters.",
    actor: "system",
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    id: "user-prompt",
    label: "User Prompt",
    description: "User sends a natural language request that may require tool use.",
    actor: "user",
    color: "bg-green-100 border-green-300 text-green-700",
  },
  {
    id: "llm-decides",
    label: "LLM Selects Tool",
    description: "The LLM analyzes the request, decides which tool to call, and generates structured arguments matching the schema.",
    actor: "llm",
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
  {
    id: "execute-tool",
    label: "Execute Tool",
    description: "The system validates the arguments against the schema and executes the selected tool/function.",
    actor: "system",
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    id: "return-result",
    label: "Return Result",
    description: "Tool result is returned to the LLM, which formulates a natural language response for the user.",
    actor: "llm",
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
] as const;

// ---------------------------------------------------------------------------
// Validation scenarios
// ---------------------------------------------------------------------------

/** A validation scenario showing before/after error correction */
export interface ValidationScenario {
  id: string;
  errorType: string;
  description: string;
  /** The malformed output from the LLM */
  malformedOutput: string;
  /** Error message from validation */
  errorMessage: string;
  /** The corrected output after retry */
  correctedOutput: string;
}

/** Validation error examples with fixes */
export const VALIDATION_SCENARIOS: ValidationScenario[] = [
  {
    id: "wrong-type",
    errorType: "Type Mismatch",
    description: "Field type does not match schema definition",
    malformedOutput: JSON.stringify(
      {
        name: "Alice Johnson",
        age: "twenty-eight",
        isActive: "yes",
      },
      null,
      2,
    ),
    errorMessage: 'Validation error: "age" must be integer, got string. "isActive" must be boolean, got string.',
    correctedOutput: JSON.stringify(
      {
        name: "Alice Johnson",
        age: 28,
        isActive: true,
      },
      null,
      2,
    ),
  },
  {
    id: "missing-required",
    errorType: "Missing Required Field",
    description: "A required field is absent from the output",
    malformedOutput: JSON.stringify(
      {
        sentiment: "positive",
        topics: ["performance", "design"],
      },
      null,
      2,
    ),
    errorMessage: 'Validation error: missing required fields "confidence", "summary".',
    correctedOutput: JSON.stringify(
      {
        sentiment: "positive",
        confidence: 0.87,
        topics: ["performance", "design"],
        summary: "User praised the product performance and sleek design.",
      },
      null,
      2,
    ),
  },
  {
    id: "invalid-enum",
    errorType: "Invalid Enum Value",
    description: "Value is not one of the allowed enum options",
    malformedOutput: JSON.stringify(
      {
        sentiment: "very positive",
        confidence: 0.95,
        topics: ["service"],
        summary: "Great customer service experience.",
      },
      null,
      2,
    ),
    errorMessage: 'Validation error: "sentiment" must be one of ["positive", "negative", "neutral", "mixed"], got "very positive".',
    correctedOutput: JSON.stringify(
      {
        sentiment: "positive",
        confidence: 0.95,
        topics: ["service"],
        summary: "Great customer service experience.",
      },
      null,
      2,
    ),
  },
  {
    id: "extra-text",
    errorType: "Extra Text / Not JSON",
    description: "LLM wraps JSON in markdown or adds commentary",
    malformedOutput: `Here is the extracted data:

\`\`\`json
{
  "name": "Bob Smith",
  "email": "bob@example.com"
}
\`\`\`

Let me know if you need anything else!`,
    errorMessage: "Parse error: response is not valid JSON. Contains markdown formatting and extra text outside the JSON object.",
    correctedOutput: JSON.stringify(
      {
        name: "Bob Smith",
        email: "bob@example.com",
      },
      null,
      2,
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Validation pipeline steps
// ---------------------------------------------------------------------------

/** A step in the validation pipeline */
export interface ValidationPipelineStep {
  id: string;
  label: string;
  description: string;
  successColor: string;
  errorColor: string;
}

/** Steps in the validation pipeline */
export const VALIDATION_PIPELINE_STEPS: ValidationPipelineStep[] = [
  {
    id: "raw-output",
    label: "Raw LLM Output",
    description: "Receive the raw text response from the language model",
    successColor: "bg-blue-100 border-blue-300 text-blue-700",
    errorColor: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    id: "json-parse",
    label: "JSON Parse",
    description: "Attempt to parse the text as valid JSON",
    successColor: "bg-green-100 border-green-300 text-green-700",
    errorColor: "bg-red-100 border-red-300 text-red-700",
  },
  {
    id: "schema-validate",
    label: "Schema Validate",
    description: "Validate parsed JSON against the defined schema",
    successColor: "bg-green-100 border-green-300 text-green-700",
    errorColor: "bg-red-100 border-red-300 text-red-700",
  },
  {
    id: "result",
    label: "Accept / Retry",
    description: "Accept valid output or retry with error feedback",
    successColor: "bg-green-100 border-green-300 text-green-700",
    errorColor: "bg-amber-100 border-amber-300 text-amber-700",
  },
] as const;

// ---------------------------------------------------------------------------
// Summary comparison table
// ---------------------------------------------------------------------------

/** A row in the summary comparison table */
export interface OutputApproach {
  id: string;
  name: string;
  mechanism: string;
  reliability: string;
  flexibility: string;
  bestFor: string;
}

/** Comparison of structured output approaches */
export const OUTPUT_APPROACHES: OutputApproach[] = [
  {
    id: "json-mode",
    name: "JSON Mode",
    mechanism: "Model constrained to output valid JSON",
    reliability: "High - guaranteed valid JSON",
    flexibility: "Low - no schema enforcement",
    bestFor: "Simple key-value extraction, quick prototyping",
  },
  {
    id: "function-calling",
    name: "Function Calling",
    mechanism: "Model fills tool parameters against a schema",
    reliability: "Very High - schema-validated by the API",
    flexibility: "High - full JSON Schema support",
    bestFor: "Tool use, API integrations, complex extraction",
  },
  {
    id: "prompt-based",
    name: "Prompt-Based",
    mechanism: "Instructions in the prompt ask for specific format",
    reliability: "Medium - model may deviate",
    flexibility: "Very High - any format possible",
    bestFor: "Custom formats, CSV, XML, non-JSON output",
  },
] as const;

/** Use-case scenario for the intro comparison */
export interface UseCaseScenario {
  id: string;
  label: string;
  description: string;
}

/** Real-world use cases for structured output */
export const USE_CASES: UseCaseScenario[] = [
  {
    id: "data-extraction",
    label: "Data Extraction",
    description: "Pull structured fields from emails, PDFs, and documents",
  },
  {
    id: "classification",
    label: "Classification",
    description: "Categorize text into predefined labels with confidence scores",
  },
  {
    id: "form-filling",
    label: "Form Filling",
    description: "Auto-populate form fields from conversational input",
  },
  {
    id: "api-integration",
    label: "API Integration",
    description: "Generate valid API request bodies from natural language",
  },
  {
    id: "data-transformation",
    label: "Data Transformation",
    description: "Convert between formats (CSV to JSON, XML to JSON)",
  },
] as const;

/** Example for the function calling code demo */
export const FUNCTION_CALLING_TOOL_DEFINITION = `{
  "name": "get_weather",
  "description": "Get the current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or coordinates"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature unit"
      }
    },
    "required": ["location"]
  }
}`;

/** Example of the LLM selecting a tool and generating arguments */
export const FUNCTION_CALLING_RESPONSE = `{
  "tool_call": {
    "name": "get_weather",
    "arguments": {
      "location": "Prague",
      "units": "celsius"
    }
  }
}`;

/** Example tool execution result */
export const FUNCTION_CALLING_RESULT = `{
  "temperature": 12,
  "units": "celsius",
  "condition": "partly cloudy",
  "humidity": 65,
  "wind_speed_kmh": 18
}`;
