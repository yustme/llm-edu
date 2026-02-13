import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PROMPT_CATEGORIES,
  STYLE_PRESETS,
  type StylePreset,
} from "@/data/mock-image-gen";

const ANIMATION_DURATION = 0.3;

// Weight-to-opacity mapping for the "model view" colored spans
function weightToOpacity(weight: number): string {
  if (weight >= 1.3) return "opacity-100";
  if (weight >= 1.1) return "opacity-90";
  if (weight >= 1.0) return "opacity-80";
  return "opacity-70";
}

// Weight-to-brightness mapping for visual emphasis
function weightToRing(weight: number): string {
  if (weight >= 1.3) return "ring-2 ring-amber-400";
  if (weight >= 1.1) return "ring-1 ring-amber-300";
  return "";
}

/**
 * Interactive prompt builder that lets users compose image generation prompts
 * by selecting options across categories, applying style presets, and viewing
 * the composed prompt with attention weight visualization.
 */
export function PromptBuilder() {
  const [subjectText, setSubjectText] = useState("a majestic mountain landscape");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const styleCategory = PROMPT_CATEGORIES.find((c) => c.id === "style");
  const moodCategory = PROMPT_CATEGORIES.find((c) => c.id === "mood");
  const qualityCategory = PROMPT_CATEGORIES.find((c) => c.id === "quality");

  // Apply a style preset by setting all related selections
  function applyPreset(preset: StylePreset) {
    setActivePreset(preset.id);

    // Find matching options from the preset modifiers
    const styleMatch = styleCategory?.options.find((o) =>
      preset.modifiers.some((m) => m === o.label),
    );
    const moodMatch = moodCategory?.options.find((o) =>
      preset.modifiers.some((m) => m === o.label),
    );
    const qualityMatch = qualityCategory?.options.find((o) =>
      preset.modifiers.some((m) => m === o.label),
    );

    if (styleMatch) setSelectedStyle(styleMatch.id);
    if (moodMatch) setSelectedMood(moodMatch.id);
    if (qualityMatch) setSelectedQuality(qualityMatch.id);
  }

  // Build the composed prompt from current selections
  const promptParts = useMemo(() => {
    const parts: Array<{ text: string; color: string; weight: number }> = [];

    if (subjectText.trim()) {
      parts.push({
        text: subjectText.trim(),
        color: "bg-blue-100 text-blue-700",
        weight: 1.0,
      });
    }

    if (selectedStyle && styleCategory) {
      const opt = styleCategory.options.find((o) => o.id === selectedStyle);
      if (opt) {
        parts.push({
          text: opt.label,
          color: "bg-purple-100 text-purple-700",
          weight: opt.weight,
        });
      }
    }

    if (selectedMood && moodCategory) {
      const opt = moodCategory.options.find((o) => o.id === selectedMood);
      if (opt) {
        parts.push({
          text: opt.label,
          color: "bg-emerald-100 text-emerald-700",
          weight: opt.weight,
        });
      }
    }

    if (selectedQuality && qualityCategory) {
      const opt = qualityCategory.options.find((o) => o.id === selectedQuality);
      if (opt) {
        parts.push({
          text: opt.label,
          color: "bg-amber-100 text-amber-700",
          weight: opt.weight,
        });
      }
    }

    return parts;
  }, [
    subjectText,
    selectedStyle,
    selectedMood,
    selectedQuality,
    styleCategory,
    moodCategory,
    qualityCategory,
  ]);

  const composedPrompt = promptParts.map((p) => p.text).join(", ");

  return (
    <div className="space-y-5">
      {/* Subject input */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          Subject
        </label>
        <input
          type="text"
          value={subjectText}
          onChange={(e) => {
            setSubjectText(e.target.value);
            setActivePreset(null);
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Describe the subject of your image..."
        />
      </div>

      {/* Style presets */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          Style Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={activePreset === preset.id ? "default" : "outline"}
              size="sm"
              onClick={() => applyPreset(preset)}
              className="text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Category selectors */}
      <div className="grid grid-cols-3 gap-4">
        {/* Style */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Style
          </label>
          <div className="flex flex-wrap gap-1.5">
            {styleCategory?.options.map((opt) => (
              <Badge
                key={opt.id}
                variant={selectedStyle === opt.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer text-[10px] transition-colors",
                  selectedStyle === opt.id && "bg-purple-600 hover:bg-purple-700",
                )}
                onClick={() => {
                  setSelectedStyle(selectedStyle === opt.id ? null : opt.id);
                  setActivePreset(null);
                }}
              >
                {opt.label.split(",")[0]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Mood
          </label>
          <div className="flex flex-wrap gap-1.5">
            {moodCategory?.options.map((opt) => (
              <Badge
                key={opt.id}
                variant={selectedMood === opt.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer text-[10px] transition-colors",
                  selectedMood === opt.id && "bg-emerald-600 hover:bg-emerald-700",
                )}
                onClick={() => {
                  setSelectedMood(selectedMood === opt.id ? null : opt.id);
                  setActivePreset(null);
                }}
              >
                {opt.label.split(",")[0]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Quality
          </label>
          <div className="flex flex-wrap gap-1.5">
            {qualityCategory?.options.map((opt) => (
              <Badge
                key={opt.id}
                variant={selectedQuality === opt.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer text-[10px] transition-colors",
                  selectedQuality === opt.id && "bg-amber-600 hover:bg-amber-700",
                )}
                onClick={() => {
                  setSelectedQuality(
                    selectedQuality === opt.id ? null : opt.id,
                  );
                  setActivePreset(null);
                }}
              >
                {opt.label.split(",")[0]}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Composed prompt preview */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Composed Prompt
        </p>
        <p className="text-sm text-foreground font-mono leading-relaxed break-words">
          {composedPrompt || (
            <span className="text-muted-foreground italic">
              Select options above to build a prompt...
            </span>
          )}
        </p>
      </div>

      {/* Model view with attention weights */}
      {promptParts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATION }}
          className="rounded-lg border bg-card p-4 space-y-3"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Model View - Attention Weights
          </p>
          <div className="flex flex-wrap gap-2">
            {promptParts.map((part, index) => (
              <motion.span
                key={`${part.text}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                  part.color,
                  weightToOpacity(part.weight),
                  weightToRing(part.weight),
                )}
              >
                <span>{part.text}</span>
                <span className="text-[10px] font-bold opacity-70">
                  ({part.weight.toFixed(1)})
                </span>
              </motion.span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Higher weights (brighter, ringed) receive more attention during
            generation. Quality modifiers and style keywords are typically
            up-weighted to improve output fidelity.
          </p>
        </motion.div>
      )}
    </div>
  );
}
