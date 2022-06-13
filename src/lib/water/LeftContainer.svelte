<script>
    import { IsShowWaterNavBar } from "$lib/stores.js";

    export let visible = false
    export let title = '' // 标题
    $: IsShowWaterNavBar.set({ key: 'left_nav', value: visible })
</script>
<div class="m-card" class:visible>
    <div class="m-card__btn" class:visible on:click={() => visible = !visible}></div>
    <div class="m-card__header">
        <div class="title">{title}</div>
    </div>
    <div class="m-card-container">
        <slot></slot>
    </div>
    <div class="m-card__footer"></div>
</div>

<style lang="scss">
.m-card {
    position: fixed;z-index: 10;left: 10px;top: 90px;transition: .3s;
    &__header {
      width: 246px;height: 48px;background: url("/assets/live_water/left_top.png") 0 0 no-repeat;
      .title {color: #fff;font-size: 16px;padding-left: 32px;padding-top: 5px;}
    }
    &-container {background: url("/assets/live_water/left_mid.png") 0 0 repeat-y;padding: 20px 10px;}
    &__footer {width: 246px;height: 14px;background: url("/assets/live_water/left_bottom.png") 0 0 repeat-y;}
    &__btn {
      position: absolute;width: 20px;height: 40px;right: -20px;top: 50%;margin-top: -20px;
      cursor: pointer;border: 1px solid #155bb0;transition: .3s;border-left: 0;
      background: #1296db;  /* fallback for old browsers */
      background: -webkit-linear-gradient(to right, #1296db00, #1296db52);
      background: linear-gradient(to right, #1296db00, #1296db52);
        &:after {content: '‹';color: #fff;font-size: 26px;line-height: 32px;padding-left: 5px;}
    }
    &__btn.visible {transform: rotateY(180deg);border-right: 0;border-left: 1px solid #155bb0;}
}
.m-card.visible {left: -246px;}
</style>
