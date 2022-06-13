<script>
	import MessageDialog from './messageDialog.svelte';
  import { cubicInOut } from 'svelte/easing';
  import { BeScrollbar, showNotice, BeIcon } from '@brewer/beerui';
	import { ADMIN_LOADING_STATUS, PERMISSION_THEME_ROUTER, THEME_LOADING_STATUS, USER_INFO } from "../stores.js";
  import { fetchHeaderDocumentList } from '$api/document'
  import { loginOut } from "$utils/login.js";
  import { fetchHeaderMessageList, readMessage, messageDetail } from '$api/adminMessage'
  import { exportExcel } from '$utils/'
  import { goto } from '$app/navigation';
	import { onDestroy } from "svelte";
  let showMessage = false
  let showDocument = false
  let showUser = false
  let previewDialog = false
  let messageData = {}
  let active = -1
  let documenList = []
  let messageList = []
  let messageCount = 0
  let msgIds = []
  fetchHeaderDocumentList().then(res => {
    documenList = res
  })
  const getMessage = () => {
    fetchHeaderMessageList().then(res => {
      messageList = res.list
      messageCount = res.count
    })
  }
  getMessage()
  function zoomIn(node, params) {
    return {
      duration:params.duration,
      easing: cubicInOut,
      css: t => {
        return `
          opacity: ${t};
          transform: scaleY(${t});
          transform-origin: center top;`
      }
    };
  }
  const documentHandler = () => {
    showDocument = !showDocument
    active = 1
  }
  const closeDocumentHandler = () => {
    showDocument = false;
    if(!showDocument && !showMessage && !showUser) active = -1
  }
  const messageHandler = () => {
    showMessage = !showMessage;
    active = 2
  }
  const closeMessageHandler = () => {
    showMessage = false
    if(!showMessage  && !showDocument && !showUser) active = -1
  }
  const userHandler = () => {
    showUser = !showUser;
    active = 3
  }
  const closeUserHandler = () => {
    showUser = false
    if(!showMessage  && !showDocument && !showUser) active = -1
  }
  const getDetail = (row) => {
    messageDetail({msgId: row.msgId}).then(res => {
      messageData = {
        title: res.title,
        sendTime: res.sendTime,
        sendName: res.sendName,
        content: res.msgBody,
        list: res.fileBOList || []
      }
      previewDialog = true
      if(row.isRead === 0) {
        msgIds = [row.msgId]
        handleRead()
      }
    })
  }
  const batchRead = () => {
    msgIds = []
    messageList.forEach(item => {
      if(item.isRead === 0) {
        msgIds.push(item.msgId)
      }
    })
    handleRead()
  }
  const handleRead = () => {
    readMessage({msgIds: msgIds.join(',')}).then(res => {
      showNotice({
        toast: true,
        message: '更新成功',
        duration: 3000,
        type: 'success'
      })
      getMessage()
    })
  }
  function clickOutside(node, params) {
    document.addEventListener('click', (e) => {
      // 如果是查看消息详情 不关闭弹出层
      const dialog = document.querySelector('.be-dialog')
      if(dialog && dialog.contains(e.target)) {
        return
      } else if (node && !node.contains(e.target)) {
    　  params.cb()
  　　}
    })
    return {
			destroy() {
				// node已从DOM中移除
        document.removeEventListener('click',  params.cb())
			}
		}
  }
  const userSelect = (index) => {
    if(index === 1) {
      goto('/admin/system/user/resetPassword?id='+ $USER_INFO.userId + '&name=' + $USER_INFO.userNick || $USER_INFO.loginName)
      closeUserHandler()
    }
    if(index === 2) {
      window.open('https://cdn.zhihuihedao.cn/assets/zsdn/WebComponents.exe')
    }
    if(index === 3) {
      loginOut()
    }
  }
	const gotoHomePage = () => {
		ADMIN_LOADING_STATUS.set(true)
	  location.href = '/'
	}
	onDestroy(() => ADMIN_LOADING_STATUS.set(false))
</script>

