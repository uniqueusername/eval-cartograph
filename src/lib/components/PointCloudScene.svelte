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
  let mouseX = $state(0)
  let mouseY = $state(0)

  function onhover(model: string | null, event: PointerEvent | null) {
    hoveredModel = model
    if (event) {
      mouseX = event.clientX
      mouseY = event.clientY
    }
  }

  function onmousemove(e: MouseEvent) {
    if (hoveredModel) {
      mouseX = e.clientX
      mouseY = e.clientY
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-full h-full" onmousemove={onmousemove}>
  <Canvas>
    <SceneContent {points} {modelNames} {usePluses} {onhover} />
  </Canvas>

  {#if hoveredModel}
    <div
      class="panel fixed z-50 pointer-events-none"
      style="left: {mouseX + 12}px; top: {mouseY + 12}px;"
    >
      <span class="panel-text">{hoveredModel}</span>
    </div>
  {/if}
</div>
