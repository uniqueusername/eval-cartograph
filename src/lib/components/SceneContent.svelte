<script lang="ts">
  import { T, useThrelte } from "@threlte/core"
  import { Billboard, interactivity, OrbitControls, Text } from "@threlte/extras"
  import { useTask } from "@threlte/core"
  import { Vector3 } from "three"
  import { colors } from "$lib/colors"
  import { CAMERA_DISTANCE } from "$lib/points"
  import type { EmbeddingPoint } from "$lib/umap"

  interface Props {
    points: EmbeddingPoint[]
    modelNames: string[]
    usePluses: boolean
    tappedModel: string | null
    onhover: (model: string | null, event: PointerEvent | null) => void
    ontap: (model: string) => void
    onproject: (x: number, y: number) => void
  }

  let { points, modelNames, usePluses, tappedModel, onhover, ontap, onproject }: Props = $props()

  interactivity()

  const { camera, renderer } = useThrelte()
  const projVec = new Vector3()

  useTask(() => {
    if (!tappedModel) return
    const point = points.find((p) => p.model === tappedModel)
    if (!point) return
    projVec.set(point.x, point.y, point.z)
    projVec.project(camera.current)
    const canvas = renderer.domElement
    const x = (projVec.x * 0.5 + 0.5) * canvas.clientWidth
    const y = (-projVec.y * 0.5 + 0.5) * canvas.clientHeight
    onproject(x, y)
  })

  let downModel: string | null = null

  const fogColor = $derived($colors.fog)
  const textColor = $derived($colors.text)
  const axisColor = $derived($colors.axis)
</script>

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
      strokeWidth={point.model === tappedModel ? 2 : 0}
      strokeColor={textColor}
    />
    <T.Mesh
      onpointerenter={(e: any) => { e.stopPropagation(); onhover(point.model, e.nativeEvent) }}
      onpointerleave={() => onhover(null, null)}
      onpointerdown={(e: any) => { e.stopPropagation(); downModel = point.model }}
      onpointerup={(e: any) => { e.stopPropagation(); if (downModel === point.model) ontap(point.model); downModel = null }}
    >
      <T.SphereGeometry args={[18]} />
      <T.MeshBasicMaterial transparent opacity={0} depthWrite={false} />
    </T.Mesh>
  </Billboard>
{/each}
