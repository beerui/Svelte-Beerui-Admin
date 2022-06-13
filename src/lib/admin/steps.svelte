<script>
  import {
    BeDialog, BeIcon
  } from "@brewer/beerui";
  import ImgSwiper from "$lib/admin/imgSwiper.svelte";
  export let stepsList = [] // 传过来的进度数组
  
  let detailDialogVisible = false
  let title = ''
  let detailObj = {}
  let swiperList = [] // 图片视频数组
  let fileList = [] // 附件
  let audioList = [] // 音频
  let clickFiles = (_obj) => {
    detailDialogVisible = true
    detailObj = _obj || {}
    title = _obj.state || ''
    swiperList = _obj.accessoryMap.imageAndVideoList || []
    fileList = _obj.accessoryMap.appendixList || []
    audioList = _obj.accessoryMap.audioList || []
  }
  let openFile = (_item) => {
    const el = document.createElement('a')
    el.style.display = 'none'
    el.setAttribute('target', '_blank')
    _item.fileName && el.setAttribute('download', _item.fileName)
    el.href = _item.url
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }
  let beforeClose = () => {
    detailDialogVisible = false
  }
  let listData = initArray()
  function initArray() {
    let newArr = []
    let _size = 4
    for (let i = 0; i < Math.ceil(stepsList.length / _size); i++) {
      let _start = i * _size
      let _end = _start + _size
      newArr.push(stepsList.slice(_start, _end))
    }
    return newArr
  }

  let imgAndVideoDialogVisible = false
  let imgAndVideoIndex = 0
  let imgVideoBigList = []
  let showBigImgAndVideo = (_item) => {
    imgAndVideoIndex = _item.detail.index
    imgVideoBigList = _item.detail.list
    imgAndVideoDialogVisible = true
  }
  let clickPrevious = () => {
    if (imgAndVideoIndex == 0) return
    imgAndVideoIndex--
  }
  let clickNext = () => {
    if (imgAndVideoIndex == (imgVideoBigList.length - 1)) return
    imgAndVideoIndex++
  }
  let imgAndVideoBeforeClose = () => {
    imgAndVideoDialogVisible = false
    detailDialogVisible = true
  }
