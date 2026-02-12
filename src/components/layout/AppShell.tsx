import { Outlet } from "react-router";
import { ModuleNav } from "./ModuleNav";
import { LAYOUT } from "@/config/theme.config";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleNav />
      <main
        className="min-h-screen"
        style={{ marginLeft: LAYOUT.sidebarWidthPx }}
      >
        <Outlet />
      </main>
    </div>
  );
}
