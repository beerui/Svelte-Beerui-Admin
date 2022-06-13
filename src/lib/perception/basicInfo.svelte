<script>

</script>
<div class="flex g-info-content">
  <div class="m-preview"></div>
  <div class="m-info">
    <div class="item flex">
      <span class="label">建设时间：</span>
      <span class="value">2020-10-03</span>
    </div>
    <div class="item flex">
      <span class="label">运维单位：</span>
      <span class="value">浙江某某某某某单位</span>
    </div>
    <div class="item flex">
      <span class="label">负责人：</span>
      <span class="value">2020-10-03</span>
      <span class="value">13952641222</span>
    </div>
    <div class="item flex">
      <span class="label">设备主要功能：</span>
      <span class="value flex-1">功能介绍，文字功能，介绍文字</span>
    </div>
  </div>
</div>
<div class="g-operational-record-container relative">
  <span class="title">运维记录</span>
  <div class="g-record-list">
    <div class="m-item flex items-center">
      <div class="time">2021-03-06</div>
      <div class="remark">断电断电维保断电</div>
      <div class="company">浙江某某某某某公司 | 王某某</div>
    </div>
    <div class="m-item flex items-center">
      <div class="time">2021-03-06</div>
      <div class="remark">断电断电维保断电</div>
      <div class="company">浙江某某某某某公司 | 王某某</div>
    </div>
    <div class="m-item flex items-center">
      <div class="time">2021-03-06</div>
      <div class="remark">断电断电维保断电</div>
      <div class="company">浙江某某某某某公司 | 王某某</div>
    </div>
    <div class="m-item flex items-center">
      <div class="time">2021-03-06</div>
      <div class="remark">断电断电维保断电</div>
      <div class="company">浙江某某某某某公司 | 王某某</div>
    </div>
  </div>
</div>
<style lang="scss">
  .g-info-content {
    margin: 19px 0;
    .m-preview {width: 166px;height: 125px;border: 2px solid #1BD7FF;margin-right: 28px;flex-shrink: 0;}
    .m-info {
      .item {
        font-size: 14px;margin: 12px 0 7px;
        &::before {display: block;content: "";width: 16px;height: 16px;margin-right: 6px;background: url('/assets/home/perception/point_icon.png') 100% 100% / 100% 100% no-repeat;}
        .label {color: #B1D5F9;}
        .value {display: inline-block;max-width: 218px;color: #fff;margin-right: 10px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
        .flex-1 {flex: 1}
      }
    }
  }
  .g-operational-record-container {
    height: 135px;padding-top: 3px;background: url('/assets/home/perception/bt_3.png') 100% 100% / 100% 100% no-repeat;
    .title {margin-left: 31px;font-size: 16px;color: #fff;}
    .g-record-list {
      height: 96px;overflow: auto;
      .m-item {
        height: 32px;padding: 0 21px 0;color: #B1D5F9;font-size: 14px;&:nth-child(2n) {background: rgba(2, 65, 130, 0.32);}
        .time {width: 105px;}
        .remark {width: 207px;padding-right: 5px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #fff;}
        .company {flex: 1;}
      }
    }
  }
</style>