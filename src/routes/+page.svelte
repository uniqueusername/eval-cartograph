<script lang="ts">
  import { untrack } from "svelte"
  import { alignProcrustes } from "$lib/procrustes"
  import { computePoints } from "$lib/points"
  import type { EvalResult } from "$lib/umap"
  import FilterPanel from "$lib/components/FilterPanel.svelte"
  import DebugPanel from "$lib/components/DebugPanel.svelte"
  import PointCloudScene from "$lib/components/PointCloudScene.svelte"
  import InfoPanel from "$lib/components/InfoPanel.svelte"

  let { data }: {
    data: {
      modelNames: string[]
      evalNames: string[]
      data: number[][]
      evalResultsByModel: Record<string, EvalResult[]>
    }
  } = $props()

  let selectedModels = $state(new Set(untrack(() => data.modelNames)))
  let selectedEvals = $state(new Set(untrack(() => data.evalNames)))
  let usePluses = $state(false)
  let selectedComparisonModels = $state<string[]>([])
  let hasUsedTouch = $state(false)

  function onpointerdown(e: PointerEvent) {
    if (e.pointerType === 'touch') hasUsedTouch = true
  }

  function ontogglecomparison(model: string) {
    if (selectedComparisonModels.includes(model)) {
      selectedComparisonModels = selectedComparisonModels.filter((name) => name !== model)
      return
    }
    selectedComparisonModels = [...selectedComparisonModels, model]
  }

  function clearcomparison() {
    if (selectedComparisonModels.length === 0) return
    selectedComparisonModels = []
  }

  $effect(() => {
    const visibleModels = new Set(points.map((point) => point.model))
    const nextSelectedModels = selectedComparisonModels.filter((model) => visibleModels.has(model))
    if (nextSelectedModels.length !== selectedComparisonModels.length) {
      selectedComparisonModels = nextSelectedModels
    }
  })

  function filterEvalResults(evalsSet: Set<string>): Record<string, EvalResult[]> {
    return Object.fromEntries(
      Object.entries(data.evalResultsByModel).map(([model, results]) => [
        model,
        results.filter((r) => evalsSet.has(r.evalName)),
      ]),
    )
  }

  let filteredEvalResultsByModel = $state(filterEvalResults(untrack(() => selectedEvals)))

  let points = $state(
    computePoints(
      untrack(() => data.modelNames),
      untrack(() => data.evalNames),
      untrack(() => data.data),
      selectedModels,
      selectedEvals,
    ),
  )

  function onFilterChange() {
    const oldPoints = points
    const newPoints = computePoints(
      data.modelNames,
      data.evalNames,
      data.data,
      selectedModels,
      selectedEvals,
    )
    points = alignProcrustes(oldPoints, newPoints)
    filteredEvalResultsByModel = filterEvalResults(selectedEvals)
  }
</script>

<svelte:window {onpointerdown} />

<div class="w-full h-screen bg-bg">
  <FilterPanel
    modelNames={data.modelNames}
    evalNames={data.evalNames}
    {selectedModels}
    {selectedEvals}
    {selectedComparisonModels}
    evalResultsByModel={filteredEvalResultsByModel}
    onclearcomparison={clearcomparison}
    onchange={onFilterChange}
    {hasUsedTouch}
  />

  <InfoPanel />

  {#if hasUsedTouch}
    <div class="fixed top-4 left-4 z-50">
      <div class="font-neon text-[0.6rem] leading-tight lowercase text-text/50 whitespace-pre-line pointer-events-none select-none border border-border bg-bg p-2">tap a point to preview scores
tap and hold to compare</div>
    </div>
  {/if}

  {#if __DEBUG__}
    <DebugPanel {usePluses} onchange={() => (usePluses = !usePluses)} />
  {/if}

  <PointCloudScene
    {points}
    modelNames={data.modelNames}
    evalResultsByModel={filteredEvalResultsByModel}
    usePluses={usePluses}
    {selectedComparisonModels}
    {ontogglecomparison}
    {clearcomparison}
  />
</div>
