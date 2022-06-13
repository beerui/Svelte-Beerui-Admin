<script>
	import StatisticalChartItem from './statisticalChartItem.svelte';
	import TabItem from './tabItem.svelte';
  import { onMount, createEventDispatcher } from "svelte"
  import * as echarts from 'echarts'
  import { fetchDialogU2RiverSum, fetchDialogU2Resumption } from '$api/home'
  let dispatch = createEventDispatcher()

  export let areaId
  export let activeIndex = ''

  let list = [
    { name:'区级河道', value: '0', grade: 4 },
    { name:'镇级河道', value: '0', grade: 5 },
    { name:'村级河道', value: '0', grade: 6 },
    { name:'入河排水口', value: '0', grade: 0 }
  ]
  const lastMonthRiver = {
    xAxis: [],
    yAxis1:[],
    yAxis2:[]
  }
  function initChart() {
    const chart = echarts.init(document.getElementById('river-statistical_chart'))
    chart.setOption({
      grid: {
        containLabel: true,
        left: 0,
        top: 30,
        bottom: 10,
        right: 0
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let str = `
            <div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${params[0].name}</div>
            <div style="margin: 10px 0 0;line-height:1;">
          `
          params.forEach((val, index) => {
            str += `
              <div style="margin: ${index === params.length - 1 ? 10 : 0}px 0 0;line-height:1;">
                <div style="margin: 0px 0 0;line-height:1;">
                  ${val.marker}
                  <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${val.seriesName}</span>
                  <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${val.value}%</span>
                  <div style="clear:both"></div>
                </div>
                <div style="clear:both"></div>
              </div>
            `
          })
          str += `</div></div>`
          return str
        }
        // axisPointer: {
        //   type: 'cross',
        //   crossStyle: {
        //     color: '#999'
        //   }
        // }
      },
      legend: {
        top: 0,
        right: 0,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        itemWidth: 12,
        itemHeight: 6,
        data: [{name:'巡河率',
          itemStyle: {
            color:'#00B7FB'
          }
        },{name:'问题处理率',
          itemStyle: {
            color:'#00D999'
          }
        }]
      },
      xAxis: [
        {
          type: 'category',
          data: lastMonthRiver.xAxis,
          axisPointer: {
            type: 'shadow'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#B1D5F9'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20,
          splitLine: {
            lineStyle: {
              color: '#022C5A'
            }
          },
          axisLabel: {
            color: '#B1D5F9',
            formatter: '{value} %'
          },
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: (3 / lastMonthRiver.xAxis.length) * 100,
          height: 6,
          bottom: 0,
          borderColor: "transparent",
          handleSize: 0,
          showDetail: false,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: "#aaa",
          }
        },
        {
          type: 'inside'
        }
      ],
      series: [
        {
          name: '巡河率',
          type: 'bar',
          barWidth: 10,
          data: lastMonthRiver.yAxis1,
          itemStyle:{
            normal:{
                color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#3CDBFF'
                }, {
                    offset: 1,
                    color: 'rgba(1, 66, 133, 0.18)'
                }], false)
            }
          },
        },
        {
          name: '问题处理率',
          type: 'bar',
          barWidth:10,
          data: lastMonthRiver.yAxis2,
            itemStyle:{
            normal:{
                color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#00E09E'
                }, {
                    offset: 1,
                    color: 'rgba(0, 172, 101, 0.18) '
                }], false)
            }
        },
        }
      ]
    })
  }
  const healthRatioColor = {
    '好': '#00B7FB',
    '中': '#22AD5D',
    '差': '#FF5604'
  }
  const healthRatioData = [{
    name:'好',
    value: 42
  },{
    name:'中',
    value: 20
  },{
    name:'差',
    value: 38
  }]
  
  function getRiverSum() {
    const data = {
      areaId
    }
    fetchDialogU2RiverSum(data).then(res => {
      list = [
        { name: '区级河道', value: res.districtCount, grade: 4 },
        { name: '镇级河道', value: res.townCount, grade: 5 },
        { name: '村级河道', value: res.villageCount, grade: 6 },
        { name: '入河排水口', value: res.outfallCount, grade: 0 }
      ]
    })
  }

  let progress1Obj = { value: 0, lasrMonth: 0, year: 0 }
  let progress2Obj = { value: 0, lasrMonth: 0, year: 0 }

  function getResumption() {
    fetchDialogU2Resumption().then(res => {
      lastMonthRiver.xAxis = res.rvierRateAndTaskLayersRes.areaName
      lastMonthRiver.yAxis1 = res.rvierRateAndTaskLayersRes.rvierRateList
      lastMonthRiver.yAxis2 = res.rvierRateAndTaskLayersRes.taskRateList
      progress1Obj = { value: res.thisMonthWaterPatrolRate, lastMonth: res.upMonthWaterPatrolRate, year: res.yearWaterPatrolRate }
      progress2Obj = { value: res.thisMonthTaskRate, lastMonth: res.thisMonthTaskRate, year: res.yearTaskRate }
      initChart()
    })
  }

  getRiverSum() // 河道数量
  getResumption() // 履职统计

  const handleTabClick = (evt) => {
    if (evt === activeIndex) {
      activeIndex = ''
    } else {
      activeIndex = evt
    }
    dispatch('tabItemClick', activeIndex)
  }
</script>


<div class="home-dialog">
  <div class="home-dialog-list">
    {#each list as item, index}
      <TabItem index={item.grade} activeIndex={activeIndex} title={item.name} value={item.value} showFour={true} on:click={() => handleTabClick(item.grade)} />
    {/each}
  </div>
  <div class="home-dialog-statistical">
    <img src="/assets/home/statistical_icon.png" alt="">
    <div class="flex w-full mt-2">
      <div class="w-1/2 h-150"><StatisticalChartItem name="本月巡河率" monthStr="上月" bind:value={progress1Obj.value} bind:lastMonth={progress1Obj.lastMonth} bind:year={progress1Obj.year} id="progress-chart"/></div>
      <div class="w-1/2 h-150 ml-33"><StatisticalChartItem color="#00D999" monthStr="本月" name='本月处理率' bind:value={progress2Obj.value} bind:lastMonth={progress2Obj.lastMonth} bind:year={progress2Obj.year} id="progress-chart2"/></div>
    </div>
  </div>
  <div class="home-dialog-statistical_chart">
    <div class="flex items-center">
      <img src="/assets/home/triangle_icon.png" alt="">
      <span class="text-white">上月镇街河长制履职统计</span>
    </div>
    <div class="river-statistical_chart" id="river-statistical_chart"></div>
  </div>
</div>

<style lang="scss">
  .home-dialog{
    width: 431px;
    max-height: calc(100vh - 170px);
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(7, 20, 41, 0.88);
    box-shadow: 0 0 16px #2373E8 inset;
    padding: 20px;
    &-list {
      display: flex;
      justify-content: space-between;
    }
    &-statistical{
      margin-top: 10px;
      img {
        margin-left: -20px;
      }
      &_chart {
        margin-top: 22px;
        img {
          width: 22px;
          height: 32px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
  .ml-33 {
    margin-left: 33px;
  }
  .justify-between {
    justify-content: space-between;
  }
  .river-statistical_chart {
    width: 100%;
    height: 180px;
  }
  .h-150 {
    height: 150px;
  }
</style>
