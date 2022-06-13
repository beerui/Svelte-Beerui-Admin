<script>
	import StatisticalChartItem from './statisticalChartItem.svelte';
	import TabItem from './tabItem.svelte';
  import { onMount } from "svelte"
  import * as echarts from 'echarts'
  import { createEventDispatcher } from 'svelte'
  import { 
    fetchDialogU2Resumption,
    waterStatisticalRate,
    getHomeIssueThemeCount
  } from '$api/home'

  export let areaId
  export let activeIndex = ''

  let  dispatch = createEventDispatcher()

  let select = [
    {
      name:'上月',
      value: 0
    },
    {
      name:'本月',
      value: 1
    },
    {
      name:'本年',
      value: 2
    }
  ]
  let list = [
    {
      name:'轻微问题',
      value: '0',
    },
    {
      name:'一般问题',
      value: '0',
      color: '#FFE71E'
    },
    {
      name:'重大问题',
      value: '0',
      color: '#FF3A3A'
    }
  ]

  let chart = null
  let active = 0
  const radarData = {
    xAxis: [],
    yAxis: []
  }

  let progress1Obj = { value: 0, lastMonth: 0, year: 0 }
  const lastMonthRiver = {
    xAxis: [],
    yAxis1: [],
    yAxis2: []
  }

  const dataChange = (evt) => {
    active = evt
    getRadarData()
  }

  const getIssueCount = () => {
    const params = {
      areaId,
      yearTime: new Date().getFullYear()
    }
    getHomeIssueThemeCount(params).then(res => {
      list = [
        {name: '轻微问题', value: res.minorIssueNum,},
        {name: '一般问题', value: res.generalIssue, color: '#FFE71E'},
        {name: '重大问题', value: res.majorIssue, color: '#FF3A3A'}
      ]
    })
  }

  function initChart() {
    const chart = echarts.init(document.getElementById('process-statistical_chart'))
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
        // axisPointer: {
        //   type: 'cross',
        //   crossStyle: {
        //     color: '#999'
        //   }
        // },
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
                  <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${val.value}${index === params.length - 1 ? '' : '%'}</span>
                  <div style="clear:both"></div>
                </div>
                <div style="clear:both"></div>
              </div>
            `
          })
          str += `</div></div>`
          return str
        }
      },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 12,
        itemHeight: 6,
        textStyle: {
          color: '#fff'
        },
        data: [
          {
            name:'处理率',
            itemStyle: {
              color:'#00D999'
            }
          },
          {
            name:'问题发现数',
            itemStyle: {
              color:'#1BD7FF'
            }
          }
        ],
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: (2 / lastMonthRiver.xAxis.length) * 100,
          height: 8,
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
      xAxis: [
        {
          type: 'category',
          data: lastMonthRiver.xAxis,
          axisPointer: {
            type: 'shadow'
          },
          // boundaryGap: false,
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
          // max: 100,
          // interval: 20,
          splitLine: {
            lineStyle: {
              color: '#022C5A'
            }
          },
          axisLabel: {
            color: '#B1D5F9',
            formatter: '{value}'
          },
        },
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
            color: '#00D999',
            formatter: '{value} %'
          }
        }
      ],
      series: [
        {
          name: '处理率',
          type: 'line',
          yAxisIndex: 1,
          data: lastMonthRiver.yAxis2,
          symbol: "none",
          lineStyle: {
            color: '#00D999'
          },
          itemStyle: {
            opacity: 0,
            normal: {
              color: '#00D999' 
            }
          },
          // smooth:true,
          areaStyle:{
            color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#00D999'
            }, {
                offset: 1,
                color: 'rgba(0, 172, 101, 0.08) '
            }], false)
          },
        },
        {
          name: '问题发现数',
          type: 'bar',
          barWidth:10,
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
        }
      ]
    })
  }

  function formatData() {
    const data = radarData.yAxis
    const max = Math.max(...radarData.yAxis)
    const formatData = {}
    const indicator = []
    radarData.xAxis.forEach((item, index) => {
      formatData[item] = data[index]
      indicator.push({
        text: item,
        max: max
      })
    })
    initRadarChart(formatData, indicator)
  }

  function initRadarChart(formatData, indicator) {
    if (!chart) {
      chart = echarts.init(document.getElementById('radar-chart'))
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
              return value + '\n' + '{a|' + formatData[value] + '}';
            },
            rich: {
              a: {
                  fontSize: '14',
                  lineHeight: '24',
                  align: 'center'
              }
            }
          },
          splitLine: {
            // show:false
            lineStyle: {
              color: '#2e68ca'
            }
          },
          splitArea: {
            show:false
          },
          center: ['50%', '55%'],
          radius: 130
        }
      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          itemStyle: {
            color: '#fff'
          },
          lineStyle: {
            color: '#2587ff'
          },
          areaStyle: {
            color: 'rgba(48,105,164,0.2)'
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

  const getResumption = () => {
    fetchDialogU2Resumption().then(res => {
      lastMonthRiver.xAxis = res.rvierRateAndTaskLayersRes.areaName || []
      lastMonthRiver.yAxis1 = res.rvierRateAndTaskLayersRes.taskCountList || []
      lastMonthRiver.yAxis2 = res.rvierRateAndTaskLayersRes.manthTaskRateList || []
      progress1Obj.lastMonth = res.thisMonthTaskRate
      progress1Obj.value = res.thisMonthTaskRate
      progress1Obj.year = res.yearTaskRate
      initChart()
    })
  }

  const getRadarData = () => {
    const data = {
      timeType: active + 1
    }
    waterStatisticalRate(data).then(res => {
      // 调换河长发现位置
      const index = res.problemSourceList.findIndex(val => val === '河长发现')
      res.problemSourceList.splice(index, 1)
      res.problemSourceList.unshift('河长发现')
      const data = res.problemSourceNumList[index]
      res.problemSourceNumList.splice(index, 1)
      res.problemSourceNumList.unshift(data)
      radarData.xAxis = res.problemSourceList || []
      radarData.yAxis = res.problemSourceNumList || []
      formatData()
    })
  }

  const handleTabClick = (evt) => {
    const { detail } = evt
    if(detail === activeIndex) {
      activeIndex = ''
    } else {
      activeIndex = detail
    }
    dispatch('tabItemClick', activeIndex)
  }

  onMount (async() => {
    getIssueCount()
    getResumption()
    getRadarData()
  })
</script>
<div class="home-dialog">
  <div class="home-dialog-list">
    {#each list as item, index}
      <TabItem index={index+1} activeIndex={activeIndex} title={item.name} value={item.value} color={item.color} on:click={handleTabClick}/>
    {/each}
  </div>
  <div class="home-dialog-statistical">
    <img src="/assets/home/process_rate.png" alt="">
    <div class="w-full mt-2 px-6">
      <StatisticalChartItem color="#00D999" name='本月处理率' value={progress1Obj.value} monthStr="本月" lastMonth={progress1Obj.lastMonth} direction='row' year={progress1Obj.year} id="progress-chart3"/>
    </div>
  </div>
  <div class="home-dialog-statistical_chart" id="process-statistical_chart">
  </div>
  <div class="home-dialog-river_health">
    <div class="flex items-center justify-between w-full">
      <img src="/assets/home/source_analysis.png" alt="">
      <div class="river-health_select">
        {#each select as item}
        <span class={item.value == active && 'active'} on:click={() => dataChange(item.value)}>{item.name}</span>
        {/each}
      </div>
    </div>
    <div class="radar-chart" id="radar-chart"></div>
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
        margin-top: 14px;
        width: 100%;
        height: 180px;
      }
    }
    &-river_health {
      margin-top: 40px;
      img {
        margin-left: -20px;
      }
      .river-health_select {
        display: flex;
        span {
          cursor: pointer;
          display: inline-block;
          width: 56px;
          height: 26px;
          background:url(/assets/home/home_dialog.png) no-repeat;
          background-position: 0 -990px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #B1D5F9;
          font-size: 12px;
          margin-left: 10px;
        }
        .active {
          background:url(/assets/home/home_dialog.png) no-repeat;
          background-position: 0 -934px;
        }
      }
      &_title {
        margin-top: 10px;
        margin-left: 32px;
      }
    }
  }
  .ml-33 {
    margin-left: 33px;
  }
  .justify-between {
    justify-content: space-between;
  }
  .px-6 {
    padding: 0 6px;
  }
  .radar-chart {
    margin-top:20px;
    width:100%;
    height:350px;
  }
</style>
