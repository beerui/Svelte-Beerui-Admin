<script>
  import { createEventDispatcher } from 'svelte'

  export let color
  export let title
  export let value
  export let showFour = false
  export let index
  export let activeIndex

  let dispatch = createEventDispatcher()

  const handleClick = () => {
    dispatch('click', index)
  }
</script>

<div class="home-dialog-tab cursor-pointer" class:four={showFour} class:active={activeIndex === index} on:click={handleClick}>
  <span>{title}</span>
  <span class="home-dialog-tab-value" style={`color:${color}`}>{value}</span>
</div>

<style lang="scss">
.home-dialog-tab {
  width: 132px;
  height: 80px;
  background:  url('/assets/home/home_dialog.png') no-repeat;
  background-position: 0 0;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  padding-top: 16px;
  &-value {
    margin-top: 2px;
    color:#61D9FD;
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
  }
  &:hover {
    background-position: 0 -110px;
  }
}
.home-dialog-tab.active {
  background-position: 0 -110px;
}
.four {
  width: 92px;
  height: 80px;
  background-position: -144px 0;
  &:hover {
    background-position: -144px -110px;
  }
}
.four.active {
  background-position: -144px -110px;
}
</style>