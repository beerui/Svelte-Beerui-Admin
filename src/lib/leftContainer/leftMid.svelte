<script>
  import { onMount, tick } from 'svelte'
  import * as echarts from 'echarts'
  import Dialog from './dialog.svelte'
  import AnalyseChart from './analyseChart.svelte'
  import { fly } from 'svelte/transition'
  import { deviceCapacity, deviceStatistic } from '$api/home'

  export let visible = false

  let normalRate = 0 // 设备运行正常占比
  let anomalyOperationCount = 0 // 异常运行数量
  let deviceTypeCount = 0 // 设备数量
  let normalOperationCount = 0 // 正常运行数量
  let deviceCount = 0 // 设备类型数量
  let dialogVisible = false
  // 弹窗
  let analyseChart = null
  let dialogData = {
     pumpCount: 0,
     gateCount: 0,
     aerialVehicleCount: 0,
     highAltitudeVideoCount: 0,
     waterVideoCount: 0,
     qualityCount: 0,
     levelCount: 0,
     aiVideoCount: 0,
     deviceTypeNameList: [],
     normalDeviceCountList: [],
     errorDeviceCountList: [],
     deviceErrorInfoResList: []
  }

  const getDeviceCapacity = () => {
    deviceCapacity().then(res => {
      normalRate = res.normalRate
      anomalyOperationCount = res.anomalyOperationCount
      deviceTypeCount = res.deviceTypeCount
      normalOperationCount = res.normalOperationCount
      deviceCount = res.deviceCount
      initChart()
    })
  }

  onMount(async () => {
      await import('echarts-liquidfill')
      getDeviceCapacity()
  })

  function initChart() {
    const chart = echarts.init(document.getElementById('operation-chart'))
    chart.setOption({
      series: {
        type: 'liquidFill',
        radius: '71.6%',
        data: [normalRate/100],
        outline: {
          borderDistance: 6,
          itemStyle: {
            borderWidth: 4,
            borderColor: '#247dd4',
            shadowBlur: 20
          }
        },
        color: [{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(37, 135, 255, .72)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(54, 122, 248, 0)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }],
        backgroundStyle: {
          color: 'rgba(54, 122, 248, .3)'
        },
        label: {
          color: 'rgba(7, 80, 181, .6)',
          insideColor: '#fff',
          fontSize: 33,
          fontWeight: 'bold',
          position: ['50%', '70%'],
          formatter: params => {
            return `${(params.value*100)}%`
          }
        }
      }
    })
  }

  const getDeviceStatistic = () => {
    deviceStatistic().then(async res => {
      dialogData = res
      await tick()
      analyseChart.initChart()
    })
  }

  const showDialog = async () => {
    dialogVisible = true
    const leftDom = document.querySelector('.g-left-container')
    const rightDom = document.querySelector('.g-right-container')
    leftDom.style.zIndex = 2
    rightDom.style.zIndex = 1
    await tick()
    getDeviceStatistic()
  }

  function closeDialog() {
    dialogVisible = false
  }
