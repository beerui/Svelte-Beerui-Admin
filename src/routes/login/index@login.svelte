<script>
  import { loginIn } from "$utils/login.js";
  import { removeAccount, setAccount } from "$utils/auth.js";
  import { LOGIN_LOADING_STATUS } from "$lib/stores.js";

  let checked = true
  let formData = {
      account: 'admin',
      password: 'admin'
  }

  function remember() {
      checked = !checked
  }

  function submit() {
      if (!formData.account) {
          return
      }
      if (!formData.password) {
          return
      }
      if (checked) {
          setAccount(formData)
      } else {
          removeAccount()
      }
      loginIn(formData, checked)
  }
</script>
<div class="g-container flex items-center justify-end relative">
<div class="g-video w-full h-full">
  <video autoplay loop muted poster="/assets/login/bg_poster.png" class="w-full h-full">
    <source src="/assets/login/bg.mp4" type="video/mp4">
  </video>
</div>
<div class="g-login_container">
  <p class="title">Svelte-Beerui-Admin</p>
  <div class="g-login_form">
    <p class="user-login">用户登录</p>
    <p class="flex items-center label">
      <img src="/assets/login/user_icon.png" alt="">
      <span class="text-white">用户名</span>
    </p>
    <div class="ipt-wrapper">
      <input type="text" placeholder="请输入用户名" bind:value={formData.account} class="ipt">
      <span class="light"/>
    </div>
    <p class="flex items-center label">
      <img src="/assets/login/lock_icon.png" alt="">
      <span class="text-white">密码</span>
    </p>
    <div class="ipt-wrapper">
      <input type="password" placeholder="请输入用户名" bind:value={formData.password} class="ipt">
      <span class="light"/>
    </div>
    <div class="g-remember w-full">
      <div class="remember-pwd flex items-center" on:click={remember}>
        <div class="checkbox" class:checked={checked}></div>
        <span>记住密码</span>
      </div>
      <p class="forget-pwd">账号 : admin  密码 : 随便填</p>
      <p class="forget-pwd">账号 : editor 密码 : 随便填</p>
    </div>
    <button class="btn" class:can-click={formData.account && formData.password && !$LOGIN_LOADING_STATUS} on:click={submit}>登录</button>
  </div>
</div>
<div class="bottom absolute w-full flex justify-center">
  <span>Beerui</span>
  <span>Svelte-Beerui-Admin技术支持</span>
</div>
</div>
<style lang="scss">
.text-white {
  color: #fff
}
.g-container {
  width: 100vw;
  height: 100vh;

  .g-video {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;

    video {
      object-fit: cover;
    }
  }

  .g-login_container {
    width: 480px;
    margin-right: 192px;

    .title {
      margin-bottom: 55px;
      font-size: 48px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      color: #FFFFFF;
      text-align: center;
      line-height: 38px;
    }

    .g-login_form {
      width: 480px;
      height: 664px;
      padding: 55px 53px 0;
      background: linear-gradient(-26deg, rgba(23, 34, 57, .56), rgba(32, 54, 102, .56));
      border: 2px solid rgba(73, 132, 255, 0.69);
      box-shadow: 9px 7px 15px 1px rgba(25, 65, 115, 0.19);
      // opacity: 0.56;
      border-radius: 8px;

      .user-login {
        margin-bottom: 60px;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
      }

      .label {
        font-size: 18px;
        margin: 31px 0 16px;

        img {
          width: 21px;
          height: 21px;
          margin-right: 13px;
        }
      }

      .ipt-wrapper {
        position: relative;

        .ipt {
          width: 367px;
          height: 56px;
          font-size: 18px;
          color: #ffffff;
          background: #283A60;
          border-radius: 4px;
          outline: none;
          padding-left: 34px;

          &:focus {
            background: url(/assets/login/focus_bg.png) 0 0 / 100% 100% no-repeat;

            & + .light {
              visibility: visible;
            }
          }
        }

        .light {
          position: absolute;
          bottom: -23px;
          left: 41px;
          visibility: hidden;
          display: block;
          width: 356px;
          height: 51px;
          background: url(/assets/login/focus_light.png) 0 0 / 100% 100% no-repeat;
        }
      }

      .g-remember {
        margin-top: 20px;
        padding: 0 8px;

        .remember-pwd {
          font-size: 16px;
          color: #ffffff;
          cursor: pointer;

          .checkbox {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            border: 1px solid #ffffff;
            border-radius: 4px;
          }

          .checked {
            border: none;
            background: url(/assets/login/checked_icon.png) 0 0 / 100% 100% no-repeat;
          }
        }

        .forget-pwd {
          font-size: 16px;
          color: #55A3FF;
        }
      }

      .btn {
        width: 368px;
        height: 64px;
        margin-top: 40px;
        color: #ffffff;
        font-size: 22px;
        letter-spacing: 2px;
        background: linear-gradient(-51deg, rgba(1, 94, 234, 0.9), rgba(0, 118, 250, 0.9));
        box-shadow: 2px 2px 4px 0px rgba(49, 135, 241, 0.27);
        border-radius: 8px;
        opacity: 0.56;
        cursor: pointer;
      }

      .can-click {
        opacity: 1;
      }
    }
  }

  .bottom {
    bottom: 22px;
    color: #ffffff;
    font-size: 14px;

    span:nth-child(1) {
      display: flex;

      &::after {
        display: block;
        content: "";
        width: 1px;
        height: 14px;
        background: #fff;
        margin: 4px 8px 0;
      }
    }
  }
}
</style>
