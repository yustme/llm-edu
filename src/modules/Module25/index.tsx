import { useEffect } from "react";
import { getModuleById } from "@/data/modules";
import { usePresentationStore } from "@/stores/presentation.store";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { StepProgress } from "@/components/layout/StepProgress";
import { StepControls } from "@/components/layout/StepControls";
import { SlideContainer } from "@/components/presentation/SlideContainer";
import { Step1Intro } from "./steps/Step1Intro";
import { Step2VisionUnderstanding } from "./steps/Step2VisionUnderstanding";
import { Step3DocumentUnderstanding } from "./steps/Step3DocumentUnderstanding";
import { Step4PipelineDemo } from "./steps/Step4PipelineDemo";
import { Step5AudioVideo } from "./steps/Step5AudioVideo";
import { Step6Summary } from "./steps/Step6Summary";
import { STEP_TITLES } from "./data";

const MODULE_ID = 25;

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1Intro />;
    case 2:
      return <Step2VisionUnderstanding />;
    case 3:
      return <Step3DocumentUnderstanding />;
    case 4:
      return <Step4PipelineDemo />;
    case 5:
      return <Step5AudioVideo />;
    case 6:
      return <Step6Summary />;
    default:
      return null;
  }
}

export default function Module25() {
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
      <div className="px-6 py-3 border-b border-border">
        <StepProgress />
      </div>
      <div className="flex-1 overflow-auto p-8">
        <SlideContainer
          animationKey={`module25-step-${currentStep}`}
          direction="right"
        >
          <StepContent step={currentStep} />
        </SlideContainer>
      </div>
    </div>
  );
}
