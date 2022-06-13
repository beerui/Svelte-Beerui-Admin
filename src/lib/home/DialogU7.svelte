<script>
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { BeIcon } from "@brewer/beerui";
    import { openNotice } from "../../utils/index.js";
    import { channelLists } from "../utils/videoChannel.js";
    import webSocket from '../utils/websocket'
    import { TOKEN } from "../stores.js";
    import { get_store_value } from "svelte/internal";
    let dispatch = createEventDispatcher()
    // export let videoFlag
    let checked = 1 // 无人机和高位监控控制显示
    let liChecked = 0 // 控制列表每一行背景，列表的显示
    export let airplaneList = [] // 历史无人机列表
    let airplaneingList = [] // 正在飞行的无人机列表
    let showRightVideo = false // 控制右边视频弹框显示
    let videoChecked = '' // 控制视频按钮背景的显示
    let videoAddress = '' // 控制视频按钮背景的显示
    let showBigVideo = false //  控制视频大弹框
    let socket = null
    onDestroy(() => {
      socket.destory = true
      socket.closeWebSocket()
    })
    const setDataList = (e) => {
      airplaneingList = e
    }
    socket = new webSocket('wss://zsdn.zhihuihedao.cn/uav-job/websocket/uav?token=' + get_store_value(TOKEN), setDataList)
    // socket = new webSocket('ws://192.168.1.119:10031/uav-job/websocket/uav?token=NOJB0FkZDZH/nMat/38db4yhDSge7HfN/0RUSgNcKvk=', setDataList)
      // 无人机和高位监控切换
    let handleClick = (_v) => {
        checked = _v
        liChecked = 0
        showRightVideo = false
        dispatch('clickVideoTabHandle', checked === 1 ? 'u7_airplane' : 'u7_video')
    }
    // 点击展开或隐藏列表
    let handleClickList = (_v, _flag) => {
        liChecked = _v
        showRightVideo = _flag
        // 如果当前无人机正在飞行中，显示右侧视频
        dispatch('handleVideoDialog', showRightVideo)
    }
    // 点击视频监控按钮 -- 显示大弹窗
    let handleBigVideo = ({ video }) => {
        videoAddress = video + '&protocol=HLS&iframe=yes&aspect=1200x675'
        showBigVideo = true
    }
    let closeRightDialog = (_v) => {
        showRightVideo = _v
    }
    let closeBigVideoDialog = () => {
        videoAddress = ''
        showBigVideo = false
    }
    const doStartLineAnimation = (isFly, { lonAndLatAndHeight }) => {
      if(isFly) {
        dispatch('doStartLineAnimation', [lonAndLatAndHeight, lonAndLatAndHeight])
      } else {
        if (lonAndLatAndHeight?.length > 0) {
          // 轨迹必须要有两个经纬度，如果只有一个经纬度,复制一份
          if(lonAndLatAndHeight.length < 2) {
            lonAndLatAndHeight = lonAndLatAndHeight.concat(lonAndLatAndHeight)
          }
          dispatch('doStartLineAnimation', lonAndLatAndHeight)
        } else {
            openNotice({
                message: '无轨迹！',
                type: 'error'
            })
        }
      }
    }
    const handleMonitorVideo = (item) => {
        dispatch('showVideoDialog', item)
    }
    const setMapCenter = (item) => {
        if (item?.lngLat) {
	        dispatch('setMapCenter', item.lngLat)
        } else {
            openNotice({
                message: '无坐标！',
                type: 'error'
            })
        }
    }
    onDestroy(() => {
        dispatch('clearStartLineAnimation')
    })
