import { writable } from "svelte/store"

function createThemeStore() {
  const isDark =
    typeof window !== "undefined"
    && (localStorage.getItem("theme") === "dark"
      || (!localStorage.getItem("theme")
        && window.matchMedia("(prefers-color-scheme: dark)").matches))

  if (isDark) document.documentElement.classList.add("dark")
  const dark = writable(isDark)

  return {
    subscribe: dark.subscribe,
    toggle: () => {
      dark.update((d) => {
        const newDark = !d
        localStorage.setItem("theme", newDark ? "dark" : "light")
        document.documentElement.classList.toggle("dark")
        return newDark
      })
    },
  }
}

export const theme = createThemeStore()
