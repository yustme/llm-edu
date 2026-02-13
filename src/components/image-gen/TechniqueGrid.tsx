import type { JSX } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADVANCED_TECHNIQUES, type AdvancedTechnique } from "@/data/mock-image-gen";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

interface TechniqueCardProps {
  technique: AdvancedTechnique;
  index: number;
}

function InpaintingBeforeVis() {
  return (
    <div className="relative h-full w-full rounded bg-gradient-to-br from-emerald-200 to-sky-200">
      {/* Masked region shown as a dashed white box */}
      <div className="absolute inset-x-3 inset-y-2 flex items-center justify-center">
        <div className="h-8 w-10 rounded border-2 border-dashed border-white/80 bg-white/40" />
      </div>
    </div>
  );
}

function InpaintingAfterVis() {
  return (
    <div className="relative h-full w-full rounded bg-gradient-to-br from-emerald-200 to-sky-200">
      {/* Filled region with different gradient */}
      <div className="absolute inset-x-3 inset-y-2 flex items-center justify-center">
        <div className="h-8 w-10 rounded bg-gradient-to-br from-teal-300 to-cyan-300 shadow-sm" />
      </div>
    </div>
  );
}

function OutpaintingBeforeVis() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
      <div className="h-10 w-10 rounded bg-gradient-to-r from-indigo-200 to-purple-200 shadow-sm" />
    </div>
  );
}

function OutpaintingAfterVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-r from-blue-100 via-indigo-200 to-pink-100 flex items-center justify-center">
      <div className="h-10 w-10 rounded bg-gradient-to-r from-indigo-300 to-purple-300 shadow-sm" />
    </div>
  );
}

function Img2ImgBeforeVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
      <div className="space-y-1">
        <div className="h-1.5 w-8 rounded-full bg-gray-400" />
        <div className="h-1.5 w-6 rounded-full bg-gray-400" />
        <div className="h-1.5 w-10 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

function Img2ImgAfterVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-br from-amber-200 to-rose-200 flex items-center justify-center">
      <div className="space-y-1">
        <div className="h-1.5 w-8 rounded-full bg-amber-500" />
        <div className="h-1.5 w-6 rounded-full bg-rose-400" />
        <div className="h-1.5 w-10 rounded-full bg-orange-400" />
      </div>
    </div>
  );
}

function ControlNetBeforeVis() {
  return (
    <div className="h-full w-full rounded bg-white flex items-center justify-center border border-dashed border-gray-300">
      {/* Simple wireframe / edge representation */}
      <svg viewBox="0 0 40 32" className="h-10 w-12 text-gray-400">
        <line x1="5" y1="28" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="20" y1="5" x2="35" y2="28" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="5" y1="28" x2="35" y2="28" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="10" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

function ControlNetAfterVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center">
      <svg viewBox="0 0 40 32" className="h-10 w-12">
        <polygon points="5,28 20,5 35,28" fill="rgba(244,63,94,0.3)" stroke="rgba(244,63,94,0.6)" strokeWidth="1" />
        <circle cx="20" cy="10" r="3" fill="rgba(251,191,36,0.5)" stroke="rgba(251,191,36,0.8)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function LoRABeforeVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-r from-blue-200 to-cyan-200 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-blue-400" />
        ))}
      </div>
    </div>
  );
}

function LoRAAfterVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-r from-fuchsia-200 to-violet-200 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-violet-500" />
        ))}
      </div>
    </div>
  );
}

function StyleTransferBeforeVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-br from-lime-200 to-emerald-200 flex items-center justify-center">
      <div className="flex gap-1">
        <div className="h-6 w-5 rounded bg-lime-400" />
        <div className="text-[8px] text-emerald-600 font-bold self-center">+</div>
        <div className="h-6 w-5 rounded bg-emerald-400" />
      </div>
    </div>
  );
}

function StyleTransferAfterVis() {
  return (
    <div className="h-full w-full rounded bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
      <div className="h-6 w-10 rounded bg-gradient-to-r from-amber-400 to-orange-400 shadow-sm" />
    </div>
  );
}

// Map technique IDs to their before/after visualization components
const TECHNIQUE_VIS: Record<
  string,
  { before: () => JSX.Element; after: () => JSX.Element }
> = {
  inpainting: { before: InpaintingBeforeVis, after: InpaintingAfterVis },
  outpainting: { before: OutpaintingBeforeVis, after: OutpaintingAfterVis },
  img2img: { before: Img2ImgBeforeVis, after: Img2ImgAfterVis },
  controlnet: { before: ControlNetBeforeVis, after: ControlNetAfterVis },
  lora: { before: LoRABeforeVis, after: LoRAAfterVis },
  "style-transfer": {
    before: StyleTransferBeforeVis,
    after: StyleTransferAfterVis,
  },
};

function TechniqueCard({ technique, index }: TechniqueCardProps) {
  const vis = TECHNIQUE_VIS[technique.id];
  const BeforeVis = vis?.before;
  const AfterVis = vis?.after;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * STAGGER_DELAY,
        duration: ANIMATION_DURATION,
      }}
      className="rounded-lg border bg-card p-4 space-y-3"
    >
      <div>
        <h4 className="text-sm font-semibold text-foreground">
          {technique.name}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          {technique.description}
        </p>
      </div>

      {/* Before / After concept visualization */}
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <p className="text-[10px] text-muted-foreground font-medium text-center">
            {technique.beforeLabel}
          </p>
          <div className="h-16 rounded overflow-hidden">
            {BeforeVis ? <BeforeVis /> : <div className={cn("h-full rounded", technique.beforeStyle)} />}
          </div>
        </div>

        <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-[10px] text-muted-foreground font-medium text-center">
            {technique.afterLabel}
          </p>
          <div className="h-16 rounded overflow-hidden">
            {AfterVis ? <AfterVis /> : <div className={cn("h-full rounded", technique.afterStyle)} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Grid of advanced image generation technique cards with
 * before/after concept visualizations using Tailwind-styled divs.
 */
export function TechniqueGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {ADVANCED_TECHNIQUES.map((technique, index) => (
        <TechniqueCard key={technique.id} technique={technique} index={index} />
      ))}
    </div>
  );
}
