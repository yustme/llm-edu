// ---------------------------------------------------------------------------
// Mock data for Module 23 - Multimodal AI
// ---------------------------------------------------------------------------

/** A single input modality with metadata */
export interface Modality {
  id: string;
  name: string;
  description: string;
  color: string;
  borderColor: string;
  iconLabel: string;
  useCases: string[];
}

/** All supported modalities */
export const MODALITIES: Modality[] = [
  {
    id: "text",
    name: "Text",
    description:
      "Natural language input including prompts, documents, and structured text. The most common modality for LLM interaction.",
    color: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-300",
    iconLabel: "Aa",
    useCases: [
      "Chat and Q&A",
      "Summarization",
      "Translation",
      "Code generation",
    ],
  },
  {
    id: "image",
    name: "Image",
    description:
      "Photos, screenshots, diagrams, charts, and scanned documents. Vision models extract meaning from pixel data.",
    color: "bg-emerald-100 text-emerald-700",
    borderColor: "border-emerald-300",
    iconLabel: "IMG",
    useCases: [
      "Photo description",
      "Chart reading",
      "OCR / text extraction",
      "Visual Q&A",
    ],
  },
  {
    id: "audio",
    name: "Audio",
    description:
      "Speech recordings, podcasts, phone calls, and music. Audio models transcribe, classify, and analyze sound.",
    color: "bg-amber-100 text-amber-700",
    borderColor: "border-amber-300",
    iconLabel: "WAV",
    useCases: [
      "Transcription",
      "Speaker diarization",
      "Sentiment from tone",
      "Sound classification",
    ],
  },
  {
    id: "video",
    name: "Video",
    description:
      "Video clips combining visual frames and audio tracks. Video models understand temporal sequences and actions.",
    color: "bg-purple-100 text-purple-700",
    borderColor: "border-purple-300",
    iconLabel: "MP4",
    useCases: [
      "Video summarization",
      "Action recognition",
      "Scene description",
      "Content moderation",
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Vision examples for Step 2
// ---------------------------------------------------------------------------

export interface VisionExample {
  id: string;
  name: string;
  inputPlaceholder: string;
  inputIcon: string;
  outputText: string;
  category: string;
}

export const VISION_EXAMPLES: VisionExample[] = [
  {
    id: "photo-description",
    name: "Photo Description",
    inputPlaceholder: "Landscape photograph: mountain scene with lake",
    inputIcon: "PHOTO",
    outputText:
      "A serene mountain landscape at golden hour. Snow-capped peaks reflect in a calm alpine lake surrounded by pine trees. Clear sky with wispy cirrus clouds. Estimated location: Pacific Northwest, elevation ~2000m.",
    category: "Scene Understanding",
  },
  {
    id: "chart-reading",
    name: "Chart Reading",
    inputPlaceholder: "Bar chart: Q1-Q4 revenue by region",
    inputIcon: "CHART",
    outputText:
      'Bar chart showing quarterly revenue across 4 regions. North America leads in all quarters (Q1: $2.1M, Q2: $2.4M, Q3: $2.8M, Q4: $3.1M). Europe shows steady growth. APAC has the steepest upward trend. Key insight: "Total revenue grew 18% YoY."',
    category: "Data Extraction",
  },
  {
    id: "ocr-document",
    name: "OCR / Text Extraction",
    inputPlaceholder: "Scanned receipt with printed text",
    inputIcon: "DOC",
    outputText:
      "Extracted text from receipt:\n- Store: Green Valley Market\n- Date: 2025-03-15\n- Items: Organic Milk ($4.99), Whole Wheat Bread ($3.49), Avocados x3 ($5.97)\n- Subtotal: $14.45\n- Tax: $1.16\n- Total: $15.61\n- Payment: Visa ending 4821",
    category: "Text Recognition",
  },
] as const;

// ---------------------------------------------------------------------------
// Document understanding data for Step 3
// ---------------------------------------------------------------------------

export interface DocumentField {
  field: string;
  value: string;
}

export interface DocumentExample {
  id: string;
  name: string;
  description: string;
  rawRepresentation: string;
  extractedFields: DocumentField[];
}

export const DOCUMENT_EXAMPLES: DocumentExample[] = [
  {
    id: "invoice",
    name: "Invoice",
    description:
      "Multi-page invoice with header, line items, and totals in a complex table layout",
    rawRepresentation:
      "[PDF Document]\nINVOICE #2025-0847\nDate: March 15, 2025\nBill To: Acme Corp\n---table---\nItem | Qty | Price\nCloud API Pro | 1 | $299.00\nStorage 500GB | 2 | $49.99\n---end table---\nSubtotal: $398.98\nTax (21%): $83.79\nTotal: $482.77",
    extractedFields: [
      { field: "invoiceNumber", value: "2025-0847" },
      { field: "date", value: "2025-03-15" },
      { field: "vendor", value: "Acme Corp" },
      { field: "lineItems", value: "2 items" },
      { field: "subtotal", value: "398.98" },
      { field: "taxRate", value: "21%" },
      { field: "total", value: "482.77" },
      { field: "currency", value: "USD" },
    ],
  },
  {
    id: "form",
    name: "Application Form",
    description:
      "Handwritten form with checkboxes, signatures, and mixed formatting",
    rawRepresentation:
      "[Scanned Form]\nAPPLICATION FOR EMPLOYMENT\nName: John A. Smith\nDOB: 1990-05-22\nPosition: [x] Full-time [ ] Part-time\nDepartment: Engineering\nStart Date: April 1, 2025\nSignature: [handwritten]\nDate Signed: March 10, 2025",
    extractedFields: [
      { field: "applicantName", value: "John A. Smith" },
      { field: "dateOfBirth", value: "1990-05-22" },
      { field: "employmentType", value: "Full-time" },
      { field: "department", value: "Engineering" },
      { field: "requestedStartDate", value: "2025-04-01" },
      { field: "signaturePresent", value: "true" },
      { field: "dateSigned", value: "2025-03-10" },
    ],
  },
] as const;

export const DOCUMENT_PIPELINE_STEPS = [
  {
    title: "Layout Analysis",
    content:
      "Detect document structure: headers, tables, paragraphs, checkboxes, and signatures using visual layout models.",
  },
  {
    title: "Text Extraction",
    content:
      "Apply OCR and text recognition to extract raw text from each detected region, preserving reading order.",
  },
  {
    title: "Field Mapping",
    content:
      "Map extracted text segments to semantic fields using an LLM that understands document context and field relationships.",
  },
  {
    title: "Validation & Output",
    content:
      "Validate extracted values against expected types and formats, then output clean structured JSON.",
  },
] as const;

// ---------------------------------------------------------------------------
// Pipeline scenario data for Step 4 (tabbed demo)
// ---------------------------------------------------------------------------

export interface PipelineProcessingStep {
  title: string;
  content: string;
}

export interface PipelineScenario {
  id: string;
  name: string;
  inputDescription: string;
  inputIcon: string;
  processingSteps: PipelineProcessingStep[];
  outputData: string;
  outputLanguage: "json" | "typescript" | "python";
}

export const PIPELINE_SCENARIOS: PipelineScenario[] = [
  {
    id: "image-description",
    name: "Image Description",
    inputDescription:
      "Product photograph: wireless headphones on a wooden desk with soft lighting",
    inputIcon: "PHOTO",
    processingSteps: [
      {
        title: "Image Encoding",
        content:
          "Convert the image to a format the vision model can process. Resize to optimal resolution while preserving detail.",
      },
      {
        title: "Visual Feature Extraction",
        content:
          "Identify objects, colors, spatial relationships, lighting conditions, and composition elements in the image.",
      },
      {
        title: "Semantic Description",
        content:
          "Generate a natural language description combining detected objects with contextual understanding and visual attributes.",
      },
      {
        title: "Structured Metadata",
        content:
          "Extract key metadata: dominant colors, detected objects, scene type, and suggested tags for searchability.",
      },
    ],
    outputData: JSON.stringify(
      {
        description:
          "Wireless over-ear headphones in matte black finish resting on a light oak desk. Soft warm lighting from the left creates subtle shadows. Premium build quality with memory foam ear cushions visible.",
        objects: ["headphones", "desk", "cable"],
        scene: "product photography",
        colors: ["matte black", "light oak", "warm white"],
        tags: [
          "electronics",
          "audio",
          "lifestyle",
          "product-shot",
          "minimal",
        ],
        confidence: 0.94,
      },
      null,
      2,
    ),
    outputLanguage: "json",
  },
  {
    id: "chart-extraction",
    name: "Chart Data Extraction",
    inputDescription:
      "Bar chart showing monthly website traffic (Jan-Jun) with two series: organic and paid",
    inputIcon: "CHART",
    processingSteps: [
      {
        title: "Chart Type Detection",
        content:
          "Identify the chart type (bar chart), axis labels, legend entries, and overall layout structure.",
      },
      {
        title: "Axis & Scale Parsing",
        content:
          "Read X-axis categories (months) and Y-axis scale (visitor count). Detect gridlines for value estimation.",
      },
      {
        title: "Data Point Extraction",
        content:
          "Measure bar heights against the Y-axis scale to extract numerical values for each series and category.",
      },
      {
        title: "Structured Data Output",
        content:
          "Compile extracted values into a structured dataset with series labels, categories, and computed aggregates.",
      },
    ],
    outputData: JSON.stringify(
      {
        chartType: "grouped-bar",
        title: "Monthly Website Traffic",
        xAxis: "Month",
        yAxis: "Visitors",
        series: [
          {
            name: "Organic",
            data: [
              { month: "Jan", visitors: 12400 },
              { month: "Feb", visitors: 13100 },
              { month: "Mar", visitors: 15800 },
              { month: "Apr", visitors: 14200 },
              { month: "May", visitors: 16900 },
              { month: "Jun", visitors: 18500 },
            ],
          },
          {
            name: "Paid",
            data: [
              { month: "Jan", visitors: 4200 },
              { month: "Feb", visitors: 5100 },
              { month: "Mar", visitors: 6300 },
              { month: "Apr", visitors: 5800 },
              { month: "May", visitors: 7100 },
              { month: "Jun", visitors: 8400 },
            ],
          },
        ],
        insights: [
          "Organic traffic grew 49% from Jan to Jun",
          "Paid traffic doubled over the same period",
          "March and June showed the strongest growth months",
        ],
      },
      null,
      2,
    ),
    outputLanguage: "json",
  },
  {
    id: "document-parsing",
    name: "Document Form Parsing",
    inputDescription:
      "Scanned insurance claim form with handwritten fields, checkboxes, and a signature block",
    inputIcon: "FORM",
    processingSteps: [
      {
        title: "Document Layout Detection",
        content:
          "Identify form regions: text fields, checkboxes, signature areas, printed labels, and handwritten entries.",
      },
      {
        title: "OCR & Handwriting Recognition",
        content:
          "Apply optical character recognition to printed text and specialized handwriting recognition for filled fields.",
      },
      {
        title: "Checkbox & Selection Detection",
        content:
          "Detect checked vs unchecked boxes, radio button selections, and circled or underlined options.",
      },
      {
        title: "Field Mapping & Validation",
        content:
          "Map recognized text to form field labels, validate data types (dates, numbers, names), and output structured data.",
      },
    ],
    outputData: JSON.stringify(
      {
        formType: "insurance-claim",
        claimNumber: "CLM-2025-08471",
        claimant: {
          name: "Sarah M. Chen",
          policyNumber: "POL-442891",
          phone: "+1-555-0193",
        },
        incident: {
          date: "2025-02-28",
          type: "vehicle-collision",
          description:
            "Rear-end collision at intersection of Main St and Oak Ave. Other driver ran red light.",
          estimatedDamage: 4200.0,
        },
        checkboxes: {
          policeReportFiled: true,
          injuriesReported: false,
          vehicleDriveable: true,
          witnessesPresent: true,
        },
        signaturePresent: true,
        dateSigned: "2025-03-01",
        confidence: 0.91,
      },
      null,
      2,
    ),
    outputLanguage: "json",
  },
] as const;

// ---------------------------------------------------------------------------
// Audio & Video data for Step 5
// ---------------------------------------------------------------------------

export interface SpeakerSegment {
  speaker: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
  color: string;
}

export const SPEAKER_SEGMENTS: SpeakerSegment[] = [
  {
    speaker: "Speaker A",
    startSeconds: 0,
    endSeconds: 8,
    text: "Welcome to the quarterly review. Let me start with the revenue numbers.",
    color: "bg-blue-400",
  },
  {
    speaker: "Speaker B",
    startSeconds: 8,
    endSeconds: 15,
    text: "Thanks. Could you also cover the customer retention metrics?",
    color: "bg-emerald-400",
  },
  {
    speaker: "Speaker A",
    startSeconds: 15,
    endSeconds: 28,
    text: "Absolutely. Revenue grew 18% quarter over quarter, driven primarily by enterprise accounts.",
    color: "bg-blue-400",
  },
  {
    speaker: "Speaker C",
    startSeconds: 28,
    endSeconds: 38,
    text: "I have a question about the APAC region. The growth there seems unusual compared to previous quarters.",
    color: "bg-amber-400",
  },
  {
    speaker: "Speaker A",
    startSeconds: 38,
    endSeconds: 50,
    text: "Great observation. APAC saw a 32% increase due to the new partnership with regional distributors.",
    color: "bg-blue-400",
  },
  {
    speaker: "Speaker B",
    startSeconds: 50,
    endSeconds: 60,
    text: "That aligns with the retention data. APAC retention went from 78% to 89% this quarter.",
    color: "bg-emerald-400",
  },
] as const;

export const AUDIO_TOTAL_DURATION_SECONDS = 60;

export interface AudioProcessingStage {
  id: string;
  name: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
}

export const AUDIO_PROCESSING_STAGES: AudioProcessingStage[] = [
  {
    id: "preprocessing",
    name: "Audio Preprocessing",
    description:
      "Normalize volume, remove background noise, and segment audio into processable chunks.",
    inputLabel: "Raw audio file",
    outputLabel: "Clean audio segments",
  },
  {
    id: "transcription",
    name: "Speech-to-Text",
    description:
      "Convert audio segments to text using ASR (Automatic Speech Recognition) models like Whisper.",
    inputLabel: "Clean audio",
    outputLabel: "Raw transcript",
  },
  {
    id: "diarization",
    name: "Speaker Diarization",
    description:
      "Identify who is speaking at each point in the audio by clustering voice embeddings.",
    inputLabel: "Audio + transcript",
    outputLabel: "Speaker-labeled segments",
  },
  {
    id: "analysis",
    name: "Content Analysis",
    description:
      "Use LLM to summarize, extract topics, detect sentiment, and identify action items from the transcript.",
    inputLabel: "Labeled transcript",
    outputLabel: "Structured analysis",
  },
] as const;

export interface VideoProcessingStage {
  id: string;
  name: string;
  description: string;
}

export const VIDEO_PROCESSING_STAGES: VideoProcessingStage[] = [
  {
    id: "frame-extraction",
    name: "Frame Extraction",
    description:
      "Sample key frames at regular intervals or based on scene changes to reduce processing load.",
  },
  {
    id: "visual-analysis",
    name: "Visual Analysis",
    description:
      "Apply vision models to key frames for object detection, scene classification, and action recognition.",
  },
  {
    id: "audio-track",
    name: "Audio Track Processing",
    description:
      "Separate and process the audio track for transcription, music detection, and sound effects classification.",
  },
  {
    id: "temporal-fusion",
    name: "Temporal Fusion",
    description:
      "Combine visual and audio analysis across the timeline to create a coherent understanding of the video content.",
  },
  {
    id: "summarization",
    name: "Summarization",
    description:
      "Generate a structured summary including scene descriptions, transcript highlights, and key moments.",
  },
] as const;

// ---------------------------------------------------------------------------
// Summary comparison table for Step 6
// ---------------------------------------------------------------------------

export interface ModalityComparison {
  modality: string;
  inputTypes: string;
  keyModels: string;
  latency: string;
  bestFor: string;
  limitation: string;
}

export const MODALITY_COMPARISONS: ModalityComparison[] = [
  {
    modality: "Text",
    inputTypes: "Prompts, documents, code",
    keyModels: "GPT-4, Claude, Gemini",
    latency: "Low (ms)",
    bestFor: "General reasoning, generation, classification",
    limitation: "Cannot understand visual or auditory information",
  },
  {
    modality: "Image",
    inputTypes: "Photos, screenshots, diagrams",
    keyModels: "GPT-4V, Claude Vision, Gemini Pro Vision",
    latency: "Medium (1-3s)",
    bestFor: "Visual Q&A, OCR, chart reading, scene understanding",
    limitation: "Static only, no temporal understanding",
  },
  {
    modality: "Audio",
    inputTypes: "Speech, podcasts, calls",
    keyModels: "Whisper, Gemini, AssemblyAI",
    latency: "Medium-High (2-10s)",
    bestFor: "Transcription, speaker ID, sentiment from tone",
    limitation: "Real-time processing is resource-intensive",
  },
  {
    modality: "Video",
    inputTypes: "Clips, streams, recordings",
    keyModels: "Gemini 1.5 Pro, GPT-4o, Twelve Labs",
    latency: "High (10-60s)",
    bestFor: "Action recognition, content moderation, summarization",
    limitation: "Very high compute cost, limited context windows",
  },
] as const;

export const MULTIMODAL_LIMITATIONS = [
  "Hallucination risk increases with visual inputs - models may describe objects not present in images",
  "Audio transcription accuracy drops significantly with overlapping speakers or heavy accents",
  "Video processing is orders of magnitude more expensive than text - use sparingly",
  "Most models cannot generate images or audio natively - they are input-only for non-text modalities",
  "Latency scales with input size - a 10-minute video takes much longer than a single image",
  "Privacy concerns: facial recognition and voice identification require careful handling",
] as const;

export const MULTIMODAL_GUIDELINES = [
  "Start with text-only, add modalities only when they provide clear value",
  "Pre-process inputs (resize images, compress audio) to reduce cost and latency",
  "Use specialized models for each modality rather than one-size-fits-all",
  "Always validate multimodal outputs - they have higher hallucination rates",
  "Cache results aggressively - re-processing the same image is wasteful",
  "Consider privacy and consent when processing images, audio, or video of people",
] as const;
