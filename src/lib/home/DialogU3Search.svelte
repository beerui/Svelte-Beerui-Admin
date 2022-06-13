<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { BePagination } from '@brewer/beerui'
  import { getIssueDataByHomeSearch } from '$api/home'

  let dispatch = createEventDispatcher()

  export let areaId

  const searchForm = {
    pageNum: 1,
    pageSize: 5,
    searchType: 1,
    waterKeyWord: ''
  }
  const tabList = [
    { name:'搜重大问题',  value: 1 },
    { name:'无人机发现',  value: 2 },
    { name:'高位监控发现',  value: 3 }
  ]
  let status = 1 // 列表中的状态(数据获取之后再改变)
  const stateStatus = {
    '待处理': 1,
    '处理中': 2,
    '已处理': 3
  }
  let total = 0
  let list = []
  let pageOptions = {
    card: true,
    scroll: true,
    showNumber: 5,
    icon: {} // 上一页 下一页的大小和颜色
  }
  let activeIssueId = ''

  export const handleInput = (evt) => {
    searchForm.waterKeyWord = evt.detail
  }

  export const handleSearch = () => {
    getIssueData()
  }

  const getIssueData = () => {
    const data = {
      areaId,
      ...searchForm
    }
    getIssueDataByHomeSearch(data).then(res => {
      list = res.list
      total = res.total
      status = searchForm.searchType
    })
  }

  const handleTabChange = (value) => {
    searchForm.searchType = value
    searchForm.pageNum = 1
    handleSearch()
  }

  const changePage = (evt) => {
    searchForm.pageNum = evt.detail
    getIssueData()
  }

  const handleItemClick = (item) => {
    if (activeIssueId === item.issueId) {
      activeIssueId = ''
    } else {
      activeIssueId = item.issueId
    }
    dispatch('itemClick', {
      item,
      activeIssueId
    })
  }

  onMount(() => {
    getIssueData()
  })
</script>

<div class="home-dialog">
  <div class="home-dialog-search">
    <div class="home-dialog-tab-list">
      {#each tabList as item}
        <div class="home-dialog-tab cursor-pointer" class:active={searchForm.searchType === item.value} on:click={() => handleTabChange(item.value)}>{item.name}</div>
      {/each}
    </div>
    <div class="home-dialog-search_bg"></div>
  </div>
  <div class="home-dialog-result">
    <img src="/assets/home/result_list.png" alt="">
    <div class="list">
      <div class="header">
        <div class="header-item_1">序号</div>
        <div class="header-item_2">事件</div>
      </div>
      <div class="content-container">
        <div class="content">
          {#each list as item, index}
          <div class="content-item cursor-pointer" class:activeItem={item.issueId === activeIssueId} on:click={() => handleItemClick(item)}>
            <img class="content-item_bg" src="/assets/home/result_list_item_bg.png" alt="">
            <div class="content-item_index"><span>{index + 1 + (searchForm.pageNum - 1) * searchForm.pageSize}</span></div>
            <img class="content-item_img" src="{item.imageUrl ? item.imageUrl.split(',')[0]: ''}" alt="">
            <div class="content-item_main">
              <p>[{item.theme}]{item.themeStr}</p>
              <img src="/assets/home/process_icon_{stateStatus[item.stateStr]}.png" alt="">
              <div class="time">
                <img src="/assets/home/time_icon.png" alt="">
                <span>{item.createTime}</span>
              </div>
              <div class="address">
                <img src="/assets/home/address_icon.png" alt="">
                <span>{item.issueAddress}</span>
              </div>
            </div>
          </div>
          {/each}
          {#if list.length === 0}
          <div class="no-data">暂无数据</div>
          {/if}
          <div class="g-home-pagination">
            <BePagination
              card
              currentPage={searchForm.pageNum}
              pageSize={searchForm.pageSize}
              {total}
              async
              layouts="pager, info"
              on:changePage={changePage}
              options={pageOptions}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
.home-dialog{
  width: 431px;
  max-height: calc(100vh - 170px);
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
    padding: 27px 0 0 10px;
    box-sizing: border-box;
  }
  &-tab {
    height: 28px;
    background: rgba(7, 38, 91, 0.18);
    border: 1px solid #01306A;
    box-shadow: 0 0 10px rgba(0, 105, 206, .32);
    border-radius: 14px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    line-height: 28px;
    margin-left: 15px;
    margin-bottom: 13px;
    // cursor: pointer;
  }
  .active {
    box-shadow: 0 0 10px rgba(2, 139, 244, .70) inset;
  }
  &-result {
    margin-top: 10px;
    .list {padding-bottom: 10px;}
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
        &_2{ width: 80%; text-align: center;}
      }
    }
    .content-container {
      height: calc(100vh - 327px);
      overflow-y: auto;
      overflow-x: hidden;
      .no-data {margin: 10px 0 0;text-align: center;font-size: 14px;color: #96CEFD;}
    }
    .content {
      width: 100%;
      &-item {
        width: 100%;
        height: 120px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #96CEFD;
        position: relative;
        &:hover {
          background: rgba(22, 120, 255, .18);
        }
        &_index {
          width: 20%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          span{
            display: inline-block;
            width: 36px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            background: url(/assets/home/index_icon.png) no-repeat;
          }
        }
        &_img {
          width: 120px;
          height: 90px;
          flex-shrink: 0;
          border-radius: 4px;
          clip-path: inset(0 round 4px);
          border: 2px solid;
          border-image: linear-gradient(0deg, #277DFF, #00AEFF) 10 10;
        }
        &_main {
          margin-left: 20px;
          font-size: 16px;
          color: #fff;
          .time {
            color: #BABABA;
            font-size: 12px;
            display: flex;
            align-items: center;
            img {
              margin-right: 7px;
            }
          }
          .address {
            color: #BABABA;
            font-size: 12px;
            display: flex;
            align-items: center;
            span {
              margin-left: 7px;
              display: inline-block;
              width: 170px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              word-break: break-all;
            }
          }
        }
        &_bg {
          position: absolute;
          width: 100%;
          height: 20px;
          left: 0;
          bottom: -10px;
        }
      }
      .activeItem {
        background: rgba(22, 120, 255, .18);
      }
      .g-home-pagination {
        padding: 20px 24px;
      }
    }
    .pagination {
      display: flex;
      margin-top: 20px;
      align-items: center;
      padding: 0 24px;
      justify-content: space-between;
      color: #B2D9FB;
      font-size: 14px;
    }
  }
}
</style>
