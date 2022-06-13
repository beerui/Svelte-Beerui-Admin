// noinspection JSUnresolvedVariable
import fetchGeoJSON from "./waterLine.json";
import fetchBusJSON from "./waterBuilding.json";

export function initMap(mapContainer) {
    return new AMap.Map(mapContainer, {
        mapStyle: 'amap://styles/6d4c7238d01b609ae86342e614f858db',
        resizeEnable: false,
        rotateEnable: true,
        pitchEnable: true,
        zoom: 14,
        pitch: 0,
        rotation: 0,
        viewMode: '3D',
        expandZoomRange: true,
        zooms: [14, 20],
        center: [120.583721, 29.999158]
    });
}

export function initLoca(map) {
    return new Loca.Container({ map })
}
export function addAnimateView(_loca, planId) {
    return new Promise(resolve => {
        if (planId === '') {
            resolve()
            return
        }
        const plans = [
            {
                value: [120.58387,29.991296],
                control: [[120.567727,29.993329],[120.577172,29.983709],[120.586218,29.980635],[120.60219,29.984106],[120.600358,29.989263],[120.600873,29.993031],[120.593889,29.995907],[120.580378,29.997146],[120.56641,29.997642],[120.58513,29.990949]],
                rotation: {
                    value: -25,
                    control: [[0.4, 5], [0.6, 30]]
                },
                pitch: 60,
                zoom: 15
            },
            {
                value: [120.574318,29.999547],
                control: [[120.568556, 30.004248], [120.571048, 30.004051], [120.577322, 30.003576], [120.577254, 29.993372], [120.568572, 29.995181], [120.56994,29.999968]],
                rotation: {
                    value: -95,
                    control: [[0.4, -25], [0.6, -30]]
                },
                pitch: 55,
                zoom: 16
            },
            {
                value: [120.592457,29.985996],
                control: [[120.598695,29.9915],[120.59232,29.989038],[120.587135,29.985778],[120.587135,29.982452]],
                rotation: {
                    value: 0,
                    control: [[0.4, 5], [0.6, 3]]
                },
                pitch: 55,
                zoom: 16
            },
            {
                value: [120.594762,29.984632],
                control: [[120.595799,29.992183],[120.595415,29.989655],[120.595146,29.986994],[120.594762,29.984632],[120.594762,29.984632]],
                rotation: {
                    value: 10,
                    control: [[1, 2], [6, 30]]
                },
                pitch: 55,
                zoom: 16
            },
            {
                value: [120.594454,29.993979],
                control: [[120.594877,29.996607],[120.594454,29.993979],[120.596682,29.992649],[120.598641,29.991152]],
                rotation: {
                    value: 50,
                    control: [[0.4, -25], [0.6, -30]]
                },
                pitch: 55,
                zoom: 16
            },
            {
                value: [120.581435,30.009066],
                control: [[120.56492,30.015817],[120.568799,30.013356],[120.576557,30.011693],[120.582664,30.010063],[120.585429,30.007303],[120.594224,30.005507],[120.595876,30.001682]],
                rotation: {
                    value: -20,
                    control: [[0.4, -25], [0.6, -30]]
                },
                pitch: 55,
                zoom: 16
            }
        ]
        const _item = plans[planId]
        _loca.viewControl.addAnimates([{
            // 地图中心点动画
            center: {
                value: _item.value, // 动画终点的经纬度
                control: _item.control,
                timing: [0.42, 0, 0.4, 1], // 动画时间控制点
                duration: 2000 // 过渡时间，毫秒（ms）
            },
            // 俯仰角动画
            pitch: {
                value: _item.pitch, // 动画终点的俯仰角度
                control: [[0.2, 75], [0.5, 75]], // 控制器，x是0～1的起始区间，y是pitch值
                timing: [0, 0, 1, 1], // 这个值是线性过渡
                duration: 2000
            },
            // 缩放等级动画
            zoom: {
                value: 16, // 动画终点的地图缩放等级
                control: [[0.1, 15], [0.1, 15]], // 控制器，x是0～1的起始区间，y是zoom值
                timing: [0.42, 0, 0.4, 1],
                duration: 2000
            },
            // 旋转动画
            rotation: {
                value: _item.rotation.value, // 动画终点的地图旋转角度
                control: _item.rotation.control, // 控制器，x是0～1的起始区间，y是rotation值
                timing: [0.42, 0, 0.4, 1],
                duration: 2000
            }
        }], () => {
            // 动画执行结束
            resolve()
        })
    })
}
export function initLocaPulseLineLayer(_loca, type) {
    const headColors = ['#01a5f2', '#00c3c5', '#00d24f', '#4e52ff', '#00c078'];
    const bgColors = ['rgba(1, 165, 242, 0.2)', 'rgba(0, 195, 197, 0.2)', 'rgba(0, 210, 79, 0.2)', 'rgba(78, 82, 255, 0.2)', 'rgba(0, 192, 120, 0.2)'];

    const layer = new Loca.PulseLineLayer({ _loca, zIndex: 1, opacity: 1, visible: true, zooms: [2, 22] })
    const geo = new Loca.GeoJSONSource({ data: fetchGeoJSON })

    layer.setSource(geo);
    layer.setStyle({
        altitude: 0,
        lineWidth: (_, feature) => {
            return String(feature.properties.type) === String(type) ? 15 : 10
        },
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

export function initMarkerLayer(_loca) {
    const buildGeo = new Loca.GeoJSONSource({ data: fetchBusJSON })
    const markerLayer = new Loca.ZMarkerLayer({ loca: _loca, zIndex: 999, visible: true })
    markerLayer.setSource(buildGeo);
    markerLayer.setStyle({
        content: function(index, feat) {
            return `
                <div style="width: 85px;height: 85px;background: url('/assets/live_water/symbol_0${feat.properties.type}.png') 0 0 no-repeat;background-size: 100%;position: relative;">
                    <div style="color: #fff; font-size: 14px;text-align: center;">${feat.properties.name}</div>
                </div>
                `
        },
        size: [85, 85],
        unit: 'px', // 像素单位
        alwaysFront: false, // 总是面向屏幕
        autitude: 0, // 海拔高度
    });
    return markerLayer
}
