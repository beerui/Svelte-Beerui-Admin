<script>
    import { BeButton, BeDialog, BeRadio, BeRadioGroup } from "@brewer/beerui";
    import {
        mouseDownPTZControl,
        clickStartRealPlay,
        clickFullScreen,
        initVideoPlugin,
        PTZZoomStop,
        clickGoPreset,
        PTZZoomout,
        PTZZoomIn,
        exitAndLoginNew,
        mouseUpPTZControl
    } from "$lib/utils/HK_video";
    import { channelLists } from "$lib/utils/videoChannel";
    import { onMount, tick } from "svelte";

    let active = '112.15.92.208'
    let activeName = ''

    onMount(async () => {
        // percentCount() await tick()
        initVideoPlugin(channelLists[0])
        setTimeout(() => {
            clickShowVideo(channelLists[0])
        }, 100)
    })

    let clickShowVideo = items => {
        active = items.szIP
        activeName = items.name
        exitAndLoginNew(items)
    }
    let channelList = [], channelNumber = 1, resetChannelNumber = 1
    const getChannelList = (result) => {
        if (result) {
            channelList = result
            channelNumber = result[0].value
            resetChannelNumber = result[0].value
            channelName = result[0].name
            clickStartRealPlay(String(channelNumber))
        }
    }
    let speed = 4

    let channelName = ''

    let visibleSelectDialog = false;
    let beforeSelectClose = () => {
        channelNumber = resetChannelNumber
        visibleSelectDialog = false
    }
    const confirmHandle = ({ detail }) => {
        if (detail === 'confirm') {
            resetChannelNumber = active
            const item = channelLists.filter(el => el.szIP === active)
            console.log('item', item[0])
            clickShowVideo(item[0])
            visibleSelectDialog = false
        } else {
            beforeSelectClose()
        }
    };
</script>

