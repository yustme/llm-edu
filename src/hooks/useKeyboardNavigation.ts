import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePresentationStore } from "@/stores/presentation.store";
import { useSimulationStore } from "@/stores/simulation.store";
import { MODULES } from "@/config/app.config";

/**
 * Keyboard shortcuts for presentation navigation.
 *
 * Left Arrow  -> previous step (within module)
 * Right Arrow -> next step (within module)
 * Space       -> toggle play/pause simulation
 * Escape      -> reset simulation
 * 1-9         -> jump to module (navigate to /module/1 through /module/9)
 * 0 or Home   -> go to home page (navigate to /)
 *
 * Keys are ignored when an input or textarea is focused.
 */
export function useKeyboardNavigation(): void {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Do not capture keys when the user is typing in an input/textarea
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }

      const { currentModuleId, nextStep, prevStep, currentStep, totalSteps } =
        usePresentationStore.getState();
      const simulation = useSimulationStore.getState();

      switch (event.key) {
        case "ArrowLeft": {
          if (currentModuleId !== null && currentStep > 1) {
            prevStep();
          }
          break;
        }

        case "ArrowRight": {
          if (currentModuleId !== null && currentStep < totalSteps) {
            nextStep();
          }
          break;
        }

        case " ": {
          // Prevent default scroll-down behaviour
          event.preventDefault();
          if (simulation.isPlaying) {
            simulation.pause();
          } else {
            simulation.play();
          }
          break;
        }

        case "Escape": {
          simulation.reset();
          break;
        }

        case "Home": {
          navigate("/");
          break;
        }

        case "0": {
          navigate("/");
          break;
        }

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          const moduleIndex = Number(event.key) - 1;
          const targetModule = MODULES[moduleIndex];
          if (targetModule) {
            navigate(targetModule.path);
          }
          break;
        }

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
}
