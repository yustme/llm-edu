import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Server, ArrowRight, ArrowLeft } from "lucide-react";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { PROTOCOL_MESSAGES, type ProtocolMessage } from "@/data/mock-mcp-flows";
import { SIMULATION } from "@/config/simulation.config";

const SPEED_MULTIPLIERS = SIMULATION.speedMultipliers;
const AUTO_PLAY_DELAY_MS = 3000;

interface ProtocolFlowProps {
  className?: string;
}

/**
 * Animated JSON-RPC message flow visualization.
 * Shows a client box on the left, server box on the right.
 * Between them: JSON message blocks animate from one side to the other.
 * Requests flow left->right, responses flow right->left.
 */
export function ProtocolFlow({ className }: ProtocolFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEED_MULTIPLIERS)[number]>(1);

  const isComplete = currentIndex >= PROTOCOL_MESSAGES.length - 1;
  const currentMessage: ProtocolMessage | null =
    currentIndex >= 0 ? PROTOCOL_MESSAGES[currentIndex] : null;

  /** Stepper: index 0 = empty (-1), indices 1..N = messages 0..N-1 */
  const stepperIndex = currentIndex + 1;
  const setStepperPosition = useCallback(
    (i: number) => setCurrentIndex(i - 1),
    [],
  );
  useFullscreenStepper(stepperIndex, PROTOCOL_MESSAGES.length + 1, setStepperPosition);

  /** Advance to the next message */
  const nextMessage = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= PROTOCOL_MESSAGES.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  /** Reset the flow */
  const resetFlow = useCallback(() => {
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, []);

  /** Toggle auto-play */
  const togglePlay = useCallback(() => {
    if (isComplete) return;
    setIsPlaying((prev) => !prev);
    if (currentIndex < 0) {
      setCurrentIndex(0);
    }
  }, [isComplete, currentIndex]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const delay = AUTO_PLAY_DELAY_MS / speed;
    const timer = setTimeout(() => {
      nextMessage();
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, isComplete, speed, currentIndex, nextMessage]);

  return (
    <div className={className}>
      {/* Client / Server boxes */}
      <div className="flex items-start justify-between gap-4">
        {/* Client box */}
        <div className="flex w-32 flex-col items-center gap-2 rounded-lg border-2 border-indigo-300 bg-indigo-50 p-3">
          <Monitor className="h-6 w-6 text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700">Client</span>
          <span className="text-[11px] text-indigo-500">Claude Desktop</span>
        </div>

        {/* Middle: message animation area */}
        <div className="flex flex-1 flex-col items-center gap-2 pt-2">
          {/* Direction indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              MCP Protocol / JSON-RPC 2.0
            </span>
          </div>

          {/* Animated message */}
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={currentMessage.id}
                initial={{
                  opacity: 0,
                  x: currentMessage.direction === "request" ? -100 : 100,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: currentMessage.direction === "request" ? 100 : -100,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                {/* Message label and direction */}
                <div className="mb-1 flex items-center justify-center gap-2">
                  {currentMessage.direction === "request" ? (
                    <>
                      <span className="text-xs font-medium text-indigo-600">
                        {currentMessage.label}
                      </span>
                      <ArrowRight className="h-3 w-3 text-indigo-500" />
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600">
                        {currentMessage.label}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="mb-1.5 text-center text-xs text-muted-foreground">
                  {currentMessage.description}
                </p>

                {/* JSON code block */}
                <CodeBlock
                  code={currentMessage.json}
                  language="json"
                  title={
                    currentMessage.direction === "request"
                      ? "Request"
                      : "Response"
                  }
                  className="text-xs"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Placeholder when no message selected */}
          {!currentMessage && (
            <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed">
              <p className="text-xs text-muted-foreground">
                Click "Auto-play" or "Next" to start the protocol flow
              </p>
            </div>
          )}
        </div>

        {/* Server box */}
        <div className="flex w-32 flex-col items-center gap-2 rounded-lg border-2 border-blue-300 bg-blue-50 p-3">
          <Server className="h-6 w-6 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">Server</span>
          <span className="text-[11px] text-blue-500">Database MCP</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {PROTOCOL_MESSAGES.map((msg, i) => (
          <div
            key={msg.id}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              i <= currentIndex
                ? msg.direction === "request"
                  ? "bg-indigo-500"
                  : "bg-emerald-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center gap-2 border-t pt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={togglePlay}
          disabled={isComplete}
        >
          {isPlaying ? "Pause" : "Auto-play"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (currentIndex < 0) setCurrentIndex(0);
            else nextMessage();
          }}
          disabled={isPlaying || isComplete}
        >
          Next
        </Button>
        <Button size="sm" variant="ghost" onClick={resetFlow}>
          Reset
        </Button>

        {/* Speed controls */}
        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Speed:</span>
          {SPEED_MULTIPLIERS.map((mult) => (
            <Button
              key={mult}
              size="sm"
              variant={speed === mult ? "default" : "ghost"}
              className="h-7 px-2 text-xs"
              onClick={() => setSpeed(mult)}
            >
              {mult}x
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
