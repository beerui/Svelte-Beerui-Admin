// noinspection JSUnresolvedVariable
import fetchGeoJSON from "./homeWaterLine.json";
import fetchBusJSON from "./waterBuilding.json";
import yuechengquJSON from "./yuechengqu.json";
import riversGeoJson from './rivers.js';
import stations from "./stations.js";
import { get_water_layers } from "../../api/home.js";
import { DEFAULT_AREA_ID } from '$utils/config'

/**
 * 地图初始化
 * @param mapContainer 地图容器 ID
 * @returns {types.Map<types.SassType, types.SassType>}
 */
export function initMap(mapContainer) {
    return new AMap.Map(mapContainer, {
        mapStyle: 'amap://styles/6d4c7238d01b609ae86342e614f858db',
        resizeEnable: false,
        rotateEnable: true,
        pitchEnable: true,
        zoom: 12,
        zooms: [11.7, 20],
        pitch: 0,
        rotation: 0,
        viewMode: '3D',
        expandZoomRange: true,
        // center: [120.583721, 29.999158]
        center: [120.585046, 29.995823]
    });
}
// 加载河网
export function renderRivers(map) {
    const geojson = new AMap.GeoJSON({
        geoJSON: riversGeoJson,
        getPolygon: function (geojson, lnglats) {
            return new AMap.Polygon({
                path: lnglats,
                fillOpacity: .6,
                strokeWeight: 0,
                strokeColor: '#07d2fd',
                fillColor: '#07d2fd'
            });
        }
    });

    map.add(geojson);
}
// 接口加载河网
export function renderRiverLayer(map) {
    const data = {
        waterId: '',
        areaId: DEFAULT_AREA_ID,
        grade: ''
    }
    return new Promise((resolve, reject) => {
        get_water_layers(data).then(res => {
            const _polygon = setPolygon(res)
            const markers = setLabelsLayer(() => {}, res,'river')
            map.add(_polygon);
            resolve({
                _polygon,
                markers
            })
        })
    })
}

// 生成Polygon
const setPolygon = (data) => {
    const features = []
    const colors = ['#07d2fd', '#59d6ff', '#19acf2', '#5ed522', '#24b462', '#ffc20d', '#ff5605']
    for (let i = 0; i < data.length; i++) {
        const _feature = JSON.parse(data[i].waterSpatial) || []
        _feature.properties.waterQuality = data[i].waterQuality || 0
        features.push(_feature)
    }
    const _polygon = new AMap.GeoJSON({
        geoJSON: {
            "type": "FeatureCollection",
            "features": features
        },
        getPolygon: function (geojson, lnglats) {
            const _color = colors[geojson.properties.waterQuality || 0]
            return new AMap.Polygon({
                path: lnglats,
                fillOpacity: .6,
                strokeWeight: 0,
                strokeColor: _color,
                fillColor: _color
            });
        }
    });
    return _polygon
}

/**
 * 绍兴越城区 面遮照
 * @param map 地图实例
 */
export const getPolygon = (map) => {
    const polygon = new AMap.Polygon({
        path: yuechengquJSON.features[0].geometry.coordinates[0],
        fillColor: '#618dff', // 多边形填充颜色
        fillOpacity: '0.02',
        borderWeight: 1, // 线条宽度，默认为 1
        strokeColor: '#ffffff', // 线条颜色
        showLabel: false,
        strokeOpacity: '0.88'
    })
    map.add(polygon)
}

export function initLoca(map) {
    return new Loca.Container({ map })
}

/**
 * 初始页面动画
 * @param _loca loca实例
 * @returns {Promise<unknown>}
 */
export function initAnimateView(_loca) {
    return new Promise(resolve => {
        const _item = {
            value: [120.58387,29.991296],
            control: [[120.567727,29.993329],[120.577172,29.983709],[120.586218,29.980635],[120.60219,29.984106],[120.600358,29.989263],[120.600873,29.993031],[120.593889,29.995907],[120.580378,29.997146],[120.56641,29.997642],[120.58513,29.990949]],
            rotation: -25,
        }
        _loca.viewControl.addAnimates([{
            // 地图中心点动画
            center: {
                value: _item.value, // 动画终点的经纬度
                control: _item.control,
                timing: [0.42, 0, 0.4, 1], // 动画时间控制点
                duration: 100 // 过渡时间，毫秒（ms）
            }
        }], () => {
            // 动画执行结束
            resolve()
        })
    })
}

