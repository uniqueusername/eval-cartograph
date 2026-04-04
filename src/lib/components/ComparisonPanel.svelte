<script lang="ts">
  import { onDestroy } from "svelte"
  import type { EvalResult } from "$lib/umap"

  interface HeatmapRow {
    evalName: string
    displayName: string
    scoresByModel: Record<string, number>
  }

  interface Props {
    selectedModels: string[]
    evalResultsByModel: Record<string, EvalResult[]>
  }

  let { selectedModels, evalResultsByModel }: Props = $props()

  const LABEL_COLUMN_REM = 9.5
  const MODEL_COLUMN_REM = 5.25
  const MAX_VISIBLE_MODEL_COLUMNS = 8
  const COLUMN_ENTRY_DURATION_MS = 260
  const COLUMN_EXIT_DURATION_MS = 220
  const ROW_ENTRY_DURATION_MS = 260
  const ROW_EXIT_DURATION_MS = 220

  // Current eval names from the (filtered) data
  let currentEvalNames = $derived.by(() => {
    const firstModel = renderedModels[0] || selectedModels[0]
    if (!firstModel) return []
    return (evalResultsByModel[firstModel] ?? []).map((r) => r.evalName)
  })

  // Eval row animation state
  let renderedEvals = $state<string[]>([])
  let enteringEvals = $state<string[]>([])
  let exitingEvals = $state<string[]>([])
  let previousEvalNames: string[] = []
  let clearEnteringEvalTimeouts = new Map<string, number>()
  let clearExitingEvalTimeouts = new Map<string, number>()

  $effect(() => {
    const current = currentEvalNames

    const addedEvals = current.filter((e) => !previousEvalNames.includes(e))
    const removedEvals = previousEvalNames.filter((e) => !current.includes(e))

    // Cancel exit for evals that came back
    for (const evalName of current) {
      const exitTimeout = clearExitingEvalTimeouts.get(evalName)
      if (exitTimeout !== undefined) {
        clearTimeout(exitTimeout)
        clearExitingEvalTimeouts.delete(evalName)
      }
    }

    // Initialize rendered evals (no animation on first appearance)
    if (renderedEvals.length === 0 && current.length > 0) {
      renderedEvals = [...current]
      previousEvalNames = [...current]
      return
    }

    // Handle added evals
    for (const evalName of addedEvals) {
      if (!renderedEvals.includes(evalName)) {
        renderedEvals = [...renderedEvals, evalName]
      }
      if (exitingEvals.includes(evalName)) {
        exitingEvals = exitingEvals.filter((e) => e !== evalName)
      }
      if (!enteringEvals.includes(evalName)) {
        enteringEvals = [...enteringEvals, evalName]
      }
      const existing = clearEnteringEvalTimeouts.get(evalName)
      if (existing !== undefined) clearTimeout(existing)
      const tid = window.setTimeout(() => {
        enteringEvals = enteringEvals.filter((e) => e !== evalName)
        clearEnteringEvalTimeouts.delete(evalName)
      }, ROW_ENTRY_DURATION_MS)
      clearEnteringEvalTimeouts.set(evalName, tid)
    }

    // Handle removed evals
    for (const evalName of removedEvals) {
      if (!renderedEvals.includes(evalName) || exitingEvals.includes(evalName)) continue
      exitingEvals = [...exitingEvals, evalName]
      const tid = window.setTimeout(() => {
        renderedEvals = renderedEvals.filter((e) => e !== evalName)
        exitingEvals = exitingEvals.filter((e) => e !== evalName)
        clearExitingEvalTimeouts.delete(evalName)
      }, ROW_EXIT_DURATION_MS)
      clearExitingEvalTimeouts.set(evalName, tid)
    }

    previousEvalNames = [...current]
  })

  // Cache eval data so exiting evals can still render during animation
  let evalDataCache = new Map<string, { displayName: string; scoresByModel: Record<string, number> }>()

  let rows = $derived.by<HeatmapRow[]>(() => {
    // Update cache with current data
    for (const evalName of renderedEvals) {
      const scores: Record<string, number> = {}
      let displayName = evalName
      let found = false
      for (const model of renderedModels) {
        const results = evalResultsByModel[model] ?? []
        const match = results.find((r) => r.evalName === evalName)
        if (match) {
          scores[model] = match.score
          if (!found) { displayName = match.displayName; found = true }
        } else {
          scores[model] = 0
        }
      }
      if (found) {
        evalDataCache.set(evalName, { displayName, scoresByModel: scores })
      }
    }

    return renderedEvals.map((evalName) => {
      const cached = evalDataCache.get(evalName)
      return {
        evalName,
        displayName: cached?.displayName ?? evalName,
        scoresByModel: cached?.scoresByModel ?? {},
      }
    })
  })

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

  let renderedModels = $state<string[]>([])
  let panelMaxWidth = $derived(
    `${LABEL_COLUMN_REM + Math.min(renderedModels.length, MAX_VISIBLE_MODEL_COLUMNS) * MODEL_COLUMN_REM}rem`,
  )

  let enteringModels = $state<string[]>([])
  let exitingModels = $state<string[]>([])
  let clearingAll = $state(false)
  let previousSelectedModels: string[] = []
  let clearEnteringTimeouts = new Map<string, number>()
  let clearExitingTimeouts = new Map<string, number>()
  let clearAllTimeout: number | null = null

  $effect(() => {
    if (clearingAll && selectedModels.length > 0) {
      if (clearAllTimeout !== null) {
        clearTimeout(clearAllTimeout)
        clearAllTimeout = null
      }
      clearingAll = false
    }

    const addedModels = selectedModels.filter((model) => !previousSelectedModels.includes(model))
    const removedModels = previousSelectedModels.filter((model) => !selectedModels.includes(model))
    const isClearingLastModel =
      selectedModels.length === 0 && previousSelectedModels.length > 0 && renderedModels.length > 0

    for (const model of selectedModels) {
      const exitTimeout = clearExitingTimeouts.get(model)
      if (exitTimeout !== undefined) {
        clearTimeout(exitTimeout)
        clearExitingTimeouts.delete(model)
      }
    }

    if (renderedModels.length === 0 && selectedModels.length > 0) {
      renderedModels = [...selectedModels]
    }

    for (const model of addedModels) {
      if (!renderedModels.includes(model)) {
        renderedModels = [...renderedModels, model]
      }

      if (exitingModels.includes(model)) {
        exitingModels = exitingModels.filter((name) => name !== model)
      }

      if (!enteringModels.includes(model)) {
        enteringModels = [...enteringModels, model]
      }

      const existingTimeout = clearEnteringTimeouts.get(model)
      if (existingTimeout !== undefined) {
        clearTimeout(existingTimeout)
      }

      const timeoutId = window.setTimeout(() => {
        enteringModels = enteringModels.filter((name) => name !== model)
        clearEnteringTimeouts.delete(model)
      }, COLUMN_ENTRY_DURATION_MS)

      clearEnteringTimeouts.set(model, timeoutId)
    }

    if (isClearingLastModel) {
      for (const timeoutId of clearExitingTimeouts.values()) {
        clearTimeout(timeoutId)
      }
      clearExitingTimeouts.clear()
      exitingModels = []
      clearingAll = true

      if (clearAllTimeout !== null) {
        clearTimeout(clearAllTimeout)
      }

      clearAllTimeout = window.setTimeout(() => {
        renderedModels = []
        enteringModels = []
        exitingModels = []
        clearingAll = false
        clearAllTimeout = null
      }, COLUMN_EXIT_DURATION_MS)

      previousSelectedModels = [...selectedModels]
      return
    }

    for (const model of removedModels) {
      if (!renderedModels.includes(model) || exitingModels.includes(model)) continue

      exitingModels = [...exitingModels, model]

      const timeoutId = window.setTimeout(() => {
        renderedModels = renderedModels.filter((name) => name !== model)
        exitingModels = exitingModels.filter((name) => name !== model)
        clearExitingTimeouts.delete(model)
      }, COLUMN_EXIT_DURATION_MS)

      clearExitingTimeouts.set(model, timeoutId)
    }

    previousSelectedModels = [...selectedModels]
  })

  onDestroy(() => {
    for (const timeoutId of clearEnteringTimeouts.values()) {
      clearTimeout(timeoutId)
    }
    clearEnteringTimeouts.clear()

    for (const timeoutId of clearExitingTimeouts.values()) {
      clearTimeout(timeoutId)
    }
    clearExitingTimeouts.clear()

    for (const timeoutId of clearEnteringEvalTimeouts.values()) {
      clearTimeout(timeoutId)
    }
    clearEnteringEvalTimeouts.clear()

    for (const timeoutId of clearExitingEvalTimeouts.values()) {
      clearTimeout(timeoutId)
    }
    clearExitingEvalTimeouts.clear()

    if (clearAllTimeout !== null) {
      clearTimeout(clearAllTimeout)
      clearAllTimeout = null
    }
  })
