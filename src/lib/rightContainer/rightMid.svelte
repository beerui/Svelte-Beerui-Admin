<script>
  import * as echarts from 'echarts'
  import { onMount, tick } from 'svelte';
  import { fly } from 'svelte/transition'
  import { getQualityLayers } from '$api/home'
  import { domload } from '$lib/utils/action'

  export let visible = false

  let date = ''
  let riverCount = 0
  let elementChartData = []

  const getData = (node) => {
    getQualityLayers().then(res => {
      riverCount = res.riverCount
      res.waterQualityTypeCount.forEach(val => {
        val.value = Number(val.value.replace('条', ''))
      })
      elementChartData = res.waterQualityTypeCount
      initChart(node, elementChartData)
    })
  }

  function setPieChartData(data, color) {
    let total = 0, hasDataLength = 0
    data.forEach(val => {
      total += val.value
      if (val.value !== 0) {
        hasDataLength ++
      }
    })
    const outSplitValue = total * 0.04
    const list = []
    data.forEach((val, index) => {
      list.push({
        name: val.name,
        value: val.value,
        itemStyle: {
          normal: {
            borderWidth: val.value === 0 ? 0 : 4,
            borderColor: color[index]
          }
        }
      }, {
        value: hasDataLength <= 1 ? 0 : (val.value === 0 ? 0 : outSplitValue),
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
          }
        }
      })
    })
    return list
  }

  function setLegendOption(targetData, length, index) {
    return {
      bottom: `${35 - 22*index}`,
      left: 45,
      itemWidth: 7,
      itemHeight: 11,
      selectedMode: false,
      itemGap: 20,
      textStyle: {
        color: '#E8ECEF',
        padding: [0, 0, 0, 6],
        fontSize: 12,
      },
      formatter: name => {
        const value = targetData.find(val => val.name === name).value
        return `${name}: ${value}%`
      }
    }
  }

  function initChart(node, targetData) {
    const chart = echarts.init(node)
    const color = ['#64F5DC', '#0084FF','#0688EB', '#FAD041', '#FF6600']
    chart.setOption({
      tooltip: {
        show: true,
        formatter: params => {
          return `<p>${params.marker}<span style="font-size: 14px;color:#666;font-weight:400;margin-left: 2px">${params.data.name}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${params.percent}%</span><p>`
        }
      },
      legend: {
        show: true,
        itemWidth: 14,
        itemHeight: 14,
        right: 34,
        top: 'center',
        formatter: name => {
          const index = elementChartData.findIndex(val => val.name === name)
          const value = elementChartData[index].value
          return ` {a|${name}}  {${index}|${value}} {b| 条}`
        },
        textStyle: {
          fontSize: 14,
          rich: {
            a: {
              color: '#D5E6FF',
              width: 50
            },
            b: {
              color: '#D5E6FF',
              width: 20
            },
            0: {
              color: '#64F5DC',
              fontFamily: 'YouSheBiaoTiHei',
              fontSize: 22
            },
            1: {
              color: '#0084FF',
              fontFamily: 'YouSheBiaoTiHei',
              fontSize: 22
            },
            2: {
              color: '#0688EB',
              fontFamily: 'YouSheBiaoTiHei',
              fontSize: 22
            },
            3: {
              color: '#FAD041',
              fontFamily: 'YouSheBiaoTiHei',
              fontSize: 22
            },
            4: {
              color: '#FF6600',
              fontFamily: 'YouSheBiaoTiHei',
              fontSize: 22
            }
          }
        }
      },
      series: {
        type: 'pie',
        radius: ['74.6%', '77.6%'],
        center: ['28.6%', '49.5%'],
        color: color,
        hoverAnimation: false,
        label: {
          show: false
        },
        data: setPieChartData(targetData, color)
      }
    })
  }

  const mounted = (node) => {
    getData(node)
  }
</script>
{#if visible}
<div class="g-container relative" in:fly="{{ x: 436, duration: 800, delay: 200 }}">
  <div class="head font-normal biao-ti-hei">水质环境</div>
  <div class="content flex">
    <div class="chart relative w-full h-full">
      <div id="element-chart" class="w-full h-full" use:domload={node => mounted(node)} />
      <div class="title absolute">
        <p class="value flex"><span class="biao-ti-hei">{riverCount}</span><span>条</span></p>
        <p class="label">河道数量</p>
      </div>
    </div>
  </div>
</div>
{/if}
<style lang="scss">
  .g-container {
    height: 255px;
    padding: 14px 0 4px;
    margin-top: 11px;
    background: url(/assets/home/right_mid_bg.png) 0 0 / 100% 100% no-repeat;
    .calendar {
      top: -2px;
      right: 14px;
      color: #A6BAD7;
      font-size: 14px;
      .icon {
        width: 16px;
        height: 16px;
        margin-left: 8px;
      }
    }
    .head {
      padding-left: 21px;
      line-height: 20px;
      font-size: 20px;
      background-image: -webkit-linear-gradient(bottom, #3684f8, #fcfffe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .content {
      height: 213px;
      .chart {
        background: url("/assets/home/water_quality_bg.png") 45px 25px / 160px 158px no-repeat;
        .title {
          top: 21px;
          left: 40px;
          width: 170px;
          height: 170px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          .value {
            line-height: 20px;margin-bottom: -2px;
            span {
              &:nth-child(1) {
                font-size: 32px;
                background: linear-gradient(0, #8EBEFF 0%, #FFFFFF 60.8154296875%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 32px;
              }
              &:nth-child(2) {
                background: none; color: #D4E6FF;font-size: 14px;padding-top: 7px;
              }
            }
          }
          .label {font-size: 14px;color: #D4E6FF;}
        }
      }
    }
  }
</style>