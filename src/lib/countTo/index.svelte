<script>
  import { onMount } from "svelte";
  import { fly } from 'svelte/transition';
  import CountItem from "./src/countItem.svelte";

  export let startNum = 0
  export let duration = 900
  export let immediately = true // 组件mount后立即滚动

  let numList = []

  export const formatNumber = (number) => {
    if (typeof number !== 'number') return
    number += ''
    numList = number.split('')
  }

  onMount(() => {
    if (immediately) {
      formatNumber(startNum)
    }
  })
</script>
<div class="card-container">
  {#each numList as item, index}
    <div class="card-item" in:fly="{{ y: 45, duration: duration, delay: (numList.length-(index+1))*450 }}">
      <div class="card-box" />
      <CountItem value={item} index={index} length={numList.length} duration={duration} />
    </div>
  {/each}
</div>
<style lang="scss">
  .card-container {
    display: flex;
    .card-item {
      position: relative;
      .card-box {
        width: 72px;
        height: 107px;
        background: url('/assets/countTo/count_bg.png') 100% 100% / 100% 100% no-repeat;
      }
    }
  }
</style>