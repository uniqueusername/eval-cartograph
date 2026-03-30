<script lang="ts">
  import type { EvalResult } from "$lib/umap"
  import { Canvas } from "@threlte/core"
  import SceneContent from "./SceneContent.svelte"
  import type { EmbeddingPoint } from "$lib/umap"

  interface Props {
    points: EmbeddingPoint[]
    modelNames: string[]
    evalResultsByModel: Record<string, EvalResult[]>
    usePluses: boolean
  }

  let { points, modelNames, evalResultsByModel, usePluses }: Props = $props()

  let tappedModel: string | null = $state(null)
  let tapTime = 0

  let activeModel: string | null = $state(null)
  let tooltipX = $state(0)
  let tooltipY = $state(0)
  let tooltipFog = $state(1)

  function ontap(model: string) {
    tapTime = Date.now()
    if (tappedModel === model) {
      tappedModel = null
    } else {
      tappedModel = model
    }
  }

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
    isMobile
      ? tooltipY < window.innerHeight / 2 ? `${GAP}px` : `calc(-100% - ${GAP}px)`
      : tooltipY < window.innerHeight / 2 ? `calc(-100% - ${GAP}px)` : `${GAP}px`
  )
  let tooltipScale = $derived(isMobile ? 'scale(0.8)' : '')
  let tooltipOpacity = $derived(tooltipFog)
  let activeEvalResults = $derived(activeModel ? evalResultsByModel[activeModel] ?? [] : [])
  let animateBars = $state(false)
  let barAnimationFrame: number | null = null

  const MAX_VISIBLE_EVALS = 4
  const SCORE_INSIDE_THRESHOLD = 0.78

  function formatScore(score: number): string {
    return score.toFixed(2)
  }

  function getVisibleEvalResults(evalResults: EvalResult[]): EvalResult[] {
    const sorted = [...evalResults].sort((a, b) => b.score - a.score)
    if (sorted.length <= MAX_VISIBLE_EVALS) return sorted
    return [...sorted.slice(0, 2), ...sorted.slice(-2)]
  }

  let visibleEvalResults = $derived(getVisibleEvalResults(activeEvalResults))
  let isEvalResultsTruncated = $derived(activeEvalResults.length > MAX_VISIBLE_EVALS)

  let downX = 0
  let downY = 0
  const TAP_THRESHOLD = 10

  function onpointerdown(e: PointerEvent) {
    downX = e.clientX
    downY = e.clientY
  }

  function onpointerup(e: PointerEvent) {
    if (!tappedModel) return
    const dx = e.clientX - downX
    const dy = e.clientY - downY
    if (dx * dx + dy * dy < TAP_THRESHOLD * TAP_THRESHOLD && Date.now() - tapTime > 200) {
      tappedModel = null
    }
  }

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
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-full h-full" onpointerdown={onpointerdown} onpointerup={onpointerup}>
  <Canvas>
    <SceneContent {points} {modelNames} {usePluses} {tappedModel} {ontap} {onproject} />
  </Canvas>

  {#if activeModel}
    {#key activeModel}
      <div
        class="panel fixed z-50 pointer-events-none"
        style="left: {tooltipX}px; top: {tooltipY}px; translate: {translateX} {translateY}; transform: {tooltipScale}; transform-origin: {tooltipX < window.innerWidth / 2 ? 'left' : 'right'} {tooltipY < window.innerHeight / 2 ? 'top' : 'bottom'}; opacity: {tooltipOpacity};"
      >
        <div class="tooltip-shell">
          <span class="panel-text tooltip-title">{activeModel}</span>

          {#if visibleEvalResults.length > 0}
            <div class="tooltip-chart">
              {#each visibleEvalResults as result, index}
                {#if isEvalResultsTruncated && index === 2}
                  <div class="tooltip-gap panel-text">...</div>
                {/if}

                <div class="tooltip-row">
                  <span class="panel-text tooltip-label">{result.displayName}</span>

                  <div class="tooltip-track">
                    <div
                      class="tooltip-bar"
                      style="width: {animateBars ? Math.max(0, Math.min(1, result.score)) * 100 : 0}%;"
                    >
                      {#if result.score >= SCORE_INSIDE_THRESHOLD}
                        <span class="panel-text tooltip-score-inline tooltip-score-inside">
                          {formatScore(result.score)}
                        </span>
                      {/if}
                    </div>

                    {#if result.score < SCORE_INSIDE_THRESHOLD}
                      <span
                        class="panel-text tooltip-score tooltip-score-outside"
                        style="left: min(calc({Math.max(0, Math.min(1, result.score)) * 100}% + 0.35rem), calc(100% - 2.55rem));"
                      >
                        {formatScore(result.score)}
                      </span>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/key}
  {/if}
</div>

<style>
  .panel {
    background: var(--color-bg);
  }

  .tooltip-shell {
    min-width: 23rem;
  }

  .tooltip-title {
    display: block;
    margin-bottom: 0.6rem;
    max-width: 28rem;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .tooltip-chart {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .tooltip-gap {
    display: grid;
    grid-template-columns: 6.4rem minmax(0, 1fr);
    align-items: center;
    gap: 0.6rem;
    font-size: 0.62rem;
    opacity: 0.7;
  }

  .tooltip-gap::before {
    content: "";
  }

  .tooltip-gap {
    text-align: center;
  }

  .tooltip-row {
    display: grid;
    grid-template-columns: 6.4rem minmax(0, 1fr);
    align-items: center;
    gap: 0.6rem;
  }

  .tooltip-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tooltip-track {
    position: relative;
    height: 1rem;
    background: color-mix(in srgb, var(--color-text) 15%, transparent);
    overflow: hidden;
  }

  .tooltip-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    max-width: 100%;
    height: 100%;
    padding-right: 0.25rem;
    background: var(--color-accent);
    transition: width 300ms cubic-bezier(0.12, 0.9, 0.18, 1);
  }

  .tooltip-score {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.62rem;
    line-height: 1;
    pointer-events: none;
  }

  .tooltip-score-inline {
    font-size: 0.62rem;
    line-height: 1;
    pointer-events: none;
  }

  .tooltip-score-inside {
    display: block;
    color: var(--color-bg);
  }

  .tooltip-score-outside {
    color: var(--color-text);
  }

  @media (max-width: 767px) {
    .tooltip-shell {
      min-width: 18.5rem;
    }

    .tooltip-row {
      grid-template-columns: 5.2rem minmax(0, 1fr);
      gap: 0.45rem;
    }

    .tooltip-gap {
      grid-template-columns: 5.2rem minmax(0, 1fr);
      gap: 0.45rem;
    }
  }
</style>
