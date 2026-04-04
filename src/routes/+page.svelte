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
  }
</script>

<div class="w-full h-screen bg-bg">
  <FilterPanel
    modelNames={data.modelNames}
    evalNames={data.evalNames}
    {selectedModels}
    {selectedEvals}
    {selectedComparisonModels}
    evalResultsByModel={data.evalResultsByModel}
    onclearcomparison={clearcomparison}
    onchange={onFilterChange}
  />

  <InfoPanel />

  {#if __DEBUG__}
    <DebugPanel {usePluses} onchange={() => (usePluses = !usePluses)} />
  {/if}

  <PointCloudScene
    {points}
    modelNames={data.modelNames}
    evalResultsByModel={data.evalResultsByModel}
    usePluses={usePluses}
    {selectedComparisonModels}
    {ontogglecomparison}
    {clearcomparison}
  />
</div>
