<script>
import Breadcrumb from "$lib/admin/breadcrumb.svelte";
import Header from "$lib/admin/header.svelte";
import Slider from "$lib/admin/slider.svelte";
import { onMount } from "svelte";
import { navigating, page } from '$app/stores';
import { PreloadingIndicator } from '@sveltejs/site-kit';
import { MENU, ROUTER_MAP } from "$lib/stores";
import { USER_INFO } from "$lib/stores";
import { getCurrent } from "$utils/login";
import { isPermissionRoute } from "../utils/login.js";
import { loading } from "@brewer/beerui";
import { ADMIN_LOADING_STATUS } from "../lib/stores.js";
let isMount = false

onMount(async () => {
    if (!$USER_INFO.userId) await getCurrent()
    isMount = true
    // 进入admin的时候 定位一次菜单的active
    initMenuActive(ROUTER_MAP, $page.url.pathname)
})
const initMenuActive = (list, path) => {
    for (const key in list) {
        if (list[key].path === path) MENU.set({ active: list[key].id, type: 'update' })
    }
}
let showProgress = false
navigating.subscribe(e => showProgress = e)
// 是否有权限进入页面
$: if (isMount && $page.url.pathname){
	isPermissionRoute($page.url.pathname, 'admin')
}
</script>
{#if showProgress}
	<PreloadingIndicator />
{/if}
<div class="g-admin" use:loading={$ADMIN_LOADING_STATUS}>
    <Header />
    <div class="g-admin-main">
        <Slider />
        <div class="g-right-container">
            <div class="breadcrumb">
                <Breadcrumb />
            </div>
            <div class="g-right-container-main relative">
                {#if isMount}
                <slot />
                {/if}
            </div>
        </div>
    </div>
</div>
<style global lang="scss">
    .progress {
        background-color: #004dff!important;
    }
    .be-form-item__error {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }
     #riverMap .amap-info-content {
         padding: 10px 20px;
         background: #1890FF;
         border-radius: 8px;
         color: #fff;
        .amap-info-close {
            display: none;
        }
     }
     #riverMap .amap-info-sharp {
        border-top: 8px solid #1890FF;
     }
    .be-progress {
        width: 100%;
    }
    .be-progress-bar_outer{
        width: 100%;
    }
    .filter {
        .be-date {
            width: auto;
            .be-input__inner {
                height: 34px;
                line-height: 34px;
                .be-range-separator {
                    line-height: 26px;
                }
            }
        }
    }
    .m-card, .rank-table, .footer-table {
        .be-table__cell {
            padding: 7px 0;
        }
        .be-table__header-wrapper {
            .be-table__cell {
              background-color: #F9F9F9;
            }
        }
    }
    .card-river-chief-base {
        .be-select {
            width: 90px;
            .be-input__inner {
                border:none;
                height: 20px;
                line-height: 20px;
            }
        }
    }
    @font-face {
    font-family: 'iconfont';  /* Project id 2656648 */
    src: url('//at.alicdn.com/t/font_2656648_6wd0jltbp8v.woff2?t=1652514156201') format('woff2'),
        url('//at.alicdn.com/t/font_2656648_6wd0jltbp8v.woff?t=1652514156201') format('woff'),
        url('//at.alicdn.com/t/font_2656648_6wd0jltbp8v.ttf?t=1652514156201') format('truetype');
    }
    :global(.iconfont) {
        font-family:"iconfont",serif;
        font-size:16px;
        font-style:normal;
    }
    .g-admin {
        min-width: 100%;
        min-height: 100vh;
        &-main {
            display: flex;
        }
    }
    /* .g-right-container {
      padding: 16px 25px;
      display: flex;
      flex-direction: column;
      flex: 1;
      &-main {
        margin-top: 18px;
      }
    } */
    .g-right-container {
        padding: 16px 25px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: calc(100vh - 56px);
        overflow-y: scroll;
        &-main {
            margin-top: 18px;
        }
    }
    .be-video-dialog .be-dialog__container {
      width: 1170px;
    }
    .be-video-dialog .be-dialog__body {
      padding: 0;
    }
    .reported-icon .be-icon {position: absolute;left: 50%;transform: translateX(-50%);}
    .small-list .icon-box {position: relative;}
    .small-list .icon-box .be-icon {width: 28px !important;height: 28px !important;position: absolute;left: 50%;transform: translateX(-50%);}
    .form-content {
      .be-form-item__content {width: 70% !important;
        .be-input {width: 100% !important;}
        .be-select {width: 100% !important;}
        .be-date {width: 100% !important;}
      }
    }
    .pump-sluiceGateStation-handle {
      .form-content {
        .be-form-item__content {width: 70%;}
        .be-form-item__label {width: 155px;}
      }
    }
    .pump-waterWorks-handle {
      .form-content {
        .be-form-item__content {width: 70%;}
        .be-form-item__label {width: 175px;}
      }
    }
    .map-dialog {
      .be-dialog__container {width: 800px;}
    }
    .admin-map {
        padding: 0;
        .g-right-container-main {
            margin-top: 0;
        }
    }
    .right-drawer {
        .be-carousel {
            height: 100%;
            &__container {
                height: 100%;
            }
        }
        .be-input__inner {
            height: 32px;
            line-height: 32px;
        }
    }
    .page-list-footer {padding: 10px !important;}
    .event-address-dialog {
      .be-dialog {
        .be-dialog__container {width: 55%;min-width: 758px;}
        .be-dialog__body {padding: 10px 20px !important;}
      }
    }
    .map-form-box {
      .be-form-item {margin-bottom: 0 !important;}
    }
    .video-btn {
      .be-icon {margin-left:-1px !important;margin-top: -2px !important;}
    }
    .accept-dialog {
        .be-dialog__body {
            padding: 10px 0 0 0;
        }
    }
    .preview-dialog {
        .be-dialog__container {
            width: 50%
        }
    }
</style>


