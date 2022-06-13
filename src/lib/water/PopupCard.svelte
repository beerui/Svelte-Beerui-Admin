<script>
    export let tip = ''
    export let title = ''
    export let desc = ''
    export let status = '' // 状态
</script>
<div class="m-popup">
    <div class="title {status}">{title}</div>
    <div class="tip">{tip}</div>
    <div class="desc">{desc}</div>
</div>

<style lang="scss">
  .m-popup {
    padding: 10px;
    font-size: 14px;
    color: #FFFFFF;
    border: 1px solid #37e0ff;
    width: 240px;position: absolute;z-index: 20;
    background: #37e0ff;
    background: -webkit-linear-gradient(to top, rgba(55, 224, 255, 0.02), #0e84b1);
    background: linear-gradient(to top, rgba(55, 224, 255, 0.02), #0e84b1);
    .title {
      font-size: 16px;color: #fff;font-weight: bold;position: relative;
      &.normal:after {
        content: "";
        display: block;
        width: 12px;
        height: 12px;
        position: absolute;
        right: 10px;
        top: 10px;
        background: #2de506;
        border-radius: 50%;
        box-shadow: 0 0 6px 2px #2de506;
      }
    }
    .desc {font-size: 14px;color: #27dcff;}
    .tip {font-size: 12px;color: #c1c1c1;}
    &:after, &:before {
      background: url("/assets/live_water/popup_left.png") 0 0 no-repeat;content: '';display: block;
      width: 12px;height: 12px;position: absolute;left: 0;top: 0;
    }
    &:before {right: 0;left: auto;background: url("/assets/live_water/popup_right.png") 0 0 no-repeat;}
    &-header {}
  }
</style>
