"use client";

import { COLORS, DARK_COLORS } from "@/lib/constants";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function getRandomDarkColor(): string {
  return DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)];
}

export default function useBackground(color?: string) {
  const { theme } = useTheme();

  useEffect(() => {
    if (color) {
      document.body.style.backgroundColor = color;
    } else {
      document.body.style.backgroundColor =
        theme === "dark" ? getRandomDarkColor() : getRandomColor();
    }
  }, [color, theme]);
}
