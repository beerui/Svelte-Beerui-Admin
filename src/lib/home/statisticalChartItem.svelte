<script>
  import { onMount } from "svelte"
  import * as echarts from 'echarts'
  export let value
  export let name
  export let lastMonth = 0
  export let year = 0
  export let id
  export let monthStr
  export let color = '#00B7FB'
  export let direction = 'column'


  $: {
    if (value) {
      initChart()
    }
  }

  function initChart() {
    const chart = echarts.init(document.getElementById(id))
    chart.setOption({
        polar: {
          radius: '180%'
        },
        angleAxis: {
            max: 100,
            show: false,
        },
        radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
        },
        series: [
            {
              name: '',
              type: 'bar',
              roundCap: true,
              barWidth: 6,
              showBackground: true,
              backgroundStyle: {
                  color: color,
                  opacity: 0.15,
              },
              data: [value],
              coordinateSystem: 'polar',
              color: color
            }
        ]
    })
  }

  onMount(() => {
    initChart()
  })
</script>

<div class="w-full h-full flex items-center justify-between" style={`flex-direction:${direction}`}>
  <div class="home-dialog-statistical-chart">
    <div class="home-dialog-statistical-progress" id={id}></div>
    <div class="home-dialog-statistical-data" style={`color:${color}`}>
      <div>
        <span class="home-dialog-statistical-data-value">{value}</span>
        <span>%</span>
      </div>
      <span class="home-dialog-statistical-data-text">{name}</span>
    </div>
  </div>
  <div class="home-dialog-statistical-old">
    <div class="home-dialog-statistical-old-bar">
      <span>{ monthStr }</span>
      <span class="text-white">{lastMonth}%</span>
    </div>
    <div class="home-dialog-statistical-old-bar">
      <span>同年</span>
      <span class="text-white">{year}%</span>
    </div>
  </div>
</div>

<style lang="scss">
.home-dialog-statistical {
    &-chart {
      display: flex;
    }
    &-data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 14px;
      color: #1DC2FF;
      font-size: 18px;
      &-value {
        font-size: 28px;
        font-weight: bold;
      }
      &-text {
        color: #fff;
        font-size: 14px;
      }
    }
    &-progress {
      width: 70px;
      height: 70px;
    }
    &-old {
      // margin-top: 19px;
      &-bar {
        width: 167px;
        height: 26px;
        background: url('/assets/home/home_dialog.png') no-repeat;
        background-position: 0 -220px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 22px;
        padding-left: 29px;
        box-sizing: border-box;
        color: #96CEFD;
        font-size: 14px;
        margin-bottom: 4px;
      }
    }
  }
  .justify-between {
    justify-content: space-between;
  }

</style>