<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    checked: boolean
    children: Snippet
    className?: string
    href?: string
    labelClassName?: string
    onchange: () => void
  }

  let {
    checked,
    children,
    className = "",
    href,
    labelClassName = "",
    onchange,
  }: Props = $props()
</script>

<div class={`checkbox-row flex w-full items-center ${className}`.trim()}>
  <label
    class="flex flex-1 items-center bg-transparent py-1 pr-2 transition-transform duration-150 ease-out hover:bg-black/20 active:scale-[0.97] active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30"
  >
    <input type="checkbox" {checked} {onchange} />
    <span class={`font-neon whitespace-nowrap lowercase ${labelClassName}`.trim()}>
      {@render children()}
    </span>
  </label>
  {#if href}
    <a
      {href}
      target="_blank"
      rel="noopener noreferrer"
      class="ml-1 flex-shrink-0 flex items-center justify-center w-6 h-6 text-text cursor-default hover:bg-black/20 active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30 active:scale-90 transition-transform duration-150 ease-out"
    >
      <svg class="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
        <path d="M1 9L9 1" />
        <path d="M4 1h5v5" />
      </svg>
    </a>
  {/if}
</div>

<style>
  .checkbox-row input[type="checkbox"] {
    appearance: none;
    margin-inline: 0.5rem;
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
    border: 1px solid var(--color-accent);
    border-radius: 9999px;
    background: transparent;
  }

  .checkbox-row input[type="checkbox"]:checked {
    background: var(--color-accent);
  }

</style>
