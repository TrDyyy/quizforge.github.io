"use client";

import { useEffect, useState } from "react";
import { MonitorCog, Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const accents = ["default", "teal", "amber", "rose"] as const;
const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];
type Accent = (typeof accents)[number];

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function applyAccent(accent: Accent) {
  if (accent === "default") delete document.documentElement.dataset.accent;
  else document.documentElement.dataset.accent = accent;
}

export function ThemeControls() {
  const [theme, setTheme] = useState<Theme>("system");
  const [accent, setAccent] = useState<Accent>("default");
  useEffect(() => {
    const storedTheme = localStorage.getItem("quizforge-theme");
    const storedAccent = localStorage.getItem("quizforge-accent");
    const validTheme = themes.includes(storedTheme as Theme) ? storedTheme as Theme : "system";
    const validAccent = accents.includes(storedAccent as Accent) ? storedAccent as Accent : "default";
    const restore = window.setTimeout(() => { setTheme(validTheme); setAccent(validAccent); applyTheme(validTheme); applyAccent(validAccent); }, 0);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => { if (localStorage.getItem("quizforge-theme") === "system") applyTheme("system"); };
    media.addEventListener("change", onSystemChange);
    return () => { window.clearTimeout(restore); media.removeEventListener("change", onSystemChange); };
  }, []);
  const cycleTheme = () => { const next = themes[(themes.indexOf(theme) + 1) % themes.length]; setTheme(next); localStorage.setItem("quizforge-theme", next); applyTheme(next); };
  const cycleAccent = () => { const next = accents[(accents.indexOf(accent) + 1) % accents.length]; setAccent(next); localStorage.setItem("quizforge-accent", next); applyAccent(next); };
  const ThemeIcon = theme === "system" ? MonitorCog : theme === "dark" ? Moon : Sun;
  return <div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={cycleTheme} aria-label={`Giao diện: ${theme}`} title={`Giao diện: ${theme}`}><ThemeIcon className="size-4" /></Button><Button variant="ghost" size="icon" onClick={cycleAccent} aria-label={`Màu nhấn: ${accent}`} title={`Màu nhấn: ${accent}`}><Palette className="size-4" /></Button></div>;
}
