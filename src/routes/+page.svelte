<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { Billboard, OrbitControls, Text } from '@threlte/extras'
	let { data } = $props()
</script>

<div class="w-full h-screen bg-black">
	<Canvas>
		<T.OrthographicCamera makeDefault position={[data.camera_init_pos.x, data.camera_init_pos.y, data.camera_init_pos.z]}>
			<OrbitControls />
		</T.OrthographicCamera>


		<T.Fog attach="fog" color={"black"} near={0} far={2000} />
		<!-- <T.FogExp2 attach="fog" color={"black"} density={0.0005} /> -->

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
                <Text text="+" fontSize={15} color={"white"} />
            </Billboard>
		{/each}
	</Canvas>
</div>
