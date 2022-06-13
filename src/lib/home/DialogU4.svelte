<script>
  import { createEventDispatcher, onMount } from "svelte";
  import * as echarts from 'echarts'
  import {
    sensor_device_count,
    factory_aand_water_level_statistic
  } from '$api/home'

  export let activeIndex = 0
  // 泵站-pump 闸门-zha 水文站-level 水厂供水-water_work
  let list = [
    { type: 'pump', label: '泵站', num: 0 },
    { type: 'zha',  label: '闸门', num: 0 },
    { type: 'level', label: '水文站', num: 0 },
    { type: 'water_work', label: '水厂供水', num: 0 }
  ]
  let lastMonthRiver = {
    xAxis: [],
    yAxis1:[],
    yAxis2:[]
  }
  let layerType = {
    pump: [],
    zha: [],
    level: [],
    water_work: []
  }

  let waterLevelStatistic = {
    beyondCount: 0, // 超限总次数
    beyondRiverCount: 0, // 最新超限河道数量
    flow: 0, // 流量规模
    levelTime: '', // 水位监测最新更新时间
    riverCount: 0, // 水位监测河道数量
    supplyTime: '', // 供水最新更新时间
    supplyWaterScale: 0 // 供水规模
  }

  const dispatch = createEventDispatcher()
  const handleClick = (type, index) => {
    if (activeIndex === index) {
      activeIndex = ''
    } else {
      activeIndex = index
    }
    dispatch('clickTypeHandle', type)
  }

  const getSensorDeviceCount = () => {
    sensor_device_count().then(res => {
      list[0].num = res.pumpCount || 0
      list[1].num = res.gateCount || 0
      list[2].num = res.hydrologyCount || 0
      list[3].num = res.supplyWaterCount || 0
      lastMonthRiver.xAxis = res.deviceTypeNameList || []
      lastMonthRiver.yAxis1 = res.normalDeviceCountList || []
      lastMonthRiver.yAxis2 = res.errorDeviceCountList || []
      initChart()
      classifyLayerType(res.layers || [])
    })
  }

  /**
   * 设备类型：layerType 1=泵站；2=闸门；3=水文监测；4=水厂
   */
  const classifyLayerType = (layers) => {
    const mapStatus = {
      1: 'pump',
      2: 'zha',
      3: 'level',
      4: 'water_work'
    }
    layers.forEach(val => {
      layerType[mapStatus[val.layerType]].push(val)
    })
  }

  const factoryAndWaterLevelStatistic = () => [
    factory_aand_water_level_statistic().then(res => {
      waterLevelStatistic = res
    })
  ]

  function initChart() {
    const chart = echarts.init(document.getElementById('analysis_operating_data-content'))
    chart.setOption({
      grid: {
        containLabel: true,
        left: 0,
        top: 20,
        bottom: 80,
        right: 0
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 38,
        textStyle: {
          color: '#fff'
        },
        itemWidth: 12,
        itemHeight: 6,
        data: [{name:'运行',
          itemStyle: {
            color:'#00B7FB'
          }
        },{name:'异常',
          itemStyle: {
            color:'#FCC900'
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
            color: '#B1D5F9',
            textStyle: {
              fontSize: 12
            },
            formatter: params => {
              return params.replace(/(.{2}\/.{1})|(.{2})/g, val => {
                return `${val}\n`
              })
            }
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
          }
        }
      ],
      series: [
        {
          name: '运行',
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
        },
        {
          name: '异常',
          type: 'bar',
          barWidth:10,
          data: lastMonthRiver.yAxis2,
            itemStyle:{
            normal:{
                color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#FFCC00'
                }, {
                    offset: 1,
                    color: 'rgba(255, 187, 3, 0.18)'
                }], false)
            }
        },
        }
      ]
    })
  }

  onMount(() => {
    getSensorDeviceCount()
    factoryAndWaterLevelStatistic()
  })
</script>


