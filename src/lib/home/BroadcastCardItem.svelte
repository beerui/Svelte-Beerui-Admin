<script>
	import StarAnimation from "./StarAnimation.svelte";
	import TriangleAnimation from "./TriangleAnimation.svelte";
	import { fly, fade } from "svelte/transition";
	export let left = '0px'
	export let bottom = '0px'
	export let visible = false
</script>
{#if visible}
	<div
		class="card-item z-10"
		style:left={left}
		style:bottom={bottom}
		style={$$props.style}
		transition:fade
	>
		<div class="card-item-star">
			<StarAnimation />
		</div>
		<div class="card-item-icon icon-lt"></div>
		<div class="card-item-icon icon-lb"></div>
		<div class="card-item-icon icon-rt"></div>
		<div class="card-item-icon icon-rb"></div>
		<div class="card-item-title">
			<div class="text" in:fly={{ y: -20, duration: 800 }}><slot name="title">数据播报 <span>Broadcasting Datagram</span></slot></div>
			<div class="line"></div>
			<div class="triangle-box">
				<TriangleAnimation rotate="90" size={[3, 3, 6]} space="5" />
			</div>
		</div>
		<div class="card-item-content" in:fly={{ y: 20, duration: 800 }}>
			<slot></slot>
		</div>
	</div>
{/if}
