import { derived } from "svelte/store"
import { theme } from "$lib/theme"

function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}

export const colors = derived(theme, () => ({
  bg: getCssVar("--color-bg"),
  text: getCssVar("--color-text"),
  border: getCssVar("--color-border"),
  fog: getCssVar("--color-fog"),
  axis: getCssVar("--color-axis"),
  accent: getCssVar("--color-accent"),
}))
