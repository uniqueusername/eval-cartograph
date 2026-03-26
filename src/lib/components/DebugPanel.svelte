<script lang="ts">
  interface Props {
    usePluses: boolean
    onchange: () => void
  }

  let { usePluses, onchange }: Props = $props()
</script>

<div class="panel fixed z-50 bottom-4 left-4">
  <label class="panel-checkbox-label">
    <input type="checkbox" checked={usePluses} {onchange} />
    <span class="panel-text">use pluses for points</span>
  </label>
</div>
