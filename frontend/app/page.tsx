"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Github, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

const WorkflowBuilder = dynamic(() => import("@/components/workflow-builder"), {
  ssr: false,
});

const themes = [
  { name: "Light", value: "light", class: "" },
  { name: "Dark", value: "dark", class: "dark" },
  { name: "Blue", value: "blue", class: "theme-blue" },
  { name: "Purple", value: "purple", class: "theme-purple" },
  { name: "Green", value: "green", class: "theme-green" },
];

export default function Home() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className =
        themes.find((t) => t.value === savedTheme)?.class || "";
    }
  }, [setTheme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    const themeClass = themes.find((t) => t.value === newTheme)?.class || "";
    document.documentElement.className = themeClass;
  };

  return (
    <main className="flex flex-col h-screen bg-gradient-to-b from-background to-muted">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl ps-5">OrbitIQ</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/jaakshu/orbitIq--client"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => handleThemeChange(t.value)}
                    className={theme === t.value ? "bg-primary/10" : ""}
                  >
                    {t.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <div className="flex-1 h-[calc(100vh-3.5rem)]">
        <WorkflowBuilder />
      </div>
    </main>
  );
}
