<script>
    import { createEventDispatcher } from "svelte";

    export let item
    export let planId
    const dispatch = createEventDispatcher()
    function dispatchHandle(type) {
        dispatch('clickPlan', type)
    }
</script>
<div class="card-list">
    <div class="icon_toolbar card-list-icon-{item.key}"></div>
    {#if item.key === 'u1'}
        <div class="card-list-main">
            <div class="card-list-title">
                <div class="title" on:click|stopPropagation={() => dispatchHandle(item.type)}>{item.title}</div>
                <div class="timer">调度次数：{item.count}</div>
            </div>
            <div class="card-list-desc">
                {item.desc}
            </div>
            <div class="card-list-name">负责人：{item.name} {item.tel}</div>
        </div>
    {:else if item.key === 'u2'}
        <div class="card-list-main u2" class:warning={item.warningDesc}>
            <div class="card-list-title">
                <div class="title">{item.title}</div>
            </div>
            <div class="card-list-desc">
                {item.size} {item.statusDesc}
            </div>
            {#if item.warningDesc}
            <div class="card-tip">{item.warningDesc}</div>
            {/if}
        </div>
        <div class="card-list-dot__{item.status}"></div>
    {:else if item.key === 'u3'}
        <div class="card-list-main u2" class:warning={item.warningDesc}>
            <div class="card-list-title">
                <div class="title">{item.title}</div>
            </div>
            <div class="card-list-desc">
                闸宽：{item.w} 闸顶高程：{item.h}
            </div>
            {#if item.warningDesc}
                <div class="card-tip">{item.warningDesc}</div>
            {/if}
        </div>
        <div class="card-list-dot__{item.status}"></div>
    {/if}
</div>
<div class="card-list-after" class:active={item.type === planId}></div>
<style lang="scss">
  .card-list {
    display: flex;margin-top: 10px;
    &-after {
      border-top: 1px solid #023161;box-shadow: 0px -3px 11px 3px rgb(2 49 97 / 61%);margin-top: 16px;
      &.active {box-shadow: 0px -52px 18px 46px rgb(28 110 169 / 49%);}
    }
    &-icon-u1 {width: 70px;height: 100px;background-position: -16px -1160px;}
    &-icon-u2 {width: 70px;height: 50px;background-position: -16px -1284px;}
    &-icon-u3 {width: 70px;height: 50px;background-position: 0 -1380px;}
    .card-tip {
      display: none;position: absolute;left: 0;top: -55px;border: 1px solid rgb(255 41 41 / 60%);width: 280px;min-height: 35px;
      background: rgba(2, 15, 47, .8);box-shadow: inset 0 0 6px 0 rgba(255, 41, 41, .54);padding: 5px 10px;z-index: 999;font-size: 14px;border-radius: 3px;
      &:after {
        content: '';background: url("/assets/live_water/icon_warning.png") 0 0 no-repeat;display: block;
        width: 13px;height: 11px;bottom: -9px;right: 20px;position: absolute;
      }
    }
    &-main {
      width: 290px;height: 100px;position: relative;
      &.warning {
        &:hover {
          .card-tip {display: block;}
        }
      }
    }
    .u2 {width: 255px;height: 60px;}
    .u3 {width: 255px;height: 60px;}
    &-title {
      display: flex;justify-content: space-between;align-items: center;cursor: pointer;
      .title {flex: 1;color: #ffffff;width: 195px;}
      .timer {font-size: 12px;color: #1fffff;width: 95px;text-align: right;}
    }
    &-desc {font-size: 12px;color: rgb(255 255 255 / 62%);margin-top: 10px;}
    &-name {
      font-size: 12px;color: #ffffff;display: flex;margin-top: 10px;
      &:before {
        content: '';
        display: block;
        padding-left: 20px;
        width: 14px;
        height: 14px;
        background: url("/assets/live_water/icon_man.png") 0 0 no-repeat;
      }
    }
    &-dot__normal {margin-top: 10px;width: 12px;height: 12px;background: #2de506;border-radius: 50%;box-shadow: 0 0 6px 2px #2de506;}
    &-dot__disabled {margin-top: 10px;width: 12px;height: 12px;background: #2de506;border-radius: 50%;box-shadow: 0 0 6px 2px #2de506;opacity: .4;}
    &-dot__stop {margin-top: 10px;width: 12px;height: 12px;background: #ff2929;border-radius: 50%;box-shadow: 0 0 6px 2px #ff2929;}
  }
</style>
