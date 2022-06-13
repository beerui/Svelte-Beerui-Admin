<script>
import { createEventDispatcher } from "svelte";
import { page } from "$app/stores";
const dispatch = createEventDispatcher()

export let key // 标识
export let label // 标题
export let run // 是否运行中
</script>
<a class="icon_toolbar m-menu-list block" href={key} on:click={dispatch('clickHandle', key)} class:run={run} class:active={key === $page.url.pathname}>{label}</a>
<style lang="scss">
  .m-menu {
    width: 220px;
    &-list {
      width: 100%;height: 41px;margin-bottom: 10px;background-position: 0 -521px;cursor: pointer;
      color: #a5d6ff;line-height: 41px;padding-left: 16px;font-size: 14px;
      &:hover {background-position: 0 -600px;}
    }
    &-list.active {background-position: 0 -600px;color: #ffc706;}
    &-list.run {
      position: relative;
      &::after {
        content: '';display: block;width: 12px;height: 12px;position: absolute;right: 15px;top: 15px;
        background: #2de506;border-radius: 50%;box-shadow: 0 0 6px 2px #2de506;
      }
    }
  }
</style>
