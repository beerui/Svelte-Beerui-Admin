<script>
	export let size = [5, 5, 10] // [10, 10, 20] || 10
	export let rotate = 0
	export let number = 3
	export let space = 3
	
	let widths = [5, 5, 10]
	const isNumber = v => /^\d+.?\d*/.test(v)
	
	const initWidth = () => {
		widths = []
		if (isNumber(size)) {
			widths = [size, size, size]
		}
		if (Array.isArray(size)) {
				widths = size
		}
	}
	initWidth()
	$: if (size) initWidth()
	
</script>
<div class="an-triangle-box">
	{#each Array(number) as item, index(index)}
		<div class="an-triangle"
		     style={
			     `
				     border-left-width: ${widths[0]}px;
				     border-right-width: ${widths[1]}px;
				     border-bottom-width: ${widths[2]}px;
				     transform: rotate(${rotate}deg);
				     animation-delay: ${index*160}ms;
				     margin-right: ${(number - 1) === index ? 0 : space}px;
			     `
		     }
		></div>
	{/each}
</div>
<style lang="scss">
	.an-triangle {
		width: 0;
		height: 0;
		border-width: 10px;
		border-top: 0;
		border-left-color: transparent;
		border-left-style: solid;
		border-right-color: transparent;
		border-right-style: solid;
		border-bottom-color: #33f1f1;
		border-bottom-style: solid;
		animation: spin 1s linear infinite;
		&-box {
			display: flex;overflow: hidden;
			@keyframes spin {
				0% {opacity: 1}
				40% {opacity: .5}
				100% {opacity: 0}
			}
		}
	}
</style>
