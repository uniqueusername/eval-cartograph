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

  let mobileExpanded = $state(false)

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

<!-- desktop -->
<div class="group hidden xl:flex fixed top-4 left-4 z-50 gap-2">
  <div class="panel min-w-35 w-max">
    <button class="panel-heading">
      models <svg class="w-3.5 h-2 transition-transform duration-200 ease-out group-hover:rotate-180" viewBox="-1 -1 14 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polyline points="1,1 6,7 11,1" /></svg>
    </button>
    <div class="panel-collapsible group-hover:grid-rows-[1fr]">
      <div class="overflow-hidden max-h-[80vh] overflow-y-auto pr-1.5 grid">
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
      evals <svg class="w-3.5 h-2 transition-transform duration-200 ease-out group-hover:rotate-180" viewBox="-1 -1 14 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><polyline points="1,1 6,7 11,1" /></svg>
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

<!-- mobile -->
<div class="xl:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col">
  <div
    class="grid transition-[grid-template-rows] duration-200 ease-out"
    class:grid-rows-[0fr]={!mobileExpanded}
    class:grid-rows-[1fr]={mobileExpanded}
  >
    <div class="overflow-hidden">
      <div
        class="flex gap-2 px-2 pb-2 pt-2 max-h-[60vh] transition-transform duration-150 ease-out"
        class:translate-y-full={!mobileExpanded}
        class:translate-y-0={mobileExpanded}
      >
        <div class="panel flex-1 min-w-0 flex flex-col overflow-hidden">
          <div class="panel-heading">models</div>
          <div class="overflow-y-auto overflow-x-hidden flex-1">
            {#each modelNames as name}
              <label class="panel-checkbox-label mr-0">
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
        <div class="panel flex-1 min-w-0 flex flex-col overflow-hidden">
          <div class="panel-heading">evals</div>
          <div class="overflow-y-auto overflow-x-hidden flex-1">
            {#each evalNames as name}
              <label class="panel-checkbox-label mr-0">
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
  </div>

  <button
    class="panel w-full border-b-0 border-l-0 border-r-0 flex items-center justify-center gap-2 font-neon text-xs font-semibold tracking-wide"
    onclick={() => (mobileExpanded = !mobileExpanded)}
  >
    filters
    <svg
      class="w-3.5 h-2 transition-transform duration-200 ease-out"
      class:rotate-180={!mobileExpanded}
      viewBox="-1 -1 14 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"
    ><polyline points="1,1 6,7 11,1" /></svg>
  </button>
</div>
