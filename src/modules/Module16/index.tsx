import { useEffect } from "react";
import { getModuleById } from "@/data/modules";
import { usePresentationStore } from "@/stores/presentation.store";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { StepProgress } from "@/components/layout/StepProgress";
import { StepControls } from "@/components/layout/StepControls";
import { SlideContainer } from "@/components/presentation/SlideContainer";
import { Step1Intro } from "./steps/Step1Intro";
import { Step2Pipeline } from "./steps/Step2Pipeline";
import { Step3SchemaContext } from "./steps/Step3SchemaContext";
import { Step4SimpleDemo } from "./steps/Step4SimpleDemo";
import { Step5ComplexDemo } from "./steps/Step5ComplexDemo";
import { Step6Summary } from "./steps/Step6Summary";
import { STEP_TITLES } from "./data";

const MODULE_ID = 16;

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1Intro />;
    case 2:
      return <Step2Pipeline />;
    case 3:
      return <Step3SchemaContext />;
    case 4:
      return <Step4SimpleDemo />;
    case 5:
      return <Step5ComplexDemo />;
    case 6:
      return <Step6Summary />;
    default:
      return null;
  }
}

export default function Module16() {
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
          animationKey={`module16-step-${currentStep}`}
          direction="right"
        >
          <StepContent step={currentStep} />
        </SlideContainer>
      </div>
    </div>
  );
}
