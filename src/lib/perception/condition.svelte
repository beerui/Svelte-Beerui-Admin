<script>
  import {
    BeTable,
    BeTableColumn,
    BeSwitch
  } from '@brewer/beerui'
  import { placeholderRegexHandle } from "$utils/index.js";

  let tableData = [
    { equipment: '1号饮水泵', voltage: '409', electricity: '2.35', status: false, isFault: false },
    { equipment: '1号饮水泵', voltage: '409', electricity: '2.35', status: false, isFault: false },
    { equipment: '1号饮水泵', voltage: '409', electricity: '2.35', status: false, isFault: false },
    { equipment: '1号饮水泵', voltage: '409', electricity: '2.35', status: false, isFault: false },
    { equipment: '1号饮水泵', voltage: '409', electricity: '2.35', status: false, isFault: true }
  ]

  const tableRowClassName = () => {
    return 'pump-table-row'
  }
</script>
<div class="g-pump-container flex">
  <div class="left flex items-center justify-center">
    <img src="/assets/home/perception/pump_icon.png" alt="" class="icon">
    <p class="value flex">闸门数: <span>2</span></p>
  </div>
  <div class="right flex items-center justify-center">
    <img src="/assets/home/perception/sluice_gate_icon.png" alt="" class="icon">
    <p class="value flex">闸门数: <span>2</span></p>
  </div>
</div>
<div class="g-pump-container-table">
  <BeTable data={tableData} height="168px" rowClassName={tableRowClassName} placeholder="--" placeholderRegex={placeholderRegexHandle}>
    <BeTableColumn prop="equipment" label="设备" />
    <BeTableColumn prop="voltage" label="实时电压(V)" align="center" />
    <BeTableColumn prop="electricity" label="实时电流(A)" align="center" />
    <BeTableColumn name="tableSlot1" prop="tableSlot" label="运行状态" align="center" />
    <div slot="tableSlot1" let:prop={row}>
      <BeSwitch checked={row.status} />
    </div>
    <BeTableColumn name="tableSlot2" prop="tableSlot" label="是否故障" align="center" />
    <div slot="tableSlot2" let:prop={row} class="flex items-center justify-center">
      {#if row.isFault}
        <img src="/assets/home/perception/abnormal_icon.png" alt="" class="isFault">
      {:else}
        <img src="/assets/home/perception/normal_icon.png" alt="" class="isFault">
      {/if}
    </div>
  </BeTable>
</div>
<style lang="scss">
  .g-pump-container {
    padding: 16px 0 29px;background: url('/assets/home/perception/bg_1.png') center bottom 20px / 485px 16px no-repeat;
    .left,.right {
      width: 50%;
      .icon {width: 46px;height: 46px;margin-right: 17px;}
      .value {
        font-size: 16px;color: #ffffff;align-items: center;
        span {margin-left: 10px;font-size: 26px;font-weight: bold;}
      }
    }
    .left {
      position: relative;
      &::after {position: absolute;top: 7px;right: 0; display: block;content: "";height:29px;border-right: 1px dashed #1E77CC;}
    }
  }
  .g-pump-container-table {
    .isFault {width: 18px;height: 18px;}
    .pump-table-row {
      height: 38px;
      background: url('/assets/home/perception/bg_2.png') 100% 100% / 100% 100% no-repeat;margin-bottom: 4px;
    }
  }
</style>