<script> 
  import {
    BeDialog,
    BeInput,
    BeButton
  } from "@brewer/beerui";
  import { onMount } from "svelte";
  import { createEventDispatcher } from 'svelte'
  let  dispatch = createEventDispatcher()

  export let locationInfo = {
    name: '',
    location: { lat: '', lng: '' }
  }
  export let visible
  export let style
  let map = ''
  let addressStr = ''
  let marker = null
  let geocoder = null
  let autocomplete = null // 联想搜索
  let geoLocation = null
  let location = {}
  let tipList = [] // 搜索提示
  let showButton = true

// ------------------------------------------------------------------------

  onMount(async () => {
    fetchMap()
  })
  function fetchMap() {
    map = new AMap.Map('mapContainer', {
      autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      showIndoorMap: false, // 是否在有矢量底图的时候自动展示室内地图，PC默认true,移动端默认false
      resizeEnable: true, // 是否监控地图容器尺寸变化，默认值为false
      dragEnable: true, // 地图是否可通过鼠标拖拽平移，默认为true
      keyboardEnable: true, // 地图是否可通过键盘控制，默认为true
      doubleClickZoom: true, // 地图是否可通过双击鼠标放大地图，默认为true
      zoomEnable: true, // 地图是否可缩放，默认值为true
      rotateEnable: false, // 地图是否可旋转，3D视图默认为true，2D视图默认false
      zoom: 15, // 初始化地图层级
      center: [120.585345, 29.991950] // 地图打开默认显示越城区古城
    })
    map.on('complete', function() {
      // 点选地图
      getPointFun()
      // 有位置信息 回显
      if (locationInfo && locationInfo.name && locationInfo.location) {
        goSearch(locationInfo.name, locationInfo.location)
      } else {
        // 精准定位
        geoLocationAddress()
      }
      // 加载输入提示插件
      AMap.plugin('AMap.AutoComplete', function() {
        autocomplete = new AMap.Autocomplete({ input: 'tipInput' })
      })
    })
  }
  
  // 点击地图事件
  function getPointFun() {
    // 为地图注册click事件获取鼠标点击出的经纬度坐标
    map.on('click', function(e) {
      showButton = false
      location = { lng: e.lnglat.lng, lat: e.lnglat.lat }
      getNameFromPoint(location)
    })
  }
  // 地点搜索服务，关键字搜索、周边搜索、范围内搜索等
  function getNameFromPoint(items) {
    if (marker) map.remove(marker)
    // if (infoWindow) infoWindow.close()
    const lnglats = [items.lng, items.lat]
    if (!geocoder) {
      map.plugin('AMap.Geocoder', function() {
        geocoder = new AMap.Geocoder({
          city: '330100', // 城市设为北京，默认：“全国”
          radius: 1000 // 范围，默认：500
        })
        initAddress(lnglats)
      })
    } else {
      initAddress(lnglats)
    }
    map.setCenter(lnglats)

    // 构造点标记
    marker = new AMap.Marker({
      position: lnglats,
      map: map
    })
  }
  function initAddress(lnglats) {
    geocoder.getAddress(lnglats, function(status, result) {
      if (status === 'complete' && result.regeocode) {
        addressStr = result.regeocode.formattedAddress
      } else {
        console.log('获取地址失败了', result, status)
      }
    })
  }
  
  // 定位
  function geoLocationAddress() {
    map.plugin('AMap.Geolocation', function() {
      geoLocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 1000, // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, // 显示定位按钮，默认：true
        buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      })
      map.addControl(geoLocation)
      geoLocation.getCurrentPosition(function(status, result) {
        console.log(result);
        if (status === 'complete') {
          location.lng = result.position.lng
          location.lat = result.position.lat
          getNameFromPoint({ lng: result.position.lng, lat: result.position.lat })
        } else if (result.position) {
          location.lng = result.position.lng
          location.lat = result.position.lat
          GetNameFromPoint({ lng: result.position.lng, lat: result.position.lat })
        } else {
          console.log('获取定位失败', result)
        }
      })
    })
  }
  let inputSearch = () => {
    showButton = true
    autocomplete.search(addressStr, function(status, result) {
      if (status === 'complete') {
        tipList = result.tips
      }
    })
  }
  function goSearch(name, _location) {
    addressStr = name
    location = {
      lat: _location.lat,
      lng: _location.lng
    }
    console.log(_location);
    getNameFromPoint(_location)
    showButton = false
  }
  let beforeCloseMap = (event) => {
    if (event === 'confirm') {
      location.addressStr = addressStr
      console.log(location);
      dispatch('mapConfirm', location)
    } else {
      dispatch('mapCancel')
    }
    visible = false
  }
</script>
<div>
  <BeDialog title="选择事件地址" {style} bind:visible={visible} beforeClose={beforeCloseMap} closeOnClickModal={false} isDrag={true}>
    <div class="position-map-box page-list">
      <div class="map-form-box form-content">
        <form style="width:100%;">
          <div class="be-form-item be-form--inline">
            <div class="be-form-item__content">
              <BeInput id="tipInput" autocomplete="off" placeholder="请输入事件地址" bind:value={addressStr} on:input={() => inputSearch()} />
            </div>
          </div>
        </form>
        {#if addressStr && showButton}
        <div class="tips-box">
          <div class="list-box">
            {#each tipList as item,index}
            <div class="tips-item" on:click={() => goSearch(item.name,item.location)}>
              <span>{ item.name }</span>
              <span class="address">({ item.district }{ item.address.length ? item.address : '' })</span>
            </div>
            {/each}
          </div>
          <div style="width:108px" />
        </div>
        {/if}
      </div>
      <div class="add-list">
        <div id="mapContainer" class="map-container"></div>
        {#if showButton}
        <div id="panel" style="height: auto;margin-bottom:5px"></div>
        {/if}
      </div>
      
    </div>
  </BeDialog>
</div>

<style lang="scss">
  .position-map-box {
    .map-form-box{width: 100%;display:flex;position: relative;
      .tips-box {width: 80%;position: absolute;z-index: 999;top: 40px;
        .list-box {width: 100%;background-color: #fff;border-top: 1px solid #DCDFE6;
          .tips-item {display: flex;width: 100%;height: 40px;padding: 10px;border-bottom: 1px solid #DCDFE6;align-items: center;border-left: 1px solid #DCDFE6;border-right: 1px solid #DCDFE6;
            &:hover {border: 1px solid #1890ff;cursor: pointer;line-height: 20px;}
            .address {margin-left: 10px;color:#9E9D9D;display: inline-block;flex: 1;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-top: 0;margin-bottom: 0;}
          }
          
        }
      }
    }
    .add-list {
      background-color: white;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      margin-top: 20px;
      .map-container {height: 500px;min-width: 700px;background-color: skyblue;}
    }
    
  }
</style>
  