<script lang="ts">
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
</script>

<div
  class="fixed top-4 left-4 z-50 max-h-[90vh] overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-3 text-sm text-black dark:text-white shadow-lg"
>
  <div class="flex gap-6">
    <div class="min-w-[140px]">
      <button class="mb-1 font-semibold text-xs uppercase tracking-wide">
        Models ({selectedModels.size}/{modelNames.length})
      </button>
      {#each modelNames as name}
        <label class="flex items-center gap-1.5 py-0.5">
          <input
            type="checkbox"
            checked={selectedModels.has(name)}
            onchange={() => toggleModel(name)}
          />
          <span class="truncate">{name}</span>
        </label>
      {/each}
    </div>

    <div class="min-w-[140px]">
      <button class="mb-1 font-semibold text-xs uppercase tracking-wide">
        Evals ({selectedEvals.size}/{evalNames.length})
      </button>
      {#each evalNames as name}
        <label class="flex items-center gap-1.5 py-0.5">
          <input
            type="checkbox"
            checked={selectedEvals.has(name)}
            onchange={() => toggleEval(name)}
          />
          <span class="truncate">{name}</span>
        </label>
      {/each}
    </div>
  </div>
</div>