<div class="g-video">
  <BeDialog bind:visible={visibleSelectDialog} on:beforeClose={beforeSelectClose} width="40%" on:confirmHandle={confirmHandle}>
    <div class="m-select-container">
	    <BeRadioGroup bind:checked={active}>
		    {#each channelLists as item}
		      <BeRadio label={item.szIP}>{item.name}</BeRadio>
		    {/each}
	    </BeRadioGroup>
    </div>
  </BeDialog>
  <div class="m-select" on:click={() => visibleSelectDialog = true}>{activeName}</div>
  <div id="divPlugin" style="width: 100%;height: 100%;padding: 36px 2px;"></div>
  <div class="m-video-tools">
    <div class="m-video-tools__pre">
      {#if resetChannelNumber === 1}
        <div class="icon-pre" on:click={() => clickGoPreset(1)}>预置点1</div>
        <div class="icon-pre" on:click={() => clickGoPreset(3)}>预置点2</div>
        <div class="icon-pre" on:click={() => clickGoPreset(7)}>预置点3</div>
      {/if}
    </div>
    <div class="m-video-tools__icon" on:mousedown={() => {mouseDownPTZControl(1)}} on:mouseup={() => {mouseUpPTZControl()}}>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16"><path d="M955.22334297 449.25694963L560.2638849 54.29749156a80.43980815 80.43980815 0 0 0-60.32985611-24.93634051 80.43980815 80.43980815 0 0 0-57.91666189 23.32754436L67.16786089 431.56019185a80.43980815 80.43980815 0 0 0 113.4201295 113.42012948l238.10183214-240.51502636V914.1990408a80.43980815 80.43980815 0 1 0 160.87961632 0V310.90047962L833.75923265 568.30786571a80.43980815 80.43980815 0 0 0 119.05091606-119.05091608z" fill="#ffffff"></path></svg>
    </div>
    <div class="m-video-tools__icon icon-right" on:mousedown={() => {mouseDownPTZControl(4)}} on:mouseup={() => {mouseUpPTZControl()}}>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16"><path d="M955.22334297 449.25694963L560.2638849 54.29749156a80.43980815 80.43980815 0 0 0-60.32985611-24.93634051 80.43980815 80.43980815 0 0 0-57.91666189 23.32754436L67.16786089 431.56019185a80.43980815 80.43980815 0 0 0 113.4201295 113.42012948l238.10183214-240.51502636V914.1990408a80.43980815 80.43980815 0 1 0 160.87961632 0V310.90047962L833.75923265 568.30786571a80.43980815 80.43980815 0 0 0 119.05091606-119.05091608z" fill="#ffffff"></path></svg>
    </div>
    <div class="m-video-tools__icon icon-bottom" on:mousedown={() => {mouseDownPTZControl(2)}} on:mouseup={() => {mouseUpPTZControl()}}>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16"><path d="M955.22334297 449.25694963L560.2638849 54.29749156a80.43980815 80.43980815 0 0 0-60.32985611-24.93634051 80.43980815 80.43980815 0 0 0-57.91666189 23.32754436L67.16786089 431.56019185a80.43980815 80.43980815 0 0 0 113.4201295 113.42012948l238.10183214-240.51502636V914.1990408a80.43980815 80.43980815 0 1 0 160.87961632 0V310.90047962L833.75923265 568.30786571a80.43980815 80.43980815 0 0 0 119.05091606-119.05091608z" fill="#ffffff"></path></svg>
    </div>
    <div class="m-video-tools__icon icon-left" on:mousedown={() => {mouseDownPTZControl(3)}} on:mouseup={() => {mouseUpPTZControl()}}>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16"><path d="M955.22334297 449.25694963L560.2638849 54.29749156a80.43980815 80.43980815 0 0 0-60.32985611-24.93634051 80.43980815 80.43980815 0 0 0-57.91666189 23.32754436L67.16786089 431.56019185a80.43980815 80.43980815 0 0 0 113.4201295 113.42012948l238.10183214-240.51502636V914.1990408a80.43980815 80.43980815 0 1 0 160.87961632 0V310.90047962L833.75923265 568.30786571a80.43980815 80.43980815 0 0 0 119.05091606-119.05091608z" fill="#ffffff"></path></svg>
    </div>
    <div class="m-video-tools__icon" on:mousedown={() => PTZZoomIn()} on:mouseup={() => PTZZoomStop()}>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16"><path d="M960 576H576v384c0 38.4-25.6 64-64 64s-64-25.6-64-64V576H64c-38.4 0-64-25.6-64-64s25.6-64 64-64h384V64c0-38.4 25.6-64 64-64s64 25.6 64 64v384h384c38.4 0 64 25.6 64 64s-25.6 64-64 64z" fill="#ffffff"></path></svg>
    </div>
    <div class="m-video-tools__icon" on:mousedown={() => PTZZoomout()} on:mouseup={() => PTZZoomStop()}>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16"><path d="M960 576H64c-38.4 0-64-25.6-64-64 0-32 25.6-64 64-64h896c32 0 64 25.6 64 64s-25.6 64-64 64z" fill="#ffffff"></path></svg>
    </div>
    <div class="m-video-tools__icon rotate-45 p-0" on:click={() => clickFullScreen()}>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16"><path d="M768 320v128H576V256h128L512 64 320 256h128v192H256V320L64 512l64 64 128 128V576h192v192H320l192 192 64-64 128-128H576V576h192v128l192-192-192-192z" fill="#ffffff"></path></svg>
    </div>
  </div>
</div>
<style lang="scss">
  .g-video {
    background: url('/assets/live_water/top_bg_mid_03.jpg') 0 0 no-repeat;width: 503px;height: 365px;position: relative;
    box-shadow: 0 0 6px 1px inset #1f4ea8;margin-left: 10px;margin-right: 20px;
    .m-select-container {
      display: flex;flex-wrap: wrap;
      .m-list {width: 32%;margin-bottom: 5px;}
    }
    .m-select {
      position: absolute;right: 54px;top: 9px;width: 88px;color: #FFFFFF;font-size: 14px;overflow: hidden;cursor: pointer;
      word-break: keep-all;text-overflow: ellipsis;
    }
    .m-video-tools {
      position: absolute;bottom: 0;width: 100%;height: 36px;color: #FFFFFF;font-size: 12px;
      display: flex;justify-content: space-around;align-items: center;cursor: pointer;
      &__pre {width: 250px;display: flex;justify-content: space-around;}
      &__icon {
        width: 20px;height: 20px;padding: 3px;
        svg {width: 100%;height: 100%;}
        &:hover {padding: 2px;}
      }
      .p-0 {padding: 0;}
      .icon-right {transform: rotateZ(90deg);}
      .icon-bottom {transform: rotateZ(180deg);}
      .icon-left {transform: rotateZ(-90deg);}
      .rotate-45 {transform: rotateZ(45deg)}
      .icon-pre {
        width: 70px;text-align: center;box-shadow: 0 0 15px 3px inset #1f4ea8;height: 24px;line-height: 24px;
        color: #e0e0e0;border-radius: 2px;
        &:hover {box-shadow: 0 0 10px 6px inset #1f4ea8;}
      }
    }
  }
</style>
