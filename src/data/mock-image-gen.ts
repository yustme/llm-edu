// ---------------------------------------------------------------------------
// Mock data for Module 24: Image Generation
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Pipeline Stages (Step 1: Text-to-Image Pipeline)
// ---------------------------------------------------------------------------

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  color: string;
}

export const IMAGE_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "prompt",
    label: "Text Prompt",
    description: "Natural language description of desired image",
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    id: "encoder",
    label: "Text Encoder",
    description: "CLIP / T5 encodes prompt into embedding vectors",
    color: "bg-purple-100 border-purple-300 text-purple-700",
  },
  {
    id: "latent",
    label: "Latent Space",
    description: "Compressed representation of the image",
    color: "bg-indigo-100 border-indigo-300 text-indigo-700",
  },
  {
    id: "diffusion",
    label: "Diffusion Model",
    description: "Iterative denoising from noise to structure",
    color: "bg-green-100 border-green-300 text-green-700",
  },
  {
    id: "decoder",
    label: "VAE Decoder",
    description: "Converts latent representation to pixel space",
    color: "bg-amber-100 border-amber-300 text-amber-700",
  },
  {
    id: "output",
    label: "Output Image",
    description: "Final generated image at target resolution",
    color: "bg-rose-100 border-rose-300 text-rose-700",
  },
];

// ---------------------------------------------------------------------------
// Diffusion Stages (Step 2: Diffusion Process)
// Each stage has an 8x8 grid of color indices (0-7) representing cell colors
// Stage 1 is pure noise, Stage 6 is a clear gradient pattern
// ---------------------------------------------------------------------------

export interface DiffusionStage {
  id: string;
  label: string;
  description: string;
  stepNumber: number;
  grid: number[][];
}

// Color palette for diffusion grid cells (indexed 0-7)
export const DIFFUSION_COLORS = [
  "bg-rose-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-yellow-300",
  "bg-lime-400",
  "bg-emerald-400",
  "bg-cyan-400",
  "bg-blue-400",
] as const;

// Stage 1: Pure noise (random)
const NOISE_GRID: number[][] = [
  [3, 7, 1, 5, 0, 6, 2, 4],
  [6, 0, 4, 2, 7, 3, 5, 1],
  [1, 5, 7, 0, 4, 2, 6, 3],
  [4, 2, 0, 6, 3, 7, 1, 5],
  [7, 3, 5, 1, 6, 0, 4, 2],
  [0, 6, 2, 4, 1, 5, 3, 7],
  [5, 1, 3, 7, 2, 4, 0, 6],
  [2, 4, 6, 3, 5, 1, 7, 0],
];

// Stage 2: Early denoising (some grouping emerges)
const EARLY_DENOISE_GRID: number[][] = [
  [3, 7, 5, 5, 0, 6, 2, 4],
  [6, 0, 4, 2, 7, 6, 5, 1],
  [1, 1, 7, 0, 4, 2, 6, 3],
  [4, 2, 0, 3, 3, 7, 1, 5],
  [7, 3, 3, 1, 6, 0, 4, 2],
  [0, 6, 2, 4, 1, 5, 5, 7],
  [5, 1, 3, 7, 2, 4, 0, 6],
  [2, 4, 6, 6, 5, 1, 7, 0],
];

// Stage 3: Mid denoising (regions forming)
const MID_DENOISE_GRID: number[][] = [
  [0, 0, 1, 1, 3, 5, 6, 7],
  [0, 0, 1, 2, 3, 5, 6, 7],
  [1, 1, 2, 2, 4, 5, 6, 6],
  [1, 2, 2, 3, 4, 5, 6, 7],
  [3, 3, 3, 4, 5, 5, 7, 7],
  [4, 3, 4, 4, 5, 6, 7, 7],
  [5, 4, 4, 5, 6, 6, 7, 7],
  [5, 5, 5, 6, 6, 7, 7, 7],
];

