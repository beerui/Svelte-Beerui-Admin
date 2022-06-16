<script>
	import TagsView from './../lib/admin/tagsView.svelte';
	import Breadcrumb from "$lib/admin/breadcrumb.svelte";
	import Header from "$lib/admin/header.svelte";
	import Slider from "$lib/admin/slider.svelte";
	import { onMount } from "svelte";
	import { navigating, page } from '$app/stores';
	import { PreloadingIndicator } from '@sveltejs/site-kit';
	import { MENU, ROUTER_MAP } from "$lib/stores";
	import { CURRENT_ROLE } from "$lib/stores";
	import { getCurrent } from "$utils/login";
	import { isPermissionRoute, loginOut } from "../utils/login.js";
	let isMount = false
	let isLogin = false
	onMount(async () => {
		isMount = true
		if ($CURRENT_ROLE) {
			isLogin = await getCurrent()
			if (!isLogin) loginOut()
			// 进入admin的时候 定位一次菜单的active
			initMenuActive(ROUTER_MAP, $page.url.pathname)
			isPermissionRoute($page.url.pathname)
		} else {
			loginOut()
		}
	})
	const initMenuActive = (list, path) => {
			for (const key in list) {
					if (list[key].path === path) MENU.set({ active: list[key].id, type: 'update' })
			}
	}
	let showProgress = false
	navigating.subscribe(e => showProgress = e)
	// 是否有权限进入页面
	$: if (isLogin && $page.url.pathname){
		isPermissionRoute($page.url.pathname)
	}
	</script>
	{#if showProgress}
		<PreloadingIndicator />
	{/if}
	<div class="g-admin">
			<Header />
			<div class="g-admin-main">
					<Slider />
					<div class="g-right">
					<TagsView />
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
	</div>

	<style global lang="scss">
		@import "../app.scss";
		@import "@brewer/beerui/assets/beer.css";
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
					background: #EFF2F4;
					&-main {
							display: flex;
					}
			}
			.g-right {
				width: 100%;
				.tags-view-item {
					.icon-close {
						.be-icon-close:before {
							transform: scale(.8);
							display: inline-block;
							vertical-align: -2px;
						}
					}
				}
			}
			.g-right-container {
					padding: 16px 25px;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					flex: 1;
					height: calc(100vh - 92px);
					overflow-y: scroll;
					&-main {
							margin-top: 18px;
					}
			}
	</style>
	
	
	