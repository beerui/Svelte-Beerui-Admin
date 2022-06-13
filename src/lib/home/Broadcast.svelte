<script>
    // 一键播报
    import { tick } from "svelte";
    import { BeCountTo } from "@brewer/beerui";
    import BroadcastCardItem from "./BroadcastCardItem.svelte";
    import BroadcastCardContent from "./BroadcastCardContent.svelte";
    import { initBroadcast } from "../utils/broadcast.js";
    export let isShowBroadcast = false // 展示播报页面
    let status = 'waiting' // 是否可以开始播报
    let BroadcastVideo = null // 视频实例
    let duration = 0
    let paused = true
    let currentTime = 0
		$: {
			console.log('duration', duration)
			console.log('paused', paused)
			console.log('currentTime', currentTime)
		}
    const loadVideo = async () => {
	      status = 'loading'
        await tick()
        await initBroadcast(BroadcastVideo)
        status = 'done'
	      console.dir(BroadcastVideo)
    }
    loadVideo()
		const toggleKey = () => {
			if (active === 0) paused = false
			active++
			if (active === 7) active = 0
		}
		const exitHandle = () => {
			isShowBroadcast = false
		}
		let active = 0
</script>
<div class="g-broadcast">
	{#if status === 'done'}
		<div class="g-broadcast-loading">
			{#if status === 'waiting'}
				读取中..
			{:else if status === 'loading'}
				正在加载资源...
			{/if}
		</div>
	{/if}
	<div on:click={toggleKey} style="position: fixed;left: 0;top: 0;z-index: 999;background:#ffffff;">播报</div>
	<div on:click={() => paused = !paused} style="position: fixed;left: 200px;top: 0;z-index: 999;background:#ffffff;">暂停</div>
	<div on:click={exitHandle} style="position: fixed;left: 100px;top: 0;z-index: 999;background:#ffffff;">退出播报</div>
	<!-- step 1	多条河介绍-->
	<BroadcastCardContent visible={currentTime > 2.3 && currentTime < 6} left="70%" bottom="50%" title="环城东河" riverName="河长姓名">
		<div class="card-list-box">
			<div class="card-mini">
				<div>问题统计</div>
				<div class="desc">
					<div class="m-count"><BeCountTo end="999" duration="3000" autoplay /></div> <span>件</span>
				</div>
			</div>
			<div class="card-mini">
				<div>问题处理率</div>
				<div class="desc"><div class="m-count"><BeCountTo end="100" duration="3000" autoplay /></div> <span>%</span></div>
			</div>
		</div>
	</BroadcastCardContent>
	<!-- step 2 河的数据分析	-->
	<BroadcastCardItem visible={currentTime > 6.2 && currentTime < 19} left="20px" bottom="50px">
		<span slot="title">数据播报 <span>Broadcasting Datagram</span></span>
		<div>
			全区区级河道 <div class="m-count"><BeCountTo end="60" duration="3000" autoplay /></div>条，镇级河道 <div class="m-count"><BeCountTo end="392" duration="3000" autoplay /></div>条，村级河道 <div class="m-count"><BeCountTo end="1410" duration="3000" autoplay /></div>条，
			截至今日，越城区巡河率 <div class="m-count"><BeCountTo end="100" duration="3000" autoplay /></div>%，上报问题 <div class="m-count"><BeCountTo end="601" duration="3000" autoplay /></div>起，其中无人机发现 <div class="m-count"><BeCountTo end="160" duration="3000" autoplay /></div>起，
			高位监控发现 <div class="m-count"><BeCountTo end="226" duration="3000" autoplay /></div>起。处理率 ：<div class="m-count"><BeCountTo end="100" duration="3000" autoplay /></div>%
		</div>
	</BroadcastCardItem>
	<!-- step 3 各个泵站	-->
	<BroadcastCardContent visible={currentTime > 20 && currentTime < 40} left="70%" bottom="50%" title="螺丝贩泵站" riverName="环山河">
		<div class="card-list-box">
			<div class="card-mini">
				<div>天气</div>
				<div class="desc">大雨</div>
			</div>
			<div class="card-mini">
				<div>河道水位</div>
				<div class="desc">4.5</div>
			</div>
			<div class="card-mini">
				<div>问题处理率</div>
				<div class="desc">100 <span>%</span></div>
			</div>
		</div>
	</BroadcastCardContent>
	<!-- step 4 闸门介绍	-->
	<BroadcastCardItem visible={currentTime > 40 && currentTime < 52} left="20px" bottom="50px" style="width: 850px;">
		<span slot="title">数据播报 <span>Broadcasting Datagram</span></span>
		<div>
			全区活水泵站 <div class="m-count"><BeCountTo end="5" duration="3000" autoplay /></div>座，活水闸门 <div class="m-count"><BeCountTo end="16" duration="3000" autoplay /></div>座，
			<hr>
			全区雨情情况，水情状态良好，易受淹区域 <div class="m-count"><BeCountTo end="0" duration="3000" autoplay /></div>处。
		</div>
	</BroadcastCardItem>
	<!-- step 5 调度方案	-->
	<BroadcastCardContent visible={currentTime > 53 && currentTime < 90} left="70%" bottom="50%" title="调度方案一" times="24">
		<div>
			全区区级河道=>河=>闸
		</div>
		<span slot="people">负责人: xxx 1255515555</span>
	</BroadcastCardContent>
	<!-- step 6 总结描述	-->
	<BroadcastCardItem visible={currentTime > 90 && currentTime < 94} left="20px" bottom="50px" style="width: 850px;">
		<span slot="title">数据播报 <span>Broadcasting Datagram</span></span>
		<div>
			古城内满足活水调度，防汛排涝指挥调度的方案共有<div class="m-count"><BeCountTo end="5" duration="3000" autoplay /></div>套，基本满足应急指挥调度的需求。
		</div>
	</BroadcastCardItem>
	<div class="video-bg">
		<video
			poster=""
			muted
			height="100%"
			bind:this={BroadcastVideo}
			src="/assets/broadcast/bg.mp4"
     bind:currentTime
     bind:duration
     bind:paused
		></video>
	</div>
</div>
<style lang="scss">
  .g-broadcast {
    width: 100%;height: 100%;position: relative;z-index: 99999;
	  .z-10 {
		  position: relative;
      z-index: 10;
	  }
	  .video-bg {
      width: 100%;height: 100%;position: fixed;left: 0;z-index: 1;top: 0;
	    video {
	      width: 100%;height: 100%;object-fit: fill;
	    }
	  }
  }
</style>
