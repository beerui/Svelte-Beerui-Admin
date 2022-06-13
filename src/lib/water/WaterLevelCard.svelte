<script>
    export let num = '0' // 水位
    export let name = '' // 河道名称
    export let level = '1' // 水质
    export let rate = '0' // 比例
</script>
<div class="m-level">
    <p>{num} <span>m</span></p>
    <p class="name">{name}</p>
    <div class="flow flow-{level}" style="height: {rate}%;"></div>
</div>

<style lang="scss">
  .m-level{
    border: 1px solid #2062a9;padding-top: 10px;margin-right: 10px;
    color: #fff;text-align: center;
    width: 100px;
    height: 85px;
    position: relative;
    .name {color: #c1c1c1;}
      p {position: relative;z-index: 1;}
      .flow {
        width: 100%;position: absolute;left: 0;bottom: 0;
        &-1 {
          background: #59d6ff;
          background: -webkit-linear-gradient(to top, rgb(89 214 255 / 40%), #59d6ff);
          background: linear-gradient(to top, rgb(89 214 255 / 40%), #59d6ff);
        }
        &-2 {
          background: #19acf2;
          background: -webkit-linear-gradient(to top, rgb(25 172 242 / 40%), #19acf2);
          background: linear-gradient(to top, rgb(25 172 242 / 40%), #19acf2);
        }
        &-3 {
          background: #5ed522;
          background: -webkit-linear-gradient(to top, rgb(94 213 34 / 40%), #5ed522);
          background: linear-gradient(to top, rgb(94 213 34 / 40%), #5ed522);
        }
        &-4 {
          background: #24b462;
          background: -webkit-linear-gradient(to top, rgb(36 180 98 / 40%), #24b462);
          background: linear-gradient(to top, rgb(36 180 98 / 40%), #24b462);
        }
        &-5 {
          background: #d9a812;
          background: -webkit-linear-gradient(to top, rgb(217 168 18 / 66%), #d9a812);
          background: linear-gradient(to top, rgb(217 168 18 / 66%), #d9a812);
        }
        &-6 {
          background: #ff5f12;
          background: -webkit-linear-gradient(to top, rgb(255 95 18 / 40%), #ff5f12);
          background: linear-gradient(to top, rgb(255 95 18 / 40%), #ff5f12);
        }
        &-7 {
          background: #8c7052;
          background: -webkit-linear-gradient(to top, rgb(140 112 82 / 40%), #8c7052);
          background: linear-gradient(to top, rgb(140 112 82 / 40%), #8c7052);
        }
        &-8 {
          background: #94979c;
          background: -webkit-linear-gradient(to top, rgb(148 151 156 / 40%), #94979c);
          background: linear-gradient(to top, rgb(148 151 156 / 40%), #94979c);
        }
      }
      &:before {
        content: '';
        display: block;
        width: 8px;
        height: 2px;
        position: absolute;
        top: 1px;left: 1px;
        background: #fff;
      }
  }
</style>
