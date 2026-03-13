<script lang="ts">
  interface Props {
    colorPoints: boolean
    onchange: () => void
  }

  let { colorPoints: colorDots, onchange }: Props = $props()
</script>

<div class="panel fixed z-50 bottom-4 right-4">
  <label class="panel-checkbox-label">
    <input type="checkbox" checked={colorDots} {onchange} />
    <span class="panel-checkbox-text">color dots by model</span>
  </label>
</div>
