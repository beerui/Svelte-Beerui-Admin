<script>
  import {
    // BeButton,
    // BeIcon,
  } from "@brewer/beerui";
  export let stepsTitleList // 传过来的步骤条title进度数组
  export let stepsList = [] // 传过来的进度数组
  export let stepsActive // 传过来的进度index
  
</script>
<div class="article-steps">
  <!-- <div class="item-box">
    {#each stepsList as item, index}
    <div class="circle-line-box" class:step-checked={index < stepsActive}>
      <span class="circle-box"></span>
      <span class="line-box"></span>
      <div class="text-box">
        <div class="box-title">{ stepsTitleList[index] }</div>
        <div class="box-name">{ item.text2 }</div>
        <div class="box-time">{ item.text3 }</div>
      </div>
    </div>
    {/each}
  </div> -->
  <div class="detail-steps-box">
    {#if stepsList.length > 0}
    <div class="flow-steps">
      {#each stepsTitleList as item, index}
        <div class="steps-item-box">
          <div class="item-top">
            <div class="step-line left-line" class:step-checked={index <= stepsActive}></div>
            <div class="item-circle" class:step-checked={index <= stepsActive}></div>
            <div class="step-line right-line" class:step-checked={index <= stepsActive-1}></div>
          </div>
          <div class="item-content">
            <div class="content-title">{ item }</div>
            {#if stepsList[index]}
            <div class="content-name">{ stepsList[index].personName }</div>
            {/if}
            {#if stepsList[index]}
            <div class="content-time">{ stepsList[index].time }</div>
            {/if}
            
            
          </div>
        </div>
      {/each}
    </div>
    {/if}
  </div>
</div>
<style lang="scss">
  .article-steps {
    // .item-box {display: flex;width:75%;margin: 50px auto;
    //   .circle-line-box {width: 33%;margin: 0px auto;
    //     .circle-box {display: inline-block;width: 8px;height: 8px;background-color: #bfbfbf;border-radius: 50%;}
    //     .line-box {display: inline-block;width: calc(100% - 16px);height: 5px;border-top: 2px solid #bfbfbf;}
    //     &:last-child {width: 100px;}
    //     &:last-child .line-box {width: 0px;}
    //     // .text-box {
    //     //   .box-title {}
    //     //   .box-name {}
    //     //   .box-time {}
    //     // }
    //   }
    //   .step-checked {
    //     .circle-box {background-color:#1890ff;}
    //     .line-box {border-top: 2px solid #1890ff;}
    //   }
    //   &:last-child .step-checked {width: 0px;}
    // }
    .detail-steps-box {
      .flow-steps {display: flex;justify-content: space-between;padding-top: 40px;padding-bottom: 30px;
        .steps-item-box {flex: 1;
          .item-top {display: flex;justify-content: space-between;
            .step-line {background: #e8e8e8;height: 2px;width: calc((100% - 13px) / 2);margin-top: 3px;}
            .item-circle {background-color: #bfbfbf;width: 9px;height: 9px;border-radius: 50%;margin: 0px 3px;}
          }
          &:first-child .left-line {height: 0px;}
          &:last-child .right-line {height: 0px;}
          .item-content {margin-top: 15px;text-align: center;
            .content-title {color: #595959;font-size: 14px;margin-bottom: 12px;}
            .content-name {color: #8c8c8c;font-size: 12px;margin-bottom: 12px;}
            .content-time {color: #8c8c8c;font-size: 12px;margin-bottom: 12px;}
          }
        }
        .step-checked {background-color: #1890ff !important;
          .item-content {
            .content-title {font-weight: 500;color: #262626;}
          }
        }
      }
    }
  }
</style>
