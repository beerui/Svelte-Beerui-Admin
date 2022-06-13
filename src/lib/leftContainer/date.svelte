<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let activeIndex = 0
  export let dateList = ['上月', '本月', '本年']

  function changeDate(index) {
    activeIndex = index
    dispatch('dateChange', index+1)
  }
</script>
<div class="date-container flex">
  {#each dateList as item, index(item)}
    <div class="item relative flex cursor-pointer {activeIndex === index ? 'active' : ''}" on:click={() => changeDate(index)}>{item}</div>
  {/each}
</div>
<style lang="scss">
  .date-container {
    .item {
      margin: 0 15px 5px 0;
      font-size: 14px;
      color: #DDEFF6;
    }
    .active {
      color: #20D8FF;
      &::before {
        position: absolute;
        top: -19px;
        left: -43px;
        z-index: -1;
        width: 115px;
        height: 74px;
        display: block;
        content: "";
        background: url(/assets/home/date_active_bg.png) 0 0 / 100% 100% no-repeat;
      }
    }
  }
</style>