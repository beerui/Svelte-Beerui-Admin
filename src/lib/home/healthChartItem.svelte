<script>
  import { onMount } from "svelte"
  import * as echarts from 'echarts'
  export let id
  export let colorMap = {
    'Ⅰ': '#58D6FE',
    'Ⅱ': '#19ACF2',
    'Ⅲ': '#5ED525',
    'Ⅳ': '#25B462',
    'Ⅴ': '#FEC20D',
    '劣Ⅴ': '#FF5604'
  }
  export let bgImg = '/assets/home/grade_icon.png'
  export let data = [{
    name:'Ⅰ',
    value: 8
  },{
    name:'Ⅱ',
    value: 20
  },{
    name:'Ⅲ',
    value: 25
  },{
    name:'Ⅳ',
    value: 22
  },{
    name:'Ⅴ',
    value: 10
  },{
    name:'劣Ⅴ',
    value: 15
  }]
onMount (async() => {
  initChart()
})
function initChart() {
  const chart = echarts.init(document.getElementById(id))
  const chartData = data.map(val => {
    return {
      value: val.value,
      name: val.name,
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [{
              offset: 1, color: colorMap[val.name] // 0% 处的颜色
            }, {
              offset: 0, color: 'transparent' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    }
  })
  const legendData = data.map(val => {
    return {
      name: val.name,
      itemStyle: {
        color: colorMap[val.name]
      }
    }
  })
  const filterValue = (v) => data.filter(el => el.name === v)[0].value
  chart.setOption({
        legend: {
          orient: 'vertical',
          top: 'bottom',
          itemWidth:10,
          // width:300,
          // height:50,
          itemGap:10,
          itemHeight:4,
          top: '170',
          data: legendData,
          textStyle: {
            fontSize: 12,
            color: '#ffffff',
            width: 50,
          },
          formatter(params) {
            return params + ' ' + filterValue(params) + '%'
          }
        },
        series: [{
          // name: '总考生数量',
          type: 'pie',
          radius: ['70%', '80%'],
          center: ['50%', '35%'],
          hoverAnimation: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: chartData
        }]
      })
}
</script>

<div class="pie-chart-item" id={id} style={` background: url(${bgImg}) no-repeat; background-position: 42px 40px;`}>
</div>

<style lang="scss">
  .pie-chart-item {
    width: 180px;
    height: 250px;
    margin-left: 20px;
  }
</style>
