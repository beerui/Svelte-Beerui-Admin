<script>
	import { BeDialog } from '@brewer/beerui';
  export let vsible = false
  export let receiverDetail = {
    notReadCount: 0,
    messageNotReadBOList: [],
    readCount: 0,
    messageReadBOList: []
  }
  
</script>
<BeDialog bind:visible={vsible} title="通知接收人列表">
  <div class="flex">
    <div class="accept">
      <div class="accept-header">
        <span>{receiverDetail.notReadCount}</span>
        <span>人未读</span>
      </div>
      <div class="accept-list">
        {#each receiverDetail.messageNotReadBOList as item}
        <div class="accept-person">
          <div class="person-name">
            <span class="point"></span>
            <span class="name">{item.userName}</span>
          </div>
          <span class="job">{item.userRole}</span>
        </div>
        {/each}
      </div>
    </div>
    <div class="accept" style="border:none">
      <div class="accept-header">
        <span class="read">{receiverDetail.readCount}</span>
        <span>人已读</span>
      </div>
      <div class="accept-list">
        {#each receiverDetail.messageReadBOList as item}
        <div class="accept-person">
          <div class="person-name">
            <span class="point"></span>
            <span class="name">{item.userName}</span>
          </div>
          <span class="job">{item.userRole}</span>
        </div>
        {/each}
      </div>
    </div>
  </div>
  <div slot="footer"></div>
</BeDialog>

<style lang="scss">
.accept {
  width: 50%;
  border-right: 1px solid #ebebeb;
  .accept-header {
    height: 36px;
    background: #F4FAFE;
    font-size: 14px;
    color: #666666;
    display: flex;
    justify-content: center;
    align-items: center;
    span:nth-child(1) {
      color: #FD4646;
      margin-right: 2px;
    }
    .read {
      color: #34DC66!important;
    }
  }
  .accept-list {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 17px 0;
    box-sizing: content-box;
    overflow-y: auto;
    .accept-person {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      width: 100%;
      .person-name {
        width: 50%;
        display: flex;
        justify-content: center;
      }
      .point {
        width: 4px;
        height: 4px;
        background: #FD4646;
        border-radius: 50%;
      }
      .read {
        background: #34DC66;
      }
      .name {
        font-size: 14px;
        margin: 0 10px;
        font-weight: 400;
        color: #333333;
        
      }
      .job {
        width: 64px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid #1890FF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #1890FF;
      }
    }
  }
}
</style>