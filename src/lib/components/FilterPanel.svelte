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

<div class="group fixed top-4 left-4 z-50 flex gap-2">
  <div class="panel min-w-35 w-max">
    <button class="panel-heading">
      models <svg class="w-[14px] h-[8px] transition-transform duration-200 ease-out group-hover:rotate-180" viewBox="-1 -1 14 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polyline points="1,1 6,7 11,1" /></svg>
    </button>
    <div class="panel-collapsible group-hover:grid-rows-[1fr]">
      <div class="overflow-hidden max-h-[80vh] overflow-y-auto pr-[6px] grid">
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
    </div>
  </div>

  <div class="panel min-w-35 w-max">
    <button class="panel-heading">
      evals <svg class="w-[14px] h-[8px] transition-transform duration-200 ease-out group-hover:rotate-180" viewBox="-1 -1 14 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polyline points="1,1 6,7 11,1" /></svg>
    </button>
    <div class="panel-collapsible group-hover:grid-rows-[1fr]">
      <div class="overflow-hidden max-h-[80vh] overflow-y-auto pr-1 grid">
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
</div>
