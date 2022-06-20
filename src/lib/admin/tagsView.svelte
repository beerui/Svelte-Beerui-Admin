<script>
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { BeIcon } from '@brewer/beerui';
  import { TAGS_VIEW, ROUTER_MAP, MENU, PERMISSION_ROUTER, COLLAPSE } from '$lib/stores'
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  let tagsList = []
  let curPath = $page.url.pathname
  let _containerWidth = 0
  let _scrollWrapper = null
  let tagAndTagSpacing = 4
  TAGS_VIEW.subscribe(tags => {
    tagsList = tags
  })
  const initTags = () => {
    Object.keys(ROUTER_MAP).forEach(key => {
      const data = ROUTER_MAP[key]
      if(data.meta && data.meta.affix) {
        const { id, title, path, hidden, parentId } = data
        tagsList.push({
          title: title,
          hidden: hidden,
          parentId: parentId,
          id: id,
          path: path,
          showClose: false
        })
      }
    })
    TAGS_VIEW.set(tagsList)
  }
  // Add current page info
  const setPathToTaglist = () => {
    if(isHasPath(curPath)) return
    const result = getPageInfoByPath(curPath)
    if(!result) return
    const { id, title, path, hidden, parentId } = result
    tagsList.push({
      title: title,
      hidden: hidden,
      parentId: parentId,
      id: id,
      path: path,
      showClose: true
    })
    TAGS_VIEW.set(tagsList)
  }
  // Get page info by path
  const getPageInfoByPath = (path) => {
    const list = Object.keys(ROUTER_MAP)
    if(list.length === 0) return
    const key = list.find(item => ROUTER_MAP[item].path === path)
    return ROUTER_MAP[key]
  }
  // Check path exist
  const isHasPath = (path) => {
    return tagsList.some(item => item.path === path)
  }
  // Move tag into view
  const moveToCurrentTag = async () => {
    await tick()
    const tagNodeList = document.querySelectorAll(".tags-view-item")
    if(tagNodeList.length === 0) return
    let firstTagNode = tagNodeList[0]
    let lastTagNode = tagNodeList[tagNodeList.length - 1]
    let currentIndex = -1
    let currentTagNode = null
    tagNodeList.forEach((item, index) => {
      if(item.dataset.path === curPath) {
        currentIndex = index
        currentTagNode = item
      }
    })
    if(firstTagNode === currentTagNode) {
      _scrollWrapper.scrollLeft  = 0
    } else if (lastTagNode === currentTagNode) {
      _scrollWrapper.scrollLeft  = _scrollWrapper.scrollWidth - _containerWidth
    } else {
      const prevTagNode = tagNodeList[currentIndex - 1]
      const nextTagNode = tagNodeList[currentIndex + 1]
      // the tag's offsetLeft after of nextTag
      const afterNextTagOffsetLeft = nextTagNode.offsetLeft + nextTagNode.offsetWidth + tagAndTagSpacing
      // the tag's offsetLeft before of prevTag
      const beforePrevTagOffsetLeft = prevTagNode.offsetLeft - tagAndTagSpacing
      if (afterNextTagOffsetLeft > _scrollWrapper.scrollLeft + _containerWidth) {
        _scrollWrapper.scrollLeft = afterNextTagOffsetLeft - _containerWidth
      } else if (beforePrevTagOffsetLeft < _scrollWrapper.scrollLeft) {
        _scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
      }
    }
  }
  // After the reload, afterNavigate cannot obtain ROUTER_MAP. As a result, the updated page cannot be added to tagslist 
  PERMISSION_ROUTER.subscribe(() => {
    initTags()
    setPathToTaglist()
  })
  // Insert tags in navigation changes
  afterNavigate((page) => {
    const path = page.to.pathname
    curPath = path
    setPathToTaglist()
    moveToCurrentTag()
  })
  const goSelectedTag = (item) => {
    moveToCurrentTag()
    goto(item.path)
    let activeId = item.id
    // the current page hidden, select parent id to highlight sidebar。 For example: add
    if(item.hidden) activeId = findActiveId(item.parentId)
    MENU.set({ active: activeId, type: 'update' })
  }
  const findActiveId = (parentId) => {
    let activeId = null
    for(const i in ROUTER_MAP) {
      const data = ROUTER_MAP[i]
      if(data.id === parentId && !data.hidden) {
        activeId = data.id
      }
      // If the parent is hidden, find again
      if(data.id === parentId && data.hidden) {
        findActiveId(data.parentId)
      }
    }
    return activeId
  }
  const closeSelectedTag = (item) => {
    tagsList = tagsList.filter(tag => tag.path !== item.path )
    TAGS_VIEW.set(tagsList)
    if(curPath === item.path) toLastTagView()
  }
  const toLastTagView = () => {
    let lastTag = tagsList[tagsList.length - 1]
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if(!lastTag) lastTag = {path: '/', id: '1'}
    goSelectedTag(lastTag)
  } 
  const handleScroll = (e) => {
    // e.deltaY / 10 (scroll distance)
    _scrollWrapper.scrollLeft = _scrollWrapper.scrollLeft + (e.deltaY / 10)
  }
</script>

<div class="tags-view-container" bind:offsetWidth={_containerWidth}> 
  <div class="tags-view-wrapper" class:collapse-close={$COLLAPSE.collapse} bind:this={_scrollWrapper} on:mousewheel={handleScroll}>
    {#each tagsList as item, index}
    <div class="tags-view-item {item.path === curPath ? 'active':''}" data-path = {item.path} on:click={() => goSelectedTag(item)}> 
      <span>{item.title}</span> 
      {#if item.showClose}
      <span class="icon-close" on:click|stopPropagation={() => closeSelectedTag(item)}>
        <BeIcon name='close' width="12" height="12" style="margin-top:2px"/>
      </span>
      {/if}
    </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .tags-view-container {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%);
    width: calc(100vw - 240px);
    .tags-view-wrapper {
      height: 40px;
      overflow-x: auto;
      white-space: nowrap;
      // width: calc(100vw - 240px);
    }
    &.collapse-close {
      width: calc(100vw - 64px);
    }
  }
  .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 6px;
    .icon-close {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
    &.active {
      background-color: #42b983;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: "";
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
  }
  .tags-view-item:first-of-type {
    margin-left: 15px;
  }
  .tags-view-item:last-of-type {
    margin-right: 15px;
  }
</style>