</script>
<div class="monitoring-management-box">
	<div class="left-content">
		<div class="left-btn">
			<div class="item-btn btnTop" class:btnTop_active={ checked === 1} on:click={() => handleClick(1)}></div>
			<div class="item-btn btnBottom" class:btnBottom_active={ checked === 2} on:click={() => handleClick(2)}></div>
		</div>
		<div class="right-list">
			{#if checked === 1}
      <div class="home-dialog">
          {#each airplaneingList as item,index}
            <div
              class="item-li"
              class:item-li-checked={ liChecked === index }
              on:click={() => handleClickList(index, true)}
            >
              <div class="li-name">
                { item.stopPlaceName }
                <!-- 视频在线显示飞行中 -->
                <span>飞行中</span>
              </div>
              <div class="li-airLine">
                无人机：{ item.uavInfo.length || 0 }
                <!-- 下 -->
                {#if liChecked !== index}
                  <span class="line-pull"/>
                {:else}
                  <span class="line-up"/>
                {/if}
              </div>
            </div>
            <!-- 点击显示的列表 -->
            {#if liChecked === index}
              <div class="item-list">
                {#each item.uavInfo as item2}
                  <div class="list-row">
                    <div class="left">
                      <div class="left-name cursor-pointer" on:click={() => doStartLineAnimation(true, item2)}>
                        <span/>
                        { item2.uavName || '无人机' }
                      </div>
                      <div class="left-time">{ item2.beginTime } - </div>
                    </div>
                    <!-- 视频按钮 -->
                    <div class="right" class:hide={!item2.video} on:click={() => handleBigVideo(item2)}/>
                  </div>
                  <div class="list-bottom-border"/>
                {/each}
              </div>
            {/if}
          {/each}
					{#each airplaneList as item,index}
						<div
							class="item-li"
				      class:item-li-checked={ liChecked === index }
				      on:click={() => handleClickList(index, item.isFly)}
						>
							<div class="li-name">
								{ item.stopPlaceName }
								<!-- 视频在线显示飞行中 -->
								<!-- {#if checked === 1} -->
								{#if item.isFly}
									<span>飞行中</span>
								{/if}
							</div>
							<div class="li-airLine">
								航线：{ item.flyRecord.length || 0 }
								<!-- 下 -->
								{#if liChecked !== index}
									<span class="line-pull"/>
								{:else}
									<span class="line-up"/>
								{/if}
							</div>
						</div>
						<!-- 点击显示的列表 -->
						{#if liChecked === index}
							<div class="item-list">
								{#each item.flyRecord as item2}
									<div class="list-row">
										<div class="left">
											<div class="left-name cursor-pointer" on:click={() => doStartLineAnimation(false, item2)}>
												<span/>
												{ item2.airRouteName || '默认航线' }
											</div>
											<div class="left-time">{ item2.beginTime } - {item2.endTime}</div>
										</div>
										<!-- 视频按钮 -->
										<div class="right" class:hide={!item2.video} on:click={() => handleBigVideo(item2)}/>
									</div>
									<div class="list-bottom-border"/>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			{/if}
			{#if checked === 2}
				<div class="home-dialog">
					<div class="item-li">
						<div class="li-name">
							高位监控
						</div>
					</div>
					<!-- 点击显示的列表 -->
					<div class="item-list item-list-video-box">
						<div class="item-list-scroll">
							{#each channelLists as item,index}
								<div class="list-row">
									<div class="left-monitoring">
										<div class="left-name" on:click={() => setMapCenter(item)}>
											<span/>
											{ item.name }
										</div>
									</div>
									<!-- 监控按钮 -->
									<div class="right-monitoring" class:monitoring-checked={ videoChecked === index}
									     on:click={() => handleMonitorVideo(item)}/>
								</div>
								<div class="list-bottom-border"/>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
	{#if showRightVideo}
		<div class="right-content">
			<div class="title">
				<div class="title-name">机场1</div>
				<!-- <div class="close-btn" /> -->
				<div class="close-btn" on:click={() => closeRightDialog(false)}/>
			</div>
			<div class="video-box"></div>
		</div>
	{/if}
	{#if showBigVideo}
		<div class="video-preview-box">
			<div class="mask-video" on:click={() => showBigVideo = false}></div>
			<div class="video-container">
				<div class="video-close" on:click={() => showBigVideo = false}>
					<BeIcon name="close" width="35" height="35"></BeIcon>
				</div>
				<iframe src="{videoAddress}" width="1200" height="675" allowfullscreen allow="autoplay; fullscreen"></iframe>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
  .monitoring-management-box {
    .left-content {
      width: 535px;
      margin-top: 39px;
      display: flex;
      justify-content: space-between;
      color: #fff;
      position: fixed;
      left: 0;
      top: 100px;
      z-index: 998;

      .left-btn {
        width: 94px;

        .item-btn {
          width: 94px;
          height: 87px;
          background-color: skyblue;
          cursor: pointer;
          background: url(/assets/home/hydraulic.png) no-repeat;
        }

        .btnTop {
          background-position: -19px -744px;
          margin-bottom: 10px;
        }

        .btnTop_active {
          background-position: -19px -552px;
          margin-bottom: 10px;
        }

        .btnBottom {
          background-position: -19px -840px;
        }

        .btnBottom_active {
          background-position: -19px -647px;
        }
      }

      .right-list {
        width: 428px;
        height: calc(100vh - 180px);
        background: rgba(7, 20, 41, 0.88);
        box-shadow: 0 0 16px #2373E8 inset;
        padding: 0 0 5px 0;

        .home-dialog {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;

          .item-li {
            height: 40px;
            width: 100%;
            background: url(/assets/home/monitoringManagement/li_bg.png) no-repeat;
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            padding: 0px 21px;
            font-size: 14px;
            font-weight: 400;
            color: #62D9FD;
            cursor: pointer;
            margin-bottom: 8px;

            .li-name {
              color: #FFFFFF;

              > span {
                display: inline-block;
                padding: 0px 3px;
                height: 20px;
                vertical-align: middle;
                background: rgba(0, 255, 31, 0.22);
                font-size: 12px;
                font-weight: 400;
                color: #2DE506;
                line-height: 20px;
                border-radius: 4px;
                border: 1px solid rgba(45, 229, 6, 0.81);
                margin-left: 5px;
              }
            }

            .li-airLine {
              > span {
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: middle;
                margin-left: 5px;
              }

              .line-pull {
                background: url(/assets/home/monitoringManagement/pull_icon.png) no-repeat;
              }

              .line-up {
                background: url(/assets/home/monitoringManagement/up_icon.png) no-repeat;
              }
            }
          }

          .item-li-checked {
            background: url(/assets/home/monitoringManagement/li_checked_bg.png) no-repeat;
          }

          .item-list {
            max-height: 250px;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 15px 21px 0px 21px;

	          &.item-list-video-box {
		          max-height: calc(100% - 50px)
	          }
            .item-list-scroll {
              height: 100%;
              overflow-y: auto;
              overflow-x: hidden;
            }

            .list-row {
              display: flex;
              justify-content: space-between;

              .left {
                .left-name {
                  font-size: 16px;
                  font-weight: 400;
                  color: #FFFFFF;
									cursor: pointer;
                  > span {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background: url(/assets/home/monitoringManagement/li_icon.png) no-repeat;
                    vertical-align: middle;
                  }
                }

                .left-time {
                  font-size: 12px;
                  font-weight: 400;
                  color: #96CEFD;
                  margin-top: 12px;
                  padding-left: 19px;
                }
              }

              .left-monitoring {
                .left-name {
                  font-size: 16px;
                  font-weight: 400;
                  color: #FFFFFF;
                  line-height: 30px;
	                cursor: pointer;
                  > span {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background: url(/assets/home/monitoringManagement/li_icon.png) no-repeat;
                    vertical-align: middle;
                  }
                }
              }

              .right {
                width: 74px;
                height: 30px;
                background: url(/assets/home/monitoringManagement/video.png) no-repeat;
                cursor: pointer;

                &.hide {
                  display: none;
                }

                &:hover {
                  background: url(/assets/home/monitoringManagement/video_checked.png) no-repeat;
                }
              }

              .right-monitoring {
                width: 74px;
                height: 30px;
                background: url(/assets/home/monitoringManagement/monitoring.png) no-repeat;
                cursor: pointer;

                &:hover {
                  background: url(/assets/home/monitoringManagement/monitoring_checked.png) no-repeat;
                }
              }
            }

            .list-bottom-border {
              height: 20px;
              width: 100%;
              margin-top: 10px;
              margin-bottom: 5px;
              background: url(/assets/home/monitoringManagement/li_bomttom_border.png) no-repeat;
            }
          }
        }
      }

    }

    .right-content {
      width: 451px;
      height: 286px;
      margin-top: 9px;
      background: url(/assets/home/monitoringManagement/video_bg.png) no-repeat;
      position: fixed;
      right: 13px;
      top: 100px;
      z-index: 9999;

      .title {
        width: 208px;
        height: 30px;
        display: flex;
        justify-content: space-between;

        .title-name {
          padding-left: 23px;
          font-size: 16px;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 30px;
        }

        .close-btn {
          width: 18px;
          height: 18px;
          background: url(/assets/home/monitoringManagement/video_close.png) no-repeat;
          margin-top: 6px;
          cursor: pointer;
        }
      }

      .video-box {
        width: 441px;
        height: 247px;
        background-color: skyblue;
        margin-top: 4px;
        margin-left: 5px;
      }
    }

    .video-preview-box {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, .6);

      .mask-video {
        position: absolute;
        background: rgba(0, 0, 0, .6);
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      .video-container {
        width: 1200px;
        height: 675px;
        margin: 0 auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }

      .video-close {
        cursor: pointer;
        position: absolute;
        right: -45px;
        top: 0;
        color: #ffffff;
      }
    }
  }
</style>
