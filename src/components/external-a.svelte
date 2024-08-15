<script lang="ts">
export let self = false

let rest = self
  ? {}
  : {
      rel: 'noreferrer noopener',
      target: '_blank',
    }
</script>

<a {...rest} {...$$restProps}><slot /></a>
