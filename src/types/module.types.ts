import type { LucideIcon } from "lucide-react";

export interface Module {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  stepCount: number;
  path: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export interface ModuleProgress {
  moduleId: number;
  currentStep: number;
  totalSteps: number;
  completed: boolean;
}
