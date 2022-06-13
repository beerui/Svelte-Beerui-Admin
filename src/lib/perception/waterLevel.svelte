<script>
  import * as echarts from 'echarts'
  import { onMount } from 'svelte'

  let time = 1
  const lastMonthRiver = {
    xAxis: ['16日18时', '17日04时', '17日14时', '18日00时', '18日10时', '18日20时 ', '19日06时', '19日16时'],
    yAxis1:[1.2, 2.5, 3.6, 2.3, 3.2, 3.6, 3.4, 2.3],
    yAxis2:[1.2, 1.4, 2.6, 3.6, 4.3, 3.6, 3.5, 2.4]
  }

  const initChart = () => {
    const chart = echarts.init(document.getElementById('chart'))
    chart.setOption({
      grid: {
        containLabel: true,
        left: 20,
        top: 20,
        bottom: 30,
        right: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        bottom: 0,
        itemWidth: 12,
        itemHeight: 6,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        data: [{name:'内河水位',
          itemStyle: {
            color:'#00B7FB'
          }
        },{name:'外河水位',
          itemStyle: {
            color:'#00D999'
          }
        }],
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
          splitLine: {
            lineStyle: {
              color: '#033368'
            }
          },
          axisLabel: {
            color: '#B1D5F9'
          }
        }
      ],
      series: [
        {
          name: '内河水位',
          type: 'bar',
          barWidth: 10,
          data: lastMonthRiver.yAxis1,
          markLine: {
            symbol: 'none',
            silent: true,
            lineStyle: { normal: { type: 'dashed' } },
            label: { position: 'start' },
            data: [
              {
                yAxis: 4.86,
                lineStyle: { width: 1.656, color: '#FF3737' },
                label: { show: false }
              }
            ]
          },
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
          name: '外河水位',
          type: 'bar',
          barWidth: 10,
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

  onMount(() => {
    initChart()
  })
</script>
<div class="g-pump-container flex justify-center">
  <div class="left">
    <p>4.23m</p>
    <p>内河水位</p>
  </div>
  <div class="center">
    <p>4.42m</p>
    <p>外河水位</p>
  </div>
  <div class="right">
    4.48m
  </div>
</div>
<div class="g-chart-container">
  <div class="m-head flex">
    <div class="title flex items-center">水位变化</div>
    <div class="time flex">
      <div class="btn" class:active={time === 1} on:click = {() => time = 1}>72小时</div>
      <div class="btn" class:active={time === 2} on:click = {() => time = 2}>最近一周</div>
      <div class="btn" class:active={time === 3} on:click = {() => time = 3}>最近一周</div>
    </div>
  </div>
  <div class="chart" id="chart" />
</div>
<style lang="scss">
  .g-pump-container {
    padding: 16px 0 29px;background: url('/assets/home/perception/bg_1.png') center bottom 20px / 485px 16px no-repeat;
    .left,.center {
      width: 130px;text-align: center;
      p {
        &:nth-child(1) {font-size: 24px;margin-bottom: 2px;color: #3CDAFF;font-weight: bold;}
        &:nth-child(2) {font-size: 14px;color: #B1D5F9;}
      }
    }
    .left {
      position: relative;
      &::after {position: absolute;top: 7px;right: 0; display: block;content: "";height:29px;border-right: 1px dashed #1E77CC;}
    }
    .center {
      p {
        &:nth-child(1) {color: #00FDB2;}
      }
    }
    .right {
      width: 146px;height: 30px;line-height: 30px;padding-left: 86px;margin-top: 10px;background: url('/assets/home/perception/alert_bg.png') 100% 100% / 100% 100% no-repeat;
    }
  }
  .g-chart-container {
    .m-head {
      .title {
        font-size: 16px;color: #fff;
        &::before {display:block; content: "";width: 20px;height: 24px;background: url('/assets/home/perception/arrows.png') 100% 100% / 100% 100% no-repeat;}
      }
      .time {
        margin-left: auto;
        .btn {
          display:flex;align-items: center;justify-content: center;border-radius: 13px;width: 68px;height: 26px;margin-right: 8px;background: url('/assets/home/perception/btn_bg.png') 100% 0 / 100% 52px no-repeat;font-size: 12px;cursor: pointer;
        }
        .active {background-position: 100% -26px;}
      }
    }
    .chart {height: 200px;}
  }
</style>