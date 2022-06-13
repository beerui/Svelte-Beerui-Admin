<script>
  import * as echarts from 'echarts'
  import { onMount } from 'svelte'
  import Dialog from '$lib/leftContainer/dialog.svelte'
  import FourTables from './fourCharts/index.svelte'
  import { BePagination, BeSelect, BeOption } from '@brewer/beerui'
  import { fly } from 'svelte/transition'
  import { fetchSewageManagementList } from '$api/home'

  export let aniVisible = false

  let data = []
  
  let year = getDate()

  let yearSelectList = [
    { label: 2019 },
    { label: 2020 },
    { label: 2021 },
    { label: 2022 },
  ]
  let xData = ['塔山街道', '府山街道', '蕺山街道', '北海街道', '稽山街道', '迪荡街道']
  let yData = [100, 100, 100, 100, 100, 100]
  let yData2 = [5, 20, 15, 20, 23, 20]
  let visible = false
  let tableList = [
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区解放大道月城花园', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区解放大道月城花园', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤林西路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤官渎路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤林西路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤官渎路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤林西路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤官渎路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤林西路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 },
    { town: '某某某街道', dwelling: '某某某小区', building: 20, unit: 20, address: '绍兴市越城区凤官渎路', chart1: 10, chart2: 10, chart3: 10, chart4: 10, chart5: 10 }
  ]
  const options = {
		card: true,
    // showNumber: 2,
		icon: {
			width: 12,
			height: 12,
			color: '#fff'
		}
	}
  
  // 一图四表详情
  let tableVisible = false

  onMount(() => {
    // initChart()
  })
  function initChart() {
    const chart = echarts.init(document.getElementById('sewage-chart'))
    chart.setOption({
      grid: {
        top: 53,
        left: 45,
        bottom: 32,
        right: 45
      },
      legend: {
        top: 10,
        right: 7,
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
          let str = '<p style="font-size: 14px; color: #fff">进度分析</p>\n'
          params.forEach(val => {
            if (val.seriesName) {
              str += `<p style="font-size: 12px; color: rgba(245, 245, 245, 0.68)">${val.marker} ${val.seriesName}: ${val.value}${val.seriesName === "完成进度" ? '%' : ''}</p>\n`
            }
          })
          return str
        }
      },
      xAxis: {
        axisLine: {
          lineStyle: {
            color: 'rgba(228, 248, 255, 0.1)'
          }
        },
        axisTick: {
          show: false //隐藏X轴刻度
        },
        axisLabel: {
          textStyle: {
            fontSize: 11,
            padding: [3,0,0,0],
            color: "rgba(255, 255, 255, 0.8)" //X轴文字颜色
          }
        },
        data: xData
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
              fontSize: 11,
              color: "#fff"
            }
          },
        },
        {
          type: "value",
          position: 'right',
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
            textStyle: {
              fontSize: 11,
              color: "#fff"
            }
          },
        },
      ],
      series: [
        {
          name: '',
          type: 'pictorialBar',
          silent: true,
          symbolSize: [16, 8],
          symbolOffset: [-12, -4],
          symbolPosition: 'end',
          z: 12,
          label: {
            show: false
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                {
                  offset: 0,
                  color: '#063D75',
                },
                {
                  offset: 1,
                  color: '#007FE0',
                },
              ]),
              opacity: 0.8,
            },
          },
          data: yData,
        },
        {
          name: '完成进度',
          yAxisIndex: 1,
          type: 'bar',
          barWidth: '16',
          barGap: '10%',
          barCateGoryGap: '10%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                {
                  offset: 0,
                  color: 'rgba(0, 115, 255, 0.99)',
                },
                {
                  offset: 1,
                  color: 'rgba(1, 186, 255, 0.2)',
                },
              ]),
              opacity: 0.8,
            },
          },
          data: yData,
        },
        {
          name: '',
          type: 'pictorialBar',
          silent: true,
          symbolSize: [16, 8],
          symbolOffset: [12, -4],
          symbolPosition: 'end',
          z: 12,
          label: {
            show: false
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                {
                  offset: 0,
                  color: '#0A7B64',
                },
                {
                  offset: 1,
                  color: '#01FFCC',
                },
              ]),
              opacity: 0.8,
            },
          },
          data: yData2,
        },
        {
          name: '完成小区数',
          type: 'bar',
          barWidth: '16',
          barGap: '50%',
          barCateGoryGap: '10%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                {
                  offset: 0,
                  color: 'rgba(1, 255, 204, 0.99)',
                },
                {
                  offset: 1,
                  color: 'rgba(1, 255, 204, 0.2)',
                },
              ]),
              opacity: 0.8,
            },
          },
          data: yData2,
        }
      ]
    })
  }

  function showDialog() {
    visible = true
    const leftDom = document.querySelector('.g-left-container')
    const rightDom = document.querySelector('.g-right-container')
    leftDom.style.zIndex = 1
    rightDom.style.zIndex = 2
  }

  function closeDialog() {
    visible = false
  }

  function changePage(val) {
    console.log(val)
  }

  // 一图四表详情
  let tableDetail = null
  function showDetail(item) {
    tableDetail = item
    visible = false
    tableVisible = true
  }

  function back() {
    hideDetail()
    visible = true
  }

  function hideDetail() {
    tableVisible = false
  }

  // 污水零直排区管理
  getSewageList()
  function getSewageList() {
    fetchSewageManagementList({ reRformYear: Number(year) }).then(res => {
      data = res
    })
  }
  let handleChange = () => {
    getSewageList()
  }
  function getDate() {
    const date = new Date()
    let year = date.getFullYear()
    return year
  }
