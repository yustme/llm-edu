import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";

const Home = lazy(() => import("@/modules/Home/index"));
const Module1 = lazy(() => import("@/modules/Module1/index"));
const Module2 = lazy(() => import("@/modules/Module2/index"));
const Module3 = lazy(() => import("@/modules/Module3/index"));
const Module4 = lazy(() => import("@/modules/Module4/index"));

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path="module/1" element={<Module1 />} />
              <Route path="module/2" element={<Module2 />} />
              <Route path="module/3" element={<Module3 />} />
              <Route path="module/4" element={<Module4 />} />
            </Route>
          </Routes>
        </Suspense>
      </TooltipProvider>
    </BrowserRouter>
  );
}
