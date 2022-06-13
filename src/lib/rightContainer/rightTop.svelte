<script>
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { waterStatistic } from '$api/home'

  export let visible = false

  let data = {
    waterDelivery: 0, // 供水量
    enterpriseCount: 0, // 取水企业数量
    dischargeWater: 0, // 排水量
    waterWorks: 0 // 自来水厂数量
  }

  const getWaterStatistic = () => {
    waterStatistic().then(res => {
      data = res
    })
  }

  onMount(() => {
    getWaterStatistic()
  })

</script>
{#if visible}
<div class="g-container relative" in:fly="{{ x: 436, duration: 800 }}">
  <div class="head font-normal biao-ti-hei">引配水管理</div>
  <div class="content flex">
    <div class="item">
      <p class="flex"><span class="font-semibold biao-ti-hei">{data.dischargeWater}</span><span>亿吨</span></p>
    </div>
    <div class="item">
      <p class="flex"><span class="font-semibold biao-ti-hei">{data.waterDelivery}</span><span>亿吨</span></p>
    </div>
    <div class="item">
      <p class="flex"><span class="font-semibold biao-ti-hei">{data.enterpriseCount}</span><span>h</span></p>
    </div>
    <div class="item">
      <p class="flex"><span class="font-semibold biao-ti-hei">{data.waterWorks}</span><span>家</span></p>
    </div>
  </div>
</div>
{/if}
<style lang="scss">
  .g-container {
    height: 197px;
    padding: 9px 0 4px;
    background: url(/assets/home/right_top_bg.png) 0 0 / 100% 100% no-repeat;
    .m-date {
      top: -5px;
    }
    .head {
      padding-left: 15px;
      line-height: 20px;
      font-size: 20px;
      background-image: -webkit-linear-gradient(bottom, #3684f8, #fcfffe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .content {
      flex-wrap: wrap;
      height: 165px;
      .item {
        width: 50%;
        height: 50%;
        flex-shrink: 0;
        padding: 17px 0 0 113px;
        &:nth-child(n+3) {
          padding-top: 7px;
        }
        p {
          line-height: 24px;
          font-size: 24px;
          span {
            &:nth-child(1) {
              font-size: 24px;
              background-image: -webkit-linear-gradient(bottom, rgba(54, 122, 248, 0.6), #F1F4F6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            &:nth-child(2) {
              display: block;
              line-height: 12px;
              font-weight: bold;
              font-size: 12px;
              color: rgba(255, 255, 255, .8);
              margin: 8px 0 0 8px;
            }
          }
        }
      }
    }
  }
</style>