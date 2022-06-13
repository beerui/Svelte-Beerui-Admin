<script>
  import { BeCarousel, BeCarouselItem } from "@brewer/beerui";

  export let show = true
  let operateStateData = {
    normal: 12,
    close: 5,
    error: 1,
    errorList: [
      { reason: 'XXXXX泵站初步分析设备电路故障，请及时排查故障，恢复运行。', name: 'XXX', phone: '15923654423' },
      { reason: 'XXXXX泵站初步分析设备电路故障，请及时排查故障，恢复运行。', name: 'XXXX', phone: '15923654424' },
    ]
  }

  function handleToggle() {
    show = !show
  }
</script>
<div class="g-container absolute {!show ? 'visible' : ''}">
  <div class="toggle absolute cursor-pointer { show ? 'close' : 'show' }" on:click={handleToggle} />
  <div class="g-wrapper">
    <div class="head relative flex items-center drainage-justify-between">
      <span class="text-white font-semibold">当前活水泵站</span>
    </div>
    <div class="operate-state flex items-center text-white font-bold">
      <p class="">正常运行：<span>{operateStateData.normal}</span> 座</p>
      <p>未运行：<span>{operateStateData.close}</span> 座</p>
      <p>异常告警：<span class="error">{operateStateData.error}</span> 座</p>
    </div>
    <div class="error-list">
      <div class="swiper">
        <BeCarousel autoplay={true} direction='vertical' trigger='hover' loop={false} interval='5000' hideIndicator>
          {#each operateStateData.errorList as item, i}
            <BeCarouselItem>
              <div class="swiper-slide flex text-white">
                <span>{i+1}. </span>
                <div class="flex flex-col drainage-justify-between">
                  <p class="reason">{item.reason}</p>
                  <p class="info">运维人员：{item.name}  {item.phone}</p>
                </div>
              </div>
            </BeCarouselItem>
          {/each}
        </BeCarousel>
      </div>
    </div>
  </div>
</div>
<style lang="scss">
  .g-container {
    bottom: 325px;
    left: 18px;
    height: 174px;
    transform: translateY(0) translateX(0);
    transition: transform .4s;
    .toggle {
      top: 0;
      right: -36px;
      width: 36px;
      height: 36px;
      transform: translateY(0);
      transition: transform .4s;
    }
    .show {
      transform: translateY(138px) translateX(18px);
      background: url(/assets/drainage/show.gif) 0 0 / 100% 100% no-repeat;
    }
    .close {
      background: url(/assets/drainage/close.png) 0 0 / 100% 100% no-repeat;
    }
    .g-wrapper {
      width: 398px;
      background: url(/assets/drainage/operat_state_bg.png) 0 0 / 100% 100% no-repeat;
    }
    .head {
      height: 27px;
      padding: 0 14px 0 22px;
    }
    .operate-state {
      height: 52px;
      padding-left: 14px;
      font-size: 14px;
      p {
        margin-right: 24px;
        span {
          color: #2FDAFF;
        }
        .error {
          color: #FF1919;
        }
      }
    }
    .error-list {
      height: 95px;
      padding-left: 74px;
      background: url(/assets/drainage/operat_state_error_bg.png) 0 0 / 100% 100% no-repeat;
      .swiper {
        width: 289px;
        height: 100%;
        overflow: hidden;
        .swiper-slide {
          padding: 25px 0 14px 0;
          font-size: 14px;
          .reason {
            overflow: hidden;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .info {
            color: #DD3848;
          }
        }
      }
    }
  }
  .visible {
    transform: translateX(-416px);
  }
</style>
