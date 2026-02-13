import { useEffect } from "react";
import { getModuleById } from "@/data/modules";
import { usePresentationStore } from "@/stores/presentation.store";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { StepProgress } from "@/components/layout/StepProgress";
import { StepControls } from "@/components/layout/StepControls";
import { SlideContainer } from "@/components/presentation/SlideContainer";
import { Step1Intro } from "./steps/Step1Intro";
import { Step2Dataset } from "./steps/Step2Dataset";
import { Step3WithoutSemantic } from "./steps/Step3WithoutSemantic";
import { Step4WithSemantic } from "./steps/Step4WithSemantic";
import { Step5Comparison } from "./steps/Step5Comparison";
import { Step6Summary } from "./steps/Step6Summary";
import { STEP_TITLES } from "./data";

const MODULE_ID = 15;

/** Map step number (1-indexed) to its component */
function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1Intro />;
    case 2:
      return <Step2Dataset />;
    case 3:
      return <Step3WithoutSemantic />;
    case 4:
      return <Step4WithSemantic />;
    case 5:
      return <Step5Comparison />;
    case 6:
      return <Step6Summary />;
    default:
      return null;
  }
}

export default function Module15() {
  const module = getModuleById(MODULE_ID);
  const setModule = usePresentationStore((s) => s.setModule);
  const { currentStep } = useStepNavigation();

  useEffect(() => {
    if (module) {
      setModule(module.id, module.stepCount);
    }
  }, [module, setModule]);

  if (!module) return null;

  const Icon = module.icon;
  const stepTitle = STEP_TITLES[currentStep - 1] ?? "";

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {module.id}. {module.name}
            </h1>
            {stepTitle && (
              <p className="text-sm text-muted-foreground">{stepTitle}</p>
            )}
          </div>
        </div>
        <StepControls />
      </header>

      {/* Step progress bar */}
      <div className="px-6 py-3 border-b border-border">
        <StepProgress />
      </div>

      {/* Step content with slide animations */}
      <div className="flex-1 overflow-auto p-8">
        <SlideContainer
          animationKey={`module15-step-${currentStep}`}
          direction="right"
        >
          <StepContent step={currentStep} />
        </SlideContainer>
      </div>
    </div>
  );
}
