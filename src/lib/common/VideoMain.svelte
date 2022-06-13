<script>
    import {
        mouseDownPTZControl,
        clickStartRealPlay,
        clickFullScreen,
        initVideoPlugin,
        exitAndLoginNew,
        mouseUpPTZControl,
        clickStopRealPlay,
        clickCapturePic,
        clickStartRecord,
        clickStopRecord
    } from "$lib/utils/HK_video";
    import { channelLists } from "$lib/utils/videoChannel";
    import { onMount, tick } from "svelte";
    import { BeIcon, BeTabPane, BeTabs } from "@brewer/beerui";

    export let visible = false

    onMount(async () => {
        // percentCount()
        await tick()
        initVideoPlugin(channelLists[0])
        setTimeout(() => {
            clickShowVideo(channelLists[0])
        }, 100)
    })

    // 112.15.92.207    POINT(120.5819333 29.9680222)
    // 123.157.150.2    POINT(120.6967778 30.0381222)
    // 123.157.150.17   POINT(120.5882972 30.118275)
    // 123.157.150.31    POINT(120.6953278 30.0857694)
    // 123.157.150.43    POINT(120.6675611 29.9935389)
    let speed = 4

    // 云台速度
    let speedSize = 42
    let active = '112.15.92.208'
    let activeName = ''
    let clickShowVideo = items => {
        active = items.szIP
        activeName = items.name
        exitAndLoginNew(items)
    }
    const closeHandle = () => {
        visible = false
    }
