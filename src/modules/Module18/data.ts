/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Introduction to ETL/ELT",
  "Traditional ETL",
  "AI-Assisted ETL",
  "Schema Mapping Demo",
  "Transform Demo",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "What is ETL/ELT and why it matters for data engineering",
  "Manual pipeline problems and maintenance challenges",
  "How AI agents can automate and improve ETL processes",
  "Agent automatically maps source to target schema",
  "Agent transforms and cleans data during the load process",
  "Traditional vs AI-assisted comparison and tools",
] as const;

/** A stage in an ETL or ELT pipeline */
export interface PipelineStageItem {
  id: string;
  label: string;
  description: string;
}

/** Three stages of traditional ETL */
export const ETL_STAGES: PipelineStageItem[] = [
  { id: "extract", label: "Extract", description: "Pull data from source systems (databases, APIs, files)" },
  { id: "transform", label: "Transform", description: "Clean, map, and reshape data to target format" },
  { id: "load", label: "Load", description: "Write transformed data into the destination warehouse" },
];

/** Three stages of ELT (different order) */
export const ELT_STAGES: PipelineStageItem[] = [
  { id: "extract", label: "Extract", description: "Pull raw data from source systems" },
  { id: "load", label: "Load", description: "Load raw data into the destination warehouse as-is" },
  { id: "transform", label: "Transform", description: "Transform data inside the warehouse using SQL" },
];

/** AI capability for ETL automation */
export interface AiCapability {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

/** AI agent capabilities for ETL processes */
export const AI_CAPABILITIES: AiCapability[] = [
  {
    id: "schema-mapping",
    label: "Auto Schema Mapping",
    description: "Automatically match source columns to target columns using semantic understanding of column names",
    iconName: "GitMerge",
  },
  {
    id: "type-inference",
    label: "Data Type Inference",
    description: "Detect and suggest appropriate data types and conversions (e.g., string dates to DATE type)",
    iconName: "Search",
  },
  {
    id: "anomaly-detection",
    label: "Anomaly Detection",
    description: "Identify outliers, missing values, and inconsistencies during the transform phase",
    iconName: "AlertTriangle",
  },
  {
    id: "transform-suggestion",
    label: "Transformation Suggestion",
    description: "Generate SQL or Python transformations based on source-target schema differences",
    iconName: "Wand2",
  },
  {
    id: "error-handling",
    label: "Intelligent Error Handling",
    description: "Automatically retry failed operations, suggest fixes for schema mismatches, and quarantine bad records",
    iconName: "ShieldCheck",
  },
  {
    id: "documentation",
    label: "Documentation Generation",
    description: "Auto-generate data lineage documentation, column mappings, and transformation logs",
    iconName: "FileText",
  },
];
