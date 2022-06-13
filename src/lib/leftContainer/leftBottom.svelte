<script>
  import { onMount, tick } from 'svelte'
  import * as echarts from "echarts"
  import DataComponent from './date.svelte'
  import Dialog from './dialog.svelte'
  import { fly } from 'svelte/transition'
  import ResumptionChart from './resumptionChart.svelte'
  import RegisteredChart from './registeredChart.svelte'
  import { waterStatisticalRate, waterLayerRate } from '$api/home'
  import { domload } from '$lib/utils/action'

  export let visible = false

  let dialogVisible = false
  let chart = null
  let formData = {
    timeType: 1
  }
  const radarData = {
    xAxis: [],
    yAxis: []
  }
  const rate = {
    activeness: 0, // 活跃度
    taskRate: 0, // 问题处理率
    waterPatrolRate: 0 // 巡河率
  }
  // 弹窗
  let dialogFormData = {
    monthTime: ''
  }
  let dialogData = {
    waterPatrolRate: 0, // 全区巡河率
    taskRate: 0, // 全区问题处理率
    riverHeadRate: 0, // 河长处理率
    thePublicRate: 0, // 公众处理率
    registerCount: 0, // 注册人数
    registerRate: 0, // 注册率
    townNameList: [], // 镇街名称数据集--第一个图表
    patrolRateList: [], // 巡河率--第一个图表
    taskRateList: [], // 问题处理率--第一个图标
    timeList: [], // 时间数组--第二个图标
    activenessList: [] // 活跃度占比
  }
  let resumptionChart = null
  let registeredChart = null

  const getNowDate = () => {
    const timeStamp = new Date()
    return `${timeStamp.getFullYear()}-${String(timeStamp.getMonth()+1).padStart(2, '0')}`
  }

  const getData = (node) => {
    waterStatisticalRate(formData).then(res => {
      // 调换河长发现位置
      const index = res.problemSourceList.findIndex(val => val === '河长发现')
      res.problemSourceList.splice(index, 1)
      res.problemSourceList.unshift('河长发现')
      const data = res.problemSourceNumList[index]
      res.problemSourceNumList.splice(index, 1)
      res.problemSourceNumList.unshift(data)
      radarData.xAxis = res.problemSourceList || []
      radarData.yAxis = res.problemSourceNumList || []
      rate.activeness = res.activeness
      rate.taskRate = res.taskRate
      rate.waterPatrolRate = res.waterPatrolRate.toFixed(0)
      formatData(node)
    })
  }

  const dateChange = (evt) => {
    formData.timeType = evt.detail
    getData()
  }

  function formatData(node) {
    const data = radarData.yAxis
    const max = Math.max(...radarData.yAxis)
    const formatData = {}
    const indicator = []
    radarData.xAxis.forEach((item, index) => {
      formatData[item] = data[index]
      indicator.push({
        text: item,
        max: max,
        axisLabel: {
          show: radarData.xAxis[index] === '河长发现' ? true : false,
          fontSize: 12,
          color: 'rgb(241, 244, 246, .4)',
          fontWeight: 'bold'
        }
      })
    })
    initChart(formatData, indicator, node)
  }

  function initChart(formatData, indicator, node) {
    if (!chart) {
      chart = echarts.init(node)
    }
    chart.setOption({
      tooltip: {
        show: false
      },
      radar: [
        {
          indicator: indicator,
          axisLine:{
            lineStyle: {
              color: '#2e68ca'
            }
          },
          axisName: {
            color: 'rgba(241,244,246,0.8)',
            formatter: function (value) {
              return value + '  ' + '{a|' + formatData[value] + '}';
            },
            rich: {
              a: {
                  fontSize: 16,
                  lineHeight: 0,
                  align: 'center',
                  fontWeight: 'bold'
              }
            }
          },
          splitLine: {
            lineStyle: {
              color: '#2e68ca'
            }
          },
          splitArea: {
            show: false
          },
          center: ['50%', '55%'],
          radius: 108
        }
      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          itemStyle: {
            color: '#fff',
            borderColor: '#2587ff'
          },
          lineStyle: {
            color: '#2587ff'
          },
          areaStyle: {
            color: 'rgba(48,105,164,0.6)'
          },
          data: [
            {
              value: radarData.yAxis
            }
          ]
        }
      ]
    })
  }
  
  const getWaterLayerRate = () => {
    waterLayerRate(dialogFormData).then(async res => {
      dialogData = res
      await tick()
      resumptionChart.initChart()
      registeredChart.initChart()
    })
  }

  const showDialog = async () => {
    dialogVisible = true
    const leftDom = document.querySelector('.g-left-container')
    const rightDom = document.querySelector('.g-right-container')
    leftDom.style.zIndex = 2
    rightDom.style.zIndex = 1
    await tick()
    getWaterLayerRate()
  }

  const handleMonthChange = () => {
    getWaterLayerRate()
  }

  const closeDialog = () => {
    dialogVisible = false
  }

  onMount(() => {
    dialogFormData.monthTime = getNowDate()
  })
