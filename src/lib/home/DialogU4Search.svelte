<script>

const tabList = [
  { name:'搜监控',  value: 1 },
  { name:'找水质',  value: 2 },
  { name:'找水位',  value: 3 }
]
const list = [
  { name:'无人机视频',  status: true },
  { name:'无人机视频',  status: true },
  { name:'无人机视频',  status: false },
  { name:'无人机视频',  status: true },
  { name:'无人机视频',  status: true },
  { name:'无人机视频',  status: true }
]
</script>

<div class="home-dialog">
  <div class="home-dialog-search">
    <div class="home-dialog-tab-list">
      {#each tabList as item}
        <div class="home-dialog-tab">{item.name}</div>
      {/each}
    </div>
    <div class="home-dialog-search_bg"></div>
  </div>
  <div class="home-dialog-result">
    <img src="/assets/home/result_list.png" alt="">
    <div class="list">
      <div class="header">
        <div class="header-item_1">序号</div>
        <div class="header-item_2">设备内容</div>
        <div class="header-item_3">网络状态</div>
      </div>
      <div class="content-container">
        <div class="content">
          {#each list as item, index}
          <div class="content-item">
            <div class="content-item_index"><span>{index + 1}</span></div>
            <div class="content-item_name">{item.name}</div>
            <div class="content-item_status">{item.status ? '网络正常' : '网络断开'}</div>
            <img class="content-item_bg" src="/assets/home/result_list_item_bg.png" alt="">
          </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
.home-dialog{
  width: 431px;
  max-height: calc(100vh - 170px);
  margin-top: 61px;
  background: rgba(7, 20, 41, 0.88);
  box-shadow: 0 0 16px #2373E8 inset;
  &-search {
    width: 100%;
    position: relative;
    &_bg {
      position: absolute;
      // z-index: -1;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 43px;
      background: url(/assets/home/home_dialog.png) no-repeat;
      background-position: 0 -1036px;
    }
  }
  &-tab-list {
    width: 100%;
    display: flex;
    position: relative;
    z-index: 2;
    flex-wrap: wrap;
    padding: 27px 0 0 42px;
    box-sizing: border-box;
  }
  &-tab {
    height: 28px;
    background: rgba(7, 38, 91, 0.18);
    border: 1px solid #01306A;
    border-radius: 14px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    line-height: 28px;
    margin-right: 15px;
    margin-bottom: 13px;
    // cursor: pointer;
  }
  &-result {
    margin-top: 10px;
    .header {
      width: 100%;
      height: 38px;
      background: url(/assets/home/home_dialog.png) no-repeat;
      background-position:0 -1119px;
      color: #3C83BE;
      font-size: 14px;
      display: flex;
      align-items: center;
      &-item {
        &_1{ width: 20%; text-align: center;}
        &_2{ width: 40%; }
        &_3{ width: 40%; }
      }
    }
    .content-container {
      height: calc(100vh - 322px);
      overflow-y: auto;
      overflow-x: hidden;
    }
    .content {
      width: 100%;
      &-item {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #96CEFD;
        position: relative;
        &_index {
          width: 20%;
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            display: inline-block;
            width: 36px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            background: url(/assets/home/index_icon.png) no-repeat;
          }
        }
        &_name { width: 40%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; word-break: break-all; color: #fff; }
        &_status { width: 40%; }
        &_bg {
          position: absolute;
          width: 100%;
          height: 20px;
          left: 0;
          bottom: -10px;
        }
      }
    }
  }
}
</style>