<div class="home-dialog">
  <div class="sensing-layer">
    <div class="sensing-layer-data">
      {#each list as item, index}
      <div on:click={() => handleClick(item.type, index)} class="sensing-layer-data_item sensing-layer-data_item_{index+1}" class:active={index === activeIndex}>
        <div class="legend_warning">
          <span>{item.label}</span>
          <span>{item.num}</span>
        </div>
      </div>
      {/each}
    </div>
  </div>
  <div class="analysis_water_supply">
    <div class="analysis_water_supply-header">
      <img src="/assets/home/analysis_water_supply.png" alt="">
      <span>最新更新时间：{waterLevelStatistic.supplyTime}</span>
    </div>
    <div class="analysis_water_supply-content">
      <div class="count cut-line">
        <p>{waterLevelStatistic.supplyWaterScale}</p>
        <p>供水规模(万吨/天)</p>
      </div>
      <div class="count">
        <p>{waterLevelStatistic.flow}</p>
        <p>流量(m/s)</p>
      </div>
    </div>
  </div>
  <div class="analysis_water_level">
    <div class="analysis_water_level-header">
      <img src="/assets/home/analysis_water_level.png" alt="">
      <span>最新更新时间：{waterLevelStatistic.levelTime}</span>
    </div>
    <div class="analysis_water_level-content">
      <div class="count cut-line">
        <p>{waterLevelStatistic.riverCount}<span>条</span></p>
        <p>水位监测河道</p>
      </div>
      <div class="count cut-line">
        <p>{waterLevelStatistic.beyondCount}<span>次</span></p>
        <p>超限次数</p>
      </div>
      <div class="count">
        <p>{waterLevelStatistic.beyondRiverCount}<span>处</span></p>
        <p>超限河道</p>
      </div>
    </div>
  </div>
  <div class="analysis_operating_data">
    <div class="analysis_operating_data-header">
      <img src="/assets/home/data_operation_analysis.png" alt="">
    </div>
    <div id="analysis_operating_data-content" class="analysis_operating_data-content" />
  </div>
</div>

<style lang="scss">
  .home-dialog{
    width: 431px;
    max-height: calc(100vh - 170px);
    margin-top: 48px;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(7, 20, 41, 0.88);
    box-shadow: 0 0 16px #2373E8 inset;
    padding: 12px 20px;
    .sensing-layer{
      &-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          margin-left: -20px;
        }
        &_legend {
          display: flex;
          .legend_normal {
            margin-right: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      &-data {
        margin-top: 7px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 4px;
        &_item {
          width: 186px;
          height: 119px;
          margin-bottom: 8px;
          cursor: pointer;
          background: url(/assets/home/hydraulic.png) no-repeat;
          background-position: 0 -276px;
          display: flex;
          align-items: center;
          font-size: 22px;
          color: #5ED2F8;
          padding: 55px 0 0;
          justify-content: center;
          &_1 {
            background-position: -19px -286px;
            &.active {
              background-position: -19px -20px;
            }
          }
          &_2 {
            background-position: -216px -286px;
            &.active {
              background-position: -216px -20px;
            }
          }
          &_3 {
            background-position: -19px -419px;
            &.active {
              background-position: -19px -153px;
            }
          }
          &_4 {
            background-position: -216px -419px;
            &.active {
              background-position: -216px -153px;
            }
          }
          &_5 {
            background-position: 0px -429px;
            &.active {
              background-position: 0 -758px;
            }
          }
          &_6 {
            background-position: -194px -429px;
            &.active {
              background-position: -194px -758px;
            }
          }
          &_7 {
            background-position: 0px -505px;
            &.active {
              background-position: 0 -834px;
            }
          }
          &_8 {
            background-position: -194px -505px;
            &.active {
              background-position: -194px -834px;
            }
          }
        }
      }
    }
    .analysis_water_supply, .analysis_water_level, .analysis_operating_data {
      &-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 33px;
        img {
          margin-left: -20px;
        }
        span {
          color: #96CEFD;
          font-size: 14px;
        }
      }
      &-content {
        height: 96px;
        display: flex;
        justify-content: center;
        position: relative;
        background: url('/assets/home/analyse_bg.png') -18px bottom / auto auto no-repeat;
        .count {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 50%;
          p {
            &:nth-child(1) {
              margin-bottom: 4px;font-size: 24px;color: #1DC2FF;font-weight: bold;
              span {font-size: 14px;margin-left: 4px;}
            }
            &:nth-child(2) {font-size: 14px;color: #ffffff;}
          }
          &:nth-child(2) {
            p {
              &:nth-child(1) {color: #00D999;}
            }
          }
        }
      }
    }
    .analysis_water_level {
      &-content {
        .count {
          width: 33.333333%;
          &:nth-child(1) {
            p {
              &:nth-child(1) {color: #61D9FD;}
            }
          }
          &:nth-child(2) {
            p {
              &:nth-child(1) {color: #F4DD1F;}
            }
          }
          &:nth-child(3) {
            p {
              &:nth-child(1) {color: #FF3A3A;}
            }
          }
        }
      }
    }
    .cut-line {
      position: relative;
      &::after {
        position: absolute;
        right: -5px;
        top: 50%;
        display: block;
        content: "";
        width: 11px;
        height: 74px;
        transform: translateY(-50%);
        background: url('/assets/home/parting_line.png') 100% 100% / 100% 100% no-repeat;
      }
    }
    .analysis_operating_data {
      &-content {
        height: 263px;
        background: none;
      }
    }
  }
  .legend_warning {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-weight: bold;
      &:nth-child(1) {font-size: 18px;color: #fff;opacity: 0.8;margin-right: 10px;}
      &:nth-child(2) {font-size: 28px;color: #60D6FD;}
    }
  }
  .normal-item {
    display: inline-block;
    width: 8px;
    height: 4px;
    background: #5FD6FD;
  }
  .normal-text {
    margin-left: 5px;
    color:#5ED5FD;
    font-size: 14px;
  }
  .font-14 {
    font-size: 14px;
  }
</style>