// Stage 4: Late denoising (clear structure)
const LATE_DENOISE_GRID: number[][] = [
  [0, 0, 0, 1, 2, 5, 6, 7],
  [0, 0, 1, 1, 3, 5, 6, 7],
  [0, 1, 1, 2, 3, 5, 6, 7],
  [1, 1, 2, 3, 4, 5, 6, 7],
  [2, 2, 3, 3, 4, 5, 7, 7],
  [3, 3, 4, 4, 5, 6, 7, 7],
  [5, 4, 5, 5, 6, 6, 7, 7],
  [5, 5, 5, 6, 6, 7, 7, 7],
];

// Stage 5: Near final (almost clean)
const NEAR_FINAL_GRID: number[][] = [
  [0, 0, 0, 1, 2, 4, 6, 7],
  [0, 0, 0, 1, 2, 4, 6, 7],
  [0, 0, 1, 2, 3, 5, 6, 7],
  [1, 1, 2, 3, 3, 5, 6, 7],
  [2, 2, 3, 3, 4, 5, 7, 7],
  [3, 3, 4, 4, 5, 6, 7, 7],
  [4, 4, 5, 5, 6, 6, 7, 7],
  [5, 5, 6, 6, 6, 7, 7, 7],
];

// Stage 6: Clear diagonal gradient pattern
const FINAL_GRID: number[][] = [
  [0, 0, 0, 1, 2, 4, 6, 7],
  [0, 0, 1, 1, 2, 4, 6, 7],
  [0, 1, 1, 2, 3, 5, 6, 7],
  [1, 1, 2, 2, 3, 5, 7, 7],
  [2, 2, 3, 3, 4, 5, 7, 7],
  [4, 4, 5, 5, 5, 6, 7, 7],
  [6, 6, 6, 7, 6, 7, 7, 7],
  [7, 7, 7, 7, 7, 7, 7, 7],
];

export const DIFFUSION_STAGES: DiffusionStage[] = [
  {
    id: "noise",
    label: "Pure Noise",
    description: "Starting from random Gaussian noise in latent space",
    stepNumber: 1,
    grid: NOISE_GRID,
  },
  {
    id: "early",
    label: "Early Denoising",
    description: "Model begins predicting and removing noise",
    stepNumber: 2,
    grid: EARLY_DENOISE_GRID,
  },
  {
    id: "mid",
    label: "Mid Denoising",
    description: "Broad structures and regions begin to form",
    stepNumber: 3,
    grid: MID_DENOISE_GRID,
  },
  {
    id: "late",
    label: "Late Denoising",
    description: "Details and color regions become defined",
    stepNumber: 4,
    grid: LATE_DENOISE_GRID,
  },
  {
    id: "near-final",
    label: "Near Final",
    description: "Fine-grained detail and texture refinement",
    stepNumber: 5,
    grid: NEAR_FINAL_GRID,
  },
  {
    id: "final",
    label: "Final Output",
    description: "Clear structured pattern with smooth gradient",
    stepNumber: 6,
    grid: FINAL_GRID,
  },
];

// ---------------------------------------------------------------------------
// Prompt Components (Step 3 & 4: Prompt Engineering + Builder)
// ---------------------------------------------------------------------------

export interface PromptOption {
  id: string;
  label: string;
  weight: number;
}

