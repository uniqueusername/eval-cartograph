<script lang="ts">
  import { T } from "@threlte/core"
  import { Billboard, interactivity, OrbitControls, Text } from "@threlte/extras"
  import { colors } from "$lib/colors"
  import { CAMERA_DISTANCE } from "$lib/points"
  import type { EmbeddingPoint } from "$lib/umap"

  interface Props {
    points: EmbeddingPoint[]
    modelNames: string[]
    usePluses: boolean
    onhover: (model: string | null, event: PointerEvent | null) => void
  }

  let { points, modelNames, usePluses, onhover }: Props = $props()

  interactivity()

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
    />
    <T.Mesh
      onpointerenter={(e: any) => { e.stopPropagation(); onhover(point.model, e.nativeEvent) }}
      onpointerleave={() => onhover(null, null)}
    >
      <T.SphereGeometry args={[18]} />
      <T.MeshBasicMaterial transparent opacity={0} depthWrite={false} />
    </T.Mesh>
  </Billboard>
{/each}
