import { NavLink } from "react-router";
import { Home, Minus, Plus, Sun, Moon, Monitor } from "lucide-react";
import { modules } from "@/data/modules";
import { cn } from "@/lib/utils";
import { LAYOUT } from "@/config/theme.config";
import { MODULE_GROUPS } from "@/config/app.config";
import { usePresentationStore } from "@/stores/presentation.store";
import { useThemeStore } from "@/stores/theme.store";
import type { Theme } from "@/stores/theme.store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

/** Width of the sidebar when collapsed to icon-only mode */
const COLLAPSED_WIDTH_PX = 56;

interface ModuleNavProps {
  collapsed?: boolean;
}

const THEME_CYCLE: Theme[] = ["system", "light", "dark"];
const THEME_ICON = { system: Monitor, light: Sun, dark: Moon } as const;
const THEME_LABEL = { system: "System", light: "Light", dark: "Dark" } as const;

export function ModuleNav({ collapsed = false }: ModuleNavProps) {
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH_PX : LAYOUT.sidebarWidthPx;
  const fontScale = usePresentationStore((s) => s.fontScale);
  const increaseFontScale = usePresentationStore((s) => s.increaseFontScale);
  const decreaseFontScale = usePresentationStore((s) => s.decreaseFontScale);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  const ThemeIcon = THEME_ICON[theme];

  return (
    <aside
      className="fixed left-0 top-0 h-screen border-r border-border bg-sidebar-background text-sidebar-foreground flex flex-col transition-[width] duration-200 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      <div className="p-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-center rounded-md p-2 transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )
                  }
                >
                  <Home className="size-4" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">Home (0)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={cycleTheme}
                  aria-label={`Theme: ${THEME_LABEL[theme]}`}
                >
                  <ThemeIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Theme: {THEME_LABEL[theme]}
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                )
              }
            >
              <Home className="size-4" />
              Home
            </NavLink>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={decreaseFontScale}
                disabled={fontScale === 80}
                aria-label="Decrease font size (-)"
              >
                <Minus className="size-3" />
              </Button>
              <span className="min-w-[3ch] text-center text-[10px] font-medium text-muted-foreground">
                {fontScale}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={increaseFontScale}
                disabled={fontScale === 160}
                aria-label="Increase font size (+)"
              >
                <Plus className="size-3" />
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={cycleTheme}
                    aria-label={`Theme: ${THEME_LABEL[theme]}`}
                  >
                    <ThemeIcon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{THEME_LABEL[theme]} theme</TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1" type="always">
        <nav className="flex flex-col gap-1 p-4">
          {MODULE_GROUPS.map((group, groupIdx) => {
            const groupModules = group.moduleIds
              .map((id) => modules.find((m) => m.id === id))
              .filter(Boolean);

            return (
              <div key={group.label}>
                {groupIdx > 0 && <Separator className="my-2" />}

                {!collapsed && (
                  <span className="mb-2 block px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </span>
                )}

                {groupModules.map((module) => {
                  if (!module) return null;
                  const Icon = module.icon;

                  if (collapsed) {
                    return (
                      <Tooltip key={module.id}>
                        <TooltipTrigger asChild>
                          <NavLink
                            to={module.path}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center justify-center rounded-md p-2 transition-colors",
                                isActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                              )
                            }
                          >
                            <Icon className="size-4 shrink-0" />
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {module.id}. {module.name}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <NavLink
                      key={module.id}
                      to={module.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                        )
                      }
                    >
                      <Icon className="mt-0.5 size-4 shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <span className="leading-tight">
                          {module.id}. {module.name}
                        </span>
                        <span className="text-xs text-muted-foreground leading-snug line-clamp-2">
                          {module.description}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
