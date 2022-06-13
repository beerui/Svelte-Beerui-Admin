<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { goto } from "$app/navigation";

  const dispatch = createEventDispatcher()
  let map = null
  export let maskVisible = true
  let markerList = []
  let activeIndex = 0
  let btnList = [
    { id: 1, name: '活水泵站', canSelected: true, value: 10 },
    { id: 2, name: '活水闸门', canSelected: true, value: 10 },
    { id: 3, name: '监控点', canSelected: false, value: 10 },
    { id: 4, name: '低洼点', canSelected: false, value: 10 },
    { id: 5, name: '受淹处', canSelected: false, value: 10 }
  ]
  let pumpList = [
    { lnglat: '120.568803,29.995072', name: '螺丝畈泵站', status: '引水中', riverway: '环山河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.581688,29.982404', name: '南门泵站', status: '排水中', riverway: '环山河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.589442,29.983201', name: '小罗门泵站', status: '停用', riverway: '环山河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.599176,29.991684', name: '东廓泵站', status: '故障', riverway: '环山河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.596434,29.988255', name: '林木市场泵站', status: '排水引水中', riverway: '环山河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
  ]
  let sluiceList = [
    { lnglat: '120.569161,30.013678', name: '迎恩门节制闸', status: '开度30°', riverway: '府山桥闸', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.573991,30.010576', name: '北海桥制闸', status: '故障', riverway: '环山河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.568614,30.004251', name: '府山桥节制闸', status: '关闭中', riverway: '鲁迅路河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.587605,30.007759', name: '西街节制闸', status: '关闭中', riverway: '鲁迅路河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.581363,29.982429', name: '南门节制闸', status: '关闭中', riverway: '鲁迅路河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.587086,29.982923', name: '罗生门节制闸', status: '关闭中', riverway: '鲁迅路河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.599195,29.991231', name: '东廓节制闸', status: '关闭中', riverway: '鲁迅路河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
    { lnglat: '120.597802,29.982933', name: '稽山节制闸', status: '关闭中', riverway: '鲁迅路河', scale: '3*1.1', inWaterLevel: 4.35, outWaterLevel: 4.52 },
  ]

  onMount(async() => {
    initMap()
  })

  function handleChange(item, index) {
    if (item.canSelected) {
      activeIndex = index
      dispatch('tabChange', item)
      clearMarker()
      addMarker()
    }
  }

  function addMarker() {
    let list = pumpList
    if (activeIndex === 1) {
      list = sluiceList
    }
    list.forEach(val => {
      let content = ''
      if (activeIndex === 0) {
        let imgName = 'pump.png', statusClass = 'normal'
        if (val.status === '停用') {
          imgName = 'pump.png'
          statusClass = 'close'
        } else if (val.status === '故障') {
          imgName = 'pump_breakdown.png'
          statusClass = 'breakdown'
        } else if (val.status === '排水中' || val.status === '排水引水中') {
          imgName = 'pump_drain.gif'
          statusClass = 'drain'
        }
        content = `
          <div class="absolute drainage-window drainage-pump-info">
            <div class="head flex items-center relative drainage-window-a" data-name="${val.name}">
              <div class="name text-white" data-name="${val.name}">${val.name}</div>
              <a href="/pump?name=${val.name}" class="name text-white" data-name="${val.name}">${val.name}</a>
            </div>
            <div class="content flex flex-col drainage-justify-between">
              <div class="flex items-center drainage-justify-between">
                <div class="label flex items-center">所在河道：</div>
                <div class="text-white">${val.riverway}</div>
              </div>
              <div class="flex items-center drainage-justify-between">
                <div class="label flex items-center">抽水泵规模（m3/s）</div>
                <div class="text-white">${val.scale}</div>
              </div>
              <div class="flex">
                <div class="flex flex-1">
                  <div class="label flex items-center">内河水位：</div>
                  <div class="text-14 text-white font-bold">${val.inWaterLevel}</div>
                </div>
                <div class="flex flex-1">
                  <div class="label flex items-center">外河水位：</div>
                  <div class="text-14 text-white font-bold">${val.outWaterLevel}</div>
                </div>
              </div>
            </div>
          </div>
          <img src="/assets/drainage/${imgName}" alt="" class="w-full h-full">
        `
      }
      if (activeIndex === 1) {
        let imgName = 'sluice_left_open', statusClass = 'normal'
        if (val.status === '关闭中') {
          imgName = 'sluice_left_close'
          statusClass = 'close'
        } else if (val.status === '故障') {
          imgName = 'sluice_breakdown'
          statusClass = 'breakdown'
        }
        content = `
        <div class="absolute drainage-window drainage-sluice-info">
            <div class="head flex items-center relative">
              <div class="name text-white">${val.name}</div>
              <div class="status flex items-center justify-end flex-1 ${statusClass}">${val.status}</div>
            </div>
            <div class="content flex flex-col drainage-justify-between">
              <div class="flex items-center drainage-justify-between">
                <div class="label flex items-center">所在河道：</div>
                <div class="text-white">${val.riverway}</div>
              </div>
              <div class="flex">
                <div class="flex flex-1">
                  <div class="label flex items-center">内河水位：</div>
                  <div class="text-14 text-white font-bold">${val.inWaterLevel}</div>
                </div>
                <div class="flex flex-1">
                  <div class="label flex items-center">外河水位：</div>
                  <div class="text-14 text-white font-bold">${val.outWaterLevel}</div>
                </div>
              </div>
            </div>
          </div>
          <img src="/assets/drainage/${imgName}.png" alt="" class="w-full h-full">
        `
      }
      const lnglat = val.lnglat.split(',')
      const marker = new AMap.Marker({
        position: new AMap.LngLat(lnglat[0], lnglat[1]),
        content: `<div class="drainage-marker relative" style="width: 130px; height: 130px">
            ${content}
          <div>`,
        offset: new AMap.Pixel(-65, -65)
      })
      marker.on('mouseover', e => {
        e.target.setTop(true)
      })
      marker.on('mouseout', e => {
        e.target.setTop(false)
      })
      markerList.push(marker)
    })
    map.add(markerList)
    // map.setFitView()
    if (activeIndex === 0) {
      map.setCenter([120.588062,29.988441])
      map.setZoom(15)
    }
    if (activeIndex === 1) {
      map.setCenter([120.588062,29.988441])
      map.setZoom(14)
    }
		try {
			Object.entries(document.querySelectorAll('.drainage-window-a')).forEach(el => {
				const _item = el[1];
				_item.addEventListener('touchend',  function (evt) {
					//href="/pump?name=${val.name}"
					goto('/pump?name=' + evt.target.dataset.name)
				})
			})
		} catch (e) {
			console.log(e)
		}
  }

  function clearMarker() {
    map.remove(markerList)
    markerList = []
  }

  function initMap() {
    map = new AMap.Map('map', {
      center: [120.591224,29.979312],
      autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      showIndoorMap: false, // 是否在有矢量底图的时候自动展示室内地图，PC默认true,移动端默认false
      resizeEnable: true, // 是否监控地图容器尺寸变化，默认值为false
      doubleClickZoom: true, // 地图是否可通过双击鼠标放大地图，默认为true
      zoomEnable: true, // 地图是否可缩放，默认值为true
      rotateEnable: false, // 地图是否可旋转，3D视图默认为true，2D视图默认false
      mapStyle: 'amap://styles/6d4c7238d01b609ae86342e614f858db',
      viewMode:'3D', // 地图模式
      pitch:35, // 地图俯仰角度，有效范围 0 度- 83 度
      zoom: 15 // 初始化地图层级
    })

    map.on('complete', () => {
      addMarker()
    })

    map.on('click', e => {
      const { lnglat } = e
      console.log(`${lnglat.lng},${lnglat.lat}`)
    })
  }
</script>
<div class="relative w-full h-full">
  <div id="map" class="w-full h-full" />
  <div class="mask absolute top-0 left-0 w-full h-full pointer-events-none {!maskVisible ? 'mask-visible' : ''}" />
</div>
<div class="g-left absolute top-0 left-0 box-border f-scroll">
  <div>
    {#each btnList as item, index(item.name)}
      <div class="f-btn flex flex-col items-center justify-center" class:active={index === activeIndex} on:click={e => handleChange(item, index)}>
        <span class="name collorfff">{ item.name }</span>
        <span class="value">{ item.value }</span>
      </div>
    {/each}
  </div>
</div>
<style lang="scss">
  .mask {
    background: url(/assets/drainage/map_mask_bg.png) 0 0 / 100% 100% no-repeat;
    opacity: 1;
    transition: opacity .4s
  }
  .mask-visible {
    opacity: 0;
  }
  .g-left {
    left: 18px;
    padding-top: 20px;
    .f-btn {
      width: 142px;
      height: 73px;
      margin-bottom: 15px;
      padding-top: 7px;
      background: url(/assets/icon_toolbar.png) no-repeat;
      background-position: -4px -292px;
      &:nth-child(-n+2) {
        cursor: pointer;
        &:hover {
          background-position: -4px -409px;
          .value {
            color: #FFF;
          }
        }
      }
    }
    .name {
      color: #FFF;
      line-height: 14px;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .value {
      color: #00d1ff;
      line-height: 26px;
      font-size: 26px;
    }
    .active {
      background-position: -4px -409px;
      .value {
        color: #FFF;
      }
    }
  }
  :global(.drainage-justify-between) {
    justify-content: space-between;
  }
  :global(.drainage-pump-info) {
    top: -150px;
    left: -82px;
    width: 387px;
    height: 174px;
    padding: 0 25px 0 35px;
    background: url(/assets/drainage/pump_bg.png) 0 0 / 100% 100% no-repeat;
  }
  :global(.drainage-pump-info .head) {
    height: 48px;
    padding: 13px 12px 0 0;
    font-weight: bold;
    margin-bottom: 17px;
  }
  :global(.drainage-window .head::before) {
    position: absolute;
    bottom: -2px;
    left: 0;
    z-index: 2;
    display: block;
    content: "";
    width: 77px;
    height: 2px;
    background: #3B93ED;
  }
  :global(.drainage-window .head::after) {
    position: absolute;
    bottom: -2px;
    left: 0;
    z-index: 1;
    display: block;
    content: "";
    width: 100%;
    height: 0;
    border-bottom: 1px dashed #68BDFF;
  }
  :global(.drainage-window .head .name) {
    max-width: 243px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
  }
  :global(.drainage-window .head .status) {
    font-size: 16px;
    // padding-right: 12px;
  }
  :global(.drainage-window .head .status::before) {
    display: block;
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 11px;
  }
  :global(.drainage-window .head .normal) {
    color: #44F61E;
  }
  :global(.drainage-window .head .normal::before) {
    background: #44F61E;
    box-shadow: 0 0 6px 2px #2de506;
  }
  :global(.drainage-window .head .drain) {
    color: #00FFFC;
  }
  :global(.drainage-window .head .drain::before) {
    background: #00FFFC;
    box-shadow: 0 0 6px 2px #00FFFC;
  }
  :global(.drainage-window .head .close) {
    color: #D3D3D3;
  }
  :global(.drainage-window .head .close::before) {
    display: none;
  }
  :global(.drainage-window .head .breakdown) {
    color: #FF1919;
  }
  :global(.drainage-window .head .breakdown::before) {
    background: #FF1919;
    box-shadow: 0 0 6px 2px #FF1919;
  }
  :global(.drainage-pump-info .content) {
    height: 74px;
    padding-right: 12px;
    color: #96CEFD;
    font-size: 14px;
  }
  :global(.drainage-window .content .label::before) {
    display: block;
    content: "";
    width: 3px;
    height: 3px;
    border-radius: 50%;
    margin-right: 9px;
    background: #96CEFD;
  }
  :global(.drainage-sluice-info) {
    top: -135px;
    left: -82px;
    width: 372px;
    height: 141px;
    padding: 0 5px 0 32px;
    background: url(/assets/drainage/sluice_bg.png) 0 0 / 100% 100% no-repeat;
  }
  :global(.drainage-sluice-info .head) {
    height: 48px;
    padding: 13px 18px 0 0;
    font-weight: bold;
    margin-bottom: 17px;
  }
  :global(.drainage-sluice-info .content) {
    height: 47px;
    padding-right: 12px;
    color: #96CEFD;
    font-size: 14px;
  }
</style>