</script>
{#if aniVisible}
<div class="g-container relative" in:fly="{{ x: 436, duration: 800, delay: 400 }}">
  <div class="head font-normal biao-ti-hei">污水零直排区管理</div>
  <div class="month-select">
    <BeSelect bind:value={year} clearable={true} on:change={() => handleChange()}>
      {#each yearSelectList as item,index}
      <BeOption bind:label={item.label} bind:value={ item.label} />
      {/each}
    </BeSelect>
  </div>
  <div class="content">
    <div class="list-wrap w-full h-full">
      {#each data as item }
      <div class="list">
        <div class="list-head">{item.twonName}</div>
        <div class="list-content">
          <div class="DIN-Bold">{item.sewageCount}</div>
        </div>
      </div>
      {/each}
    </div>
  </div>
</div>
{/if}
<Dialog bind:visible={visible}>
  <div slot="content" class="g-dialog relative">
    <div class="close absolute cursor-pointer" on:click={closeDialog} />
    <div class="table">
      <div class="table-head flex">
        <div class="item">序号</div>
        <div class="item">所属镇街</div>
        <div class="item">小区名称</div>
        <div class="item">楼栋数</div>
        <div class="item">单元数</div>
        <div class="item">地址</div>
        <div class="item">管点线成果表</div>
        <div class="item">排水口成果表</div>
        <div class="item">污染源成果表</div>
        <div class="item">设施问题清单表</div>
        <div class="item">排水设施分布图</div>
      </div>
      <div class="table-content">
        {#each tableList as item, index(item) }
          <div class="table-content-list flex">
            <div class="item">{index + 1}</div>
            <div class="item">{item.town}</div>
            <div class="item">
              <span class="cursor-pointer" style="text-decoration: underline;" on:click={() => showDetail(item)}>{item.dwelling}</span>
            </div>
            <div class="item">{item.building}</div>
            <div class="item">{item.unit}</div>
            <div class="item">{item.address}</div>
            <div class="item">{item.chart1}</div>
            <div class="item">{item.chart2}</div>
            <div class="item">{item.chart3}</div>
            <div class="item">{item.chart4}</div>
            <div class="item">{item.chart5}</div>
          </div>
        {/each}
      </div>
    </div>
    <div class="flex table-pagination" style="justify-content: flex-end;">
      <BePagination style="color: #fff" currentPage={1} pageSize={11} total={11} async layouts='' on:changePage={changePage} {options} />
    </div>
  </div>
</Dialog>
<Dialog bind:visible={tableVisible}>
  <div slot="content" class="g-table-dialog">
    <div class="head relative flex items-center justify-center">
      <div class="back absolute cursor-pointer" on:click={back} />
      <p class="title text-white font-bold">{tableDetail.dwelling}</p>
      <div class="close absolute cursor-pointer" on:click={hideDetail} />
    </div>
    <FourTables />
  </div>
</Dialog>
<style lang="scss">
  .g-container {
    height: 295px;
    padding: 9px 0 4px;
    margin-top: 12px;
    background: url(/assets/home/rightMidBottom.png) 0 0 / 100% 100% no-repeat;
    .head {
      padding-left: 15px;
      line-height: 20px;
      font-size: 20px;
      background-image: -webkit-linear-gradient(bottom, #3684f8, #fcfffe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .month-select {
      position: absolute;
      right: 15px;
      top: 38px;
      width: 108px;
      height: 28px;
      box-shadow: 0 0 15px 3px inset #1f4ea8;
      background: url('/assets/home/month_select_bg.png') 100% 100% / 100% 100% no-repeat;
    }
    .show-chart {
      top: 38px;
      left: 153px;
      width: 76px;
      height: 28px;
      z-index: 9;
    }
    .content {
      height: 261px;
      padding-top: 49px;
      .list-wrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 7px;
        overflow: auto;
        .list {
          width: 92px;
          height: 56px;
          background: url('/assets/home/sewage_list_bg.png') 100% 100% / 100% 100% no-repeat;
          margin: 0 6px 12px;
          &-head {
            height: 16px;
            line-height: 16px;
            color: #fff;
            font-size: 12px;
            text-align: center;
          }
          &-content {
            display: flex;
            height: 40px;
            &>div{
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              flex-shrink: 1;
              font-size: 20px;
              font-weight: bold;
              color: #39e8bc;
            }
          }
        }
      }
    }
  }
  .g-dialog {
    width: 1307px;
    height: 799px;
    padding: 102px 57px 19px 62px;
    background: url(/assets/home/four_tables_bg.png) 0 0 / 100% 100% no-repeat;
    .close {
      top: 59px;
      right: 59px;
      width: 14px;
      height: 14px;
    }
    .table {
      width: 100%;
      margin-bottom: 23px;
      &-head {
        height: 48px;
        background: rgba(27, 108, 230, 0.32);
      }
      &-content {
        &-list {
          position: relative;
          height: 48px;
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            content: '';
            width: 4px;
            height: 48px;
          }
          &:nth-child(2n) {
            background: rgba(27, 108, 230, 0.08)
          }
          &:hover {
            background: rgba(52, 143, 255, 0.4);
            &::before {
              background: #34BFFF;
            }
          }
        }
      }
      .item {
        display: flex;
        align-items: center;
        padding-left: 14px;
        height: 100%;
        color: #ECF6FA;
        font-size: 12px;
        &:nth-child(1) {
          width: 63px;
        }
        &:nth-child(2) {
          width: 99px;
        }
        &:nth-child(3) {
          width: 96px;
        }
        &:nth-child(4) {
          width: 73px;
        }
        &:nth-child(5) {
          width: 58px;
        }
        &:nth-child(6) {
          width: 210px;
        }
        &:nth-child(7) {
          width: 101px;
        }
        &:nth-child(8) {
          width: 118px;
        }
        &:nth-child(9) {
          width: 114px;
        }
        &:nth-child(10) {
          width: 126px;
        }
        &:nth-child(11) {
          flex: 1;
        }
      }
    }
  }
  .g-table-dialog {
    width: 1307px;
    height: 800px;
    padding: 53px 60px 19px 60px;
    background: url(/assets/home/table_dialog_bg.png) 0 0 / 100% 100% no-repeat;
    .head {
      .back {
        top: 5px;
        left: 0;
        width: 46px;
        height: 16px;
      }
      .title {
        font-size: 16px;
      }
      .close {
        top: 7px;
        right: 0;
        width: 14px;
        height: 14px;
      }
    }
  }
</style>
