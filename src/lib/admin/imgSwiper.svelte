<script>
  import {
    BeIcon,
    previewImages,
    BeDialog
  } from "@brewer/beerui";
  import { createEventDispatcher } from 'svelte'
  let  dispatch = createEventDispatcher()
  export let swiperList // 传过来的轮播图数组
  let currentArray = [0, 1, 2] // 当前展示的轮播图index数组
  let currentIndex = 0 // 当前轮播图的index
  let translationDistance = 0 // 平移距离
  let translationOnce = 61 // 每次平移距离
  
  let previous = () => {
    if (currentIndex === 0) return
    let index = currentIndex
    determineAnimationDirection(--index)
  }
  let next = () => {
    const swiperLength = swiperList.length
    if (currentIndex === swiperLength - 1) return
    let index = currentIndex
    determineAnimationDirection(++index)
  }
  let clickHandle = (_v) => {
    currentIndex = _v
  }
  let clickImageOrVideo = ( _v) => {
    dispatch('showBigImgAndVideo', {
      index: currentIndex,
      list: swiperList
    })
  }
  // 判断动画方向
  let determineAnimationDirection = (index) => {
    const swiperLength = swiperList.length
    // 上
    if (currentIndex > index) {
      currentIndex = index
      if (currentIndex === currentArray[0] && currentIndex !== 0) {
        translationDistance += translationOnce
        currentArray = [currentIndex - 1, currentIndex, currentIndex + 1]
      }
    }
    // 下
    if (currentIndex < index) {
      currentIndex = index
      if (currentIndex === currentArray[currentArray.length - 1] && currentIndex !== (swiperLength - 1)) {
        translationDistance -= translationOnce
        currentArray = [currentIndex - 1, currentIndex, currentIndex + 1]
      }
    }
  }
</script>
<div class="image-swiper">
  <div class="swiper">
    <div class="big-img">
      {#if swiperList.length > 0}
      <div class="img-box" on:click={() => clickImageOrVideo(swiperList[currentIndex])}>
        {#if swiperList[currentIndex].isVideo == '1'}
          <!-- svelte-ignore a11y-media-has-caption -->
          <video src={swiperList[currentIndex].url} alt="" controls="controls"></video>
        {/if}
        {#if swiperList[currentIndex].isVideo == '0'}
         <img src={swiperList[currentIndex].url} alt="" />
        {/if}
      </div>
      {/if}
      {#if swiperList.length <= 0}
      <div class="img-box">
        <div class="none-data-box">暂无数据</div>
      </div>
      {/if}
      
      <!-- <div class="img-text">问题照片/视频</div> -->
    </div>
    <!-- 右边数组 -->
    <!-- --------------------- isVideo: 1-视频 ，0-图片 -->
    <div class="small-list">
      <div class="icon-box icon-up" on:click={()=>previous()}>
        <BeIcon name='chevron-up' color='#c6c6c6' />
      </div>
      <div class="list-box">
        {#each swiperList as item, index}
        <div class="item-list" class:video-checked={index == currentIndex} :style={'transform: translateY('+ translationDistance +'px);'} on:click={() => {clickHandle(index)}}>
          {#if item.isVideo == '0'}
            <img src={item.url} alt="" />
          {/if}
          {#if item.isVideo == '1'}
            <div class="video-btn">
              <BeIcon name='caret-right-small' width="30" height="30" color='#fff' />
            </div>
            <img src={item.videoImg} alt="" />
          {/if}
        </div>
        {/each}
      </div>
      <div class="icon-box icon-down" on:click={()=>next()}>
        <BeIcon name='chevron-down' color='#c6c6c6' />
      </div>
    </div>
  </div>
</div>
<style lang="scss">
  .image-swiper {width: 442px;height: 275px;
    .swiper {display:flex;justify-content: space-between;
      .big-img {width: 344px;
        .img-box {width: 344px;height: 258px;border-radius: 3px;margin-right: 13px;overflow:hidden;background-color: #a3a3a3;cursor: pointer;
          img {width: 100%;height:100%;}
          video {width: 344px;height:100%;object-fit: fill;}
          .none-data-box {color: #fff;text-align: center;line-height: 258px;font-size: 14px;background-color: #a3a3a3;}
        }
        .img-text {font-size: 14px;font-weight: 400;color: #666;margin-top: 12px;text-align: center;}
      }
      .small-list {width: 85px;height: 258px;
        .icon-up {margin-top: -10px;cursor: pointer;}
        .list-box {margin-top: 30px;height: 210px;overflow-y:auto;overflow-x: hidden;
          .item-list {width: 85px;height: 61px;background-color: #a3a3a3;margin-top: 9px;border-radius: 3px;position: relative;cursor: pointer;
            .video-btn {width: 25px;height: 25px;background: #000000;opacity: 0.24;border-radius: 50%;position: absolute;top:50%;left:50%;transform:translate(-50%,-50%);
              .be-icon {margin-left:-2px !important;margin-top: -3px !important;}
            }
            img {width: 100%;height:100%;}
          }
          .video-checked {border: 1px solid #2a6aff;}
        }
        .icon-down {margin-top: 7px;cursor: pointer;}
      }
      .swiper-picture {display: flex;justify-content: center; padding: 20px 26px;}
      .swiper-list {display: flex; align-items: center;justify-content: space-between; padding: 0 14px; margin-top: 10px;
        .swiper-list-container {width:  390px;overflow: hidden;
          .trans {transition: all 0.3s;display: flex;}
        }
      }
      .small-img {width: 16px;height: 28px;cursor: pointer;}
    }
    .dialog-content{
      display: flex;justify-content: space-around;
      .left-btn {width: 40px;height: 40px;}
      .right-btn {width: 40px;height: 40px;}
      .content-img-video {
        width: 1000px;height:600px;margin: 0 auto;
        img {width: 100%;height:100%;}
        video {width: 344px;height:100%;object-fit: fill;}
      }
    }
    .swiper .swiper-picture {
      width: 100%;
      height: 356px;
      // background: url('/lshs_static/cockpit/dialog_detail_img_bg.png') no-repeat 100% 100%;
    }
    .w-full {width: 100%;}
    .h-full {height: 100%;}
    .w-122 {width: 122px;}
    .h-92 {height: 92px;}
    .border {border: 2px solid #43C3FF;}
    .border-active {border: 2px solid #FFCB2E;}
  }
</style>
