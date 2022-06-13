<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  let dateType = 0

  function handleDateChange(_dateType) {
    if (_dateType === dateType) return
    dateType = _dateType
    dispatch('dateChange', _dateType)
  }
</script>
<div class="flex justify-end">
  <div class="date-btn flex items-center justify-center cursor-pointer { dateType === 0 ? 'active' : '' }" on:click={e => handleDateChange(0)}>24小时</div>
  <div class="date-btn flex items-center justify-center cursor-pointer { dateType === 1 ? 'active' : '' }" on:click={e => handleDateChange(1)}>最近7天</div>
</div>
<style lang="scss">
  .date-btn {
    min-width: 69px;
    height: 26px;
    border-radius: 13px;
    margin-right: 8px;
    background: rgba(25, 76, 159, 0.29);
    border: 1px solid rgba(4, 84, 187, 0.9);
    opacity: 0.46;
    color: #fff;
    font-size: 14px;
  }
  .active {
    opacity: 1;
  }
</style>