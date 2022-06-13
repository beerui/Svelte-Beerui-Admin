<script>
  import { onMount } from "svelte"
  import * as echarts from 'echarts'

  let showRightTopChartMask = false
  let gaugeChart = null

  onMount (async() => {
    initRightTopChart()
  })

  function initRightTopChart() {
    gaugeChart = echarts.init(document.getElementById('right-top-chart'))
    gaugeChart.setOption({
      series: [{
        title: {
          show: false
        },
        name: '外层',
        type: 'gauge',
        radius: '110%',
        center: ["50%", "73%"],
        startAngle: 180,
        endAngle: 0,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        progress: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 1,
            color: [[1, '#48ecf2']]
          }
        },
        axisTick: {
          show: false
        },
        pointer: {
          show: false
        },
        detail: {
          show: false
        },
      }, {
        title: {
          show: false
        },
        name: 'data',
        type: 'gauge',
        data: [{
          value: 50,
          name: "超标告警率"
        }],
        center: ["50%", "73%"],
        radius: "95%",
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          show: false
        },
        progress: {
          show: true,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                  {
                      offset: 0,
                      color: '#fff27e',
                  },
                  {
                      offset: 1,
                      color: '#fee828',
                  },
              ],
            },
          }
        },
        detail: {
          show: false
        },
        pointer: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      }, {
        title: {
          show: false
        },
        name: 'data',
        type: 'gauge',
        data: [{
          value: 50,
          name: "超标告警率"
        }],
        center: ["50%", "73%"],
        radius: "106%",
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
                [50 / 100, new echarts.graphic.LinearGradient(
                    0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgba(254,231,28,0.7)',
                        }, {
                            offset: 0.5,
                            color: 'rgba(254,231,28,0.3)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(254,231,28,0)',
                        }
                    ]
                )]
            ],
            width: 30
          } 
        },
        detail: {
          show: false
        },
        progress: {
          show: false
        },
        pointer: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      }, {
        name: "超标告警率",
        type: "gauge",
        center: ["50%", "73%"],
        radius: "110%",
        startAngle: 180,
        endAngle: 0,
        title: {
          textStyle: {
            color: '#cbcaca',
            fontSize: 14
          }
        },
        axisLine: {
          show: false
        },
        progress: {
          show: false
        },
        pointer: {
          length: 28,
          width: 6,
          icon: 'triangle',
          offsetCenter: [0, '-66%'],
          itemStyle: {
            color: '#fee71c'
          }
        },
        axisLabel: {
          distance: -38,
          show: true,
          fontSize: 10,
          color: '#afafaf'
        },
        axisTick: {
          show: true,
          splitNumber: 5,
          length: 32,
          distance: -6,
          lineStyle: {
            color: "#20355a",
            width: 1.5,
            cap: "butt",
            miterLimit: 23,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            opacity: 1
          }
        },
        splitLine: {
          show: false
        },
        detail: {
          offsetCenter: [0, '-20%'],
          formatter: params => {
            return `{value|${params}}{unit| %}`
          },
          rich: {
            value: {
              color: '#fff',
              fontSize: 24
            },
            unit: {
              color: '#fff',
              fontSize: 14,
              padding: [5, 0, 0, 0]
            }
          }
        },
        data: [{
          value: 50,
          name: "超标告警率"
        }],
      }, {
        name: '内粗',
        type: 'gauge',
        radius: '75%',
        center: ["50%", "73%"],
        startAngle: 180,
        endAngle: 0,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        progress: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 3,
            color: [[1, new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: '#0d9dee'
                  },
                  {
                    offset: 1,
                    color: '#46e7f5'
                  }
                ]
            )]]
          }
        },
        axisTick: {
          show: false
        },
        pointer: {
          show: false
        },
        detail: {
          show: false
        },
      }, {
        name: '内细',
        type: 'gauge',
        radius: '70%',
        center: ["50%", "73%"],
        startAngle: 180,
        endAngle: 0,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        progress: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 1,
            color: [[1, '#0d4359']]
          }
        },
        axisTick: {
          show: false
        },
        pointer: {
          show: false
        },
        detail: {
          show: false
        },
      }]
    })
    showRightTopChartMask = true
  }
</script>
<div class="m-count-wrapper flex">
  <div class="count flex-1 flex flex-col items-center justify-end">
    <span class="text-white">242</span>
    <span>水位正常</span>
  </div>
  <div class="count flex-1 flex flex-col items-center justify-end">
    <span class="text-white">27</span>
    <span>水位超标</span>
  </div>
</div>
<div id="right-top-chart"></div>
{#if showRightTopChartMask}
  <img src="/assets/drainage/right_top_chart_mask1.png" alt="" class="mask1 absolute pointer-events-none">
  <img src="/assets/drainage/right_top_chart_mask2.png" alt="" class="mask2 absolute pointer-events-none">
{/if}
<style lang="scss">
  .m-count-wrapper {
    height: 73px;
    .count {
      span {
        &:nth-child(1) {
          line-height: 28px;
          font-size: 28px;
          margin-bottom: 9px;
        }
        &:nth-child(2) {
          line-height: 14px;
          font-size: 14px;
          color: #b1b1b1
        }
      }
    }
  }
  #right-top-chart {
    height: 191px;
  }
  .mask1 {
    top: 195px;
    left: 147px;
    width: 128px;
    height: 48px;
  }
  .mask2 {
    top: 266px;
    left: 0;
    width: 100%;
    height: 22px;
  }
</style>