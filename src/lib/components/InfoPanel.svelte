<script lang="ts">
  import Panel from "$lib/components/ui/Panel.svelte"

  let mobileVisible = $state(true)
</script>

<Panel className="fixed bottom-4 right-4 z-50 hidden xl:block">
  <div class="mb-4 font-neon text-sm font-semibold tracking-wide lowercase">eval cartograph</div>
  <p class="font-neon whitespace-nowrap lowercase">hello world</p>
</Panel>

{#if mobileVisible}
  <div class="xl:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <Panel className="relative w-full max-w-sm">
      <button
        class="absolute top-2 right-2 p-1 font-neon text-xs leading-none text-text"
        onclick={() => (mobileVisible = false)}
      >
        &times;
      </button>
      <div class="mb-4 font-neon text-sm font-semibold tracking-wide lowercase">eval cartograph</div>
      <p class="font-neon whitespace-nowrap lowercase">hello world</p>
    </Panel>
  </div>
{/if}
