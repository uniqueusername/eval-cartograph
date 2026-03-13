<script lang="ts">
  import { Canvas, T } from "@threlte/core"
  import { Billboard, OrbitControls, Text } from "@threlte/extras"
  import { colors } from "$lib/colors"
  import { CAMERA_DISTANCE, modelColor } from "$lib/points"
  import type { EmbeddingPoint } from "$lib/umap"

  interface Props {
    points: EmbeddingPoint[]
    modelNames: string[]
    colorDots: boolean
  }

  let { points, modelNames, colorDots }: Props = $props()

  const fogColor = $derived($colors.fog)
  const textColor = $derived($colors.text)
  const axisColor = $derived($colors.axis)
</script>

<Canvas>
  <T.OrthographicCamera
    makeDefault
    near={-50000}
    far={50000}
    position={[CAMERA_DISTANCE*-2, CAMERA_DISTANCE, CAMERA_DISTANCE]}
  >
    <OrbitControls />
  </T.OrthographicCamera>

  <T.Fog attach="fog" color={fogColor} near={0} far={2000} />

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
    {@const modelIdx = modelNames.indexOf(point.model)}
    <Billboard position={[point.x, point.y, point.z]}>
      <Text
        text={colorDots ? String(modelIdx) : "+"}
        fontSize={30}
        font="/Monaspace Neon Var.ttf"
        color={colorDots ? modelColor(point.model) : textColor}
      />
    </Billboard>
  {/each}
</Canvas>
