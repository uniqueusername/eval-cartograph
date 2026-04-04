<script lang="ts">
  import { T, useThrelte } from "@threlte/core"
  import { Billboard, interactivity, OrbitControls, Text } from "@threlte/extras"
  import { useTask } from "@threlte/core"
  import { Vector3, PlaneGeometry } from "three"
  import { getContext } from "svelte"
  import { colors } from "$lib/colors"
  import { CAMERA_DISTANCE } from "$lib/points"
  import type { EmbeddingPoint } from "$lib/umap"

  const haptics = getContext<{ trigger: Function }>("haptics")

  interface Props {
    points: EmbeddingPoint[]
    modelNames: string[]
    usePluses: boolean
    isMobile: boolean
    selectedComparisonModels: string[]
    ontogglecomparison: (model: string) => void
    onproject: (model: string | null, x: number, y: number, fogFactor?: number) => void
  }

  let {
    points,
    modelNames,
    usePluses,
    isMobile,
    selectedComparisonModels,
    ontogglecomparison,
    onproject,
  }: Props = $props()

  interactivity()

  const { camera, renderer } = useThrelte()
  const projVec = new Vector3()

  let hoveredModel: string | null = $state(null)
  let tappedModel: string | null = $state(null)

  let activeModel = $derived(isMobile ? tappedModel : hoveredModel)
  let activePoint = $derived(activeModel ? points.find((p) => p.model === activeModel) : null)
  let selectedModelSet = $derived(new Set(selectedComparisonModels))

  // Long-press detection for mobile model selection
  const LONG_PRESS_MS = 400
  const LONG_PRESS_MOVE_THRESHOLD = 5
  let pressTimer: number | null = null
  let pressStartX = 0
  let pressStartY = 0
  let didLongPress = false
  let pressedModel: string | null = null

  function startLongPress(model: string, e: PointerEvent) {
    if (!isMobile) return
    pressedModel = model
    pressStartX = e.clientX
    pressStartY = e.clientY
    didLongPress = false
    pressTimer = window.setTimeout(() => {
      didLongPress = true
      ontogglecomparison(model)
      haptics.trigger("medium")
      pressTimer = null
    }, LONG_PRESS_MS)
  }

  function cancelLongPress() {
    if (pressTimer !== null) {
      clearTimeout(pressTimer)
      pressTimer = null
    }
    pressedModel = null
  }

  function onWindowPointerMove(e: PointerEvent) {
    if (pressTimer === null) return
    const dx = e.clientX - pressStartX
    const dy = e.clientY - pressStartY
    if (Math.abs(dx) > LONG_PRESS_MOVE_THRESHOLD || Math.abs(dy) > LONG_PRESS_MOVE_THRESHOLD) {
      cancelLongPress()
    }
  }

  function onWindowPointerUp() {
    cancelLongPress()
  }

  const FOG_NEAR = 0
  const FOG_FAR = 2500

  useTask(() => {
    if (!activePoint || !activeModel) {
      onproject(null, 0, 0)
      return
    }
    projVec.set(activePoint.x, activePoint.y, activePoint.z)
    // compute view-space z depth to match Three.js linear fog calculation
    projVec.applyMatrix4(camera.current.matrixWorldInverse)
    const dist = -projVec.z
    const fogFactor = Math.max(0, Math.min(1, (FOG_FAR - dist) / (FOG_FAR - FOG_NEAR)))
    projVec.set(activePoint.x, activePoint.y, activePoint.z)
    projVec.project(camera.current)
    const canvas = renderer.domElement
    const x = (projVec.x * 0.5 + 0.5) * canvas.clientWidth
    const y = (-projVec.y * 0.5 + 0.5) * canvas.clientHeight
    onproject(activeModel, x, y, fogFactor)
  })

  const s = 22
  const t = 1.5
  const hGeom = new PlaneGeometry(s * 2, t)
  const vGeom = new PlaneGeometry(t, s * 2)
  const selectedS = s - 0.5
  const selectedT = 3.5
  const selectedHGeom = new PlaneGeometry(selectedS * 2, selectedT)
  const selectedVGeom = new PlaneGeometry(selectedT, selectedS * 2)

  const fogColor = $derived($colors.fog)
  const textColor = $derived($colors.text)
  const axisColor = $derived($colors.axis)
  const accentColor = $derived($colors.accent)
</script>

<svelte:window onpointermove={onWindowPointerMove} onpointerup={onWindowPointerUp} />

<T.OrthographicCamera
  makeDefault
  near={-50000}
  far={50000}
  position={[CAMERA_DISTANCE * -2, CAMERA_DISTANCE, CAMERA_DISTANCE]}
>
  <OrbitControls />
</T.OrthographicCamera>

<T.Fog attach="fog" color={fogColor} near={0} far={2500} />

<T.Mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
  <T.CylinderGeometry args={[0.5, 0.5, 100000]} />
  <T.MeshBasicMaterial color={axisColor} />
</T.Mesh>
<T.Mesh position={[0, 0, 0]}>
  <T.CylinderGeometry args={[0.5, 0.5, 100000]} />
  <T.MeshBasicMaterial color={axisColor} />
</T.Mesh>
<T.Mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
  <T.CylinderGeometry args={[0.5, 0.5, 100000]} />
  <T.MeshBasicMaterial color={axisColor} />
</T.Mesh>

{#each points as point}
  <Billboard position={[point.x, point.y, point.z]}>
    <Text
      text={usePluses ? "+" : String(modelNames.indexOf(point.model))}
      fontSize={30}
      font="/Monaspace Neon Var.ttf"
      color={textColor}
      anchorX="center"
      anchorY="middle"
    />
    {#if selectedModelSet.has(point.model)}
      <T.Mesh geometry={selectedHGeom} position={[0, selectedS, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
      <T.Mesh geometry={selectedHGeom} position={[0, -selectedS, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
      <T.Mesh geometry={selectedVGeom} position={[-selectedS, 0, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
      <T.Mesh geometry={selectedVGeom} position={[selectedS, 0, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
    {/if}
    {#if point.model === activeModel}
      <T.Mesh geometry={hGeom} position={[0, s, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
      <T.Mesh geometry={hGeom} position={[0, -s, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
      <T.Mesh geometry={vGeom} position={[-s, 0, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
      <T.Mesh geometry={vGeom} position={[s, 0, 0]}>
        <T.MeshBasicMaterial color={accentColor} />
      </T.Mesh>
    {/if}
    <T.Mesh
      onpointerenter={(e: any) => {
        e.stopPropagation()
        if (isMobile) return
        hoveredModel = point.model
      }}
      onpointerleave={() => {
        if (isMobile) return
        hoveredModel = null
      }}
      onpointerdown={(e: any) => {
        startLongPress(point.model, e.nativeEvent ?? e)
      }}
      onclick={(e: any) => {
        e.stopPropagation()
        if (isMobile) {
          if (didLongPress) {
            didLongPress = false
            return
          }
          tappedModel = tappedModel === point.model ? null : point.model
        } else {
          ontogglecomparison(point.model)
        }
      }}
      onpointermissed={() => {
        if (!isMobile || tappedModel === null) return
        tappedModel = null
      }}
    >
      <T.SphereGeometry args={[18]} />
      <T.MeshBasicMaterial transparent opacity={0} depthWrite={false} />
    </T.Mesh>
  </Billboard>
{/each}
