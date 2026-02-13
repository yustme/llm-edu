import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePresentationStore } from "@/stores/presentation.store";
import { useSimulationStore } from "@/stores/simulation.store";
import { MODULES } from "@/config/app.config";

/**
 * Keyboard shortcuts for presentation navigation.
 *
 * Left Arrow  -> normal: previous step | fullscreen: prev sim step or prev query
 * Right Arrow -> normal: next step     | fullscreen: next sim step or next query
 * B          -> toggle fullscreen on interactive area
 * +/=        -> increase font size
 * -          -> decrease font size
 * Space      -> toggle play/pause simulation
 * Escape     -> exit fullscreen (or reset simulation)
 * 1-9        -> jump to module (navigate to /module/1 through /module/9)
 * 0 or Home  -> go to home page (navigate to /)
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

      const presentation = usePresentationStore.getState();
      const simulation = useSimulationStore.getState();

      switch (event.key) {
        case "ArrowLeft": {
          if (presentation.currentModuleId === null) break;
          if (presentation.isFullscreen) {
            const hasSim = simulation.steps.length > 0;
            const simAtStart = simulation.currentStepIndex <= 0;

            // 1. Try going back in simulation
            if (hasSim && !simAtStart) {
              simulation.prevStep();
              usePresentationStore.setState({ fullscreenBoundaryReached: false });
              break;
            }

            // 2. Try going back in registered stepper
            const stepper = presentation.fullscreenStepper;
            if (stepper?.prev()) {
              usePresentationStore.setState({ fullscreenBoundaryReached: false });
              break;
            }

            // 3. Try prev query
            const movedQuery = presentation.queryCount > 1 && presentation.prevQuery();
            if (movedQuery) {
              simulation.reset();
              usePresentationStore.setState({ fullscreenBoundaryReached: false });
              break;
            }

            // 4. Boundary logic: double-press to exit fullscreen
            if (presentation.fullscreenBoundaryReached) {
              presentation.setFullscreen(false);
              if (presentation.currentStep > 1) {
                presentation.prevStep();
              }
            } else {
              usePresentationStore.setState({ fullscreenBoundaryReached: true });
            }
          } else if (presentation.currentStep > 1) {
            presentation.prevStep();
          }
          break;
        }

        case "ArrowRight": {
          if (presentation.currentModuleId === null) break;
          if (presentation.isFullscreen) {
            const hasSim = simulation.steps.length > 0;
            const simAtEnd = simulation.currentStepIndex >= simulation.steps.length - 1;

            // 1. Try advancing simulation
            if (hasSim && !simAtEnd) {
              simulation.nextStep();
              usePresentationStore.setState({ fullscreenBoundaryReached: false });
              break;
            }

            // 2. Try advancing registered stepper
            const stepper = presentation.fullscreenStepper;
            if (stepper?.next()) {
              usePresentationStore.setState({ fullscreenBoundaryReached: false });
              break;
            }

            // 3. Try next query
            const movedQuery = presentation.queryCount > 1 && presentation.nextQuery();
            if (movedQuery) {
              simulation.reset();
              usePresentationStore.setState({ fullscreenBoundaryReached: false });
              break;
            }

            // 4. Boundary logic: double-press to exit fullscreen
            if (presentation.fullscreenBoundaryReached) {
              presentation.setFullscreen(false);
              if (presentation.currentStep < presentation.totalSteps) {
                presentation.nextStep();
              }
            } else {
              usePresentationStore.setState({ fullscreenBoundaryReached: true });
            }
          } else if (presentation.currentStep < presentation.totalSteps) {
            presentation.nextStep();
          }
          break;
        }

        case "b":
        case "B": {
          if (presentation.currentModuleId !== null) {
            presentation.toggleFullscreen();
          }
          break;
        }

        case "+":
        case "=": {
          presentation.increaseFontScale();
          break;
        }

        case "-": {
          presentation.decreaseFontScale();
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
          if (presentation.isFullscreen) {
            presentation.setFullscreen(false);
          } else {
            simulation.reset();
          }
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