</script>

{#if renderedModels.length > 0}
  <div class={`comparison-shell ${clearingAll ? "panel-exit" : ""}`} style={`max-width: min(calc(100vw - 2rem), ${panelMaxWidth});`}>
    <div class="comparison-tooltip font-neon lowercase">
      press <kbd class="comparison-kbd">space</kbd> to clear
    </div>
    <div class="comparison-scroll">
      <table class="comparison-table">
        <thead>
          <tr>
            <th class="corner-cell font-neon lowercase"></th>
            {#each renderedModels as model (model)}
              <th
                class={`model-cell font-neon lowercase ${enteringModels.includes(model) ? "column-enter" : ""} ${exitingModels.includes(model) ? "column-exit" : ""}`}
                title={model}
              >
                <span>{model}</span>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each rows as row (row.evalName)}
            {@const isRowEntering = enteringEvals.includes(row.evalName)}
            {@const isRowExiting = exitingEvals.includes(row.evalName)}
            <tr class={`${isRowEntering ? "row-enter" : ""} ${isRowExiting ? "row-exit" : ""}`}>
              <th class="eval-cell font-neon lowercase" title={row.evalName}>
                <span>{row.displayName}</span>
              </th>
              {#each renderedModels as model (model)}
                <td
                  class={`score-cell font-neon ${enteringModels.includes(model) ? "column-enter" : ""} ${exitingModels.includes(model) ? "column-exit" : ""}`}
                  style={`background: ${cellBackground(row.scoresByModel[model])}; color: ${cellTextColor(row.scoresByModel[model])};`}
                  title={formatScore(row.scoresByModel[model])}
                >
                  {formatScore(row.scoresByModel[model])}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  .comparison-shell {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    z-index: 50;
    display: none;
    width: fit-content;
    max-height: min(30rem, calc(100vh - 8rem));
    border: 1px solid var(--color-border);
    background: var(--color-bg);
  }

  .panel-exit {
    overflow: hidden;
    animation: panel-exit 220ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
    transform-origin: left bottom;
  }

  .comparison-tooltip {
    position: absolute;
    bottom: calc(100% + 0.45rem);
    left: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.62rem;
    opacity: 0.82;
    white-space: nowrap;
    text-shadow: 0 1px 0 var(--color-bg);
  }

  @media (min-width: 1280px) {
    .comparison-shell {
      display: block;
    }
  }

  .comparison-scroll {
    max-height: inherit;
    overflow: auto;
  }

  .comparison-table {
    border-collapse: separate;
    border-spacing: 0;
    min-width: max-content;
  }

  .comparison-table th,
  .comparison-table td {
    height: 2rem;
    padding: 0.45rem 0.45rem;
    border-right: 1px solid color-mix(in srgb, var(--color-border) 45%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--color-border) 45%, transparent);
    font-size: 0.64rem;
    line-height: 1.1;
    text-align: center;
    vertical-align: middle;
  }

  .comparison-table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--color-bg);
  }

  .comparison-table thead .corner-cell {
    z-index: 8;
  }

  .comparison-table thead .model-cell {
    z-index: 3;
  }

  .corner-cell,
  .eval-cell {
    position: sticky;
    left: 0;
    text-align: left;
    background: var(--color-bg);
  }

  .corner-cell {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 4;
    width: 9.5rem;
    min-width: 9.5rem;
    max-width: 9.5rem;
    overflow: hidden;
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

  .model-cell {
    z-index: 3;
    width: 5.25rem;
    max-width: 5.25rem;
    min-width: 5.25rem;
    overflow: hidden;
  }

  .model-cell span,
  .eval-cell span {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .model-cell span {
    line-clamp: 3;
    -webkit-line-clamp: 3;
  }

  .eval-cell {
    z-index: 1;
    min-width: 9.5rem;
    max-width: 9.5rem;
  }

  .eval-cell span {
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  .score-cell {
    width: 5.25rem;
    min-width: 5.25rem;
    max-width: 5.25rem;
    font-size: 0.62rem;
    letter-spacing: 0.01em;
    overflow: hidden;
    white-space: nowrap;
  }

  .column-enter {
    animation: column-enter 260ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
  }

  @keyframes column-enter {
    from {
      opacity: 0;
      width: 0;
      min-width: 0;
      max-width: 0;
      padding-left: 0;
      padding-right: 0;
      border-right-color: transparent;
    }

    to {
      opacity: 1;
      width: 5.25rem;
      min-width: 5.25rem;
      max-width: 5.25rem;
      padding-left: 0.45rem;
      padding-right: 0.45rem;
      border-right-color: color-mix(in srgb, var(--color-border) 45%, transparent);
    }
  }

  .corner-cell,
  .eval-cell,
  .model-cell,
  .score-cell {
    transition:
      width 220ms cubic-bezier(0.2, 0.86, 0.24, 1),
      min-width 220ms cubic-bezier(0.2, 0.86, 0.24, 1),
      max-width 220ms cubic-bezier(0.2, 0.86, 0.24, 1),
      height 220ms cubic-bezier(0.2, 0.86, 0.24, 1),
      padding 220ms cubic-bezier(0.2, 0.86, 0.24, 1),
      font-size 220ms cubic-bezier(0.2, 0.86, 0.24, 1),
      line-height 220ms cubic-bezier(0.2, 0.86, 0.24, 1),
      opacity 180ms ease,
      border-color 180ms ease;
  }

  .column-exit {
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    border-right-color: transparent !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    opacity: 0;
  }

  .row-enter {
    animation: row-enter 260ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
  }

  @keyframes row-enter {
    from {
      opacity: 0;
      line-height: 0;
    }

    to {
      opacity: 1;
      line-height: 1.1;
    }
  }

  .row-enter > th,
  .row-enter > td {
    animation: row-cell-enter 260ms cubic-bezier(0.2, 0.86, 0.24, 1) both;
  }

  @keyframes row-cell-enter {
    from {
      height: 0;
      padding-top: 0;
      padding-bottom: 0;
      border-bottom-color: transparent;
    }

    to {
      height: 2rem;
      padding-top: 0.45rem;
      padding-bottom: 0.45rem;
      border-bottom-color: color-mix(in srgb, var(--color-border) 45%, transparent);
    }
  }

  .row-exit > th,
  .row-exit > td {
    height: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    border-bottom-color: transparent !important;
    overflow: hidden !important;
    line-height: 0 !important;
    font-size: 0 !important;
  }

  .row-exit {
    opacity: 0;
  }

  @keyframes panel-exit {
    from {
      clip-path: inset(0 0 0 0);
      opacity: 1;
    }

    to {
      clip-path: inset(0 100% 0 0);
      opacity: 1;
    }
  }

  .comparison-kbd {
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
</style>
