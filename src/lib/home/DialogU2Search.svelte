<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { BePagination } from '@brewer/beerui'
  import { findRiverList, getRiverOutfall } from '$api/home'

  export let areaId

  let dispatch = createEventDispatcher()

  let active = 1
  let activeWaterId = ''
  let total = 0
  let searchForm = {
    waterName: '',
    pageNum: 1,
    pageSize: 10
  }
  let pageOptions = {
    card: true,
    scroll: true,
    showNumber: 5,
    icon: {} // 上一页 下一页的大小和颜色
  }
  const tabList = [
    { name:'搜河道',  value: 1 },
    { name:'排水口',  value: 2 }
  ]
  let list = []

  const handleTabChange = (value) => {
    active = value
    handleSearch()
    dispatch('tabChange', active)
  }

  export const handleInput = (evt) => {
    searchForm.waterName = evt.detail
  }

  export const handleSearch = () => {
    resetSearchForm()
    if (active === 1) {
      getRiverList()
    } else {
      getRiverOutfallList()
    }
  }

  export const resetSearchForm = () => {
    list = []
    total = 0
    searchForm.pageNum = 1
    searchForm.pageSize = 10
  }

  // 河道列表
  const getRiverList = () => {
    const data = {
      areaId,
      ...searchForm
    }
    findRiverList(data).then(res => {
      list = res.list || []
      total = res.total || 0
    })
  }
  
  // 排水口列表
  const getRiverOutfallList = () => {
    const data = {
      areaId,
      ...searchForm
    }
    getRiverOutfall(data).then(res => {
      list = res.list || []
      total = res.total || 0
    })
  }

  const changePage = (evt) => {
    searchForm.pageNum = evt.detail
    if (active === 1) {
      getRiverList()
    } else {
      getRiverOutfallList()
    }
  }

  const handleItemClick = (item) => {
    if (active === 2) return
    activeWaterId = item.waterId
    dispatch('itemClick', item)
  }

  onMount(() => {
    getRiverList()
  })
</script>

<div class="home-dialog">
  <div class="home-dialog-search">
    <div class="home-dialog-tab-list">
      {#each tabList as item}
        <div class="home-dialog-tab cursor-pointer" class:active={active === item.value} on:click={() => handleTabChange(item.value)}>{item.name}</div>
      {/each}
    </div>
    <div class="home-dialog-search_bg"></div>
  </div>
  <div class="home-dialog-result">
    <img src="/assets/home/result_list.png" alt="">
    <div class="list">
      <div class="header">
        <div class="header-item_1">序号</div>
        <div class="header-item_2">名称</div>
        <div class="header-item_3">区划</div>
        <div class="header-item_4">{active === 1 ? '河湖长' : '排水口'}</div>
      </div>
      <div class="content-container">
        <div class="content">
          {#each list as item, index}
          <div class="content-item" class:activeItem={active === 1 && item.waterId === activeWaterId} class:cursor={active === 1} on:click={() => handleItemClick(item)}>
            <div class="content-item_index"><span>{index + 1 + (searchForm.pageNum - 1) * searchForm.pageSize}</span></div>
            <div class="content-item_name">{item.waterName || '--'}</div>
            <div class="content-item_division">{item.areaName || '--'}</div>
            <div class="content-item_contact">{active === 1 ? item.waterCaptainName || '--' : item.outfallCount || '--'}</div>
            <img class="content-item_bg" src="/assets/home/result_list_item_bg.png" alt="">
          </div>
          {/each}
          {#if list.length === 0}
          <div class="no-data">暂无数据</div>
          {/if}
        </div>
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

<style lang="scss">
.cursor {
  cursor: pointer;
}
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
    padding: 27px 0 0 42px;
    box-sizing: border-box;
  }
  &-tab {
    height: 30px;
    background: rgba(7, 38, 91, 0.18);
    border: 1px solid #01306A;
    box-shadow: 0 0 10px rgba(0, 105, 206, .32);
    border-radius: 14px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    line-height: 30px;
    margin-right: 15px;
    margin-bottom: 13px;
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
        &_1{ width: 25%; text-align: center;}
        &_2{ width: 25%; text-align: center;}
        &_3{ width: 25%; text-align: center;}
        &_4{ width: 25%; text-align: center;}
      }
    }
    .content-container {
      height: calc(100vh - 373px);
      overflow-y: auto;
      overflow-x: hidden;
      .no-data {margin: 10px 0 0;text-align: center;font-size: 14px;color: #96CEFD;}
      .g-home-pagination {
        padding: 20px 24px 0;
      }
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
        &:hover {
          background: rgba(22, 120, 255, .18);
        }
        &_index {
          width: 25%;
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
        &_name { width: 25%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; word-break: break-all; color: #fff; text-align: center;}
        &_division { width: 25%; text-align: center;}
        &_contact { width: 25%; text-align: center;}
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
    }
  }
}
</style>
