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

  let tappedModel: string | null = $state(null)
  let tapTime = 0

  let activeModel: string | null = $state(null)
  let tooltipX = $state(0)
  let tooltipY = $state(0)

  function ontap(model: string) {
    tapTime = Date.now()
    if (tappedModel === model) {
      tappedModel = null
    } else {
      tappedModel = model
    }
  }

  function onproject(model: string | null, x: number, y: number) {
    activeModel = model
    tooltipX = x
    tooltipY = y
  }

  const GAP = 12
  let translateX = $derived(tooltipX < window.innerWidth / 2 ? `calc(-100% - ${GAP}px)` : `${GAP}px`)
  let translateY = $derived(tooltipY < window.innerHeight / 2 ? `calc(-100% - ${GAP}px)` : `${GAP}px`)

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
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-full h-full" onpointerdown={onpointerdown} onpointerup={onpointerup}>
  <Canvas>
    <SceneContent {points} {modelNames} {usePluses} {tappedModel} {ontap} {onproject} />
  </Canvas>

  {#if activeModel}
    {#key activeModel}
      <div
        class="panel fixed z-50 pointer-events-none active"
        style="left: {tooltipX}px; top: {tooltipY}px; translate: {translateX} {translateY};"
      >
        <span class="panel-text">{activeModel}</span>
      </div>
    {/key}
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
</style>
