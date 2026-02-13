import { lazy, Suspense, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

const Home = lazy(() => import("@/modules/Home/index"));
const Module1 = lazy(() => import("@/modules/Module1/index"));
const Module2 = lazy(() => import("@/modules/Module2/index"));
const Module3 = lazy(() => import("@/modules/Module3/index"));
const Module4 = lazy(() => import("@/modules/Module4/index"));
const Module5 = lazy(() => import("@/modules/Module5/index"));
const Module6 = lazy(() => import("@/modules/Module6/index"));
const Module7 = lazy(() => import("@/modules/Module7/index"));
const Module8 = lazy(() => import("@/modules/Module8/index"));
const Module9 = lazy(() => import("@/modules/Module9/index"));
const Module10 = lazy(() => import("@/modules/Module10/index"));
const Module11 = lazy(() => import("@/modules/Module11/index"));
const Module12 = lazy(() => import("@/modules/Module12/index"));
const Module13 = lazy(() => import("@/modules/Module13/index"));

/* ------------------------------------------------------------------ */
/*  Loading fallback with animated spinner                             */
/* ------------------------------------------------------------------ */

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="size-10 rounded-full border-4 border-muted border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
        <p className="text-sm text-muted-foreground">Loading module...</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error boundary                                                     */
/* ------------------------------------------------------------------ */

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Module loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                An error occurred while loading the module. Please try again or
                navigate to the home page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-mono bg-muted rounded-md p-3 break-all">
                {this.state.error?.message ?? "Unknown error"}
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try again
              </Button>
              <Link to="/">
                <Button>Go Home</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  Keyboard navigation integration                                    */
/* ------------------------------------------------------------------ */

function KeyboardNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  useKeyboardNavigation();
  return <>{children}</>;
}

/* ------------------------------------------------------------------ */
/*  Root application component                                         */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <KeyboardNavigationProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route element={<AppShell />}>
                  <Route index element={<Home />} />
                  <Route path="module/1" element={<Module1 />} />
                  <Route path="module/2" element={<Module2 />} />
                  <Route path="module/3" element={<Module3 />} />
                  <Route path="module/4" element={<Module4 />} />
                  <Route path="module/5" element={<Module5 />} />
                  <Route path="module/6" element={<Module6 />} />
                  <Route path="module/7" element={<Module7 />} />
                  <Route path="module/8" element={<Module8 />} />
                  <Route path="module/9" element={<Module9 />} />
                  <Route path="module/10" element={<Module10 />} />
                  <Route path="module/11" element={<Module11 />} />
                  <Route path="module/12" element={<Module12 />} />
                  <Route path="module/13" element={<Module13 />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </KeyboardNavigationProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
