<script>
  import { fly } from 'svelte/transition'
  export let visible = false
  export let isShowHighVideo = false
</script>
{#if visible}
<div class="g-container flex" in:fly="{{ x: 436, duration: 1000 }}">
  <div class="left flex flex-col">
    <!-- <img src="/assets/home/monitoring.gif" alt="" class="pointer-events-none"> -->
    <video autoplay loop muted>
			<source src="/assets/home/monitoring.webm" type="video/webm">
		</video>
    <span class="text-center biao-ti-hei">全域监控</span>
  </div>
  <div class="right flex flex-wrap flex-1">
    <div class="item" />
    <div class="item" />
    <div class="item cursor-pointer" on:click={() => isShowHighVideo = true} />
    <div class="item" />
  </div>
</div>
{/if}
<style lang="scss">
  .g-container {
    height: 208px;
    margin: 14px 0;
    background: url(/assets/home/right_bottom_bg.png) 0 0 / 100% 100% no-repeat;
    .left {
      width: 45%;
      video {width: 79%;margin: 36px auto 0;}
      img {width: 189px;}
      span {font-size: 20px;margin-top: 18px;background-image: -webkit-linear-gradient(bottom, #3684f8, #fcfffe);-webkit-background-clip: text;-webkit-text-fill-color: transparent;}
    }
    .right {
      align-content: flex-start;
      .item {width: 45%;height: 100px;}
    }
  }
</style>
