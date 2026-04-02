<script lang="ts">
  import SelectionPanel from "$lib/components/SelectionPanel.svelte"

  interface Props {
    modelNames: string[]
    evalNames: string[]
    selectedModels: Set<string>
    selectedEvals: Set<string>
    onchange: () => void
  }

  let {
    modelNames,
    evalNames,
    selectedModels,
    selectedEvals,
    onchange,
  }: Props = $props()

  let mobileExpanded = $state(false)

  function toggleModel(name: string) {
    if (selectedModels.has(name)) selectedModels.delete(name)
    else selectedModels.add(name)
    onchange()
  }

  function toggleEval(name: string) {
    if (selectedEvals.has(name)) selectedEvals.delete(name)
    else selectedEvals.add(name)
    onchange()
  }

  function modelLabel(name: string, index: number): string {
    return `${name} [${index}]`
  }

  function evalHref(name: string): string {
    return `https://app.primeintellect.ai/dashboard/environments/${name}`
  }
</script>

<div class="group hidden xl:flex fixed top-4 left-4 z-50 gap-2">
  <SelectionPanel
    title="models"
    items={modelNames}
    selected={selectedModels}
    toggle={toggleModel}
    labelFor={modelLabel}
    showCaret={true}
    panelClassName="min-w-35 w-max"
    collapsibleClassName="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out group-hover:grid-rows-[1fr]"
    bodyClassName="max-h-[80vh] overflow-y-auto pr-1.5"
  />

  <SelectionPanel
    title="evals"
    items={evalNames}
    selected={selectedEvals}
    toggle={toggleEval}
    hrefFor={evalHref}
    showCaret={true}
    panelClassName="min-w-35 w-max"
    collapsibleClassName="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out group-hover:grid-rows-[1fr]"
    bodyClassName="max-h-[80vh] overflow-y-auto pr-1"
  />
</div>

{#if mobileExpanded}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="xl:hidden fixed inset-0 z-40"
    onclick={() => (mobileExpanded = false)}
    onkeydown={(e) => e.key === 'Escape' && (mobileExpanded = false)}
  ></div>
{/if}

<div class="xl:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col">
  <div
    class="grid transition-[grid-template-rows] duration-200 ease-out"
    class:grid-rows-[0fr]={!mobileExpanded}
    class:grid-rows-[1fr]={mobileExpanded}
  >
    <div class="overflow-hidden">
      <div
        class="flex flex-col gap-2 px-2 pb-2 pt-2 h-[60vh] transition-transform duration-150 ease-out"
        class:translate-y-full={!mobileExpanded}
        class:translate-y-0={mobileExpanded}
      >
        <SelectionPanel
          title="models"
          items={modelNames}
          selected={selectedModels}
          toggle={toggleModel}
          labelFor={modelLabel}
          panelClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
          collapsibleClassName="flex flex-1 flex-col min-h-0"
          bodyClassName="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        />
        <SelectionPanel
          title="evals"
          items={evalNames}
          selected={selectedEvals}
          toggle={toggleEval}
          hrefFor={evalHref}
          panelClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
          collapsibleClassName="flex flex-1 flex-col min-h-0"
          bodyClassName="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        />
      </div>
    </div>
  </div>

  <button
    class="border-x-0 border-b-0 border-t border-border bg-bg p-3 font-neon text-xs font-semibold tracking-wide text-text"
    onclick={() => (mobileExpanded = !mobileExpanded)}
  >
    <span class="flex items-center justify-center gap-2">
      filters
      <svg
        class="h-2 w-3.5 transition-transform duration-200 ease-out"
        class:rotate-180={!mobileExpanded}
        viewBox="-1 -1 14 10"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="square"
        stroke-linejoin="miter"
      >
        <polyline points="1,1 6,7 11,1" />
      </svg>
    </span>
  </button>
</div>