</script>
	<div class="g-video-main">
		<div class="g-video-main-main">
			<div class="close" on:click={closeHandle}>
				<BeIcon name="close" width="30" height="30" />
			</div>
			<div class="videoMonitoring-box">
					<div class="list-box">
						<!--      <div class="video-photo-box">-->
						<!--        <div class="video-name">&#45;&#45; {activeName} &#45;&#45;</div>-->
						<!--      </div>-->
						<div class="video-list-box">
							{#each channelLists as item}
								<div class="video-item" class:video-item-checked={item.szIP === active} on:click={()=> clickShowVideo(item)}>
									<div class="item-name">{item.name}</div>
									<div class="item-icon"></div>
								</div>
							{/each}
						</div>
					</div>
					<div class="video-box">
						<div id="divPlugin" class="video-container">
						</div>
					</div>
					<div class="btn-box">
						<div class="item-icon-box">
							<div class="item-list-icon item-list-icon-1" on:click={() => clickStartRealPlay()}></div>
							<div class="item-list-icon item-list-icon-2" on:click={() => clickStopRealPlay()}></div>
							<div class="item-list-icon item-list-icon-3" on:click={() => clickCapturePic()}></div>
							<div class="item-list-icon item-list-icon-4" on:click={() => clickStartRecord()}></div>
							<div class="item-list-icon item-list-icon-5" on:click={() => clickStopRecord()}></div>
							<div class="item-list-icon item-list-icon-6" on:click={() => clickFullScreen()}></div>
						</div>
						<div class="item-arrow-box">
							<div>
								<div class="arrow-title">云台控制</div>
								<div class="arrow-cintent">
									<div class="item-list-arrow item-list-arrow-1" on:mousedown={() => mouseDownPTZControl(5)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-2" on:mousedown={() => mouseDownPTZControl(1)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-3" on:mousedown={() => mouseDownPTZControl(7)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-4" on:mousedown={() => mouseDownPTZControl(3)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-5" on:mousedown={() => mouseDownPTZControl(9)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-6" on:mousedown={() => mouseDownPTZControl(4)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-7" on:mousedown={() => mouseDownPTZControl(6)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-8" on:mousedown={() => mouseDownPTZControl(2)} on:mouseup={mouseUpPTZControl}></div>
									<div class="item-list-arrow item-list-arrow-9" on:mousedown={() => mouseDownPTZControl(8)} on:mouseup={mouseUpPTZControl}></div>
								</div>
							</div>
							<div class="zoom-box">
								<div>
									<span>缩放</span>
									<div>
										<span class="item-list-arrows item-list-arrows-10" on:mousedown={mouseDownPTZControl(5,0)} on:mouseup={mouseUpPTZControl(5,1)}></span>
										<span class="item-list-arrows item-list-arrows-11" on:mousedown={mouseDownPTZControl(6,0)} on:mouseup={mouseUpPTZControl(6,1)}></span>
									</div>
								</div>
								<div>
									<span>变焦</span>
									<div>
										<span class="item-list-arrows item-list-arrows-10" on:mousedown={mouseDownPTZControl(11,0)} on:mouseup={mouseUpPTZControl(11,1)}></span>
										<span class="item-list-arrows item-list-arrows-11" on:mousedown={mouseDownPTZControl(12,0)} on:mouseup={mouseUpPTZControl(12,1)}></span>
									</div>
								</div>
								<div>
									<span>光圈</span>
									<div>
										<span class="item-list-arrows item-list-arrows-10" on:mousedown={mouseDownPTZControl(13,0)} on:mouseup={mouseUpPTZControl(13,1)}></span>
										<span class="item-list-arrows item-list-arrows-11" on:mousedown={mouseDownPTZControl(14,0)} on:mouseup={mouseUpPTZControl(14,1)}></span>
									</div>
								</div>
							</div>
						</div>
						<div class="item-speed-box">
							<div class="speed-box">云台速度</div>
							<input type=range bind:value={speedSize}>
						</div>
					</div>
			</div>
		</div>
	</div>
<style lang="scss">
	.g-video-main-main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 65%;
    height: calc(100vh - 200px);
    opacity: 1;
    z-index: 999999;
    background: #030f2e;
    box-shadow: 0 0 16px #2373E8 inset;
    padding: 15px;
    color: #fff;
		.close {position: absolute;right: -35px;top: 0;cursor: pointer;}
	}
  .videoMonitoring-box {
    display: flex;width: 100%;height: 100%;
    .list-box {
	    width: 206px;
      .video-photo-box {width: 206px;height: 226px;background: url('/assets/images/video/video_photo.png') no-repeat;background-size: 100% 100%;
        .video-name {text-align: center;font-size: 16px;font-weight: 400;color: #333333;padding-top: 195px;}
      }
      .video-list-box {height: 100%;overflow-y: scroll;overflow-x:hidden;
        .video-item {
          width:184px;min-height: 36px;border-radius: 4px;padding: 11px 14px;font-size: 14px;font-weight: 400;
          display:flex;justify-content: space-between;cursor: pointer;
          .item-name {width: 130px;}
          .item-icon {width: 16px;height: 16px;background: url('/assets/images/video/un_checked.png') no-repeat;}
        }
        .video-item-checked {background: #E5F3FE;
          .item-name {color:#0188EF;}
          .item-icon {background: url('/assets/images/video/checked.png') no-repeat;}
        }
      }
    }
    .video-box {
	    background-color: black;width: calc(100% - 423px);height: 100%;
      .video-container {width: 100%;height: 100%;}
    }
    .btn-box {
	    width: 239px;height: 100%;overflow-y: scroll;overflow-x: hidden;
      .item-icon-box{display: flex;flex-wrap: wrap;justify-content: space-between;padding: 0 14px;box-sizing: border-box;
        .item-list-icon {width: 62px;height: 62px;transition: all .15s;cursor: pointer;margin-bottom: 8px;}
        .item-list-icon-1 {background: url('/assets/images/video/k_01_1.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-1:hover {background: url('/assets/images/video/k_01_2.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-2 {background: url('/assets/images/video/k_02_1.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-2:hover {background: url('/assets/images/video/k_02_2.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-3 {background: url('/assets/images/video/k_03_1.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-3:hover {background: url('/assets/images/video/k_03_2.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-4 {background: url('/assets/images/video/k_04_1.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-4:hover {background: url('/assets/images/video/k_04_2.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-5 {background: url('/assets/images/video/k_05_1.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-5:hover {background: url('/assets/images/video/k_05_2.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-6 {background: url('/assets/images/video/k_06_1.png') no-repeat;background-size: 100% 100%;}
        .item-list-icon-6:hover {background: url('/assets/images/video/k_06_2.png') no-repeat;background-size: 100% 100%;}
      }
      .item-arrow-box {display: flex;align-items: center;padding-left: 15px;padding-right: 14px;box-sizing: border-box;
        .arrow-title {font-size: 14px;font-weight: bold;margin-bottom: 17px;}
        .arrow-cintent {display: flex;flex-wrap: wrap;width: 140px;font-size:30px;}
        .item-list-arrow{width: 38px;height: 38px;margin-bottom: 5px;margin-right: 5px;background: url('/assets/images/video/k_07.png') no-repeat;cursor: pointer;}
        .item-list-arrow-1:hover{background-position: -4px -5px;}
        .item-list-arrow-1{background-position: -57px -5px;}
        .item-list-arrow-2:hover{background-position: -4px -49px;}
        .item-list-arrow-2{background-position: -57px -49px;}
        .item-list-arrow-3:hover{background-position: -4px -93px;}
        .item-list-arrow-3{background-position: -57px -93px;}
        .item-list-arrow-4:hover{background-position: -4px -137px;}
        .item-list-arrow-4{background-position: -57px -137px;}
        .item-list-arrow-5:hover{background-position: -4px -181px;}
        .item-list-arrow-5{background-position: -57px -181px;}
        .item-list-arrow-6:hover{background-position: -4px -225px;}
        .item-list-arrow-6{background-position: -57px -225px;}
        .item-list-arrow-7:hover{background-position: -4px -269px;}
        .item-list-arrow-7{background-position: -57px -269px;}
        .item-list-arrow-8:hover{background-position: -4px -313px;}
        .item-list-arrow-8{background-position: -57px -313px;}
        .item-list-arrow-9:hover{background-position: -4px -357px;}
        .item-list-arrow-9{background-position: -57px -357px;}
        .item-list-arrows{width: 38px;height: 26px;background: url('/assets/images/video/k_07.png') no-repeat;cursor: pointer;}
        .item-list-arrows-10:hover{background-position: 0 -452px;}
        .item-list-arrows-10{background-position: 0px -490px;}
        .item-list-arrows-11{background-position: -39px -452px;}
        .item-list-arrows-11:hover{background-position: -39px -490px;}

        .zoom-box {
          >div {margin-bottom: 10px;
            >span {font-size: 14px;font-weight: 400;}
            >div {display: flex;align-items: center;justify-content: center;border-radius: 4px;font-size: 18px;margin-top: 3px;overflow: hidden;}
          }
        }
      }
      .item-speed-box {padding: 15px 14px 0 15px;box-sizing: border-box;
        .speed-box {font-size: 14px;font-weight: bold;margin-bottom: 17px;}
      }
    }
  }
</style>
