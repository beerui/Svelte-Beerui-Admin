<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher()

export let searchInputValue = ''
export let tabActive = 'u2'
export let showChangeButton = false
export let areaId

let areaName = '越城区'

$: {
  dispatch('input', searchInputValue)
}

function sendValue() {
  dispatch('change', searchInputValue)
}

  let focusHandle = (bool) => {
    if (showChangeButton || bool) {
      dispatch('openSearch', bool)
    }
  }
</script>

<div class="dialog-search">
  <div class="dialog-search-header">
    <div class="dialog-search-select">
      <!-- <BeCascader
        bind:value={areaId}
        lazy={true}
        config={{value: 'areaId', label: 'areaName', children: "children"}}
        bind:options={options} 
        lazyLoad={lazyLoad}
      /> -->
      <div class="w-full flex items-center">
        <span>{areaName}</span>
        <span class="triangle"></span>
      </div>
    </div>
    <div class="dialog-search-input" class:wide={showChangeButton}>
      <input
        type="text"
        bind:value={searchInputValue}
        placeholder={tabActive === 'u2' ? '请输入河道名称或河长姓名' : '请输入水域数据关键词' }
        on:focusin={() => focusHandle(false)}
        on:keyup={(e) => { if( e.key === 'Enter') sendValue() }}
      >
      <span class="line"></span>
      <img class="cursor-pointer" src="/assets/home/search_icon.png" on:click={sendValue} alt="search">
    </div>
    {#if !showChangeButton}
    <img class="cursor-pointer ml-12" src="/assets/home/dialog_search_statistics.png" on:click={() => focusHandle(true)} alt="statistics">
    {/if}
  </div>
</div>

<style lang="scss">
.dialog-search {
  width: 454px;
  height: 82px;
  background: url('/assets/home/dialog_search_bg.png') no-repeat;
  &-header {
    width: 100%;
    height: 44px;
    display: flex;
    // justify-content: center;
    align-items: center;
    margin-left: 48px;
    .ml-12 {
      margin-left: 12px;
    }
  }
  &-select {
    width: 100px;
    height: 100%;
    color: #fff;
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  &-input {
    width: 221px;
    height: 32px;
    padding: 3px 6px;
    background: rgba(11, 34, 93, 0.24);
    box-shadow: 0 0 2px #2373E8;
    border: 1px solid rgba(35, 115, 232, 0.69);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: width .2s ease;
    img {
      width: 24px;
      height: 24px;
    }
    .line {
      width: 1px;
      height: 24px;
      background-color: #1a55ab;
    }
    input {
      height: 18px;
      padding-left: 3px;
      background: transparent;
      color: #fff;
      font-size: 14px;
      animation: width .2s ease;
      &:focus {
        outline: none;
      }
    }
    input::-webkit-input-placeholder{
        color:#3E85C0;
        font-size: 14px;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color:#3E85C0;
        font-size: 14px;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#3E85C0;
        font-size: 14px;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
      color:#3E85C0;
      font-size: 14px;
    }
  }
  .wide {
    width: 302px;
    input {
      width: 254px;
    }
  }
}
.triangle {
  display: inline-block;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 0px solid transparent;
  border-top: 6px solid #1b9eda;
  margin-left: 12px;
}
</style>
