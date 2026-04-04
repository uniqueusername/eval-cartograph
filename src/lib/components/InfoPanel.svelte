<script lang="ts">
  import Panel from "$lib/components/ui/Panel.svelte"

  type PanelState = "open" | "closing" | "closed" | "opening"

  let desktopState = $state<PanelState>("open")
  let mobileState = $state<PanelState>("open")

  const DURATION = 220

  function close(which: "desktop" | "mobile") {
    if (which === "desktop") {
      desktopState = "closing"
      setTimeout(() => (desktopState = "closed"), DURATION)
    } else {
      mobileState = "closing"
      setTimeout(() => (mobileState = "closed"), DURATION)
    }
  }

  function open(which: "desktop" | "mobile") {
    if (which === "desktop") {
      desktopState = "opening"
      setTimeout(() => (desktopState = "open"), DURATION)
    } else {
      mobileState = "opening"
      setTimeout(() => (mobileState = "open"), DURATION)
    }
  }
</script>

{#snippet socials()}
  <div class="mt-4 flex flex-col gap-1.5 font-neon text-xs lowercase">
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="text-text shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      <a class="text-[var(--color-accent)] underline" href="https://x.com/nonlilynear" target="_blank" rel="noopener">@nonlilynear</a>
    </div>
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="text-text shrink-0"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      <a class="text-[var(--color-accent)] underline" href="https://github.com/nonlilynear" target="_blank" rel="noopener">@nonlilynear</a>
    </div>
  </div>
{/snippet}

<!-- Desktop -->
{#if desktopState !== "closed"}
  <div class={`info-shell hidden xl:block ${desktopState === "closing" ? "info-exit" : ""} ${desktopState === "opening" ? "info-enter" : ""}`}>
    <Panel className="relative">
      <button
        class="absolute bottom-2 right-2 w-5 h-5 flex items-center justify-center font-neon text-xs leading-none text-text border-none bg-transparent cursor-default hover:bg-black/20 active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30 active:scale-90 transition-transform duration-150 ease-out"
        onclick={() => close("desktop")}
      >
        &times;
      </button>
      <div class="mb-4 font-neon text-sm font-semibold tracking-wide lowercase">eval cartograph</div>
        <p class="font-neon lowercase max-w-xs text-wrap">visualize the performance of different models against a set of environments from the prime intellect <a class="text-[var(--color-accent)] underline" href="https://app.primeintellect.ai/dashboard/environments">environments hub</a>. models with similar capability profiles will cluster.</p>
      {@render socials()}
    </Panel>
  </div>
{:else}
  <button
    class="info-button hidden xl:flex active:scale-90 transition-transform duration-150 ease-out"
    onclick={() => open("desktop")}
  >
    i
  </button>
{/if}

<!-- Mobile -->
{#if mobileState !== "closed"}
  <div class={`xl:hidden fixed inset-0 z-50 flex items-center justify-center p-4 ${mobileState === "closing" ? "info-overlay-exit" : ""} ${mobileState === "opening" ? "info-overlay-enter" : ""}`}>
    <Panel className="relative w-full max-w-sm">
      <button
        class="absolute top-2 right-2 w-5 h-5 flex items-center justify-center font-neon text-xs leading-none text-text border-none bg-transparent cursor-default hover:bg-black/20 active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30 active:scale-90 transition-transform duration-150 ease-out"
        onclick={() => close("mobile")}
      >
        &times;
      </button>
      <div class="mb-4 font-neon text-sm font-semibold tracking-wide lowercase">eval cartograph</div>
    <p class="font-neon lowercase max-w-xs text-wrap">visualize the performance of different models against a set of environments from the prime intellect <a class="text-[var(--color-accent)] underline" href="https://app.primeintellect.ai/dashboard/environments">environments hub</a>. models with similar capability profiles will cluster.</p>
      {@render socials()}
    </Panel>
  </div>
{:else}
  <button
    class="xl:hidden info-button active:scale-90 transition-transform duration-150 ease-out"
    onclick={() => open("mobile")}
  >
    i
  </button>
{/if}

<style>
  .info-shell {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 50;
    transform-origin: bottom right;
  }

  .info-exit {
    animation: info-collapse 220ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
    pointer-events: none;
  }

  .info-enter {
    animation: info-expand 220ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
  }

  @keyframes info-collapse {
    from {
      clip-path: inset(0 0 0 0);
      opacity: 1;
    }
    to {
      clip-path: inset(100% 0 0 100%);
      opacity: 1;
    }
  }

  @keyframes info-expand {
    from {
      clip-path: inset(100% 0 0 100%);
      opacity: 1;
    }
    to {
      clip-path: inset(0 0 0 0);
      opacity: 1;
    }
  }

  /* Mobile overlay fade */
  .info-overlay-exit {
    animation: info-fade-out 220ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
    pointer-events: none;
  }

  .info-overlay-enter {
    animation: info-fade-in 220ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
  }

  @keyframes info-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes info-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .info-button {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 50;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-neon);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: default;
    animation: info-button-in 220ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
  }

  .info-button:hover {
    background: color-mix(in srgb, var(--color-text) 10%, var(--color-bg));
  }

  .info-button:active {
    background: color-mix(in srgb, var(--color-text) 20%, var(--color-bg));
  }

  @keyframes info-button-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
