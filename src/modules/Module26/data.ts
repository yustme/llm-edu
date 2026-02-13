/** Step titles for the module navigation header */
export const STEP_TITLES = [
  "Text-to-Image Pipeline",
  "Diffusion Process",
  "Prompt Engineering",
  "Interactive Prompt Builder",
  "Advanced Techniques",
  "Summary",
] as const;

/** Step descriptions shown in the step progress area */
export const STEP_DESCRIPTIONS = [
  "From text prompt to generated image - the full pipeline architecture",
  "How iterative denoising transforms random noise into coherent images",
  "Anatomy of an effective image prompt: subject, style, composition, quality",
  "Build and visualize prompts with attention weights and style presets",
  "Inpainting, outpainting, ControlNet, LoRA, and other advanced methods",
  "Model comparison, ethical considerations, and best practices",
] as const;
