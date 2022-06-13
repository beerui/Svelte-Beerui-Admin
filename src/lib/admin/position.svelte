<script> 
  import {
    BeDialog
  } from "@brewer/beerui";
  import { onMount, tick } from "svelte";
  import { createEventDispatcher } from 'svelte'
  let  dispatch = createEventDispatcher()
  export let visible
  export let title
  export let location = { lat: '', lng: '' }
  export let type = 1
  export let path = []
  export let center = []
  let map = ''
  let marker = null
  let geocoder = null
  let geoLocation = null
  // let isMount = false
// ------------------------------------------------------------------------

  onMount(async () => {
    fetchMap()
  })
  
  // $:if(visible) {
  //   setTimeout(() => {
  //     fetchMap()
  //   }, 500);
  // }
 
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
      zoom: type == 2 ? 10 : 15 // 初始化地图层级,
    })
    map.on('complete', function() {
      // 点选地图
      // 有位置信息 回显
      if(type == 1) {
        if (location && location.lat && location.lng) {
          if (marker) map.remove(marker)
          const lnglats = [location.lng, location.lat]
          if (!geocoder) {
            map.plugin('AMap.Geocoder', function() {
              geocoder = new AMap.Geocoder({ city: '330100', radius: 1000 })
            })
          }
          map.setCenter(lnglats)
          // 构造点标记
          marker = new AMap.Marker({ position: lnglats, map: map })
        } else {
          geoLocationAddress()
        }
      }
      if(type == 2) {
        addPolygon(path)
      }
    })
  }
  // 画面
  function addPolygon(path) {
    const polygon = new AMap.Polygon({
      path: path,
      fillColor: '#1890FF', // 多边形填充颜色
      borderWeight: 2, // 线条宽度，默认为 1
      fillOpacity: 0.4,
      strokeColor: '#1890FF', // 线条颜色
    });
    map.setCenter(center)
    map.add(polygon);
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
    })
  }
  const beforeCloseMap = (event) => {
    if (event === 'confirm') {
      dispatch('mapConfirm')
    } else {
      dispatch('mapCancel')
    }
    visible = false
  }
</script>
<div>
  <BeDialog bind:title={title} bind:visible={visible} beforeClose={beforeCloseMap} closeOnClickModal={false} isDrag={true} isHideFooter={true}>
    <div class="position-map-box page-list">
      <div id="mapContainer" class="map-container"></div>
    </div>
  </BeDialog>
</div>

<style lang="scss">
  .position-map-box {
    .map-container {height: 500px;min-width: 700px;background-color: skyblue;}
  }
</style>
  