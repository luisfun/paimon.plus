<script lang="ts">
// client:load

let uid: number | undefined = undefined

const clickHandler = async () => {
  const res = await fetch(`/api/uid/${uid}`)
  console.log("uid", uid)
  console.log("res.text", await res.text())
}
</script>

<div>
  <input type="number" placeholder="UID" bind:value={uid} class="input input-bordered w-full max-w-xs bg-neutral" />
  <button class="btn btn-neutral" on:click={clickHandler}>GO</button>
</div>
