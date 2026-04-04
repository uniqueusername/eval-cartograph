<script lang="ts">
  import { getContext } from "svelte"
  import type { EvalResult } from "$lib/umap"

  const haptics = getContext<{ trigger: Function }>("haptics")

  interface Props {
    selectedModels: string[]
    evalResultsByModel: Record<string, EvalResult[]>
    onclear: () => void
    hasUsedTouch: boolean
  }

  let { selectedModels, evalResultsByModel, onclear, hasUsedTouch }: Props = $props()

  let evalColumns = $derived.by<{ evalName: string; displayName: string }[]>(() => {
    const firstModel = selectedModels[0]
    if (!firstModel) return []
    const results = evalResultsByModel[firstModel] ?? []
    return results.map((r) => ({ evalName: r.evalName, displayName: r.displayName }))
  })

  function getScore(model: string, evalIndex: number): number {
    return evalResultsByModel[model]?.[evalIndex]?.score ?? 0
  }

  function formatScore(score: number): string {
    return score.toFixed(2)
  }

  function cellBackground(score: number): string {
    const accentMix = Math.round(12 + Math.max(0, Math.min(1, score)) * 76)
    return `color-mix(in srgb, var(--color-accent) ${accentMix}%, var(--color-bg))`
  }

  function cellTextColor(score: number): string {
    return score >= 0.58 ? "var(--color-bg)" : "var(--color-text)"
  }
</script>

<div class="mobile-comparison">
  <div class="mobile-comparison-header">
    {#if hasUsedTouch}
      <button class="clear-btn font-neon lowercase hover:bg-black/20 active:bg-black/30 dark:hover:bg-white/20 dark:active:bg-white/30 active:scale-90 transition-transform duration-150 ease-out" onclick={() => { haptics.trigger([{ duration: 50, intensity: 1.0 }, { delay: 50, duration: 40, intensity: 0.7 }, { delay: 50, duration: 30, intensity: 0.5 }, { delay: 50, duration: 25, intensity: 0.3 }, { delay: 50, duration: 20, intensity: 0.15 }]); onclear() }}>clear</button>
    {:else}
      <span class="clear-hint font-neon lowercase">press <kbd class="clear-kbd">space</kbd> to clear</span>
    {/if}
  </div>
  <div class="mobile-comparison-scroll">
    <table class="mobile-comparison-table">
      <thead>
        <tr>
          <th class="corner-cell font-neon lowercase"></th>
          {#each evalColumns as col (col.evalName)}
            <th class="eval-header-cell font-neon lowercase" title={col.evalName}>
              <span>{col.displayName}</span>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each selectedModels as model (model)}
          <tr>
            <th class="model-cell font-neon lowercase" title={model}>
              <span>{model}</span>
            </th>
            {#each evalColumns as col, evalIndex (col.evalName)}
              {@const score = getScore(model, evalIndex)}
              <td
                class="score-cell font-neon"
                style={`background: ${cellBackground(score)}; color: ${cellTextColor(score)};`}
                title={formatScore(score)}
              >
                {formatScore(score)}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .mobile-comparison {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .mobile-comparison-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 0.5rem;
    flex-shrink: 0;
  }

  .clear-btn {
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    padding: 0.25rem 0.6rem;
    font-size: 0.62rem;
    cursor: pointer;
  }

  .clear-hint {
    font-size: 0.62rem;
    opacity: 0.82;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .clear-kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.4rem;
    height: 1.1rem;
    padding: 0 0.3rem;
    border: 1px solid color-mix(in srgb, var(--color-border) 75%, transparent);
    background: color-mix(in srgb, var(--color-text) 6%, transparent);
    font: inherit;
    vertical-align: baseline;
  }

  .mobile-comparison-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
    border: 1px solid var(--color-border);
  }

  .mobile-comparison-table {
    border-collapse: separate;
    border-spacing: 0;
    min-width: max-content;
  }

  .mobile-comparison-table th,
  .mobile-comparison-table td {
    height: 1.8rem;
    padding: 0.35rem 0.4rem;
    border-right: 1px solid color-mix(in srgb, var(--color-border) 45%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--color-border) 45%, transparent);
    font-size: 0.58rem;
    line-height: 1.1;
    text-align: center;
    vertical-align: middle;
  }

  .mobile-comparison-table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--color-bg);
  }

  .corner-cell {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 4;
    width: 7rem;
    min-width: 7rem;
    max-width: 7rem;
    overflow: hidden;
    background: var(--color-bg);
    isolation: isolate;
  }

  .corner-cell::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: var(--color-bg);
    pointer-events: none;
  }

  .eval-header-cell {
    z-index: 3;
    width: 4.5rem;
    max-width: 4.5rem;
    min-width: 4.5rem;
    overflow: hidden;
  }

  .eval-header-cell span {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    -webkit-line-clamp: 3;
  }

  .model-cell {
    position: sticky;
    left: 0;
    z-index: 1;
    min-width: 7rem;
    max-width: 7rem;
    text-align: left;
    background: var(--color-bg);
  }

  .model-cell span {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .score-cell {
    width: 4.5rem;
    min-width: 4.5rem;
    max-width: 4.5rem;
    font-size: 0.56rem;
    letter-spacing: 0.01em;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
