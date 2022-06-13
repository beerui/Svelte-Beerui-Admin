<script>
	import SixRectAnimation from "./SixRectAnimation.svelte";
	import { BeIcon } from "@brewer/beerui";
	import { fly, fade } from "svelte/transition";
	export let title = ''
	export let riverName = ''
	export let times = ''
	export let left = '0px'
	export let bottom = '0px'
	export let visible = false
</script>
{#if visible}
	<div
		class="card-item-rect z-10"
		style:left={left}
		style:bottom={bottom}
		style={$$props.style}
		transition:fade
	>
		<div class="rect-title">
			<div class="rect-title-style" in:fly={{ y: -10, duration: 800 }}>
				<SixRectAnimation />
				{title}
			</div>
			{#if riverName}
				<div class="rect-river-name" in:fly={{ y: -20, duration: 800 }}>
					<BeIcon width="24" height="24" name="books"/>
					{riverName}
				</div>
			{/if}
			{#if times}
				<div class="rect-river-times" in:fly={{ y: -20, duration: 800, delay: 100 }}>
					调度次数：<span>{times}</span>
				</div>
			{/if}
		</div>
		<div class="rect-content" in:fly={{ y: 20, duration: 800, delay: 200 }}>
			<slot></slot>
		</div>
		<div class="rect-people" in:fly={{ y: 20, duration: 800, delay: 300 }}>
			<slot name="people"></slot>
		</div>
	</div>
{/if}
