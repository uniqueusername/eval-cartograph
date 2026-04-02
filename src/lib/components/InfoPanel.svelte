<script lang="ts">
  import Panel from "$lib/components/ui/Panel.svelte"

  let desktopVisible = $state(true)
  let mobileVisible = $state(true)
</script>

{#if desktopVisible}
  <Panel className="fixed bottom-4 right-4 z-50 hidden xl:block">
    <button
      class="absolute top-2 right-2 w-5 h-5 flex items-center justify-center font-neon text-xs leading-none text-text border-none bg-transparent cursor-default hover:bg-black/20 active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30 active:scale-90 transition-transform duration-150 ease-out"
      onclick={() => (desktopVisible = false)}
    >
      &times;
    </button>
    <div class="mb-4 font-neon text-sm font-semibold tracking-wide lowercase">eval cartograph</div>
      <p class="font-neon lowercase max-w-xs text-wrap">visualize the performance of different models against a set of environments from the prime intellect <a class="text-[var(--color-accent)] underline" href="https://app.primeintellect.ai/dashboard/environments">environments hub</a>. models with similar capability profiles will cluster.</p>
  </Panel>
{/if}

{#if mobileVisible}
  <div class="xl:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <Panel className="relative w-full max-w-sm">
      <button
        class="absolute top-2 right-2 w-5 h-5 flex items-center justify-center font-neon text-xs leading-none text-text border-none bg-transparent cursor-default hover:bg-black/20 active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30 active:scale-90 transition-transform duration-150 ease-out"
        onclick={() => (mobileVisible = false)}
      >
        &times;
      </button>
      <div class="mb-4 font-neon text-sm font-semibold tracking-wide lowercase">eval cartograph</div>
    <p class="font-neon lowercase max-w-xs text-wrap">visualize the performance of different models against a set of environments from the prime intellect <a class="text-[var(--color-accent)] underline" href="https://app.primeintellect.ai/dashboard/environments">environments hub</a>. models with similar capability profiles will cluster.</p>
    </Panel>
  </div>
{/if}
