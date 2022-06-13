<script>
  import OneTable from './one.svelte'
  import TwoTable from './two.svelte'
  import ThreeTable from './three.svelte'
  import FourTable from './four.svelte'
  import FiveTable from './five.svelte'

  let btnList = [
    { name: '管点线成果表', value: 1 },
    { name: '排水口成果表', value: 2 },
    { name: '污染源成果表', value: 3 },
    { name: '设施问题清单表', value: 4 },
    { name: '排水设施分布图', value: 5 }
  ]
  let activeIndex = 0
  let componentList = {
    0: OneTable,
    1: TwoTable,
    2: ThreeTable,
    3: FourTable,
    4: FiveTable
  }

  function navChange(index) {
    activeIndex = index
  }
</script>
<div class="g-container">
  <div class="head flex">
    {#each btnList as item, index(item)}
      <div class="nav-item flex items-center justify-center cursor-pointer" class:active={index === activeIndex} on:click={() => navChange(index)}>
        {item.name}
      </div>
    {/each}
  </div>
  <svelte:component this={componentList[activeIndex]} />
</div>
<style lang="scss">
  .g-container {
    padding-top: 20px;
    .head {
      .nav-item {
        width: 132px;
        height: 45px;
        margin: 0 8px 18px 0;
        padding-bottom: 2px;
        font-size: 12px;
        color: rgba(236, 246, 250, .6);
        background-image: url(/assets/home/table_btn_default_bg.png);
      }
      .active {
        color: #ECF6FA;
        background-image: url(/assets/home/table_btn_active_bg.png);
      }
    }
  }
</style>