/**
 * 总览 河道流向动画
 * @param _loca loca实例
 * @returns {Loca.PulseLineLayer}
 */
export function initLocaPulseLineLayer(_loca) {
    const headColors = ['#056dde', '#02cf7a', '#f7aa05', '#4e52ff', '#00c078'];
    const bgColors = ['rgba(1, 165, 242, 0.5)', 'rgba(0, 195, 197, 0.5)', 'rgba(0, 210, 79, 0.5)', 'rgba(78, 82, 255, 0.2)', 'rgba(0, 192, 120, 0.2)'];

    const layer = new Loca.PulseLineLayer({ _loca, zIndex: 1, opacity: 1, visible: true, zooms: [2, 22] })
    const geo = new Loca.GeoJSONSource({ data: fetchGeoJSON })

    layer.setSource(geo);
    layer.setStyle({
        altitude: 0,
        lineWidth: 3,
        // 脉冲头颜色
        headColor: (_, feature) => {
            return headColors[feature.properties.type - 1];
        },
        // 脉冲尾颜色
        trailColor: (_, feature) => {
            return bgColors[feature.properties.type - 1];
        },
        // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4 长度修改 会造成动画卡顿
        interval: 0.25,
        // 脉冲线的速度，几秒钟跑完整段路
        duration: 3000,
    });
    return layer
}
/**
 * 总览 河道点位
 * @param _loca loca实例
 * @returns {Loca.ScatterLayer}
 */
export function initScatterLayer(_loca) {
    const breathYellow = new Loca.ScatterLayer({
        _loca,
        zIndex: 112,
        fitView: true,
        opacity: 1,
        visible: true,
        zooms: [2, 20],
    });
    const buildGeo = new Loca.GeoJSONSource({ data: fetchBusJSON })
    breathYellow.setSource(buildGeo);
    breathYellow.setStyle({
        unit: 'px',
        size: [30, 30],
        borderWidth: 0,
        texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
        duration: 1000,
        animate: true,
    });

    return breathYellow
}
/**
 * 总览 泵闸站点位
 * @param _loca loca实例
 * @returns {Loca.ScatterLayer}
 */
export function initStationLayer(data) {
    // const stationGeo = new Loca.GeoJSONSource({ data: stations })
    // 设置一个图标对象
    const icons = [{}, {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/pump_1.png',
        size: [42, 100]
    }, {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/home_map_2.png',
        size: [36, 48]
    }, {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/home_map_3.png',
        size: [36, 48]
    }];

    const markers = [];
    const layer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        fitView: true,
        collision: false, // 密集点消失
        // 设置 allowCollision：true，可以让标注避让用户的标注
        allowCollision: true,
    });
    // 初始化 labelMarker
    // const items = stationGeo.options.data.features
    for (let i = 0; i < data.length; i++) {
        if (data[i].layerType === 1 && data[i].lat && data[i].lon) {
            const curData = {
                name: data[i].name,
                position: [data[i].lon, data[i].lat],
                opacity: 1,
                zIndex: 10,
                fold: true,
                icon: icons[data[i].layerType],
                cursor: 'default'
                // text: {
                //     content: items[i].properties.name,
                //     direction: 'right',
                //     offset: [0, -60],
                //     style: {
                //         fontSize: 14,
                //         fillColor: '#fff',
                //         // strokeColor: '#fff',
                //         fold: true
                //     }
                // }
            }
            const labelMarker = new AMap.LabelMarker(curData)
            markers.push(labelMarker);
        }
    }
    // 将 marker 添加到图层
    layer.add(markers);
    return layer
}

/**
 * 河域水网 点位
 * @param map 地图实例
 * @param labelMarkerClick marker点击回调值
 * @returns {AMap.LabelsLayer} 点位图层
 */
export function initLabelsLayer(map, labelMarkerClick, data, type = 'river') {
    const layer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        fitView: true,
        collision: false, // 密集点消失
        // 设置 allowCollision：true，可以让标注避让用户的标注
        allowCollision: true,
    });
    // const buildGeo = new Loca.GeoJSONSource({ data: homeRiver })
    const markers = setLabelsLayer(labelMarkerClick, data, type)
    // 将 marker 添加到图层
    layer.add(markers);
    return layer
}

