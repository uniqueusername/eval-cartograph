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
  let displayModel: string | null = $state(null)
  let mouseX = $state(0)
  let mouseY = $state(0)

  function onhover(model: string | null, event: PointerEvent | null) {
    hoveredModel = model
    if (model) displayModel = model
    if (event) {
      mouseX = event.clientX
      mouseY = event.clientY
    }
  }

  function onmousemove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  let active = $derived(!!hoveredModel)
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-full h-full" onmousemove={onmousemove}>
  <Canvas>
    <SceneContent {points} {modelNames} {usePluses} {onhover} />
  </Canvas>

  {#if displayModel}
    <div
      class="panel fixed z-50 pointer-events-none"
      class:active
      style="left: {mouseX + 12}px; top: {mouseY + 12}px;"
    >
      <span class="panel-text">{displayModel}</span>
    </div>
  {/if}
</div>

<style>
  .panel {
    opacity: 0;
    transition: opacity 100ms ease-out;
  }
  .panel.active {
    animation: pop-settle 150ms ease-out forwards;
  }

  @keyframes pop-settle {
    0% { opacity: 1; }
    100% { opacity: 0.7; }
  }
</style>
