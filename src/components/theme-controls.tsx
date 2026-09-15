"use client";

import { Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const accents = ["default", "teal", "amber", "rose"] as const;
export function ThemeControls() {
  const setTheme = () => document.documentElement.classList.toggle("dark");
  const setAccent = () => {
    const current = document.documentElement.dataset.accent ?? "default";
    const next = accents[(accents.indexOf(current as (typeof accents)[number]) + 1) % accents.length];
    if (next === "default") delete document.documentElement.dataset.accent;
    else document.documentElement.dataset.accent = next;
  };
  return <div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={setTheme} aria-label="Đổi giao diện sáng tối"><Sun className="size-4 dark:hidden" /><Moon className="hidden size-4 dark:block" /></Button><Button variant="ghost" size="icon" onClick={setAccent} aria-label="Đổi màu nhấn"><Palette className="size-4" /></Button></div>;
}
