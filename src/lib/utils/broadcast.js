/**
 * 一键播报功能流程
 * 1 调用接口 返回语音 文字数据
 * 2 加载语音
 * 3 加载视频底
 * 4 播放视频 根据语音 控制进度
 * 5 在不同的事件点触发弹框
 */

/**
 * 初始化播报内容
 */
export const initBroadcast = async (BroadcastVideo) => {
    console.log('initBroadcast')
    // load video
    await loadSourceDone(BroadcastVideo)
    console.log('load done')
    // load audio
    // init dialog
}

const loadSourceDone = (dom) => {
    return new Promise((resolve, reject) => {
        const loadData = () => {
          setTimeout(() => {
              if (dom.readyState === 4) {
                  resolve('done')
              } else {
                  loadData(dom)
              }
          }, 100)
        }
        loadData()
    })
}
