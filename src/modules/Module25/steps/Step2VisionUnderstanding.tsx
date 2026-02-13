import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Image, BarChart3, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Badge } from "@/components/ui/badge";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { VISION_EXAMPLES } from "@/data/mock-multimodal";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const ICON_MAP: Record<string, typeof Image> = {
  PHOTO: Image,
  CHART: BarChart3,
  DOC: FileText,
};

const CARD_COLORS: Record<string, string> = {
  PHOTO: "border-emerald-200 bg-emerald-50/50",
  CHART: "border-blue-200 bg-blue-50/50",
  DOC: "border-amber-200 bg-amber-50/50",
};

const ICON_COLORS: Record<string, string> = {
  PHOTO: "bg-emerald-100 text-emerald-600",
  CHART: "bg-blue-100 text-blue-600",
  DOC: "bg-amber-100 text-amber-600",
};

export function Step2VisionUnderstanding() {
  const [selectedId, setSelectedId] = useState<string>(
    VISION_EXAMPLES[0].id,
  );

  const selected = VISION_EXAMPLES.find((ex) => ex.id === selectedId) ?? VISION_EXAMPLES[0];

  const selectedIndex = VISION_EXAMPLES.findIndex((ex) => ex.id === selectedId);
  const setSelectedByIndex = useCallback(
    (i: number) => setSelectedId(VISION_EXAMPLES[i].id),
    [],
  );
  useFullscreenStepper(
    selectedIndex === -1 ? 0 : selectedIndex,
    VISION_EXAMPLES.length,
    setSelectedByIndex,
  );

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Vision Understanding"
          highlights={[
            "Scene Analysis",
            "Chart Reading",
            "OCR",
            "Visual Q&A",
          ]}
        >
          <p>
            Vision models analyze images to extract meaning, describe scenes,
            and read text from visual content. The pipeline is straightforward:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Image input</strong> -- a photo, screenshot, chart, or
              scanned document is provided to the model
            </li>
            <li>
              <strong>Vision model processing</strong> -- the model identifies
              objects, text, layout, and relationships
            </li>
            <li>
              <strong>Structured output</strong> -- the result is a description,
              data extraction, or answer to a visual question
            </li>
          </ul>
          <p>
            Modern vision models like GPT-4V, Claude Vision, and Gemini Pro
            Vision can handle diverse visual tasks without task-specific
            training. Select an example on the right to explore.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          {/* Example selector cards */}
          <div className="grid grid-cols-3 gap-3">
            {VISION_EXAMPLES.map((example, index) => {
              const IconComp = ICON_MAP[example.inputIcon] ?? Image;
              const isActive = example.id === selectedId;

              return (
                <motion.button
                  key={example.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  onClick={() => setSelectedId(example.id)}
                  className={cn(
                    "rounded-lg border-2 p-3 text-left transition-all",
                    isActive
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:border-primary/30",
                    CARD_COLORS[example.inputIcon] ?? CARD_COLORS.DOC,
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded",
                        ICON_COLORS[example.inputIcon] ?? ICON_COLORS.DOC,
                      )}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">
                      {example.name}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {example.category}
                  </Badge>
                </motion.button>
              );
            })}
          </div>

          {/* Selected example detail */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Input -> Output flow */}
            <div className="flex items-stretch gap-3">
              {/* Input placeholder */}
              <div
                className={cn(
                  "flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed p-4",
                  CARD_COLORS[selected.inputIcon] ?? CARD_COLORS.DOC,
                )}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-lg",
                    ICON_COLORS[selected.inputIcon] ?? ICON_COLORS.DOC,
                  )}
                >
                  {(() => {
                    const Icon = ICON_MAP[selected.inputIcon] ?? Image;
                    return <Icon className="h-7 w-7" />;
                  })()}
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {selected.inputPlaceholder}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Output */}
              <div className="flex-1 rounded-lg border bg-card p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Model Output
                </p>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {selected.outputText}
                </p>
              </div>
            </div>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
