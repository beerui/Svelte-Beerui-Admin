<script>
  import RightTop from '$lib/rightContainer/rightTop.svelte'
  import RightMid from '$lib/rightContainer/rightMid.svelte'
  import RightMidBottom from '$lib/rightContainer/rightMidBottom.svelte'
  import RightBottom from '$lib/rightContainer/rightBottom.svelte'

  export let visible = false
  export let isShowHighVideo = false
</script>
<div class="g-right-container absolute">
  <RightTop {visible} />
  <RightMid {visible} />
  <RightMidBottom aniVisible={visible} />
  <RightBottom {visible} bind:isShowHighVideo />
</div>
<style lang="scss">
  .g-right-container {
    top: 0;
    z-index: 2;
    right: 0;
    width: 465px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 14px 24px 0 0;
    background: url("/assets/home/map_shade.png") 100% 100% / 100% 100% no-repeat;
    &::-webkit-scrollbar-thumb {
      background: transparent
    }
  }
</style>
