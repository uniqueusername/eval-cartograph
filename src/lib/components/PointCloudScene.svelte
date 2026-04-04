<script lang="ts">
  import type { EvalResult } from "$lib/umap"
  import { Canvas } from "@threlte/core"
  import SceneContent from "./SceneContent.svelte"
  import type { EmbeddingPoint } from "$lib/umap"
  import ModelTooltip from "./ModelTooltip.svelte"
  import ComparisonPanel from "./ComparisonPanel.svelte"

  interface Props {
    points: EmbeddingPoint[]
    modelNames: string[]
    evalResultsByModel: Record<string, EvalResult[]>
    usePluses: boolean
    selectedComparisonModels: string[]
    ontogglecomparison: (model: string) => void
    clearcomparison: () => void
  }

  let { points, modelNames, evalResultsByModel, usePluses, selectedComparisonModels, ontogglecomparison, clearcomparison }: Props = $props()

  let activeModel: string | null = $state(null)
  let tooltipX = $state(0)
  let tooltipY = $state(0)
  let tooltipFog = $state(1)

  function onproject(model: string | null, x: number, y: number, fogFactor: number = 1) {
    activeModel = model
    tooltipX = x
    tooltipY = y
    tooltipFog = fogFactor
  }

  const GAP = 12
  let isMobile = $derived(window.innerWidth < 768)
  // desktop: push tooltip away from center (towards outer corner)
  // mobile: push tooltip towards center (inverted) and scale down 50%
  let translateX = $derived(
    isMobile
      ? tooltipX < window.innerWidth / 2 ? `${GAP}px` : `calc(-100% - ${GAP}px)`
      : tooltipX < window.innerWidth / 2 ? `calc(-100% - ${GAP}px)` : `${GAP}px`
  )
  let translateY = $derived(
    tooltipY < window.innerHeight / 2 ? `calc(-100% - ${GAP}px)` : `${GAP}px`
  )
  let tooltipScale = $derived(isMobile ? 'scale(0.8)' : '')
  let tooltipOpacity = $derived(tooltipFog)
  let activeEvalResults = $derived(activeModel ? evalResultsByModel[activeModel] ?? [] : [])
  let animateBars = $state(false)
  let barAnimationFrame: number | null = null

  const MAX_VISIBLE_EVALS = 4

  function getVisibleEvalResults(evalResults: EvalResult[]): EvalResult[] {
    const sorted = [...evalResults].sort((a, b) => b.score - a.score)
    if (sorted.length <= MAX_VISIBLE_EVALS) return sorted
    return [...sorted.slice(0, 2), ...sorted.slice(-2)]
  }

  let visibleEvalResults = $derived(getVisibleEvalResults(activeEvalResults))
  let isEvalResultsTruncated = $derived(activeEvalResults.length > MAX_VISIBLE_EVALS)

  $effect(() => {
    if (barAnimationFrame !== null) {
      cancelAnimationFrame(barAnimationFrame)
      barAnimationFrame = null
    }

    if (!activeModel || visibleEvalResults.length === 0) {
      animateBars = false
      return
    }

    animateBars = false
    barAnimationFrame = requestAnimationFrame(() => {
      animateBars = true
      barAnimationFrame = null
    })

    return () => {
      if (barAnimationFrame !== null) {
        cancelAnimationFrame(barAnimationFrame)
        barAnimationFrame = null
      }
    }
  })

  function onkeydown(event: KeyboardEvent) {
    if (event.code !== "Space") return
    const target = event.target
    if (target instanceof HTMLElement) {
      if (
        target.isContentEditable ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        return
      }
      // Blur buttons/checkboxes so spacebar always triggers clearcomparison
      if (target.tagName === "BUTTON" || target.tagName === "INPUT") {
        target.blur()
      }
    }

    event.preventDefault()
    clearcomparison()
  }
</script>

<svelte:window onkeydown={onkeydown} />

<div class="w-full h-full">
  <Canvas>
    <SceneContent
      {points}
      {modelNames}
      {usePluses}
      {isMobile}
      {selectedComparisonModels}
      {ontogglecomparison}
      {onproject}
    />
  </Canvas>

  {#if activeModel}
    <ModelTooltip
      {activeModel}
      {animateBars}
      {isEvalResultsTruncated}
      tooltipFog={tooltipOpacity}
      {tooltipScale}
      {tooltipX}
      {tooltipY}
      {translateX}
      {translateY}
      {visibleEvalResults}
    />
  {/if}

  <ComparisonPanel selectedModels={selectedComparisonModels} {evalResultsByModel} />
</div>
