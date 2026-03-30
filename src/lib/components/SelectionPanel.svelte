<script lang="ts">
  import Panel from "$lib/components/ui/Panel.svelte"
  import CheckboxRow from "$lib/components/ui/CheckboxRow.svelte"

  interface Props {
    items: string[]
    selected: Set<string>
    title: string
    toggle: (name: string) => void
    bodyClassName?: string
    collapsibleClassName?: string
    headingClassName?: string
    labelFor?: (name: string, index: number) => string
    panelClassName?: string
    showCaret?: boolean
  }

  let {
    items,
    selected,
    title,
    toggle,
    bodyClassName = "",
    collapsibleClassName = "",
    headingClassName = "",
    labelFor = (name: string) => name,
    panelClassName = "",
    showCaret = false,
  }: Props = $props()
</script>

<Panel className={panelClassName}>
  <div
    class={`mb-1 flex w-full items-center justify-between font-neon text-xs font-semibold tracking-wide ${headingClassName}`.trim()}
  >
    <span>{title}</span>

    {#if showCaret}
      <svg
        class="h-2 w-3.5 transition-transform duration-200 ease-out group-hover:rotate-180"
        viewBox="-1 -1 14 10"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="square"
        stroke-linejoin="miter"
      >
        <polyline points="1,1 6,7 11,1" />
      </svg>
    {/if}
  </div>

  <div class={`collapsible ${collapsibleClassName}`.trim()}>
    <div class={`grid overflow-hidden ${bodyClassName}`.trim()}>
      {#each items as item, index}
        <CheckboxRow checked={selected.has(item)} onchange={() => toggle(item)}>
          {labelFor(item, index)}
        </CheckboxRow>
      {/each}
    </div>
  </div>
</Panel>

<style>
  .collapsible::-webkit-scrollbar {
    width: 4px;
  }

  .collapsible::-webkit-scrollbar-track {
    background: transparent;
  }

  .collapsible::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 0;
  }

  @supports not selector(::-webkit-scrollbar) {
    .collapsible {
      scrollbar-color: var(--color-border) transparent;
      scrollbar-width: thin;
    }
  }
</style>
