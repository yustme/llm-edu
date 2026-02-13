import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleNav } from "./ModuleNav";
import { LAYOUT } from "@/config/theme.config";
import { usePresentationStore } from "@/stores/presentation.store";

/** Breakpoint in pixels below which the sidebar auto-collapses */
const COLLAPSE_BREAKPOINT_PX = LAYOUT.sidebarWidthPx + LAYOUT.contentMinWidthPx;

/** Width of the sidebar when collapsed to icon-only mode */
const COLLAPSED_WIDTH_PX = 56;

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const fontScale = usePresentationStore((s) => s.fontScale);

  const checkWidth = useCallback(() => {
    if (window.innerWidth < COLLAPSE_BREAKPOINT_PX) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    // Check on mount
    checkWidth();

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [checkWidth]);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH_PX : LAYOUT.sidebarWidthPx;

  return (
    <div className="min-h-screen bg-background">
      <ModuleNav collapsed={collapsed} />

      {/* Toggle button pinned at sidebar edge */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-2 z-50 transition-[left] duration-200"
        style={{ left: sidebarWidth - 20 }}
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <PanelLeftClose className="size-4" />
        )}
      </Button>

      <main
        className="min-h-screen transition-[margin-left] duration-200"
        style={{ marginLeft: sidebarWidth / (fontScale / 100), zoom: fontScale / 100 }}
      >
        <Outlet />
      </main>
    </div>
  );
}
