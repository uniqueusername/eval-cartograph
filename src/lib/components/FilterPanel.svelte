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

<div class="panel top-4 left-4 max-h-[90vh] overflow-y-auto">
  <div class="flex gap-6">
    <div class="min-w-35">
      <button class="panel-heading">
        Models ({selectedModels.size}/{modelNames.length})
      </button>
      {#each modelNames as name}
        <label class="panel-checkbox-label">
          <input
            type="checkbox"
            checked={selectedModels.has(name)}
            onchange={() => toggleModel(name)}
          />
          <span class="panel-checkbox-text">{name}</span>
        </label>
      {/each}
    </div>

    <div class="min-w-35">
      <button class="panel-heading">
        Evals ({selectedEvals.size}/{evalNames.length})
      </button>
      {#each evalNames as name}
        <label class="panel-checkbox-label">
          <input
            type="checkbox"
            checked={selectedEvals.has(name)}
            onchange={() => toggleEval(name)}
          />
          <span class="panel-checkbox-text">{name}</span>
        </label>
      {/each}
    </div>
  </div>
</div>
