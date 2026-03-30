<script lang="ts">
  import { Canvas } from "@threlte/core"
  import SceneContent from "./SceneContent.svelte"
  import type { EmbeddingPoint } from "$lib/umap"

  interface Props {
    points: EmbeddingPoint[]
    modelNames: string[]
    usePluses: boolean
  }

  let { points, modelNames, usePluses }: Props = $props()

  let hoveredModel: string | null = $state(null)
  let tappedModel: string | null = $state(null)
  let displayModel: string | null = $state(null)
  let mouseX = $state(0)
  let mouseY = $state(0)
  let tapX = $state(0)
  let tapY = $state(0)

  function onhover(model: string | null, event: PointerEvent | null) {
    hoveredModel = model
    if (model) displayModel = model
    if (event) {
      mouseX = event.clientX
      mouseY = event.clientY
    }
  }

  let tapTime = 0

  function ontap(model: string) {
    tapTime = Date.now()
    if (tappedModel === model) {
      tappedModel = null
    } else {
      tappedModel = model
    }
  }

  function dismissTap() {
    if (Date.now() - tapTime > 200) tappedModel = null
  }

  function onproject(x: number, y: number) {
    tapX = x
    tapY = y
  }


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

  function onmousemove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  let active = $derived(!!hoveredModel || !!tappedModel)
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-full h-full" onmousemove={onmousemove} onpointerdown={onpointerdown} onpointerup={onpointerup}>
  <Canvas>
    <SceneContent {points} {modelNames} {usePluses} {tappedModel} {onhover} {ontap} {onproject} />
  </Canvas>

  <!-- hover: follows cursor (devices with hover support) -->
  {#if hoveredModel}
    {#key hoveredModel}
      <div
        class="panel hover-tooltip fixed z-50 pointer-events-none active"
        style="left: {mouseX + 12}px; top: {mouseY + 12}px;"
      >
        <span class="panel-text">{hoveredModel}</span>
      </div>
    {/key}
  {/if}

  <!-- tap: pinned to point (touch devices) -->
  {#if tappedModel}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="panel tap-tooltip fixed z-50 -translate-x-1/2"
      class:active={!!tappedModel}
      style="left: {tapX}px; top: {tapY - 40}px;"
      onclick={dismissTap}
    >
      <span class="panel-text">{tappedModel}</span>
    </div>
  {/if}
</div>

<style>
  .panel {
    background: color-mix(in srgb, var(--color-bg) 50%, transparent);
    transition: background 100ms ease-out;
  }
  .panel.active {
    animation: flash-settle 150ms ease-out forwards;
  }

  @keyframes flash-settle {
    0% { background: color-mix(in srgb, var(--color-bg) 50%, var(--color-text) 20%); }
    100% { background: color-mix(in srgb, var(--color-bg) 50%, transparent); }
  }

  /* hover tooltip: only on devices with a pointer */
  @media (hover: none) {
    .hover-tooltip { display: none; }
  }

  /* tap tooltip + dismiss: only on touch devices */
  @media (hover: hover) {
    .tap-tooltip { display: none; }
  }
</style>