/**
 * 河域水网河道图层
 * onlyResetPolygon 只个生成数据不更新地图
 */
export function initRiverLayer(map, data, onlyResetPolygon = false) {
    const polygon = setPolygon(data)
    if (!onlyResetPolygon) {
        map.add(polygon)
    }
    return polygon
}

/**
 * 生成河道、排水口marker点
 */
export function setLabelsLayer(labelMarkerClick, data, type = 'river') {
    // 设置一个图标对象
    const icon = {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/river.png',
        size: [42, 100]
    };
    let markers = [];
    // 初始化 labelMarker
    // const items = buildGeo.options.data.features
    if (type === 'river') {
        for (let i = 0; i < data.length; i++) {
            const waterSpatial = JSON.parse(data[i].waterSpatial)
            const curData = {
                waterId: data[i].waterId,
                name: data[i].waterName,
                position: waterSpatial.properties.CENTER,
                opacity: 1,
                zIndex: 10,
                fold: true,
                icon,
                text: {
                    content: data[i].waterName,
                    direction: 'right',
                    offset: [-20, -5],
                    style: {
                        fontSize: 14,
                        fillColor: '#fff',
                        strokeColor: '#fff',
                        fold: true,
                        padding: '2, 5',
                    }
                }
            }
            const labelMarker = new AMap.LabelMarker(curData);
            labelMarker.on('click', (evt) => labelMarkerClick(evt))
            markers.push(labelMarker);
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            const curData = {
                position: [data[i].outfallLon, data[i].outfallLat],
                opacity: 1,
                zIndex: 10,
                fold: true,
                text: {
                    content: '·',
                    direction: 'center',
                    offset: [-6, -6],
                    style: {
                        fontSize: 75,
                        fillColor: '#00fffc',
                        strokeColor: '#00fffc',
                        fold: true
                    }
                }
            }
            const labelMarker = new AMap.LabelMarker(curData)
            markers.push(labelMarker);
        }
    }
    return markers
}

/**
 * 水岸事件 点聚合图层
 * @param labelMarkerTotalClick {Function} marker点击回调值
 * @returns {AMap.LabelsLayer} 点位图层
 */
export function initEventClusterer(map, labelMarkerTotalClick, data) {
    const marker = setMarkerCluster(labelMarkerTotalClick, data)
    const layer = newLabelsLayerHandle(map, false, [3, 14.999])
    layer.add(marker);
    return layer
}

/**
 * 生成水岸事件 点聚合图层marker点
 */
export function setMarkerCluster(labelMarkerTotalClick, data) {
    const points = []
    data.forEach(val => {
        const hasIndex = points.findIndex(v => v.areaId === val.areaId)
        if (hasIndex === -1) {
            points.push({
                areaId: val.areaId,
                lnglat: [val.lon, val.lat],
                total: 1
            })
        } else {
            points[hasIndex].total += 1
        }
    })
    // 设置一个图标对象
    const icon = {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/problem_circle.png',
        size: [55, 55]
    };
    const marker = []; // 仿聚合
    // 初始化 labelMarker
    for (let i = 0; i < points.length; i++) {
        const curData = {
            // name: points[i].name,
            position: points[i].lnglat,
            opacity: 1,
            zIndex: 10,
            fold: true,
            icon,
            text: {
                content: String(points[i].total),
                direction: 'center',
                offset: [2, -2],
                style: {
                    fontSize: 14,
                    fillColor: '#fff',
                    strokeColor: '#fff',
                    fold: false, // 不换行
                    padding: [0, 0, 0, 0]
                }
            }
        }
        const labelMarker = new AMap.LabelMarker(curData);
        labelMarker.on('click', (evt) => labelMarkerTotalClick(evt))
        marker.push(labelMarker);
    }
    return marker
}