</script>
<div class="article-steps">
  <div class="detail-steps-box">
    {#each listData as item, index}
      <div class="semicircle-box">
        {#if index % 2 !== 0 && index !== listData.length - 1}
          <div class="left-semicircle"></div>
        {/if}
        {#each item as liItem, liIndex}
          <div class="row-steps">
            <div class="step-item">
              <div class="item-circle"></div>
              <div class="step-line" class:hidden-line={(index+1) === listData.length && (liIndex+1) === item.length && listData.length % 2 !== 0}></div>
            </div>
            <div class="content-item">
              <div class="content-title">{ liItem.state }</div>
              {#if liItem}
              <div class="content-name">{ liItem.personName }</div>
              {/if}
              {#if liItem}
              <div class="content-time">{ liItem.time }</div>
              {/if}
              {#if JSON.stringify(liItem.accessoryMap) !== '{}'}
                <div class="content-btn" on:click={() => clickFiles(liItem)}>查看附件</div>
              {/if}
            </div>
          </div>
        {/each}
        {#if index % 2 === 0 && index !== listData.length - 1}
          <div class="right-semicircle"></div>
        {/if}
      </div>
    {/each}
  </div>
  <BeDialog bind:visible={detailDialogVisible} title={title} isHideFooter={true} beforeClose={beforeClose} closeOnClickModal={false}>
    <div class="detail-content">
      <div class="content-left">
        <div class="left-title">
          <div></div>
          处理描述：
        </div>
        <div class="left-content">{ detailObj.desc || '' }</div>
        <div class="left-title left-line">
          <div></div>
          处理人：<span>{ detailObj.personName }</span>
        </div>
        <div class="left-title left-line">
          <div></div>
          处理时间：<span>{ detailObj.time }</span>
        </div>
        {#if fileList.length > 0}
        <div class="left-title">
          <div></div>附件：
        </div>
        <div class="left-content">
          <div class="item-files">
            {#each fileList as item, index}
              <span on:click={() => openFile(item)}>{ item.fileName }</span>
            {/each}
          </div>
        </div>
        {/if}
        {#if audioList.length > 0}
        <div class="left-title">
          <div></div>音频：
        </div>
        <div class="left-content">
          {#each audioList as item, index}
          <div class="item-audio">
            <audio src={item.url} controls>
              <!-- <source :src={item.url} type="audio/ogg"> -->
              <!-- <source type="audio/mpeg"> -->
              您的浏览器不支持 audio 标签。
            </audio>
          </div>
          {/each}
        </div>
        {/if}
      </div>
      <div class="content-right">
        {#if swiperList.length > 0}
          <ImgSwiper swiperList={swiperList} on:showBigImgAndVideo={showBigImgAndVideo} />
        {/if}
      </div>
    </div>
  </BeDialog>
  <BeDialog class="imgVideoDialog" bind:visible={imgAndVideoDialogVisible} title="查看详情" isHideFooter={true} closeOnClickModal={false} beforeClose={imgAndVideoBeforeClose}>
    <div class="dialog-content">
      <div class="left-btn" on:click={() => clickPrevious()}><BeIcon name='chevron-left' color='#c6c6c6' width="40" height="40" /></div>
      <div class="content-img-video">
        {#if imgVideoBigList[imgAndVideoIndex].isVideo == '1'}
          <!-- svelte-ignore a11y-media-has-caption -->
          <video src={imgVideoBigList[imgAndVideoIndex].url} alt="" controls="controls"></video>
        {/if}
        {#if imgVideoBigList[imgAndVideoIndex].isVideo == '0'}
          <img src={imgVideoBigList[imgAndVideoIndex].url} alt="" />
        {/if}
      </div>
      <div class="right-btn" on:click={() => clickNext()}><BeIcon name='chevron-right' color='#c6c6c6' width="40" height="40" /></div>
    </div>
  </BeDialog>
</div>
<style lang="scss">
  .article-steps {
    .detail-steps-box {display:flex;flex-direction: column;padding:40px 0px;width: 80%;margin: 0 auto;min-width:800px;
      .semicircle-box {display: flex;height: 140px;position: relative;
        .row-steps {
          width:25%;
          .step-item {display: flex;justify-content: space-between;
            .step-line {height: 3px;margin-top: 3px;background-color: #1890ff;width:100%;}
            .item-circle {background-color: #bfbfbf;width: 9px;height: 9px;border-radius: 50%;margin: 0px 3px;background-color: #1890ff;}
          }
          .content-item {margin-top: 15px;font-size: 12px;color: #8c8c8c;
            .content-title {color: #595959;font-size: 14px;margin-bottom: 12px;}
            .content-name {margin-bottom: 12px;}
            .content-time {margin-bottom: 8px;}
            .content-btn {color: #038BFB;cursor: pointer;text-decoration: underline;}
          }
          .hidden-line {width: 0px !important;}
        }
        &:nth-child(2n) {
          flex-direction: row-reverse;
        }
      }
      
      .left-semicircle {
        position: absolute;
        left: -60px;
        top: 3px;
        width: 60px;
        height: 143px;
        border: 3px solid #1890ff;
        border-radius: 100% 0 0 100%/50%;
        border-right: none;
      }
      .right-semicircle {
        position: absolute;
        right: -60px;
        top: 3px;
        width: 60px;
        height: 143px;
        border: 3px solid #1890ff;
        border-radius: 0 100% 100% 0/50%;
        border-left: none;
      }
    }
    .detail-content {
      display: flex;
      .content-left {
        width: calc(100% - 480px);
        font-size: 14px;
        min-width: 495px;
        .left-title {
          color: #666;
          font-weight: 400;
          > div {
            width: 3px;
            height: 3px;
            background: #8E8E8E;
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
          }
          span {
            color: #333;
          }
        }
        .left-content {
          padding-left: 17px;
          line-height: 30px;
          margin-bottom: 20px;
          width: 90%;
          .item-files {
            display: flex;
            color: #038BFB;
            cursor: pointer;
            text-decoration: underline;
            >div {
              margin-right: 12px;
            }
          }
          .item-audio {
            margin-top: 10px;
          }
        }
        .left-line {
          margin-bottom: 20px;
        }
      }
    }
    .dialog-content {
      display: flex;
      justify-content: space-around;
      width: 1000px;
      height: 600px;
      .left-btn {
        width: 40px;
        height: 40px;
        margin-top: 265px;
        cursor: pointer;
      }
      .right-btn {
        width: 40px;
        height: 40px;
        margin-top: 265px;
        cursor: pointer;
      }
      .content-img-video {
        width: calc(100% - 100px);
        img {
          width: 100%;
          height: 100%;
        }
        video {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
