<script>
	export let size = 10
</script>
<div class="an-six-rect">
	<p class="top-triangle"></p>
	<p class="center"></p>
	<p class="bottom-triangle"></p>
</div>
<style lang="scss">
	.an-six-rect{
		display: inline-block;
		.top-triangle{
			width: 0;
			height: 0;
			border-bottom: 5px solid #cdb671;
			border-left: 7px solid transparent;
			border-right: 7px solid transparent;
		}
		.center{
			width: 14px;
			height: 7px;
			background: #cdb671;
		}
		.bottom-triangle{
			width: 0;
			height: 0;
			border-top: 5px solid #cdb671;
			border-left: 7px solid transparent;
			border-right: 7px solid transparent;
		}
	}
</style>
