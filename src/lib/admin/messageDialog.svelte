<script>
  import { BeDialog } from '@brewer/beerui'
  export let previewDialog = false
  export let forms
</script>

<BeDialog bind:visible={previewDialog} title="通知">
  <div class="preview-header">
    <h1>{forms.title|| '暂无标题'}</h1>
    <div class="header-person">
      <span>发布时间：</span>
      <div>{forms.sendTime || '暂无时间'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <span>发布人：</span>
      <span>{forms.sendName || '暂无发布人'}</span>
    </div>
  </div>
  <div class="preview-content">
    {@html forms.content}
  </div>
  <div class="preview-footer">
    <div class="tip">附件：</div>
    <div>
      {#each forms.list as item}
      <a on:click={window.open(item.filePath || (item.url + item.serviceFileName))} class="cursor-pointer">{item.fileName}</a>
      {/each}
    </div>
  </div>
</BeDialog>

<style lang="scss">
  .preview-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 40px;
    border-bottom:1px solid #e9e9e9;
  }
  .preview-content{
    padding: 20px;
    max-height: 500px;
    overflow-y: auto;
   }
  .preview-footer {
    padding: 0 20px;
    display: flex;
    .tip {
      color: #333;
      font-size: 14px;
    }
  }
  .header-person{
    display: flex;
  }
</style>