</script>
{#if visible}
<div class="g-container" in:fly="{{ x: -436, duration: 800, delay: 200 }}">
  <div class="head cursor-pointer font-normal biao-ti-hei" on:click={showDialog}>
    传感设备运行能力分析
  </div>
  <div class="content flex">
    <div class="left h-full" id="operation-chart"></div>
    <div class="right flex flex-col h-full flex-1">
      <div class="item flex-1">
        <p class="font-semibold biao-ti-hei">{deviceCount}</p>
        <p>传感设备总数</p>
      </div>
      <div class="item flex-1">
        <p class="font-semibold biao-ti-hei">{normalOperationCount}</p>
        <p>正常运行</p>
      </div>
      <div class="item flex-1">
        <p class="error font-semibold biao-ti-hei">{anomalyOperationCount}</p>
        <p>异常设备</p>
      </div>
      <div class="item flex-1">
        <p class="font-semibold biao-ti-hei">{deviceTypeCount}</p>
        <p>设备类型</p>
      </div>
    </div>
  </div>
</div>
{/if}
<Dialog bind:visible={dialogVisible}>
  <div slot="content" class="g-dialog relative">
    <div class="close absolute cursor-pointer" on:click={closeDialog} />
    <div class="g-machine_content flex">
      <div class="item">
        <span class="value">{dialogData.pumpCount}</span>
        <span class="unit">座</span>
      </div>
      <div class="item">
        <span class="value">{dialogData.gateCount}</span>
        <span class="unit">座</span>
      </div>
      <div class="item">
        <span class="value">{dialogData.aerialVehicleCount}</span>
        <span class="unit">架</span>
      </div>
      <div class="item">
        <span class="value">{dialogData.highAltitudeVideoCount}</span>
        <span class="unit">座</span>
      </div>
      <div class="item">
        <span class="value">{dialogData.waterVideoCount}</span>
        <span class="unit">座</span>
      </div>
      <div class="item">
        <span class="value">{dialogData.aiVideoCount}</span>
        <span class="unit">座</span>
      </div>
      <div class="item">
        <span class="value">{dialogData.qualityCount}</span>
        <span class="unit">座</span>
      </div>
      <div class="item">
        <span class="value">{dialogData.levelCount}</span>
        <span class="unit">座</span>
      </div>
    </div>
    <div class="g-analyse_content flex">
      <div class="chart">
        <AnalyseChart bind:this={analyseChart} data={dialogData} />
      </div>
      <div class="table">
        <div class="table-head flex">
          <div class="item">设备名称</div>
          <div class="item">原因</div>
          <div class="item">处理状态</div>
          <div class="item">上报时间</div>
          <div class="item">运维人员</div>
        </div>
        <div class="table-content">
          {#each dialogData.deviceErrorInfoResList as item(item) }
            <div class="table-content-list flex">
              <div class="item">{item.deviceName}</div>
              <div class="item">{item.content}</div>
              <div class="item">{item.stateName}</div>
              <div class="item">{item.uploadTime}</div>
              <div class="item">{item.name}</div>
            </div>
          {/each}
          {#if dialogData.deviceErrorInfoResList.length === 0}
          <p class="no-data">暂无数据</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</Dialog>
<style lang="scss">
  .g-container {
    height: 263px;
    margin-top: 16px;
    padding: 9px 0 4px;
    background: url(/assets/home/left_mid_bg.png) 0 0 / 100% 100% no-repeat;
    .head {
      padding-left: 15px;
      line-height: 20px;
      font-size: 20px;
      background-image:-webkit-linear-gradient(bottom, #3684f8, #fcfffe,);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
    }
    .content {
      height: 228px;
      .left {
        width: 229px;
      }
      .right {
        .item {
          padding: 4px 0 0 97px;
          p {
            &:nth-child(1) {
              font-size: 24px;
              line-height: 24px;
              letter-spacing: 2px;
              font-weight: bold;
              margin-bottom: 3px;
              background: -webkit-linear-gradient(bottom, #367AF8, #fcfffe);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            &:nth-child(2) {
              font-size: 12px;
              line-height: 12px;
              color: #FFFFFF;
            }
          }
          p.error {
            background: -webkit-linear-gradient(bottom, #F82E2E, #fcfffe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }
  }
  .g-dialog {
    width: 1307px;
    height: 672px;
    padding: 80px 73px 20px 61px;
    background: url(/assets/home/machine_dialog_bg.png) 0 0 /100% 100% no-repeat;
    .close {
      top: 59px;
      right: 59px;
      width: 14px;
      height: 14px;
    }
    .g-machine_content {
      height: 185px;
      padding: 19px 21px 0 57px;
      margin-bottom: 48px;
      .item {
        width: 12.5%;
        padding-top: 130px;
        display: flex;
        justify-content: center;
        .value {
          margin-right: 6px;
          font-size: 24px;
          color: #5ED2F8;
          font-weight: 600;
        }
        .unit {
          font-size: 14px;
          color: #fff;
          margin-top: 7px;
        }
      }
    }
    .g-analyse_content {
      height: 315px;
      padding-top: 37px;
      .chart {
        width: 50%;
      }
      .table {
        width: 50%;
        padding: 32px 0 0 12px;
        &-head {
          height: 48px;
          background: rgba(27, 108, 230, 0.16);
          color: #fff;
          .item {
            height: 100%;
          }
        }
        &-content {
          height: 180px;
          overflow: auto;
          &-list {
            &:nth-child(2n) {
              background: rgba(27, 108, 230, 0.08)
            }
          }
          .item {
            height: 36px;
            color: #ECF6FA;
          }
          .no-data {margin: 10px 0 0;text-align: center;font-size: 14px;color: #96CEFD;}
        }
        .item {
          display: flex;
          align-items: center;
          padding: 0 14px;
          font-size: 12px;
          &:nth-child(1) {
            width: 126px;
          }
          &:nth-child(2) {
            width: 84px;
          }
          &:nth-child(3) {
            width: 82px;
          }
          &:nth-child(4) {
            width: 156px;
          }
          &:nth-child(5) {
            flex: 1
          }
        }
      }
    }
  }
</style>
