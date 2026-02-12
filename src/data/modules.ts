import { MODULES } from "@/config/app.config";
import type { Module } from "@/types/module.types";

export const modules: Module[] = MODULES.map((config) => ({
  id: config.id,
  name: config.name,
  description: config.description,
  icon: config.icon,
  stepCount: config.stepCount,
  path: config.path,
}));

export function getModuleById(id: number): Module | undefined {
  return modules.find((m) => m.id === id);
}
