<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { Billboard, OrbitControls, Text } from '@threlte/extras'
	export let data
</script>

<div class="w-full h-screen">
	<Canvas>
		<T.OrthographicCamera makeDefault position={[data.camera_init_pos.x, data.camera_init_pos.y, data.camera_init_pos.z]}>
			<OrbitControls target={[data.centroid.x, data.centroid.y, data.centroid.z]} />
		</T.OrthographicCamera>

		<T.AmbientLight intensity={1} />

		{#each data.points as point} -->
    		<Billboard position={[point.x, point.y, point.z]}>
                <Text text="+" fontSize={15} color="black" />
            </Billboard>
		{/each}
	</Canvas>
</div>