export interface PromptCategory {
  id: string;
  name: string;
  color: string;
  options: PromptOption[];
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "subject",
    name: "Subject",
    color: "text-blue-700 bg-blue-100 border-blue-300",
    options: [
      { id: "s1", label: "a majestic mountain landscape", weight: 1.0 },
      { id: "s2", label: "a cyberpunk city at night", weight: 1.0 },
      { id: "s3", label: "a serene forest with a river", weight: 1.0 },
      { id: "s4", label: "a futuristic space station", weight: 1.0 },
      { id: "s5", label: "a cozy cafe interior", weight: 1.0 },
    ],
  },
  {
    id: "style",
    name: "Style",
    color: "text-purple-700 bg-purple-100 border-purple-300",
    options: [
      { id: "st1", label: "photorealistic, 8k photography", weight: 1.2 },
      { id: "st2", label: "anime style, Studio Ghibli", weight: 1.2 },
      { id: "st3", label: "oil painting, impressionist", weight: 1.1 },
      { id: "st4", label: "watercolor illustration", weight: 1.1 },
      { id: "st5", label: "digital art, concept art", weight: 1.0 },
    ],
  },
  {
    id: "mood",
    name: "Mood",
    color: "text-emerald-700 bg-emerald-100 border-emerald-300",
    options: [
      { id: "m1", label: "dramatic lighting, golden hour", weight: 0.9 },
      { id: "m2", label: "ethereal, dreamy atmosphere", weight: 0.9 },
      { id: "m3", label: "dark and moody, cinematic", weight: 1.0 },
      { id: "m4", label: "bright and cheerful, vibrant", weight: 0.8 },
      { id: "m5", label: "mysterious, foggy ambiance", weight: 0.9 },
    ],
  },
  {
    id: "quality",
    name: "Quality",
    color: "text-amber-700 bg-amber-100 border-amber-300",
    options: [
      { id: "q1", label: "highly detailed, sharp focus", weight: 1.3 },
      { id: "q2", label: "masterpiece, best quality", weight: 1.4 },
      { id: "q3", label: "professional photography, DSLR", weight: 1.2 },
      { id: "q4", label: "trending on ArtStation", weight: 1.0 },
      { id: "q5", label: "ultra-realistic, ray tracing", weight: 1.3 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Style Presets (Step 4: Interactive Prompt Builder)
// ---------------------------------------------------------------------------

export interface StylePreset {
  id: string;
  name: string;
  modifiers: string[];
  accentColor: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    modifiers: [
      "photorealistic, 8k photography",
      "dramatic lighting, golden hour",
      "highly detailed, sharp focus",
    ],
    accentColor: "bg-sky-100 text-sky-700 border-sky-300",
  },
  {
    id: "anime",
    name: "Anime",
    modifiers: [
      "anime style, Studio Ghibli",
      "bright and cheerful, vibrant",
      "masterpiece, best quality",
    ],
    accentColor: "bg-pink-100 text-pink-700 border-pink-300",
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    modifiers: [
      "oil painting, impressionist",
      "dramatic lighting, golden hour",
      "highly detailed, sharp focus",
    ],
    accentColor: "bg-orange-100 text-orange-700 border-orange-300",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    modifiers: [
      "watercolor illustration",
      "ethereal, dreamy atmosphere",
      "masterpiece, best quality",
    ],
    accentColor: "bg-teal-100 text-teal-700 border-teal-300",
  },
  {
    id: "digital-art",
    name: "Digital Art",
    modifiers: [
      "digital art, concept art",
      "dark and moody, cinematic",
      "trending on ArtStation",
    ],
    accentColor: "bg-violet-100 text-violet-700 border-violet-300",
  },
];

// ---------------------------------------------------------------------------
// Advanced Techniques (Step 5)
// ---------------------------------------------------------------------------

export interface AdvancedTechnique {
  id: string;
  name: string;
  description: string;
  conceptDescription: string;
  beforeStyle: string;
  afterStyle: string;
  beforeLabel: string;
  afterLabel: string;
}

export const ADVANCED_TECHNIQUES: AdvancedTechnique[] = [
  {
    id: "inpainting",
    name: "Inpainting",
    description:
      "Selectively regenerate parts of an existing image by masking specific regions. The model fills in the masked area while maintaining coherence with the surrounding content.",
    conceptDescription: "Mask a region and let the model fill it in",
    beforeStyle:
      "bg-gradient-to-br from-emerald-200 to-sky-200 relative overflow-hidden",
    afterStyle:
      "bg-gradient-to-br from-emerald-200 to-sky-200 relative overflow-hidden",
    beforeLabel: "Original with mask",
    afterLabel: "Inpainted result",
  },
  {
    id: "outpainting",
    name: "Outpainting",
    description:
      "Extend an image beyond its original boundaries. The model generates new content that seamlessly continues the existing composition, style, and context.",
    conceptDescription: "Expand the image canvas with generated content",
    beforeStyle: "bg-gradient-to-r from-indigo-200 to-purple-200",
    afterStyle: "bg-gradient-to-r from-blue-100 via-indigo-200 to-pink-100",
    beforeLabel: "Original bounds",
    afterLabel: "Extended canvas",
  },
  {
    id: "img2img",
    name: "Image-to-Image",
    description:
      "Transform an existing image using a text prompt while preserving the original structure and composition. Control the transformation strength with a denoising parameter.",
    conceptDescription: "Transform existing images with text guidance",
    beforeStyle: "bg-gradient-to-br from-gray-200 to-gray-300",
    afterStyle: "bg-gradient-to-br from-amber-200 to-rose-200",
    beforeLabel: "Input image",
    afterLabel: "Transformed output",
  },
  {
    id: "controlnet",
    name: "ControlNet",
    description:
      "Guide image generation with structural inputs like edge maps, depth maps, or pose skeletons. Provides precise spatial control over the generated output.",
    conceptDescription: "Structural conditioning for precise control",
    beforeStyle: "bg-white border-2 border-dashed border-gray-400",
    afterStyle: "bg-gradient-to-br from-rose-200 to-amber-200",
    beforeLabel: "Edge / pose guide",
    afterLabel: "Controlled output",
  },
  {
    id: "lora",
    name: "LoRA Fine-Tuning",
    description:
      "Low-Rank Adaptation trains small adapter weights on top of a base model to learn specific styles, characters, or concepts without retraining the entire model.",
    conceptDescription: "Lightweight fine-tuning for custom styles",
    beforeStyle: "bg-gradient-to-r from-blue-200 to-cyan-200",
    afterStyle: "bg-gradient-to-r from-fuchsia-200 to-violet-200",
    beforeLabel: "Base model output",
    afterLabel: "LoRA-adapted output",
  },
  {
    id: "style-transfer",
    name: "Style Transfer",
    description:
      "Apply the artistic style of one image to the content of another. Separates content structure from style patterns and recombines them to create new compositions.",
    conceptDescription: "Combine content and style from different sources",
    beforeStyle: "bg-gradient-to-br from-lime-200 to-emerald-200",
    afterStyle: "bg-gradient-to-br from-amber-200 to-orange-300",
    beforeLabel: "Content + style ref",
    afterLabel: "Styled result",
  },
];

// ---------------------------------------------------------------------------
// Model Comparison (Step 6: Summary)
// ---------------------------------------------------------------------------

export interface ModelFeature {
  feature: string;
  dalleValue: string;
  sdValue: string;
  midjourneyValue: string;
}

export const MODEL_COMPARISON: ModelFeature[] = [
  {
    feature: "Provider",
    dalleValue: "OpenAI",
    sdValue: "Stability AI / Open Source",
    midjourneyValue: "Midjourney Inc.",
  },
  {
    feature: "Access",
    dalleValue: "API + ChatGPT",
    sdValue: "Open weights, self-hosted",
    midjourneyValue: "Discord / Web",
  },
  {
    feature: "Architecture",
    dalleValue: "Diffusion (proprietary)",
    sdValue: "Latent Diffusion (UNet / DiT)",
    midjourneyValue: "Diffusion (proprietary)",
  },
  {
    feature: "Customization",
    dalleValue: "Limited (prompt only)",
    sdValue: "Full (LoRA, ControlNet, etc.)",
    midjourneyValue: "Style parameters",
  },
  {
    feature: "Cost",
    dalleValue: "Per-image API pricing",
    sdValue: "Free (compute costs only)",
    midjourneyValue: "Subscription tiers",
  },
  {
    feature: "Best For",
    dalleValue: "Quick prototyping, integration",
    sdValue: "Full control, production pipelines",
    midjourneyValue: "Artistic quality, ease of use",
  },
];

// ---------------------------------------------------------------------------
// Ethical Considerations (Step 6: Summary)
// ---------------------------------------------------------------------------

export interface EthicalConsideration {
  id: string;
  title: string;
  description: string;
}

export const ETHICAL_CONSIDERATIONS: EthicalConsideration[] = [
  {
    id: "copyright",
    title: "Copyright and Training Data",
    description:
      "Models are trained on large datasets that may include copyrighted works, raising questions about fair use and artist compensation.",
  },
  {
    id: "deepfakes",
    title: "Deepfakes and Misinformation",
    description:
      "Generated images can be used to create convincing fake content, requiring robust detection and provenance systems.",
  },
  {
    id: "bias",
    title: "Bias and Representation",
    description:
      "Training data biases can lead to stereotypical or underrepresented outputs across different demographics and cultures.",
  },
  {
    id: "watermarking",
    title: "Watermarking and Attribution",
    description:
      "Emerging standards like C2PA aim to embed provenance metadata in generated images for transparency.",
  },
  {
    id: "consent",
    title: "Consent and Likeness",
    description:
      "Generating images of real people without consent raises serious privacy and ethical concerns.",
  },
];

// ---------------------------------------------------------------------------
// Best Practices (Step 6: Summary)
// ---------------------------------------------------------------------------

export interface BestPractice {
  id: string;
  label: string;
  description: string;
}

export const BEST_PRACTICES: BestPractice[] = [
  {
    id: "specific-prompts",
    label: "Write specific, detailed prompts",
    description:
      "Include subject, style, mood, lighting, and quality modifiers for consistent results.",
  },
  {
    id: "negative-prompts",
    label: "Use negative prompts",
    description:
      "Specify what you do not want to see - blurry, low quality, extra limbs, etc.",
  },
  {
    id: "iterate",
    label: "Iterate with seed and parameters",
    description:
      "Lock the seed to explore variations, then adjust CFG scale and steps for refinement.",
  },
  {
    id: "resolution",
    label: "Match training resolution",
    description:
      "Generate at the model's native resolution first, then upscale with a separate step.",
  },
];

// ---------------------------------------------------------------------------
// Prompt Component Descriptions (Step 3: Prompt Engineering)
// ---------------------------------------------------------------------------

export interface PromptComponentInfo {
  id: string;
  name: string;
  description: string;
  example: string;
  color: string;
  importance: string;
}

export const PROMPT_COMPONENT_INFO: PromptComponentInfo[] = [
  {
    id: "subject",
    name: "Subject",
    description:
      "The main focus of the image. Be specific about what you want to see.",
    example: "a majestic lion standing on a cliff edge",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    importance: "Essential - defines what the image is about",
  },
  {
    id: "style",
    name: "Style",
    description:
      "The artistic style, medium, or rendering technique for the image.",
    example: "oil painting, impressionist style, thick brushstrokes",
    color: "bg-purple-100 text-purple-700 border-purple-300",
    importance: "High - dramatically changes the visual output",
  },
  {
    id: "composition",
    name: "Composition",
    description:
      "Camera angle, framing, perspective, and spatial arrangement of elements.",
    example: "wide angle shot, rule of thirds, low camera angle",
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    importance: "Medium - controls the visual layout and perspective",
  },
  {
    id: "quality",
    name: "Quality Modifiers",
    description:
      "Technical quality indicators that push the model toward higher fidelity output.",
    example: "highly detailed, 8k, sharp focus, professional",
    color: "bg-amber-100 text-amber-700 border-amber-300",
    importance: "Medium - improves overall output quality",
  },
  {
    id: "negative",
    name: "Negative Prompts",
    description:
      "Elements to exclude from the generation. Helps avoid common artifacts.",
    example: "blurry, low quality, watermark, extra fingers",
    color: "bg-red-100 text-red-700 border-red-300",
    importance: "Important - prevents common defects",
  },
];
