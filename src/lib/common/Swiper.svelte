<script>
  import { BeIcon } from "@brewer/beerui";
  export let showPicture = true
  export let swiperList = []

  // 当前轮播图的index
  let currentIndex = 0,
    // 平移距离
    translationDistance = 0,
    // 当前展示的轮播图index数组
    currentArray = [0, 1, 2],
    // 每次平移距离
    translationOnce = 115


  const next = () => {
      const swiperLength = swiperList.length
      if (currentIndex === swiperLength - 1) return
      let index = currentIndex
      determineAnimationDirection(++index)
  }
  const preview = (item, index) => {
      determineAnimationDirection(index)
  }
  const previous = () => {
      if (currentIndex === 0) return
      let index = currentIndex
      determineAnimationDirection(--index)
  }
  // 判断动画方向
  const determineAnimationDirection = (index) => {
      const swiperLength = swiperList.length
      // 左
      if (currentIndex > index) {
          currentIndex = index
          if (currentIndex === currentArray[0] && currentIndex !== 0) {
              translationDistance += translationOnce
              currentArray = [currentIndex - 1, currentIndex, currentIndex + 1]
          }
      }
      // 右
      if (currentIndex < index) {
          currentIndex = index
          if (currentIndex === currentArray[currentArray.length - 1] && currentIndex !== swiperLength - 1) {
              translationDistance -= translationOnce
              currentArray = [currentIndex - 1, currentIndex, currentIndex + 1]
          }
      }
  }
  let clickHandle = (_v) => {
    currentIndex = _v
  }
</script>
<div class="swiper">
  {#if showPicture}
    {#if swiperList[currentIndex].isVideo == '1'}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video class="swiper-picture" src={swiperList[currentIndex].url} alt="" controls="controls"></video>
    {/if}
    {#if swiperList[currentIndex].isVideo == '0'}
      <div class="swiper-picture flex justify-center items-center py-20 px-26" style="background: url({swiperList[currentIndex].url}) center center / cover no-repeat;"></div>
    {/if}
  {/if}
  <!-- 下方数组 -->
  <div class="swiper-list flex items-center justify-between px-14 mt-16">
    <div class="w-20 h-28 cursor-pointer close" on:click={previous}>
      <BeIcon name='chevron-left' width="20" height="20" color='#0357ae' />
    </div>
    <div class="swiper-list-container">
      <div class="flex trans" style="transform: translateX({translationDistance}px);">
        {#each swiperList as item, index}
          {#if item.isVideo === 0}
            <img src={item.url} class="w-115 h-92 ml-4 mr-4 box-border cursor-pointer {currentIndex === index ? 'border-active':'border'}" alt="" on:click={() => {clickHandle(index)}}>
          {:else}
            <div class="video-smallBox">
              <div class="video-btn">
                <BeIcon name='caret-right-small' width="30" height="30" color='#fff' />
              </div>
              <img src={item.videoImg} class="w-115 h-92 ml-4 mr-4 box-border cursor-pointer {currentIndex === index ? 'border-active':'border'}" alt="" on:click={() => {clickHandle(index)}}>
            </div>
          {/if}
        {/each}
      </div>
    </div>
    <div class="w-20 h-28 cursor-pointer close" on:click={next}>
      <BeIcon name='chevron-right' width="20" height="20" color='#0357ae' />
    </div>
  </div>
</div>
<style lang="scss">
.swiper {
  width: 430px;
  min-width: 430px;
  .swiper-list {
    display: flex;align-items: center;justify-content: space-between;
    padding: 0 12px;margin-top: 16px;cursor: pointer;
    .swiper-list-container {
      width:  380px;
      overflow: hidden;
      .trans {
        transition: all 0.3s;
      }
      .video-smallBox {position: relative;
        .video-btn {width: 30px;height: 30px;background: #000000;opacity: 0.24;border-radius: 50%;position: absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          .be-icon {margin-left:-2px !important;margin-top: -3px !important;}
        }
      }
    }
  }
  .close {font: bold 26px/14px Tahoma,Verdana,sans-serif;color: #0357ae;line-height: 25px;}
}
.swiper .swiper-picture {
  width: 100%;
  height: 255px;
  background: #000000;
  display: flex;justify-content: center;
  align-items: center;
  border: 2px solid #006cd0;
  img {width: 100%;height: 100%;cursor: pointer;}
}
.w-20 {width: 20px;}
.h-28 {height: 28px;}
.mr-4 {margin-left: 4px;}
.mr-4 {margin-right: 4px;}
.mt-16 {margin-top: 16px;}
.w-115 {
  min-width: 115px;
}
.h-92 {
  height: 92px;
}
.border {
  border: 2px solid #43C3FF;
}
.border-active {
  border: 2px solid #FFCB2E;
}
</style>
