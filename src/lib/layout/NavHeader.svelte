<script>
	import { BeClock } from "@brewer/beerui";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { loginOut, openPageRedirect } from "../../utils/login.js";
	import { PERMISSION_ROUTER, PERMISSION_THEME_ROUTER, THEME_LOADING_STATUS, USER_INFO } from "../stores.js";
	import { isPermission } from "../../utils/index.js";
	import { onDestroy } from "svelte";
	
	let showExit = false
	let theWerther = {
		werther: '',
		temperature: '',
	}
	//加载天气查询插件
	AMap.plugin('AMap.Weather', function () {
		//创建天气查询实例
		let weather = new AMap.Weather();
		//执行实时天气信息查询
		weather.getLive('越城区', function (err, data) {
			// console.log('执行实时天气信息查询', err, data);
			theWerther = data
		});
	});
	
	const gotoAdmin = () => {
		THEME_LOADING_STATUS.set(true)
		const _menu = openPageRedirect($PERMISSION_ROUTER)
		_menu && goto(_menu.path)
	}
	onDestroy(() => THEME_LOADING_STATUS.set(false))
</script>
<div class="m-nav">
	<div class="p-nav biao-ti-hei flex">
		<span>{theWerther.weather} {theWerther.temperature} °C</span>
		<BeClock async class="m-timer biao-ti-hei" defaultTime="00:00:00" formatTime="HH:mm:ss"/>
	</div>
	<div class="m-container">
		<div class="left-nav flex">
			{#if isPermission($PERMISSION_THEME_ROUTER, 'home')}
				<a sveltekit:prefetch href="/" class="icon_toolbar m-list-nav" class:active={$page.url.pathname === '/'}>一屏总览</a>
			{:else}
				<a href="javascript: void(0)"></a>
			{/if}
			{#if isPermission($PERMISSION_THEME_ROUTER, 'pipePlatform')}
				<a sveltekit:prefetch href="/pipePlatform" class="icon_toolbar m-list-nav">水管平台</a>
			{:else}
				<a href="javascript: void(0)"></a>
			{/if}
			{#if isPermission($PERMISSION_THEME_ROUTER, 'drainage')}
				<a sveltekit:prefetch href="/drainage" class="icon_toolbar m-list-nav"
					 class:active={$page.url.pathname === '/drainage'}>智慧排涝</a>
			{:else}
				<a href="javascript: void(0)"></a>
			{/if}
		</div>
		<a href="" class="m-container__logo"></a>
		<div class="right-nav flex">
			{#if isPermission($PERMISSION_THEME_ROUTER, 'water')}
				<a sveltekit:prefetch href="/water" class="icon_toolbar m-list-nav m-list-nav__right"
					 class:active={$page.url.pathname === '/water'}>活水调度</a>
			{:else}
				<a href="javascript: void(0)"></a>
			{/if}
			{#if isPermission($PERMISSION_THEME_ROUTER, 'dataMiddleground')}
				<a sveltekit:prefetch href="/dataMiddleground" class="icon_toolbar m-list-nav m-list-nav__right"
					 class:active={$page.url.pathname === '/dataMiddleground'}>数据中台</a>
			{:else}
				<a href="javascript: void(0)"></a>
			{/if}
		</div>
		<!-- <a href="" class="icon_toolbar m-list-nav m-list-nav__right">线上医院</a> -->
	</div>
	
	{#if $PERMISSION_ROUTER.length > 0}
		<div class="admin-logo" on:click={gotoAdmin}></div>
	{/if}
	<div class="user" on:click={() => showExit = !showExit}>
		<img class="header" src="/assets/default_header.png" alt="">
		<span>{$USER_INFO.userNick || $USER_INFO.loginName}</span>
		<span class="down"></span>
		{#if showExit}
			<img on:click={loginOut} class="exit" src="/assets/exit.png" alt="">
		{/if}
	</div>
</div>
<style lang="scss">
	.m-nav {
		min-width: 1366px;
		height: 84px;
		background: url('/assets/logo_bg1.png') center center no-repeat;
		display: flex;
		// justify-content: space-between;
		margin: 0 auto;
		
		.p-nav {
			width: 262px;
			padding-left: 60px;
			margin-top: 30px;
			color: #fff;
			display: flex;
			align-items: center;
			flex-shrink: 0;
		}
	}
	
	.m-container {
		// margin: 0 auto;
		// margin-left: 25px;
		display: flex;
		.left-nav,
		.right-nav {
			width: 426px;
		}
		
		&__logo {
			width: 538px;
			height: 100%
		}
	}
	
	.admin-logo {
		width: 94px;
		margin: 33px 0 0 auto;
		cursor: pointer;
		height: 28px;
		background: url('/assets/admin_logo.png') center center no-repeat;
		flex-shrink: 0;
		
		&:hover {
			background: url('/assets/admin_logo_active.png') center center no-repeat;
		}
	}
	
	.user {
		display: flex;
		align-items: center;
		margin: 9px 60px 0 25px;
		color: #fff;
		font-size: 14px;
		cursor: pointer;
		position: relative;
		
		.header {
			width: 26px;
			height: 26px;
			border-radius: 50%;
		}
		
		span {
			margin-left: 3px;
			display: inline-block;
			width: 65px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		
		.down {
			display: inline-block;
			margin-left: 5px;
			width: 0;
			height: 0;
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			border-top: 6px solid #ffffff;
		}
		
		.exit {
			width: 65px;
			height: 36px;
			position: absolute;
			right: -9px;
			bottom: -25px;
			z-index: 99;
		}
	}
	
	.m-list-nav {
		width: 142px;
		height: 35px;
		margin-top: 30px;
		display: block;
		text-align: center;
		color: #a5d6ff;
		line-height: 35px;
		font-size: 16px;
		
		&:hover {
			background-position: 0 -71px;
			color: #ffc706;
		}
		
		&.active {
			background-position: 0 -71px;
			color: #ffc706;
		}
		
		&__right {
			background-position: 0 -141px;
			
			&.active {
				background-position: 0 -212px;
				color: #ffc706;
				font-weight: bold;
			}
			
			&:hover {
				background-position: 0 -212px;
				color: #ffc706;
			}
		}
	}
	
	:global(.m-timer) {
		font-size: 16px;
		color: #def8ff;
		margin-left: 20px;
	}
	
	@media screen and (max-width: 1650px) {
		.p-nav {
			display: none;
		}
	}
</style>
