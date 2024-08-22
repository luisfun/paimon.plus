<script lang="ts">
// client:only="svelte"

let uid: number | undefined = undefined
let disabled = true
$: disabled = !/^(18|[1-35-9])\d{8}$/.test(uid?.toString() || '')

const clickHandler2 = async () => {
  const res = await fetch(`/api/uid/${uid}`, { cache: 'force-cache', headers: { 'Cache-Control': 'force-cache' } })
  console.log('uid', uid)
  console.log('res.text', await res.text())
}
const clickHandler = async () => {
  const res = await fetch(`/api/uid/${uid}`)
  console.log('uid', uid)
  console.log('res.text', await res.text())
}
</script>

<div>
  <input type="number" placeholder="UID" bind:value={uid} class="input input-bordered w-full max-w-xs bg-neutral" />
  <button class="btn btn-neutral" on:click={clickHandler} {disabled}>default</button>
  <button class="btn btn-neutral" on:click={clickHandler2} {disabled}>force-cache</button>
</div>
