import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { usePresentationStore } from "@/stores/presentation.store";
import { useSimulationStore } from "@/stores/simulation.store";

export function StepControls() {
  const { currentStep, totalSteps, nextStep, prevStep, reset } =
    usePresentationStore();
  const { isPlaying, play, pause } = useSimulationStore();

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < totalSteps;

  return (
    <div className="flex items-center gap-2" data-slot="step-controls">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            disabled={currentStep === 1 && !isPlaying}
            aria-label="Reset (Esc)"
          >
            <RotateCcw className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset (Esc)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={prevStep}
            disabled={!canGoBack}
            aria-label="Previous step (Left Arrow)"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Previous step (&larr;)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={isPlaying ? pause : play}
            aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isPlaying ? "Pause" : "Play"} (Space)
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={nextStep}
            disabled={!canGoNext}
            aria-label="Next step (Right Arrow)"
          >
            <ChevronRight className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Next step (&rarr;)</TooltipContent>
      </Tooltip>
    </div>
  );
}
