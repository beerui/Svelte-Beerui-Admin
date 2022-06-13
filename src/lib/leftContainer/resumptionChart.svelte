<script>
  import * as echarts from 'echarts'
  import { createEventDispatcher } from 'svelte'
  import { BeDatePicker } from '@brewer/beerui'
 
  const dispatch = createEventDispatcher()

  export let time = ''

  export let data =  {
    waterPatrolRate: 0, // 全区巡河率
    taskRate: 0, // 全区问题处理率
    riverHeadRate: 0, // 河长处理率
    thePublicRate: 0, // 公众处理率
    townNameList: [], // 镇街名称数据集--第一个图表
    patrolRateList: [], // 巡河率--第一个图表
    taskRateList: [], // 问题处理率--第一个图标
  }

  let chart = null
  
  export const initChart = () => {
    if (!chart) {
      chart = echarts.init(document.getElementById('resumption-chart'))
    }
    chart.setOption({
      grid: {
        top: 53,
        left: 45,
        bottom: 37,
        right: 32
      },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 8,
        itemHeight: 8,
        icon: 'circle',
        selectedMode: false,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12
        }
      },
      tooltip: {
        trigger: 'axis',
        borderColor: '#259BFF',
        backgroundColor: '#0B386C',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(2, 96, 204, 0.2)'
          }
        },
        formatter: (params) => {
          let str = '<p style="font-size: 14px; color: #fff">履职分析</p>\n'
          params.forEach(val => {
            if (val.seriesName) {
              str += `<p style="font-size: 12px; color: rgba(245, 245, 245, 0.68)">${val.marker} ${val.seriesName}: ${val.value}%</p>\n`
            }
          })
          return str
        }
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: (5 / data.townNameList.length) * 100,
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
          type: 'inside',
        }
      ],
      xAxis: {
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: 'rgba(228, 248, 255, 0.4)'
          }
        },
        axisTick: {
          show: false //隐藏X轴刻度
        },
        axisLabel: {
          textStyle: {
            fontSize: 14,
            color: "rgba(255, 255, 255)" //X轴文字颜色
          }
        },
        data: data.townNameList
      },
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: 'rgba(228, 248, 255, 0.1)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}%',
            textStyle: {
              fontSize: 13,
              color: "#fff"
            }
          },
        }
      ],
      series: [
        {
          name: '巡河率',
          type: 'bar',
          barWidth: '32',
          barGap: '10%',
          barCateGoryGap: '10%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                {
                  offset: 0,
                  color: '#3CDBFF',
                },
                {
                  offset: 1,
                  color: 'rgba(1, 66, 133, 0.18)',
                },
              ]),
            },
          },
          data: data.patrolRateList,
        },
        {
          name: '解决率',
          type: 'bar',
          barWidth: '32',
          barGap: '50%',
          barCateGoryGap: '10%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                {
                  offset: 0,
                  color: '#00E09E',
                },
                {
                  offset: 1,
                  color: 'rgba(0, 172, 101, 0.18)',
                },
              ]),
            },
          },
          data: data.taskRateList
        }
      ]
    })
  }

  const handleTimeChange = (evt) => {
    dispatch('change', evt.detail)
  }
</script>
<div class="g-container w-full h-full relative">
  <div class="percent absolute flex text-white">
    <p class="flex items-center">全区巡河率 <span class="DIN-Bold">{data.waterPatrolRate}%</span></p>
    <p class="flex items-center">问题解决率 <span class="DIN-Bold">{data.taskRate}%</span></p>
    <p class="flex items-center">河长处理率 <span class="DIN-Bold">{data.riverHeadRate}%</span></p>
    <p class="flex items-center">公众处理率 <span class="DIN-Bold">{data.thePublicRate}%</span></p>
  </div>
  <div class="date flex items-center absolute">
    <p>{time || '请选择月份'}</p>
    <!-- <img src="/assets/home/calendar_icon.png" alt="" class="icon absolute pointer-events-none"> -->
    <div class="river-work absolute">
      <BeDatePicker bind:value={time} placeholder='选择日期时间' selectMode="month" on:change={handleTimeChange} clearable={false} />
    </div>
  </div>
  <div id="resumption-chart" class="w-full h-full"></div>
</div>
<style lang="scss">
  .g-container {
    .percent {
      top: 0;
      left: 180px;
      font-size: 14px;
      span {
        color: #5ED2F8;
        font-size: 22px;
        line-height: 24px;
        font-weight: bold;
        margin: -3px 28px 0 12px;
      }
    }
    .date {
      top: -8px;
      left: 925px;
      z-index: 2;
      width: 130px;
      height: 32px;
      padding: 0 30px;
      font-size: 14px;
      line-height: 14px;
      box-shadow: 0 0 15px 3px inset #1f4ea8;
      color: #A6BAD7;
      .icon {right: 15px;width: 16px;height: 16px;}
      .river-work {left: 0;}
    }
  }
</style>