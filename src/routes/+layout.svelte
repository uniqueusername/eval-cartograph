<script lang="ts">
  import faviconLight from "$lib/assets/favicon-light.svg"
  import faviconDark from "$lib/assets/favicon-dark.svg"
  import ThemeToggle from "$lib/components/ThemeToggle.svelte"
  import { theme } from "$lib/theme"
  import "$lib/styles/global.css"

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href={$theme ? faviconDark : faviconLight} />
</svelte:head>

<ThemeToggle />

{@render children()}
