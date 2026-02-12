import { useEffect } from "react";
import { getModuleById } from "@/data/modules";
import { usePresentationStore } from "@/stores/presentation.store";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { StepProgress } from "@/components/layout/StepProgress";
import { StepControls } from "@/components/layout/StepControls";
import { SlideContainer } from "@/components/presentation/SlideContainer";
import { Step1Intro } from "./steps/Step1Intro";
import { Step2Metrics } from "./steps/Step2Metrics";
import { Step3TestCases } from "./steps/Step3TestCases";
import { Step4LLMJudge } from "./steps/Step4LLMJudge";
import { Step5EvalDemo } from "./steps/Step5EvalDemo";
import { Step6Summary } from "./steps/Step6Summary";
import { STEP_TITLES } from "./data";

const MODULE_ID = 9;

/** Map step number (1-indexed) to its component */
function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1Intro />;
    case 2:
      return <Step2Metrics />;
    case 3:
      return <Step3TestCases />;
    case 4:
      return <Step4LLMJudge />;
    case 5:
      return <Step5EvalDemo />;
    case 6:
      return <Step6Summary />;
    default:
      return null;
  }
}

export default function Module9() {
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
          animationKey={`module9-step-${currentStep}`}
          direction="right"
        >
          <StepContent step={currentStep} />
        </SlideContainer>
      </div>
    </div>
  );
}