// const renderMarkerList = [
//     'https://cdn.zhihuihedao.cn/assets/zsdn/icons/problem_1.png',
//     'https://cdn.zhihuihedao.cn/assets/zsdn/icons/problem_2.png',
//     'https://cdn.zhihuihedao.cn/assets/zsdn/icons/problem_3.png'
// ]
// export function initEventClusterer(map, data, labelMarkerTotalClick) {
//     data.forEach(val => {
//         val.lnglat = [val.lon, val.lat]
//     })
//     console.log(data)
//     const cluster = new AMap.MarkerCluster(map, data, {
//         maxZoom: 15,
//         // minClusterSize: 1,
//         renderClusterMarker: _renderClusterMarker,
//         // renderClusterMarker: context => {
//         //     const offset = new AMap.Pixel(-27, -27);
//         //     const div = `<div style="display: flex; align-items: center; justify-content: center;width: 55px;height: 55px;font-size: 14px;background: url(https://cdn.zhihuihedao.cn/assets/zsdn/icons/problem_circle.png) 100% 100% / 100% 100% no-repeat;">${context.count}</div>`
//         //     context.marker.setContent(div)
//         //     context.marker.setOffset(offset)
//         // },
//         // renderMarker: context => {
//         //     const offset = new AMap.Pixel(-21, -50);
//         //     const div = `<div style="display: flex; align-items: center; justify-content: center;width: 42px;height: 100px;font-size: 14px;background: url(${renderMarkerList[context.data[0].themeType]}) 100% 100% / 100% 100% no-repeat;">${context.count}</div>`
//         //     context.marker.setContent(div)
//         //     context.marker.setOffset(offset)
//         // }
//     })
//     return cluster
// }

/**
 * 水岸事件 问题点图层
 * @param list {Array} 问题点数据
 * @param labelMarkerProblemClick {Function} marker点击回调值
 * @returns {AMap.LabelsLayer} 点位图层
 */
export function addProblemPoint(list, labelMarkerProblemClick) {
    const layer = new AMap.LabelsLayer({
        zooms: [15, 20],
        zIndex: 1000,
        // collision: false, // 密集点消失
        allowCollision: true // 可以让标注避让用户的标注
    });
    const marker = setProblemPointMarker(list, labelMarkerProblemClick)
    layer.add(marker);
    return layer
}

/**
 * 生成水岸事件 问题点图层marker点
 */
export function setProblemPointMarker(list, labelMarkerProblemClick) {
    const marker = []; // 多个点
    // 设置一个图标对象
    const icon = {
        type: 'image',
        size: [42, 100]
    };
    for (let i = 0; i < list.length; i++) {
        const img = `problem_${list[i]['themeType']}`
        const curData = {
            // name: list[i].name,
            id: list[i].issueId,
            position: [list[i].lon, list[i].lat],
            opacity: 1,
            zIndex: 10,
            fold: true,
            icon: Object.assign(icon, {
                image: `https://cdn.zhihuihedao.cn/assets/zsdn/icons/${img}.png`
            })
        }
        const labelMarker = new AMap.LabelMarker(curData);
        labelMarker.on('click', (evt) => labelMarkerProblemClick(evt))
        marker.push(labelMarker);
    }
    return marker
}

/**
 * 水岸事件 问题点图层
 * @param list {Array} 问题点数据
 * @param labelMarkerProblemClick {Function} marker点击回调值
 * @returns {{layerPump: AMap.LabelsLayer, layerZha: AMap.LabelsLayer}} 点位图层
 */
