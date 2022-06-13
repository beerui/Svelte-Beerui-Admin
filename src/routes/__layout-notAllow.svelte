<div class="g-notAllow">
	<div class="container">
		<img src="/assets/403.svg" alt="">
		<div>
			<slot></slot>
		</div>
	</div>
</div>
<style lang="scss">
.g-notAllow {
	background: #ffffff;width: 100%;height: 100vh;overflow: hidden;text-align: center;
	.container {display: flex;align-items: center;justify-content: center;margin-top: 12%;}
}
p {color: #6e6d7a;}
</style>


