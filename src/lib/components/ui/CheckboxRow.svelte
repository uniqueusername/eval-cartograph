<script lang="ts">
  import type { Snippet } from "svelte"

  interface Props {
    checked: boolean
    children: Snippet
    className?: string
    labelClassName?: string
    onchange: () => void
  }

  let {
    checked,
    children,
    className = "",
    labelClassName = "",
    onchange,
  }: Props = $props()
</script>

<label
  class={`checkbox-row flex w-full items-center bg-transparent py-1 transition-transform duration-150 ease-out hover:bg-black/20 active:scale-[0.97] active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30 ${className}`.trim()}
>
  <input type="checkbox" {checked} {onchange} />
  <span class={`font-neon whitespace-nowrap lowercase ${labelClassName}`.trim()}>
    {@render children()}
  </span>
</label>

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