export function initWaterWatchLayer(list, labelMarkerWatchClick, map) {
    // 添加泵站点位
    // const stationGeo = new Loca.GeoJSONSource({ data: stations })
    // 初始化 labelMarker
    // const items = stationGeo.options.data.features
    // for (let i = 0; i < items.length; i++) {
    //     if (items[i].properties.type === '1') {
    //         list.push({
    //             name: items[i].properties.name,
    //             lnglat: items[i].geometry.coordinates,
    //             status: 1,
    //             type: 'pump'
    //         });
    //     } else if (items[i].properties.type === '2') {
    //         list.push({
    //             name: items[i].properties.name,
    //             lnglat: items[i].geometry.coordinates,
    //             status: 1,
    //             type: 'zha'
    //         });
    //     } else {}
    // }

    const markerPump = []; // 多个点
    const markerZha = []; // 多个点
    const markerLevel = []; // 多个点
    const markerWaterWork = []; // 多个点
    // 设置一个图标对象
    const icon = {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/river.png',
        size: [42, 100]
    };
    const mapStatus = {
        1: 'pump',
        2: 'zha',
        3: 'level',
        4: 'water_work'
    }
    const layerPump = newLabelsLayerHandle(map)
    const layerZha = newLabelsLayerHandle(map)
    const layerLevel = newLabelsLayerHandle(map)
    const layerWaterWork = newLabelsLayerHandle(map)
    for (let i = 0; i < list.length; i++) {
        const img = `${mapStatus[list[i]['layerType']]}_1`
        const curData = {
            id: list[i].id,
            name: list[i].name,
            position: [list[i].lon, list[i].lat],
            opacity: 1,
            zIndex: 10,
            fold: true,
            extData: {
                type: list[i]['layerType']
            },
            icon: Object.assign(icon, {
                image: `https://cdn.zhihuihedao.cn/assets/zsdn/icons/${img}.png`
            })
        }
        const labelMarker = new AMap.LabelMarker(curData);
        labelMarker.on('click', (evt) => labelMarkerWatchClick(evt))
        if (list[i]['layerType'] === 1) {
            markerPump.push(labelMarker);
        } else if (list[i]['layerType'] === 2) {
            markerZha.push(labelMarker);
        } else if(list[i]['layerType'] === 3) {
            markerLevel.push(labelMarker)
        } else if (list[i]['layerType'] === 4) {
            markerWaterWork.push(labelMarker)
        }
    }
    layerPump.add(markerPump);
    layerZha.add(markerZha);
    layerLevel.add(markerLevel);
    layerWaterWork.add(markerWaterWork);

    return { layerPump, layerZha, layerLevel, layerWaterWork }
}
const loadGeoJSONSource = (coordinates, type) => {
    return new Loca.GeoJSONSource({
        data: {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coordinates,
                    },
                },
            ],
        },
    })
}
/**
 * 监控管理图层
 * @param list {Array} 问题点数据
 * @param labelMarkerWatchClick
 * @param map
 * @returns {*[]} 点位图层
 */
export function initVideoLayer(list, labelMarkerWatchClick, map) {
    list = list.map(el => {
        return { ...el, type: 'video2', status: 1 }
    })

    const markers = []; // 多个点
    // 设置一个图标对象
    const icon = {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/river.png',
        size: [42, 100]
    };
    const newLabelsLayer = newLabelsLayerHandle(map, false)
    for (let i = 0; i < list.length; i++) {
        const img = `${list[i]['type']}_${list[i]['status']}`
        const curData = {
            name: list[i].name,
            position: list[i].lngLat,
            opacity: 1,
            zIndex: 10,
            fold: true,
            extData: list[i],
            icon: Object.assign(icon, {
                image: `https://cdn.zhihuihedao.cn/assets/zsdn/icons/${img}.png`
            })
        }
        const labelMarker = new AMap.LabelMarker(curData);
        labelMarker.on('click', (evt) => labelMarkerWatchClick(evt))
        markers.push(labelMarker);
    }
    newLabelsLayer.add(markers);

    return newLabelsLayer
}
/**
 * 监控管理图层
 * @param list {Array} 问题点数据
 * @param labelMarkerWatchClick
 * @param map
 * @returns {*[]} 点位图层
 */
export function initAirplaneLayer(list, labelMarkerWatchClick, map) {
    // 添加泵站点位
    list = list.map(el => {
        return { ...el, type: 'plane', status: 1 }
    })
    const markers = []; // 多个点
    // 设置一个图标对象
    const icon = {
        type: 'image',
        image: 'https://cdn.zhihuihedao.cn/assets/zsdn/icons/river.png',
        size: [42, 100]
    };
    const newLabelsLayer = newLabelsLayerHandle(map)
    for (let i = 0; i < list.length; i++) {
        const img = `${list[i]['type']}_${list[i]['status']}`
        const curData = {
            name: list[i].name,
            position: list[i].lnglat,
            opacity: 1,
            zIndex: 10,
            fold: true,
            icon: Object.assign(icon, {
                image: `https://cdn.zhihuihedao.cn/assets/zsdn/icons/${img}.png`
            })
        }
        const labelMarker = new AMap.LabelMarker(curData);
        labelMarker.on('click', (evt) => labelMarkerWatchClick(evt))
        markers.push(labelMarker);
    }
    newLabelsLayer.add(markers);

    return newLabelsLayer
}

