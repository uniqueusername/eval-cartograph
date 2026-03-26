<script lang="ts">
  import { alignProcrustes } from "$lib/procrustes"
  import { computePoints } from "$lib/points"
  import FilterPanel from "$lib/components/FilterPanel.svelte"
  import DebugPanel from "$lib/components/DebugPanel.svelte"
  import PointCloudScene from "$lib/components/PointCloudScene.svelte"
    import InfoPanel from "$lib/components/InfoPanel.svelte"

  let { data } = $props()

  const modelNames: string[] = data.modelNames
  const evalNames: string[] = data.evalNames
  const matrixData: number[][] = data.data
  let selectedModels = $state(new Set(modelNames))
  let selectedEvals = $state(new Set(evalNames))
  let usePluses = $state(false)

  let points = $state(
    computePoints(
      modelNames,
      evalNames,
      matrixData,
      selectedModels,
      selectedEvals,
    ),
  )

  function onFilterChange() {
    const oldPoints = points
    const newPoints = computePoints(
      modelNames,
      evalNames,
      matrixData,
      selectedModels,
      selectedEvals,
    )
    points = alignProcrustes(oldPoints, newPoints)
  }
</script>

<div class="w-full h-screen bg-bg">
  <FilterPanel
    {modelNames}
    {evalNames}
    {selectedModels}
    {selectedEvals}
    onchange={onFilterChange}
  />

  <InfoPanel />

  {#if __DEBUG__}
    <DebugPanel {usePluses} onchange={() => (usePluses = !usePluses)} />
  {/if}

  <PointCloudScene {points} {modelNames} usePluses={usePluses} />
</div>
