<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"

  interface Props extends HTMLAttributes<HTMLElement> {
    children: Snippet
    className?: string
    style?: string
    tag?: keyof HTMLElementTagNameMap
  }

  let { children, className = "", tag = "div", ...rest }: Props = $props()
</script>

<svelte:element
  this={tag}
  {...rest}
  class={`border border-border bg-bg p-3 text-sm text-text ${className}`.trim()}
>
  {@render children()}
</svelte:element>
