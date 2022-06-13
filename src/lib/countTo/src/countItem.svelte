<script>
  import { tick } from "svelte";

  export let value = 0
  export let index = 0
  export let length = 0
  export let duration = 0

  let oldValue = 0

  $: {
    tick().then(() => {
      oldValue = value
    })
  }

</script>
<div class="number-list-container">
  <div class="number-list" style="transform: translate3d(0, -{oldValue*10}%, 0); transition-delay: {(length-(index+1))*450}ms; transition-duration: {duration}ms">
    {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as num}
      <span class="DIN-Black">{num}</span>
    {/each}
  </div>
</div>
<style lang="scss">
  .number-list-container {
    position: absolute;
    top: 9px;
    left: 8px;
    width: 55px;
    height: 86px;
    overflow: hidden;
    .number-list {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 86px;
        font-size: 56px;
        color: #cee2ff;
      }
    }
  }
</style>