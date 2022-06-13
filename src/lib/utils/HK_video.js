// noinspection JSCommentMatchesSignature

let szIP = '218.108.149.90', szPort = 8181, szUsername = 'admin', szPassword = 'wasu8888'
let g_iWndIndex = 0 // 当前选择的窗口编号
let iPTZSpeed = 4
let _iStreamType = '1'

/**
 * 初始化视频监控插件
 * @param getChannelList
 * @param ACCOUNT
 * @param {Number} w 窗口数量 默认 1x1
 */
export function initVideoPlugin(items, streamtype = 3) {
    _iStreamType = String(streamtype)
    // 检查插件是否已经安装过
    if (-1 === WebVideoCtrl.I_CheckPluginInstall()) {
        // alert("您还未安装过插件，双击开发包目录里的WebComponents.exe安装！");
        return
    }
    // 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin('100%', '100%', {
        iWndowType: 1,
        cbSelWnd: function (xmlDoc) {
            g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
        }
    });
    WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
    // 检查插件是否最新
    if (-1 === WebVideoCtrl.I_CheckPluginVersion()) {
        // alert("检测到新的插件版本，双击开发包目录里的WebComponents.exe升级！");
        return
    }
}
export function exitAndLoginNew(items) {
    if (items.szIP === szIP) return
    const iRet = WebVideoCtrl.I_Logout(szIP);
    0 === iRet ? showOPInfo(szIP + " 退出成功！") : showOPInfo(szIP + '退出失败！')
    szIP = items.szIP
    szPort = items.szPort
    szUsername = items.szUsername
    szPassword = items.szPassword
    const channelNumber = String(items.value) || '1'
    WebVideoCtrl.I_Login(szIP, 3, szPort, szUsername, szPassword, {
        success: function (xmlDoc) {
            console.log(szIP + " 登录成功！");
            WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
                async: true,
                success: function (res) {
                    clickStartRealPlay(channelNumber)
                },
                error: function () {
                    console.log(szIP + " 获取模拟通道失败！");
                    showOPInfo(szIP + " 获取模拟通道失败！");
                }
            });
        },
        error: function () {
            console.log(szIP + " 登录失败！");
            showOPInfo(szIP + " 登录失败！");
        }
    });

}
// 登录
function clickLogin() {
    const iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
        success: function (xmlDoc) {
            showOPInfo(szIP + " 登录成功！");
            getChannelInfo()
        },
        error: function () {
            console.log(szIP + " 登录失败！");
            showOPInfo(szIP + " 登录失败！");
        }
    });

    if (-1 === iRet) {
        showOPInfo(szIP + " 已登录过！");
        getChannelInfo()
    }
}
// 退出
export function clickLogout() {
    let szInfo = "";

    const iRet = WebVideoCtrl.I_Logout(szIP);
    if (0 === iRet) {
        szInfo = "退出成功！"
        getChannelInfo()
    } else {
        szInfo = "退出失败！"
    }
    showOPInfo(szIP + " " + szInfo);
}
// 获取通道
function getChannelInfo(getChannelList) {
    let oSel = [], nAnalogChannel = 0
    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
        async: false,
        success: function (xmlDoc) {
            console.log('模拟通道', xmlDoc)
            var oChannels = $(xmlDoc).find("VideoInputChannel");
            nAnalogChannel = oChannels.length;

            $.each(oChannels, function (i) {
                var id = parseInt($(this).find("id").eq(0).text(), 10),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Camera " + (id < 9 ? "0" + id : id);
                }
                oSel.push({ value: id, name })
            });
            console.log(szIP + " 获取模拟通道成功！");
            // getChannelList(oSel)
        },
        error: function () {
            console.log(szIP + " 获取模拟通道失败！");
        }
    });
    // 数字通道
    WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
        async: false,
        success: function (xmlDoc) {
            const oChannels = $(xmlDoc).find("InputProxyChannelStatus");
            $.each(oChannels, function (i) {
                let id = parseInt($(this).find("id").eq(0).text(), 10),
                    name = $(this).find("name").eq(0).text(),
                    online = $(this).find("online").eq(0).text();
                if ("false" === online) {// 过滤禁用的数字通道
                    return true;
                }
                if ("" === name) {
                    name = "IPCamera " + ((id - nAnalogChannel) < 9 ? "0" + (id - nAnalogChannel) : (id - nAnalogChannel));
                }
                oSel.push({ value: id, name })
            });
            console.log(szIP + " 获取数字通道成功！");
            // getChannelList(oSel)
        },
        error: function () {
            console.log(szIP + " 获取数字通道失败！");
            return null
        }
    });
}


// 开始预览
export function clickStartRealPlay(channels) {
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iStreamType = parseInt(_iStreamType, 10),
        iChannelID = parseInt(channels, 10) || '1'

    console.log("clickStartRealPlay！", iChannelID);
    // 已经在播放了，先停止
    if (oWndInfo != null) {
        WebVideoCtrl.I_Stop();
    }

    console.log('开始预览')
    WebVideoCtrl.I_StartRealPlay(szIP, {
        iStreamType: _iStreamType,
        iChannelID: iChannelID,
        bZeroChannel: false
    });
}

