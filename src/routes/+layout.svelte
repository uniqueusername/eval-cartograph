<script lang="ts">
  import { onDestroy, setContext } from "svelte"
  import { createWebHaptics } from "web-haptics/svelte"
  import faviconLight from "$lib/assets/favicon-light.svg"
  import faviconDark from "$lib/assets/favicon-dark.svg"
  import ThemeToggle from "$lib/components/ThemeToggle.svelte"
  import { theme } from "$lib/theme"
  import "$lib/styles/global.css"

  const haptics = createWebHaptics()
  setContext("haptics", haptics)
  onDestroy(haptics.destroy)

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href={$theme ? faviconDark : faviconLight} />
</svelte:head>

<ThemeToggle />

{@render children()}
