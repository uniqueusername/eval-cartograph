<script lang="ts">
  let mobileVisible = $state(true)
</script>

<!-- desktop -->
<div class="panel hidden xl:block fixed z-50 bottom-4 right-4">
  <div class="panel-title mb-4">eval cartograph</div>
  <p class="panel-text">hello world</p>
</div>

<!-- mobile popup -->
{#if mobileVisible}
  <div class="xl:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="panel relative w-full max-w-sm">
      <button
        class="absolute top-2 right-2 text-text font-neon text-xs leading-none p-1"
        onclick={() => (mobileVisible = false)}
      >
        &times;
      </button>
      <div class="panel-title mb-4">eval cartograph</div>
      <p class="panel-text">hello world</p>
    </div>
  </div>
{/if}
