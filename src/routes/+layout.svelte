<script lang="ts">
  import favicon from "$lib/assets/favicon.svg"
  import ThemeToggle from "$lib/components/ThemeToggle.svelte"

  let { children } = $props()

  import "../app.css"
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ThemeToggle />

{@render children()}
