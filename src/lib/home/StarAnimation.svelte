<script>
	import { BeIcon } from "@brewer/beerui";
	
	export let size = 10
	export let number = 3
	export let space = 3
</script>
<div class="an-star-box">
	{#each Array(number) as item, index(index)}
		<div class="an-star"
		     style={
			     `
				     animation-delay: ${index*600}ms;
				     margin-right: ${(number - 1) === index ? 0 : space}px;
			     `
		     }
		>
			<BeIcon name="star-filled" width={size} height={size} />
		</div>
	{/each}
</div>
<style lang="scss">
	.an-star {
		animation: spin 2s linear infinite;color: #3cdffa;
		&-box {
			display: flex;overflow: hidden;
			@keyframes spin {
				0% {opacity: 1}
				60% {opacity: 0}
			}
		}
	}
</style>
