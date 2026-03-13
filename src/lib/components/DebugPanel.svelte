<script lang="ts">
  interface Props {
    colorPoints: boolean
    onchange: () => void
  }

  let { colorPoints: colorDots, onchange }: Props = $props()
</script>

<div
  class="fixed bottom-4 right-4 z-50 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-3 text-sm text-black dark:text-white shadow-lg"
>
  <label class="flex items-center gap-1.5 cursor-pointer">
    <input type="checkbox" checked={colorDots} {onchange} />
    <span>color dots by model</span>
  </label>
</div>
