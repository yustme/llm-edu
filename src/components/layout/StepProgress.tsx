import { Progress } from "@/components/ui/progress";
import { usePresentationStore } from "@/stores/presentation.store";

export function StepProgress() {
  const { currentStep, totalSteps } = usePresentationStore();

  if (totalSteps === 0) return null;

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="flex items-center gap-3" data-slot="step-progress">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Step {currentStep} of {totalSteps}
      </span>
      <Progress value={progressPercent} className="h-2 flex-1" />
    </div>
  );
}
