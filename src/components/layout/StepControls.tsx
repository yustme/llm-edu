import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePresentationStore } from "@/stores/presentation.store";
import { useSimulationStore } from "@/stores/simulation.store";

export function StepControls() {
  const { currentStep, totalSteps, nextStep, prevStep, reset } =
    usePresentationStore();
  const { isPlaying, play, pause } = useSimulationStore();

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < totalSteps;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={reset}
        disabled={currentStep === 1 && !isPlaying}
        aria-label="Reset"
      >
        <RotateCcw className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={prevStep}
        disabled={!canGoBack}
        aria-label="Previous step"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={isPlaying ? pause : play}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={nextStep}
        disabled={!canGoNext}
        aria-label="Next step"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
