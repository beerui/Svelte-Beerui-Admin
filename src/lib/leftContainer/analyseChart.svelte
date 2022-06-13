<script>
  import * as echarts from 'echarts'

  export let data = {
    deviceTypeNameList: [],
    normalDeviceCountList: [],
    errorDeviceCountList: []
  }
  
  export const initChart = () => {
    const chart = echarts.init(document.getElementById('analyse-chart'))
    chart.setOption({
      grid: {
        top: 53,
        left: 45,
        bottom: 37,
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
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(2, 96, 204, 0.2)'
          }
        },
        formatter: (params) => {
          let str = `<p style="font-size: 14px; color: #fff">${params[0].axisValue}</p>\n`
          params.forEach(val => {
            if (val.seriesName) {
              str += `<p style="font-size: 12px; color: rgba(245, 245, 245, 0.68)">${val.marker} ${val.seriesName}: ${val.value}</p>\n`
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
          formatter: name => {
            const length = name.length
            if (length >= 4) {
              const start = Math.ceil(length / 2)
              return `${name.slice(0, start)}\n${name.slice(start)}`
            }
            return name
          },
          textStyle: {
            fontSize: 12,
            color: "rgba(255, 255, 255)" //X轴文字颜色
          }
        },
        data: data.deviceTypeNameList
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
            formatter: '{value}',
            textStyle: {
              fontSize: 13,
              color: "#fff"
            }
          },
        }
      ],
      series: [
        {
          name: '运行',
          type: 'bar',
          barWidth: '14',
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
          data: data.normalDeviceCountList,
        },
        {
          name: '异常',
          type: 'bar',
          barWidth: '14',
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
          data: data.errorDeviceCountList,
        }
      ]
    })
  }
</script>
<div id="analyse-chart" class="w-full h-full" />