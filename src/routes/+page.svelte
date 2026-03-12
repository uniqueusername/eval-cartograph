<script lang="ts">
  import { Canvas, T } from "@threlte/core"
  import { Billboard, OrbitControls, Text } from "@threlte/extras"
  import { theme } from "$lib/theme"

  let { data } = $props()

  const fogColor = $derived($theme ? "black" : "white")
  const textColor = $derived($theme ? "white" : "black")
</script>

<div class="w-full h-screen bg-white dark:bg-black">
  <Canvas>
    <T.OrthographicCamera
      makeDefault
      position={[
        data.camera_init_pos.x,
        data.camera_init_pos.y,
        data.camera_init_pos.z,
      ]}>
      <OrbitControls />
    </T.OrthographicCamera>

    <T.Fog attach="fog" color={fogColor} near={0} far={2000} />
    <!-- <T.FogExp2 attach="fog" color={fogColor} density={0.0008} /> -->

    <T.Mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <T.CylinderGeometry args={[0.5, 0.5, 10000]} />
      <T.MeshBasicMaterial color="#444444" />
    </T.Mesh>
    <T.Mesh position={[0, 0, 0]}>
      <T.CylinderGeometry args={[0.5, 0.5, 10000]} />
      <T.MeshBasicMaterial color="#444444" />
    </T.Mesh>
    <T.Mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <T.CylinderGeometry args={[0.5, 0.5, 10000]} />
      <T.MeshBasicMaterial color="#444444" />
    </T.Mesh>

    {#each data.points as point}
      <Billboard position={[point.x, point.y, point.z]}>
        <Text text="+" fontSize={15} color={textColor} />
      </Billboard>
    {/each}
  </Canvas>
</div>
