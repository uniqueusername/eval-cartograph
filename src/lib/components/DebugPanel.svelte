<script lang="ts">
  import Panel from "$lib/components/ui/Panel.svelte"
  import CheckboxRow from "$lib/components/ui/CheckboxRow.svelte"

  interface Props {
    usePluses: boolean
    onchange: () => void
  }

  let { usePluses, onchange }: Props = $props()
</script>

<Panel className="fixed bottom-4 left-4 z-50">
  <CheckboxRow checked={usePluses} {onchange}>
    use pluses for points
  </CheckboxRow>
</Panel>