// 停止预览
export function clickStopRealPlay() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex)
    if (oWndInfo != null) WebVideoCtrl.I_Stop();
    showOPInfo(szIP + " 停止预览！")
}

// PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
let g_bPTZAuto = false;
export function mouseDownPTZControl(iPTZIndex) {
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        bZeroChannel = false,
        bStop = false;

    if (oWndInfo !== null) {
        if (9 === iPTZIndex && g_bPTZAuto) {
            iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
            bStop = true;
        } else {
            g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
            bStop = false;
        }

        WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
            iPTZSpeed: iPTZSpeed,
            success: function (xmlDoc) {
                if (9 === iPTZIndex) {
                    g_bPTZAuto = !g_bPTZAuto;
                }
                showOPInfo(oWndInfo.szIP + " 开启云台成功！")
            },
            error: function () {
                console.log(oWndInfo.szIP + " 开启云台失败！")
                showOPInfo(oWndInfo.szIP + " 开启云台失败！")
            }
        });
    }
}

// 方向PTZ停止
export function mouseUpPTZControl() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(1, true, {
            success: function (xmlDoc) {
                console.log(oWndInfo.szIP + " 停止云台成功！");
                showOPInfo(oWndInfo.szIP + " 停止云台成功！")
            },
            error: function () {
                console.log(oWndInfo.szIP + " 停止云台失败！");
                showOPInfo(oWndInfo.szIP + " 停止云台失败！")
            }
        });
    }
}


// 调用预置点
export function clickGoPreset(preset) {
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iPresetID = parseInt(preset, 10);

    if (oWndInfo != null) {
        WebVideoCtrl.I_GoPreset(iPresetID, {
            success: function (xmlDoc) {
                console.log(oWndInfo.szIP + " 调用预置点成功！");
                showOPInfo(oWndInfo.szIP + " 调用预置点成功！")
            },
            error: function () {
                console.log(oWndInfo.szIP + " 调用预置点失败！");
                showOPInfo(oWndInfo.szIP + " 调用预置点失败！")
            }
        });
    }
}

// 暂停
export function clickPause() {
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex)
    if (oWndInfo != null) WebVideoCtrl.I_Pause();
    showOPInfo(oWndInfo.szIP + " 暂停！")
}
// 恢复
export function clickResume() {
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex)
    if (oWndInfo != null) WebVideoCtrl.I_Resume();
    showOPInfo(oWndInfo.szIP + " 恢复！")
}
// 检查插件版本
export function clickCheckPluginVersion() {
    const iRet = WebVideoCtrl.I_CheckPluginVersion()
    if (0 === iRet) {
        alert("您的插件版本已经是最新的！")
    } else {
        alert("检测到新的插件版本！")
    }
}


export function PTZZoomIn() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(10, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 调焦+成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  调焦+失败！");
            }
        });
    }
}

export function PTZZoomout() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 调焦-成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  调焦-失败！");
            }
        });
    }
}

export function PTZZoomStop() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 调焦停止成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  调焦停止失败！");
            }
        });
    }
}

export function PTZFocusIn() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 聚焦+成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  聚焦+失败！");
            }
        });
    }
}

export function PTZFoucusOut() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(13, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 聚焦-成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  聚焦-失败！");
            }
        });
    }
}

export function PTZFoucusStop() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 聚焦停止成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  聚焦停止失败！");
            }
        });
    }
}

export function PTZIrisIn() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 光圈+成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  光圈+失败！");
            }
        });
    }
}

export function PTZIrisOut() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(15, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 光圈-成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  光圈-失败！");
            }
        });
    }
}

export function PTZIrisStop() {
    const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 光圈停止成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  光圈停止失败！");
            }
        });
    }
}

// 抓图
export function clickCapturePic() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var szChannelID = $("#channels").val(),
            szPicName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
            iRet = WebVideoCtrl.I_CapturePic(szPicName);
        if (0 == iRet) {
            szInfo = "抓图成功！";
        } else {
            szInfo = "抓图失败！";
        }
        showOPInfo(oWndInfo.szIP + " " + szInfo);
    }
}

// 开始录像
export function clickStartRecord() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var szChannelID = $("#channels").val(),
            szFileName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
            iRet = WebVideoCtrl.I_StartRecord(szFileName);
        if (0 == iRet) {
            szInfo = "开始录像成功！";
        } else {
            szInfo = "开始录像失败！";
        }
        showOPInfo(oWndInfo.szIP + " " + szInfo);
    }
}

// 停止录像
export function clickStopRecord() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_StopRecord();
        if (0 == iRet) {
            szInfo = "停止录像成功！";
        } else {
            szInfo = "停止录像失败！";
        }
        showOPInfo(oWndInfo.szIP + " " + szInfo);
    }
}

// 全屏
export function clickFullScreen() {
    WebVideoCtrl.I_FullScreen(true);
}

function showOPInfo(msg) {
    const box = document.querySelector('.video-message-box')
    if (!box) return
    const dom = document.createElement('div')
    const theFirstChild = box.firstChild;
    dom.textContent = msg
    dom.className = 'video-message-box-list'
    box.insertBefore(dom, theFirstChild)
}

export function changeSpeed(v) {
    console.log('changeSpeed', v)
    iPTZSpeed = v
}
