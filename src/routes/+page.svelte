<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { Billboard, OrbitControls, Text } from '@threlte/extras'
	export let data
</script>

<div class="w-full h-screen">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 0, 10]}>
			<OrbitControls />
		</T.PerspectiveCamera>

		<T.AmbientLight intensity={1} />

		{#each data.points as point}
    		<Billboard><Text text="+" position={[point.x, point.y, point.z]} fontSize={1} color="black" /></Billboard>
		{/each}
		<!-- <Billboard><Text text="+" position={[1, 2, 0]} fontSize={1} color="black" /></Billboard>
		<Billboard><Text text="+" position={[-2, -2, 3]} fontSize={1} color="black" /></Billboard>
		<Billboard><Text text="+" position={[1, 2, 3]} fontSize={1} color="black" /></Billboard>` -->
	</Canvas>
</div>
