<script>
  import LeftTop from '$lib/leftContainer/leftTop.svelte'
  import LeftMid from '$lib/leftContainer/leftMid.svelte'
  import LeftBottom from '$lib/leftContainer/leftBottom.svelte'

  export let visible = false
</script>
<div class="g-left-container absolute">
  <LeftTop {visible} />
  <LeftMid {visible} />
  <LeftBottom {visible} />
</div>
<style lang="scss">
  .g-left-container {
    top: 0;
    z-index: 2;
    left: 0;
    width: 465px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 18px 0 24px 24px;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      display: block;
      content: "";
      width: 100%;
      height: 100%;
      background: url("/assets/home/map_shade.png") 100% 100% / 100% 100% no-repeat;
      transform: rotateY(180deg);
    }
    &::-webkit-scrollbar-thumb {
      background: transparent
    }
  }
</style>
