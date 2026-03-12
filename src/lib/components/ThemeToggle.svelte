<script lang="ts">
  import { theme } from "$lib/theme"
</script>

<button
  onclick={() => theme.toggle()}
  class="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:opacity-80"
  aria-label="toggle dark mode">
  {#if $theme}
    🌙
  {:else}
    ☀️
  {/if}
</button>
