import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MODEL_OPTIONS, COST_DEFAULTS } from "@/data/mock-optimization";
import type { ModelOption } from "@/data/mock-optimization";

interface CostCalculatorProps {
  className?: string;
}

const INPUT_TOKEN_MAX = 10000;
const OUTPUT_TOKEN_MAX = 5000;
const TOOL_CALLS_MAX = 10;

/**
 * Interactive cost calculator that lets users adjust token counts,
 * tool calls, and model selection to see real-time cost calculations.
 */
export function CostCalculator({ className }: CostCalculatorProps) {
  const [inputTokens, setInputTokens] = useState<number>(COST_DEFAULTS.inputTokens);
  const [outputTokens, setOutputTokens] = useState<number>(COST_DEFAULTS.outputTokens);
  const [toolCalls, setToolCalls] = useState<number>(COST_DEFAULTS.toolCalls);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODEL_OPTIONS[0]);

  const inputCost = (inputTokens / 1000) * selectedModel.inputCostPer1k;
  const outputCost = (outputTokens / 1000) * selectedModel.outputCostPer1k;
  const toolCost = toolCalls * COST_DEFAULTS.toolCallCostEach;
  const totalCost = inputCost + outputCost + toolCost;

  return (
    <div className={cn("space-y-5", className)}>
      {/* Model selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Model
        </label>
        <div className="flex flex-wrap gap-2">
          {MODEL_OPTIONS.map((model) => (
            <button
              key={model.name}
              onClick={() => setSelectedModel(model)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                selectedModel.name === model.name
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {model.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input tokens slider */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Input Tokens
          </label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {inputTokens.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={INPUT_TOKEN_MAX}
          step={100}
          value={inputTokens}
          onChange={(e) => setInputTokens(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{INPUT_TOKEN_MAX.toLocaleString()}</span>
        </div>
      </div>

      {/* Output tokens slider */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Output Tokens
          </label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {outputTokens.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={OUTPUT_TOKEN_MAX}
          step={50}
          value={outputTokens}
          onChange={(e) => setOutputTokens(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{OUTPUT_TOKEN_MAX.toLocaleString()}</span>
        </div>
      </div>

      {/* Tool calls slider */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Tool Calls
          </label>
          <span className="text-sm tabular-nums text-muted-foreground">
            {toolCalls}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={TOOL_CALLS_MAX}
          step={1}
          value={toolCalls}
          onChange={(e) => setToolCalls(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{TOOL_CALLS_MAX}</span>
        </div>
      </div>

      {/* Cost breakdown */}
      <motion.div
        layout
        className="rounded-lg border bg-muted/50 p-4 space-y-2"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Cost Breakdown
        </p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Input tokens</span>
            <span className="tabular-nums font-medium">
              ${inputCost.toFixed(6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Output tokens</span>
            <span className="tabular-nums font-medium">
              ${outputCost.toFixed(6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Tool calls ({toolCalls} x ${COST_DEFAULTS.toolCallCostEach})
            </span>
            <span className="tabular-nums font-medium">
              ${toolCost.toFixed(6)}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="tabular-nums font-bold text-primary">
              ${totalCost.toFixed(6)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
