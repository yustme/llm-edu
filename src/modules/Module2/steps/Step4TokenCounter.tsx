import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { TokenCounter } from "@/components/context-window/TokenCounter";

export function Step4TokenCounter() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Interactive Token Counter"
          highlights={["Live Count", "Fill Meter", "Budget Planning"]}
        >
          <p>
            Understanding how many tokens your prompts consume is essential for
            building reliable LLM applications. This interactive counter lets
            you experiment with different prompt sizes.
          </p>
          <p>
            The context window is divided into three zones:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>System prompt tokens</strong> -- instructions and persona
              that persist across the conversation
            </li>
            <li>
              <strong>User prompt tokens</strong> -- the current message
              including any injected context (RAG chunks, tool results)
            </li>
            <li>
              <strong>Response reservation</strong> -- tokens set aside for the
              model&apos;s response (max_tokens parameter)
            </li>
          </ul>
          <p>
            The fill meter shows how much of the context window is used. When
            it overflows, you need to either reduce input or increase the
            context window size.
          </p>
          <p>
            Try loading different example prompts to see how token counts vary.
            The tokenizer here uses a simple word-based approximation (1 word
            ~ 1.3 tokens).
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea>
          <TokenCounter />
        </InteractiveArea>
      </div>
    </div>
  );
}
