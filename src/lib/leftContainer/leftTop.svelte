<script>
  import * as echarts from 'echarts'
  import { onMount, tick } from 'svelte'
  import { fly } from 'svelte/transition'
  import { pump_and_level_statistics, SWDataservice } from "../../api/home.js";
  import { FormatTime } from "@brewer/beerui/utils/beerui";
  import { getWind, setWind } from "../../utils/auth.js";

  export let visible = false

  // 台风
  let theWind = {
      lat: '',
      lng: '',
      length: '',
		  strong: '',
		  power: '',
		  speed: '',
		  moverspeed: '',
		  name: '',
		  time: '',
		  movedirection: '',
      distance: '',
      enname: ''
  }
	onMount(() => {
		const _theWind = getWind()
		if (!_theWind) {
		  SWDataservice().then(res => {
				  if (res.data.status === 999) {
		          theWind = res.data.dataList[0]
					    setWind(theWind)
					    formatData()
				  }
		  })
		} else {
			theWind = _theWind
			formatData()
		}
	})
  
  const formatData = () => {
	  const times = new FormatTime('yyyy.MM.dd HH:mm', theWind.time);
	  theWind.time = times.getTime
	  const meter = AMap.GeometryUtil.distance([theWind.lng, theWind.lat], [120.670009, 29.997754])
	  theWind.distance = (meter/1000).toFixed(2);
  }
  let activeIndex = 0

  function navChange(index) {
    if (activeIndex === index) return
    activeIndex = index
    if (index === 1) {
        pump_and_level_statistics().then(res => {
            init(res)
        })
    }
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
            borderWidth: 2,
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
            borderWidth: 2
          }
        }
      })
    })
    return list
  }
  /**
   * 初始化图表
   * @param domId 图表容器id
   * @param legendUnit 图例单位
   * @param targetData 图表源数据
   */
  function initChart(domId, legendUnit, targetData) {
    const chart = echarts.init(document.getElementById(domId))
    const color = ['#2587FF', '#E8B039', '#6A6A6A']
    chart.setOption({
      legend: {
        top: 22,
        left: 95,
        itemWidth: 2,
        itemHeight: 11,
        selectedMode: false,
        textStyle: {
          color: '#E8ECEF',
          padding: [0, 0, 0, 6],
          fontSize: 14,
        },
        formatter: name => {
          const value = targetData.find(val => val.name === name).value
          return `${name}:${value}${legendUnit}`
        }
      },
      series: {
        type: 'pie',
        radius: [37, 37.1],
        center: [48, 56.5],
        color: color,
        hoverAnimation: false,
        label: {
          show: false
        },
        data: setPieChartData(targetData, color)
      }
    })
  }

  async function init(data) {
    await tick()
    const leftData = [
      { name: '正常', value: data.pumpStatistics.normalAmount },
      { name: '未运行', value: data.pumpStatistics.notRunAmount },
      { name: '异常', value: data.pumpStatistics.abnormalAlarmAmount }
    ]
    const rightData = [
      { name: '正常', value: data.waterLevelStatistics.normalAmount },
      { name: '超警戒', value: data.waterLevelStatistics.abnormalAmount },
    ]
    initChart('left-chart', '座', leftData)
    initChart('right-chart', '条', rightData)
  }
