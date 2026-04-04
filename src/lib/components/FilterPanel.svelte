<script lang="ts">
  import { getContext } from "svelte"
  import SelectionPanel from "$lib/components/SelectionPanel.svelte"
  import MobileComparisonPanel from "$lib/components/MobileComparisonPanel.svelte"
  import type { EvalResult } from "$lib/umap"

  const haptics = getContext<{ trigger: Function }>("haptics")

  interface Props {
    modelNames: string[]
    evalNames: string[]
    selectedModels: Set<string>
    selectedEvals: Set<string>
    selectedComparisonModels: string[]
    evalResultsByModel: Record<string, EvalResult[]>
    onclearcomparison: () => void
    onchange: () => void
    hasUsedTouch: boolean
  }

  let {
    modelNames,
    evalNames,
    selectedModels,
    selectedEvals,
    selectedComparisonModels,
    evalResultsByModel,
    onclearcomparison,
    onchange,
    hasUsedTouch,
  }: Props = $props()

  let mobileExpanded = $state(false)
  let mobileComparisonExpanded = $state(false)

  function toggleFilters() {
    mobileExpanded = !mobileExpanded
    if (mobileExpanded) mobileComparisonExpanded = false
    haptics.trigger("light")
  }

  function toggleComparison() {
    mobileComparisonExpanded = !mobileComparisonExpanded
    if (mobileComparisonExpanded) mobileExpanded = false
    haptics.trigger("light")
  }

  let hasComparison = $derived(selectedComparisonModels.length > 0)

  $effect(() => {
    if (!hasComparison) mobileComparisonExpanded = false
  })

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

{#if mobileExpanded || mobileComparisonExpanded}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="xl:hidden fixed inset-0 z-40"
    onclick={() => { mobileExpanded = false; mobileComparisonExpanded = false }}
    onkeydown={(e) => { if (e.key === 'Escape') { mobileExpanded = false; mobileComparisonExpanded = false } }}
  ></div>
{/if}

<div class="xl:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col">
  <!-- Filters bottom sheet -->
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

  <!-- Comparison bottom sheet -->
  <div
    class="grid transition-[grid-template-rows] duration-200 ease-out"
    class:grid-rows-[0fr]={!mobileComparisonExpanded}
    class:grid-rows-[1fr]={mobileComparisonExpanded}
  >
    <div class="overflow-hidden">
      <div
        class="px-2 pb-2 pt-2 h-[60vh] transition-transform duration-150 ease-out"
        class:translate-y-full={!mobileComparisonExpanded}
        class:translate-y-0={mobileComparisonExpanded}
      >
        <div class="border border-border bg-bg p-3 h-full flex flex-col min-h-0">
          <MobileComparisonPanel
            selectedModels={selectedComparisonModels}
            {evalResultsByModel}
            onclear={onclearcomparison}
            {hasUsedTouch}
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Footer buttons -->
  <div class="flex border-x-0 border-b-0 border-t border-border bg-bg">
    <button
      class="flex-1 p-3 font-neon text-xs font-semibold tracking-wide text-text"
      onclick={toggleFilters}
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
    {#if hasComparison}
      <button
        class="flex-1 border-l border-border p-3 font-neon text-xs font-semibold tracking-wide text-text"
        onclick={toggleComparison}
      >
        <span class="flex items-center justify-center gap-2">
          comparison
          <svg
            class="h-2 w-3.5 transition-transform duration-200 ease-out"
            class:rotate-180={!mobileComparisonExpanded}
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
    {/if}
  </div>
</div>
