<script>
  import * as echarts from 'echarts'

  let yearList = []

  export let data = {
    registerCount: 0, // 注册人数
    registerRate: 0, // 注册率
    timeList: [], // 时间数组--第二个图标
    activenessList: [] // 活跃度占比
  }

  $: {
    if (data.timeList.length) {
      data.timeList.forEach(val => {
        const year = val.match(/\d{4}/)[0]
        if (!yearList.includes(year)) {
          yearList.push(year)
        }
      })
    }
  }

  let chart = null

  export const initChart = () => {
    if (!chart) {
      chart = echarts.init(document.getElementById('registered-chart'))
    }
    chart.setOption({
      grid: {
        top: 53,
        left: 45,
        bottom: 50,
        right: 32
      },
      legend: {
        show: false,
        top: 0,
        right: 48,
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
        formatter: (params) => {
          let str = `<p style="font-size: 14px; color: #fff">${params[0].axisValue}</p>\n`
          params.forEach(val => {
            if (val.seriesName) {
              str += `<p style="font-size: 12px; color: rgba(245, 245, 245, 0.68)">${val.marker} 数据占比: ${val.value}%</p>\n`
            }
          })
          return str
        }
      },
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
          },
          formatter: params => {
            const list = Object.assign([], yearList)
            const indexList =  list.map(year => data.timeList.findIndex(val => val.includes(year)))
            const paramsList = params.split('年')
            let res = paramsList[1]
            for (let i=0; i<indexList.length; i++) {
              if (params === data.timeList[indexList[i]]) {
                res = `${paramsList[1]}\n${paramsList[0]}`
              }
            }
            return res
          }
        },
        data: data.timeList
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
          type: 'line',
          symbol: 'none',
          itemStyle: {
            normal: {
              color: '#37DAFF'
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(55, 218, 255, 0.78)'
                },
                {
                  offset: 1,
                  color: 'rgba(0, 96, 255, 0)'
                }
              ], false)
            }
          },
          data: data.activenessList
        }
      ]
    })
  }
</script>
<div class="relative w-full h-full">
  <div class="percent absolute flex text-white">
    <p class="flex items-center">注册人数 <span class="DIN-Bold">{data.registerCount}</span></p>
    <p class="flex items-center">注册率 <span class="DIN-Bold">{data.registerRate}%</span></p>
  </div>
  <div id="registered-chart" class="w-full h-full" />
</div>
<style lang="scss">
  .percent {
    top: -3px;
    left: 315px;
    font-size: 14px;
    span {
      color: #5ED2F8;
      font-size: 22px;
      line-height: 24px;
      font-weight: bold;
      margin: -3px 91px 0 12px;
    }
  }
</style>