function newLabelsLayerHandle(map, visible  = true, zooms) {
    return new AMap.LabelsLayer({
        map: map,
        zooms: zooms || [2, 20],
        zIndex: 1000,
        visible: visible,
        fitView: true,
        collision: false, // 密集点消失
        // 设置 allowCollision：true，可以让标注避让用户的标注
        allowCollision: true,
    });
}

/**
 *  添加地图边框类
 */
export function setImageLayer(map){
    // map_border
    let imageLayer = new AMap.ImageLayer({
        url: '/assets/home/map_border.png',
        bounds: new AMap.Bounds(
            [120.485307,29.854947],
            [120.859242,30.243968]
        ),
    });
    map.addLayer(imageLayer)
}
const startAnimationContainer = {
    marker: null,
    lineLayer: null,
    polyline: null,
    lineLayerData: null,
    passedPolyline: null
}
/**
 * 开始动画
 */
export function startAnimation(map, loca, lineArr) {
    clearDrawMoveAnimation()
    // lineArr = [[120.542053,30.000252],[120.555368,29.998643],[120.568994,29.995157],[120.574258,29.986306],[120.58169,29.98121],[120.583238,29.971016],[120.582619,29.949285],[120.58169,29.941772]];
    drawMovePolyline(map, loca, lineArr)
}

/**
 * 清除
 */
export function clearDrawMoveAnimation() {
    if (startAnimationContainer.marker) {
        startAnimationContainer.marker.stopMove();
        startAnimationContainer.marker.setMap(null);
        startAnimationContainer.marker = null;
        startAnimationContainer.lineLayer.setLoca(null);
        startAnimationContainer.lineLayer = null;
        startAnimationContainer.lineLayerData = null;
        // startAnimationContainer.polyline.setMap(null);
        // startAnimationContainer.polyline = null;
        // startAnimationContainer.passedPolyline.setMap(null);
        // startAnimationContainer.passedPolyline = null;
    }
}
/**
 * 绘制无人机轨迹线
 * @param lineArr
 * @param map
 * @param loca
 */
export function drawMovePolyline(map, loca, lineArr) {
    console.log(map, loca, lineArr)
    AMap.plugin('AMap.MoveAnimation', function(){
        const _paths = lineArr.map(el => [el.longitude, el.latitude])
        startAnimationContainer.marker = new AMap.Marker({
            map: map,
            position: _paths[0],
            height: 100,
            icon: "https://cdn.zhihuihedao.cn/assets/zsdn/gif/airport.gif",
            offset: new AMap.Pixel(-60, -60),
        });

        // 绘制轨迹
        startAnimationContainer.lineLayer = new Loca.LineLayer({
            loca: loca
        });
        startAnimationContainer.lineLayerData = new Loca.GeoJSONSource({
            data: {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': _paths,
                        },
                    },
                ],
            },
        });
        startAnimationContainer.lineLayer.setSource(startAnimationContainer.lineLayerData, {
            altitude: function (index, feature) {
                return lineArr[index].height;
            },
            zIndex: 99,
            color : '#40ce6d',
            visible: true,
            lineWidth: 4,
            opacity: 1,
        });
        // startAnimationContainer.polyline = new AMap.Polyline({
        //     map: map,
        //     path: lineArr,
        //     height: 500,
        //     showDir:true,
        //     lineCap: 'round', // 折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
        //     lineJoin: 'round', // 折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
        //     strokeColor: "#28F",  //线颜色
        //     // strokeOpacity: 1,     //线透明度
        //     strokeWeight: 6,      //线宽
        //     // strokeStyle: "solid"  //线样式
        // });

        // startAnimationContainer.passedPolyline = new AMap.Polyline({
        //     map: map,
        //     path: _paths,
        //     height: 500,
        //     strokeColor: "#AF5",  //线颜色
        //     strokeWeight: 6,      //线宽
        // });


        startAnimationContainer.marker.on('moving', function (e) {
            // startAnimationContainer.passedPolyline.setPath(e.passedPath);
            // startAnimationContainer.marker._opts.height = lineArr[e.index].height * 100
            // startAnimationContainer.marker._originOpts.height = lineArr[e.index].height * 100
            map.setCenter(e.target.getPosition(),true)
        });

        startAnimationContainer.marker.moveAlong(_paths, {
            // 每一段的时长
            duration: 500,//可根据实际采集时间间隔设置
            // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
            autoRotation: false,
            circlable: false
        });
    });
}
