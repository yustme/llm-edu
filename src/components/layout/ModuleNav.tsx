import { NavLink } from "react-router";
import { Home } from "lucide-react";
import { modules } from "@/data/modules";
import { cn } from "@/lib/utils";
import { LAYOUT } from "@/config/theme.config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ModuleNav() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen border-r border-border bg-sidebar-background text-sidebar-foreground flex flex-col"
      style={{ width: LAYOUT.sidebarWidthPx }}
    >
      <div className="p-4">
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
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          <span className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Modules
          </span>
          {modules.map((module) => {
            const Icon = module.icon;
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
        </nav>
      </ScrollArea>
    </aside>
  );
}
