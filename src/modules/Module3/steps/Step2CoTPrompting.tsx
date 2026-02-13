import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, BookOpen, Cpu } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { COT_VARIANTS } from "@/data/mock-reasoning";
import type { CoTVariant } from "@/data/mock-reasoning";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const VARIANT_ICONS: Record<string, typeof Zap> = {
  "zero-shot": Zap,
  "few-shot": BookOpen,
  "auto-cot": Cpu,
};

const VARIANT_COLORS = [
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBorder: "border-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    headerBg: "bg-blue-100",
    headerText: "text-blue-800",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBorder: "border-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    headerBg: "bg-emerald-100",
    headerText: "text-emerald-800",
  },
  {
    bg: "bg-violet-50",
    border: "border-violet-200",
    activeBorder: "border-violet-500",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    headerBg: "bg-violet-100",
    headerText: "text-violet-800",
  },
] as const;

export function Step2CoTPrompting() {
  const [selectedVariant, setSelectedVariant] = useState<string>(
    COT_VARIANTS[0].id,
  );

  const selected =
    COT_VARIANTS.find((v) => v.id === selectedVariant) ?? COT_VARIANTS[0];
  const selectedIndex = COT_VARIANTS.findIndex(
    (v) => v.id === selectedVariant,
  );

  // Fullscreen arrow-key navigation: cycle through CoT variants
  const setVariantByIndex = useCallback(
    (i: number) => setSelectedVariant(COT_VARIANTS[i].id),
    [],
  );
  useFullscreenStepper(selectedIndex, COT_VARIANTS.length, setVariantByIndex);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Chain-of-Thought Prompting"
          highlights={["Zero-Shot", "Few-Shot", "Auto-CoT"]}
        >
          <p>
            Chain-of-Thought (CoT) prompting is the foundational technique for
            improving LLM reasoning. Introduced by Wei et al. (2022), it
            demonstrates that asking the model to show its work dramatically
            improves performance on arithmetic, common-sense, and symbolic
            reasoning tasks.
          </p>
          <p>There are three main variants:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Zero-shot CoT</strong> -- simply append "Let's think step
              by step" to the prompt. No examples needed.
            </li>
            <li>
              <strong>Few-shot CoT</strong> -- provide worked examples with
              explicit reasoning traces before the actual question.
            </li>
            <li>
              <strong>Auto-CoT</strong> -- automatically generate diverse
              reasoning demonstrations by clustering questions and sampling.
            </li>
          </ul>
          <p>
            Click each card on the right to see the prompt template and learn
            when to use that variant.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Chain-of-Thought Variants
          </p>

          {/* Variant selector cards */}
          <div className="grid grid-cols-3 gap-3">
            {COT_VARIANTS.map((variant, index) => {
              const Icon = VARIANT_ICONS[variant.id] ?? Zap;
              const colors = VARIANT_COLORS[index % VARIANT_COLORS.length];
              const isSelected = variant.id === selectedVariant;

              return (
                <motion.button
                  key={variant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${colors.bg} ${
                    isSelected ? colors.activeBorder : colors.border
                  } ${isSelected ? "ring-2 ring-offset-1 ring-primary/30" : "hover:shadow-sm"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${colors.iconBg}`}
                    >
                      <Icon className={`h-4 w-4 ${colors.iconColor}`} />
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {variant.name}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected variant detail */}
          <VariantDetail variant={selected} colorIndex={selectedIndex} />
        </InteractiveArea>
      </div>
    </div>
  );
}

function VariantDetail({
  variant,
  colorIndex,
}: {
  variant: CoTVariant;
  colorIndex: number;
}) {
  const colors = VARIANT_COLORS[colorIndex % VARIANT_COLORS.length];

  return (
    <motion.div
      key={variant.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Description */}
      <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}>
        <p className="text-sm leading-relaxed text-foreground">
          {variant.description}
        </p>
      </div>

      {/* When to use */}
      <div className="rounded-lg border bg-muted/50 p-3">
        <Badge variant="secondary" className="mb-2 text-xs">
          When to Use
        </Badge>
        <p className="text-sm text-muted-foreground">{variant.whenToUse}</p>
      </div>

      {/* Prompt example */}
      <CodeBlock
        code={variant.promptExample}
        language={variant.promptLanguage}
        title={`${variant.name} -- Prompt Template`}
      />
    </motion.div>
  );
}
