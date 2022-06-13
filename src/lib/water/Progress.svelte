<script>
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher()

export let status = 'waiting' // 状态 等待(waiting) 运行中(running) 已完成(done)
export let title // 标题
export let percent = 10 // 进度

let _statusTexts = {
    waiting: '等待',
    running: '运行中...',
    done: '已完成'
}
// 状态提示文字
export let statusTexts = {}
Object.assign(_statusTexts, statusTexts)
$: {
    if (status === 'done' || percent === 100) {
        status = 'done'
        percent = 100
    }
}
</script>
<div class="m-progress">
    {#if title}
    <div class="m-progress-label">{title}</div>
    {/if}
    <div class="m-progress-warp">
        <div class="m-progress-container" style="width: {percent}%"></div>
    </div>
    {#if status}
        <div class="m-progress-status">{_statusTexts[status]}</div>
    {/if}
</div>

<style lang="scss">
  .m-progress {
    width: 100%;height: 100%;padding: 8px 5px;border: 2px solid #1b6cc5;border-radius: 999px;box-shadow: inset 0 0 20px 8px #085ea9;display: flex;justify-content: space-between;align-items: center;
    &-label {color: #FFFFFF;min-width: 140px;overflow: hidden;padding: 0 5px;text-align: right;font-size: 12px;}
    &-status {color: #0AE493;width: 150px;overflow: hidden;padding: 0 5px;font-size: 12px;}
    &-warp {width: 100%;height: 100%;overflow: hidden;}
    &-container {
      width: 10%;height: 100%;border-radius: 999px;background-color: #1ac39b;background-position: 0 0;flex: 1;
      background-image: url("data:image/svg+xml,%3Csvg width='80' height='40' viewBox='0 0 80 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300b376' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='m1,85l85,-92l-42.5,0l-42.5,46m85,46l0,-46l-42.5,46'/%3E%3C/g%3E%3C/svg%3E");
      animation: animateBackground infinite 2s linear;
    }
  }
  @keyframes animateBackground {
    0% {background-position: 0 0;}
    100% {background-position: 80px 0;}
  }
</style>