</script>
{#if visible}
<div class="g-container relative" in:fly="{{ x: -436, duration: 800, delay: 400 }}">
  <div class="m-date absolute right-0">
    <DataComponent on:dateChange={dateChange} />
  </div>
  <div class="head font-normal biao-ti-hei">河长制</div>
  <div class="top flex cursor-pointer" on:click={showDialog}>
    <div class="item relative flex-1">
      <p>巡河率</p>
      <p class="font-normal biao-ti-hei">{rate.waterPatrolRate}%</p>
    </div>
    <div class="item relative flex-1">
      <p>问题处理率</p>
      <p class="font-normal biao-ti-hei">{rate.taskRate}%</p>
    </div>
    <div class="item relative flex-1">
      <p>公众活跃度</p>
      <p class="font-normal biao-ti-hei">{rate.activeness}%</p>
    </div>
  </div>
  <div class="title flex">问题来源分析</div>
  <div class="bottom" id="river-chief_chart" use:domload={node => getData(node)}  />
</div>
{/if}
<Dialog bind:visible={dialogVisible}>
  <div slot="content" class="g-dialog relative">
    <div class="close absolute cursor-pointer" on:click={closeDialog} />
    <div class="g-top_chart">
      <ResumptionChart bind:this={resumptionChart} bind:data={dialogData} bind:time={dialogFormData.monthTime} on:change={handleMonthChange} />
    </div>
    <div class="g-bottom_chart">
      <RegisteredChart bind:this={registeredChart} bind:data={dialogData} />
    </div>
  </div>
</Dialog>
<style lang="scss">
  .g-container {
    height: 430px;
    margin-top: 20px;
    padding: 16px 0 4px;
    background: url(/assets/home/left_bottom_bg.png) 0 0 / 100% 100% no-repeat;
    .m-date {top: 0px;}
    .head {
      padding-left: 18px;
      line-height: 20px;
      font-size: 20px;
      background-image: -webkit-linear-gradient(bottom, #3684f8, #fcfffe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .top {
      padding: 0 18px;
      .item {
        width: 128px;height: 61px;background-color: rgba(37, 135, 255, 0.04);
        box-shadow: 0 0 15px 3px inset #1f4ea8;border-left: 1px solid rgb(37 135 255 / 80%);
        margin: 16px 0;padding: 12px 0 0 12px; 
        &::before {
          position: absolute;
          top: 7px;
          right: 17px;
          display: block;
          content: '';
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
        }
        &::after {position: absolute;display: block;content: "";left: 85px;top: 22px;height: 38px;}
        &:nth-child(1) {
          &::after{width: 36px;background: url("/assets/home/left_bottom_icon.png") -36px 0px / 120px 38px no-repeat}
        }
        &:nth-child(2) {
          margin: 16px 9px;
          &::after{width: 38px;background: url("/assets/home/left_bottom_icon.png") -72px 0px / 120px 38px no-repeat}
        }
        &:nth-child(3) {
          &::after{width: 40px;background: url("/assets/home/left_bottom_icon.png") 0 0px / 120px 38px no-repeat}
        }
        p {
          font-weight: bold;
          &:nth-child(1) {font-size: 12px;color: rgba(255, 255, 255, .8);margin-bottom: 4px;}
          &:nth-child(2) {font-size: 22px;line-height: 22px;background-image: -webkit-linear-gradient(bottom, rgba(54, 122, 248, 0.6), #F1F4F6);-webkit-background-clip: text;-webkit-text-fill-color: transparent;}
        }
      }
      .up {
        &::before {border-bottom: 4px solid #21CDFF;}
      }
      .down {
        &::before {border-top: 4px solid #EB0016;}
      }
    }
    .title {
      font-size: 16px;color: #DDEFF6;font-weight: bold;padding-left: 18px;
      &::before {display: block;content: "";width: 4px;height: 18px;margin-right: 8px;background: linear-gradient(45deg, #47C6FE, #4FA2FF)}
    }
    .bottom {height: 276px;}
  }
  .g-dialog {
    width: 1307px;
    height: 799px;
    padding: 123px 60px 20px 70px;
    background: url(/assets/home/river_chief_dialog_bg.png) 0 0 /100% 100% no-repeat;
    .close {
      top: 59px;
      right: 59px;
      width: 14px;
      height: 14px;
    }
    .g-top_chart {height: 294px;margin-bottom: 58px;}
    .g-bottom_chart {height: 300px;}
  }
</style>
