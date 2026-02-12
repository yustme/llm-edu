import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEST_CASES } from "@/data/mock-evaluation";
import type { TestCase } from "@/data/mock-evaluation";

const TEST_TYPES = ["unit", "integration", "e2e"] as const;
type TestType = (typeof TEST_TYPES)[number];

const TYPE_LABELS: Record<TestType, string> = {
  unit: "Unit",
  integration: "Integration",
  e2e: "E2E",
};

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.3;

function TestCaseCard({ testCase, index }: { testCase: TestCase; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        delay: index * STAGGER_DELAY,
        duration: ANIMATION_DURATION,
        ease: "easeOut",
      }}
      className="rounded-lg border bg-card p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {testCase.status === "pass" ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
          )}
          <span className="text-sm font-semibold">{testCase.name}</span>
        </div>
        <Badge
          variant="secondary"
          className={
            testCase.status === "pass"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {testCase.status === "pass" ? "Pass" : "Fail"}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {testCase.description}
      </p>

      <div className="space-y-1 text-xs">
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground w-16 shrink-0">
            Input:
          </span>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
            {testCase.input}
          </code>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground w-16 shrink-0">
            Expected:
          </span>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
            {testCase.expectedOutput}
          </code>
        </div>
      </div>
    </motion.div>
  );
}

export function Step3TestCases() {
  const [activeType, setActiveType] = useState<TestType>("unit");
  const filteredCases = TEST_CASES.filter((tc) => tc.type === activeType);

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Test Case Types"
          highlights={["Unit", "Integration", "End-to-End"]}
        >
          <p>
            AI agent testing follows the same pyramid as traditional software,
            but each layer has unique considerations:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Unit tests</strong> verify individual functions: date
              parsers, formatters, input sanitizers. These are fast, cheap, and
              deterministic.
            </li>
            <li>
              <strong>Integration tests</strong> check tool chains: does the
              search result correctly flow into the summarizer? These catch
              interface mismatches.
            </li>
            <li>
              <strong>E2E tests</strong> validate complete workflows from user
              question to final answer. These are slower but catch real-world
              failures.
            </li>
          </ul>
          <p>
            Use the tabs to explore example test cases for each type. Notice how
            complexity increases and tests become less deterministic at higher
            levels.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          {/* Tab selector */}
          <div className="mb-5 flex items-center gap-2 border-b pb-3">
            {TEST_TYPES.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={activeType === type ? "default" : "outline"}
                onClick={() => setActiveType(type)}
              >
                {TYPE_LABELS[type]}
              </Button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              {filteredCases.length} test{filteredCases.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Test case list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {filteredCases.map((tc, index) => (
                <TestCaseCard key={tc.id} testCase={tc} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </InteractiveArea>
      </div>
    </div>
  );
}