<div class="g-admin-header">
  <div class="header-left">
    <div class="header-logo">越城区古城治水应用（治水大脑）</div>
  </div>
 <div class="header-right">
	 {#if $PERMISSION_THEME_ROUTER.length > 0}
	   <div class="btn cursor-pointer flex items-center" on:click={gotoHomePage}>
	     <i class="iconfont">&#xe604;</i>
	     <span>驾驶舱</span>
	   </div>
	 {/if}
   <div class="btn" class:active={active === 1} on:click={documentHandler} use:clickOutside={{ cb: closeDocumentHandler }}>
     <i class="iconfont">&#xe7e0;</i>
     <span>文档</span>
     {#if showDocument}
     <div class="document" on:click|stopPropagation in:zoomIn="{{duration: 250}}" out:zoomIn="{{duration: 250}}">
      <div class="header">
        <span>文档手册</span>
        <span>点击文档下载查看</span>
      </div>
      <div class="body">
        <BeScrollbar>
          {#each documenList as item}
          <div class="item" on:click={() => {console.log(item.url, item.documentName);exportExcel(item.url, item.documentName)}}>
            <i class="iconfont">{@html item.fileIcon}</i>
            <span>{item.documentName}</span>
          </div>
          {/each}
        </BeScrollbar>
      </div>
      <div class="footer" on:click={closeDocumentHandler}>关闭</div>
      <div class="popper__arrow"></div>
     </div>
     {/if}
   </div>
   <div class="btn" class:active={active === 2} on:click={messageHandler} use:clickOutside={{ cb: closeMessageHandler }}>
     <i class="iconfont">&#xe611;</i>
     <span>消息</span>
     {#if showMessage}
     <div class="message" on:click|stopPropagation in:zoomIn="{{duration: 250}}" out:zoomIn="{{duration: 250}}">
      <div class="header">
        <span>通知（{messageCount} 条未读）</span>
        <span on:click={batchRead}>全部标记已读</span>
      </div>
      <div class="body">
        <BeScrollbar>
          {#each messageList as item}
          <div class="item" on:click={() => getDetail(item)}>
            <i class="iconfont">&#xe76f;</i>
            <div class="item-content">
              <span>{@html item.msgBody}</span>
              <span>{item.sendTime}</span>
            </div>
          </div>
          {/each}
        </BeScrollbar>
      </div>
      <div class="footer" on:click={closeMessageHandler}>关闭</div>
      <div class="popper__arrow"></div>
     </div>
     {/if}
   </div>
  <div class="user cursor-pointer" class:active={active === 3} on:click={userHandler} use:clickOutside={{ cb: closeUserHandler }}>
    <img src="/assets/default_header.png" alt="">
    <span>{$USER_INFO.userNick || $USER_INFO.loginName}</span>
    {#if showUser}
     <div class="user-dialog" on:click|stopPropagation in:zoomIn="{{duration: 250}}" out:zoomIn="{{duration: 250}}">
      <div class="tab-header">个人角色</div>
      <div class="role-list">
        <div class="item">
          <div class="name">
            <img src="/assets/default_header.png" class="img">
            <span>{$USER_INFO.userNick || $USER_INFO.loginName}</span>
          </div>
          <BeIcon name='check' color='#1890FF' />
        </div>
      </div>
      <div class="tab-header">个人中心</div>
      <div class="role-list">
        <div class="item" on:click={() => userSelect(1)}>
          <div class="name">
            <img src="/assets/admin/password.png" class="img" style="width:20px;height:24px;border-radius:0">
            <span>密码重置</span>
          </div>
        </div>
      </div>
      <!-- <div class="tab" on:click={() => userSelect(0)}>个人中心</div>
      <div class="tab" on:click={() => userSelect(1)}>密码重置</div> -->
      <div class="tab" on:click={() => userSelect(2)}>插件下载</div>
      <div class="tab" on:click={() => userSelect(3)} style="color:red">退出登录</div>
      <div class="footer" on:click={closeUserHandler}>关闭</div>
      <div class="popper__arrow"></div>
     </div>
     {/if}
  </div>
 </div>
</div>
{#if previewDialog}
<MessageDialog bind:previewDialog = {previewDialog} forms = {messageData}/>
{/if}
<style lang="scss">
  .g-admin-header {
    height: 56px;
    width: 100%;
    background-color: #2A6AFF;
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
  }
  .header-logo {
    font-size: 24px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #FFFFFF;
    letter-spacing: 3px;
    padding: 0 34px 0 20px;
  }
  .header-left {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .header-right {
    display: flex;
    align-items: center;
    .btn {
      color:#fff;
      position: relative;
      font-size: 14px;
      // width: 72px;
      padding: 0 12px;
      height: 32px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-right: 1px solid rgba($color: #ffffff, $alpha: 0.1);
      a {color: #fff;}
      .iconfont {
        color: #fff;
        font-size: 18px;
        margin-right: 10px;
        cursor: pointer;
      }
      &:nth-of-type(3) {
        border-right:none;
      }
      &.active {
        background-color: #fff;
        border-radius: 8px;
        color: #1890FF;
        .iconfont {
          color: #1890FF;
        }
      }
      .message, .document {
        position: absolute;
        top: 44px;
        z-index: 997;
        right: -16px;
        border-radius: 8px;
        width: 320px;
        height: 448px;
        background-color: #fff;
        box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.15);
        .header {
          height: 44px;
          padding: 0 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          color: #333333;
          align-items: center;
          font-size: 14px;
          span:nth-child(2) {
            color: #1890FF;
            font-size: 12px;
          }
        }
        .body {
          height: 360px;
          .item {
            padding: 13px 20px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            &>i {
              color: #FF8818;
              font-size: 24px;
            }
            &-content {
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              color: #333333;
              font-size: 14px;
              span:nth-child(2) {
                color: #999999;
                font-size: 12px;
                margin-top: 8px;
              }
            }
          }
        }
        .footer {
          height: 44px;
          display: flex;
          justify-content: center;
          color: #1890FF;
          align-items: center;
          font-size: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
      }
      .document {
        .header {
          span:nth-child(2) {
            color: #999999;
            font-size: 12px;
          }
        }
        .body {
          .item {
            .iconfont {
              color: #1890FF;
              font-size: 20px;
            }
            color: #1890FF;
            font-size: 12px;
          }
        }
      }
    }

    .popper__arrow {
      width: 10px;
      height: 10px;
      border-left: 1px solid #e4e7ed;
      border-top: 1px solid #e4e7ed;
      background-color: transparent;
      transform: rotate(45deg);
      position: absolute;
      top: -5px;
      filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
      left: 260px;
      // border: 1px solid #e4e7ed;
      &::after {
        content: " ";
        position: absolute;
        display: block;
        width: 0;
        background-color: #fff;
        height: 0;
        border: 5px solid transparent;
      }
    }
    .user {
      display: flex;
      align-items: center;
      margin-left: 32px;
      position: relative;
      padding: 4px 13px 4px 8px;
      >img {
        border-radius: 50%;
        margin-right: 7px;
        width: 22px;
        height: 22px;
      }
      &.active {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: #1890FF;
      }
      span {
        font-size: 12px;
        font-family: Source Han Sans CN-Normal, Source Han Sans CN;
        font-weight: 400;
        color: #FFFFFF;
      }
      .user-dialog {
        position: absolute;
        top: 44px;
        z-index: 997;
        right: 0;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        width: 320px;
        // height: 448px;
        background-color: #fff;
        box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.15);
        .tab-header {
          padding: 12px;
          color: #333333;
          font-size: 14px;
        }
        .tab {
          padding: 12px;
          color: #333333;
          font-size: 14px;
          text-align: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .role-list {
          max-height: 242px;
          background: #F4FAFE;
          padding: 13px 15px;
          overflow-y: scroll;
          .item {
            background: #FFFFFF;
            box-shadow: 0px 4px 10px 1px rgba(40, 76, 105, 0.15);
            border-radius: 12px;
            opacity: 1;
            border: 1px solid #FFFFFF;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            .name {
              display: flex;
              align-items: center;
              .img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 16px;
              }
              span {
                font-size: 14px;
                font-weight: 400;
                color: #333333;
              }
            }
          }
        }
        .footer {
          height: 44px;
          display: flex;
          justify-content: center;
          color: #1890FF;
          align-items: center;
          font-size: 12px;
        }
      }
    }
  }

</style>
