<script lang="ts">
// client:only="svelte"

let uid: number | undefined = undefined

const clickHandler = async () => {
  const res = await fetch(`/api/uid/${uid}`, { cache: 'reload' })
  console.log('uid', uid)
  console.log('res.text', await res.text())
}
const clickHandler2 = async () => {
  const res = await fetch(`/api/uid/${uid}`, { cache: 'force-cache' })
  console.log('uid', uid)
  console.log('res.text', await res.text())
}
</script>

<div>
  <input type="number" placeholder="UID" bind:value={uid} class="input input-bordered w-full max-w-xs bg-neutral" />
  <button class="btn btn-neutral" on:click={clickHandler}>reload</button>
  <button class="btn btn-neutral" on:click={clickHandler2}>force-cache</button>
</div>