</script>
{#if visible}
<div class="g-container" in:fly="{{ x: -436, duration: 800 }}">
  <div class="m-nav flex cursor-pointer">
    <div class="m-nav-item font-normal biao-ti-hei {activeIndex === 0 ? 'active' : ''}" on:click={() => navChange(0)}>
      台风预警
    </div>
    <div class="m-nav-item font-normal biao-ti-hei {activeIndex === 1 ? 'active' : ''}" on:click={() => navChange(1)}>
      古城水情
    </div>
  </div>
  {#if activeIndex === 0}
    <div class="m-nav-content flex items-center justify-center">
      <div class="content-1 flex">
        <div class="left">
          <div class="name relative flex items-center">
            <span class="font-bold" title={theWind.name}>{theWind.name}</span>
            <span>{theWind.enname}</span>
          </div>
          <div class="time">{theWind.time}</div>
          <div class="describe flex items-center justify-center font-bold">
<!--            台风“灿嘟“将缓 慢移动，强度变化 不大。-->
	          台风“{theWind.name}“ 气压{theWind.pressure}，风向{theWind.pressure}。
          </div>
        </div>
        <div class="right">
          <p>中心位置：纬度：{theWind.lat}度、经度{theWind.lng}度</p>
          <p>强度等级：{theWind.strong}</p>
          <p>最大风力：{theWind.power}级，{theWind.speed}米/秒（约{theWind.movespeed}公里/小时）</p>
          <p>参考位置：风向:{theWind.movedirection}，距离绍兴市{theWind.distance}公里</p>
<!--          <p>参考位置：位于东海北部海面，距离绍兴市偏南方向580公里</p>-->
        </div>
      </div>
    </div>
  {:else}
    <div class="m-nav-content">
      <div class="content-2">
        <div class="top flex items-center">
          <div class="bell" />
          <p class="text">温馨提示：古城水情一切正常</p>
        </div>
        <div class="bottom flex">
          <div class="left flex-1">
            <div class="head flex items-center font-bold">泵闸站运行</div>
            <div class="content relative">
              <div id="left-chart" class="w-full h-full" />
              <div class="bg absolute flex items-center justify-center cursor-pointer">
                <img src="/assets/home/pump_icon.png" alt="" class="icon">
              </div>
            </div>
          </div>
          <div class="right flex-1">
            <div class="head flex items-center font-bold">河道水位</div>
            <div class="content relative">
              <div id="right-chart" class="w-full h-full" />
              <div class="bg absolute flex items-center justify-center cursor-pointer">
                <img src="/assets/home/water_level_icon.png" alt="" class="icon">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
{/if}
<style lang="scss">
  .g-container {
    height: 234px;
    padding: 9px 0 4px;
    background: url(/assets/home/left_top_bg.png) 0 0 / 100% 100% no-repeat;
    .m-nav {
      padding-left: 16px;
      &-item {
        margin-right: 12px;
        line-height: 20px;
        font-size: 20px;
        opacity: 0.75;
        background-image:-webkit-linear-gradient(bottom, #3684f8, #fcfffe,);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }
      .active {
        opacity: 1;
      }
    }
    .m-nav-content {
      height: 203px;
      padding: 0 11px;
      .content-1 {
        width: 421px;
        height: 177px;
        background: url(/assets/home/typhoon_bg.png) 0 0 / 100% 100% no-repeat;
        .left {
          width: 134px;
          height: 100%;
          margin-right: 8px;
          padding: 0 9px 0 14px;
          flex-shrink: 0;
          .name {
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            margin: 15px 0 11px;
            span {
              &:nth-child(1) {
                display: block;
                width: 80px;
                font-size: 20px;
                line-height: 20px;
                margin-bottom: 7px;
                background: linear-gradient(0deg, rgba(255, 37, 37) -14%, rgba(255, 255, 255, 1) 90.1123046875%);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &:nth-child(2) {
                font-size: 12px;
                line-height: 12px;
                color: rgba(221, 239, 246, .6);
                font-weight: 300;
              }
            }
            &::after {
              position: absolute;
              top: -13px;
              right: -7px;
              display: block;
              content: "";
              width: 51px;
              height: 48px;
              background: url('/assets/home/typhoon_alert.png') 100% 100% / 100% 100% no-repeat;
            }
          }
          .time {
            font-size: 12px;
            line-height: 12px;
            color: rgba(235, 247, 255, .6);
            letter-spacing: 0;
          }
          .describe {
            height: 86px;
            margin-top: 13px;
            font-size: 12px;
            color: #FF4646;
            line-height: 1.6;
            font-family: MicrosoftYaHei;
          }
        }
        .right {
          height: 100%;
          color: #f4fcff;
          font-size: 12px;
          line-height: 12px;
          padding: 0 18px 0 8px;
          background: #0b132d;
          p {
            padding: 13px 0 10px;
            border-bottom: 1px solid rgba(48, 143, 255, .1);
            line-height: 1.3;
          }
        }
      }
      .content-2 {
        padding: 10px 0 4px;
        .top {
          height: 28px;
          padding-left: 10px;
          background: radial-gradient(circle, rgba(37, 119, 255, .4), rgba(33, 205, 255, 0));
          .bell {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            background: url(/assets/home/bell.png) 0 0 / 100% 100% no-repeat;
          }
          .text {
            font-size: 12px;
            color: #E7ECEF;
          }
        }
        .bottom {
          height: 159px;
          padding-top: 12px;
          .head {
            font-size: 16px;
            color: #DDEFF6;
            padding-left: 10px;
            &::before {
              display: block;
              content: '';
              width: 4px;
              height: 18px;
              margin-right: 8px;
              background: linear-gradient(45deg, #47C6FE, #4FA2FF);
            }
          }
          .content {
            height: 107px;
            padding: 0 10px;
            .bg {
              top: 13px;
              left: 15px;
              width: 86px;
              height: 87px;
              background: url(/assets/home/pie_chart_bg.png) 0 0 / 100% 100% no-repeat;
            }
          }
        }
      }
    }
  }
</style>
