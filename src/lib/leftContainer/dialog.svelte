<script>
  import { fade } from 'svelte/transition'

  export let visible = false

  function close() {
    visible = false
  }
</script>
{#if visible}
  <div class="dialog relative">
    <div class="dialog-mask" transition:fade="{{delay: 0, duration: 300}}" on:click={close} />
    <div class="dialog-container" transition:fade="{{delay: 0, duration: 300}}">
      <slot name="content" />
    </div>
  </div>
{/if}
<style lang="scss">
  .dialog {
    &-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #020B14;
      opacity: 0.6;
      z-index: 997;
    }
    &-container {
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 998;
      transform: translate(-50%, -50%);
    }
  }
</style>