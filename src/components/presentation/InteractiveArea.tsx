import { type ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePresentationStore } from "@/stores/presentation.store";

interface InteractiveAreaProps {
  children: ReactNode;
  className?: string;
  /** Allow fullscreen toggle (default: true) */
  allowFullscreen?: boolean;
}

/**
 * Right-side visualization container with consistent padding,
 * border, and background styling. Includes a fullscreen toggle.
 */
export function InteractiveArea({
  children,
  className,
  allowFullscreen = true,
}: InteractiveAreaProps) {
  const isFullscreen = usePresentationStore((s) => s.isFullscreen);
  const toggleFullscreen = usePresentationStore((s) => s.toggleFullscreen);
  const fontScale = usePresentationStore((s) => s.fontScale);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <>
      {/* Inline version */}
      {!isFullscreen && (
        <div
          className={cn(
            "relative rounded-xl border bg-card p-6 shadow-sm",
            className,
          )}
        >
          {allowFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={toggleFullscreen}
              title="Fullscreen (B)"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          {children}
        </div>
      )}

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
            style={{ zoom: fontScale / 100 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-end border-b px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Minimize2 className="h-4 w-4" />
                Exit fullscreen
              </Button>
            </div>

            {/* Content */}
            <div className={cn("flex-1 overflow-auto p-8", className)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
