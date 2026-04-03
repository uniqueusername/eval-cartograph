<script lang="ts">
  import Panel from "$lib/components/ui/Panel.svelte"
  import type { EvalResult } from "$lib/umap"

  interface Props {
    activeModel: string
    animateBars: boolean
    isEvalResultsTruncated: boolean
    tooltipFog: number
    tooltipScale: string
    tooltipX: number
    tooltipY: number
    translateX: string
    translateY: string
    visibleEvalResults: EvalResult[]
  }

  const SCORE_INSIDE_THRESHOLD = 0.78

  let {
    activeModel,
    animateBars,
    isEvalResultsTruncated,
    tooltipFog,
    tooltipScale,
    tooltipX,
    tooltipY,
    translateX,
    translateY,
    visibleEvalResults,
  }: Props = $props()

  function formatScore(score: number): string {
    return score.toFixed(2)
  }

  function normalizedWidth(score: number): number {
    return Math.max(0, Math.min(1, score)) * 100
  }
</script>

<Panel
  className="pointer-events-none fixed z-30"
  style={`left: ${tooltipX}px; top: ${tooltipY}px; translate: ${translateX} ${translateY}; transform: ${tooltipScale}; transform-origin: ${tooltipX < window.innerWidth / 2 ? "left" : "right"} ${tooltipY < window.innerHeight / 2 ? "top" : "bottom"}; opacity: ${tooltipFog};`}
>
  <div class="tooltip-shell">
    <span class="tooltip-title font-neon lowercase">{activeModel}</span>

    {#if visibleEvalResults.length > 0}
      <div class="flex flex-col gap-[0.35rem]">
        {#each visibleEvalResults as result, index}
          {#if isEvalResultsTruncated && index === 2}
            <div class="tooltip-row tooltip-gap font-neon text-[0.62rem] lowercase opacity-70">
              <span aria-hidden="true"></span>
              <span class="text-center">...</span>
            </div>
          {/if}

          <div class="tooltip-row">
            <span class="truncate font-neon lowercase">{result.displayName}</span>

            <div class="tooltip-track">
              <div
                class="tooltip-bar"
                style={`width: ${animateBars ? normalizedWidth(result.score) : 0}%;`}
              >
                {#if result.score >= SCORE_INSIDE_THRESHOLD}
                  <span class="font-neon text-[0.62rem] leading-none lowercase text-bg">
                    {formatScore(result.score)}
                  </span>
                {/if}
              </div>

              {#if result.score < SCORE_INSIDE_THRESHOLD}
                <span
                  class="tooltip-score font-neon text-[0.62rem] leading-none lowercase text-text"
                  style={`left: min(calc(${normalizedWidth(result.score)}% + 0.35rem), calc(100% - 2.55rem));`}
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
</Panel>

<style>
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

  .tooltip-row {
    display: grid;
    grid-template-columns: 6.4rem minmax(0, 1fr);
    align-items: center;
    gap: 0.6rem;
  }

  .tooltip-track {
    position: relative;
    height: 1rem;
    overflow: hidden;
    background: color-mix(in srgb, var(--color-text) 15%, transparent);
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
    pointer-events: none;
  }

  @media (max-width: 767px) {
    .tooltip-shell {
      min-width: 18.5rem;
    }

    .tooltip-row {
      grid-template-columns: 5.2rem minmax(0, 1fr);
      gap: 0.45rem;
    }
  }
</style>
