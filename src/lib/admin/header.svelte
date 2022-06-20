<script>
  import { cubicInOut } from 'svelte/easing';
  import { BeIcon } from '@brewer/beerui';
	import { TOKEN } from "../stores.js";
  import { loginOut } from '$utils/login.js';
  let showUser = false
  let active = -1
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
  const changeRole = async (type) => {
    TOKEN.set(type)
    window.location.reload()
  }
  const userHandler = () => {
    showUser = !showUser;
    active = 1
  }
  const closeUserHandler = () => {
    showUser = false
    active = -1
  }
  function clickOutside(node, params) {
    document.addEventListener('click', (e) => {
      if (node && !node.contains(e.target)) {
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
</script>

<div class="g-admin-header">
  <div class="header-left">
    <div class="header-logo">Svelte-Beerui-admin</div>
  </div>
 <div class="header-right">
  <div class="user cursor-pointer" class:active={active === 1} on:click={userHandler} use:clickOutside={{ cb: closeUserHandler }}>
    <img src="/assets/default_header.png" alt="">
    <!-- This is because the current role is used as token -->
    <!-- you can adjust it according to your needs -->
    <span>{$TOKEN}</span>
    {#if showUser}
     <div class="user-dialog" on:click|stopPropagation in:zoomIn="{{duration: 250}}" out:zoomIn="{{duration: 250}}">
      <div class="tab-header">个人角色</div>
      <div class="role-list">
        <div class="item" on:click={() => changeRole('admin')}>
          <div class="name">
            <img src="/assets/default_header.png" class="img">
            <span>admin</span>
          </div>
          {#if $TOKEN === 'admin'}
          <BeIcon name='check' color='#1890FF' />
          {/if}
        </div>
        <div class="item" on:click={() => changeRole('editor')}>
          <div class="name">
            <img src="/assets/default_header.png" class="img">
            <span>editor</span>
          </div>
          {#if $TOKEN === 'editor'}
          <BeIcon name='check' color='#1890FF' />
          {/if}
        </div>
      </div>
      <div class="tab" on:click={() => { loginOut()} } style="color:red">退出登录</div>
      <div class="footer" on:click={closeUserHandler}>关闭</div>
      <div class="popper__arrow"></div>
     </div>
     {/if}
  </div>
 </div>
</div>
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
