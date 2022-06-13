<script>
  import { onMount } from "svelte"
  import { requestAnimationFrame, cancelAnimationFrame } from '$utils/requestAnimationFrame'

  export let show = false

  let canvas = null
  let ctx = null
  let lx = 293, rx = 293
  let lImgX = 172, rImgX = 528
  let tabActiveImage
  let opacity = 1

  const initLighter = () => {
    canvas.width = 786
    canvas.heigth = 160
    ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0b142e'
    ctx.lineWidth = 35
    ctx.strokeStyle = '#0b142e'
    ctx.lineJoin="round"
    moveLighter()
  }

  const drawLine = (lx, rx) => {
    ctx.beginPath()
    ctx.lineTo(lx, 170)
    ctx.lineTo(lx+100, -10)
    ctx.moveTo(rx+200, 170)
    ctx.lineTo(rx+200, 170)
    ctx.lineTo(rx+100, -10)
    ctx.stroke()
    ctx.closePath()
  }

  const moveLighter = async () => {
    clearCanvas()
    const rq = requestAnimationFrame(moveLighter)
    if (lx <= 0) {
      cancelAnimationFrame(rq)
      tabActiveImage = await loadImg()
      setTimeout(() => {
        moveTabActiveImage()
      }, 100)
    } else {
      ctx.globalCompositeOperation = 'destination-out'
      lx -= 31
      rx += 31
      drawLine(lx, rx)
    }
  }

  const loadImg = () => {
    const img = new Image()
    img.src = '/assets/tab_active_bar.png'
    return new Promise((resolve, reject) => {
      img.onload = function() {
        resolve(img)
      }
    })
  }

  const moveTabActiveImage = () => {
    const rq = requestAnimationFrame(moveTabActiveImage)
    if (lImgX <= 8) {
      cancelAnimationFrame(rq)
      setTimeout(() => {
        tabActiveImageFadeOut()
      }, 100)
    } else {
      clearCanvas()
      lImgX -= 19
      rImgX += 19
      drawTabActiveImage(lImgX, rImgX)
    }
  }

  const drawTabActiveImage = (lImgX, rImgX) => {
    ctx.globalAlpha = opacity
    ctx.drawImage(tabActiveImage, lImgX, 115, 87, 39)
    ctx.drawImage(tabActiveImage, rImgX, 115, 87, 39)
  }

  const tabActiveImageFadeOut = () => {
    const rq = requestAnimationFrame(tabActiveImageFadeOut)
    if (opacity <= 0.1) {
      cancelAnimationFrame(rq)
      show = false
    } else {
      opacity -= 0.08
      clearCanvas()
      drawtabActiveImageOpacity(lImgX, rImgX)
    }
  }

  const drawtabActiveImageOpacity = () => {
    drawTabActiveImage(lImgX, rImgX)
  }

  const clearCanvas = () => {
		try {
	    ctx.globalAlpha = 1
	    ctx.globalCompositeOperation = 'source-over'
	    ctx.clearRect(0, 0, canvas.width, canvas.height)
	    ctx.fillRect(0, 0, canvas.width, canvas.height)
		} catch (e) {
			console.log('clearCanvas', e)
		}
  }

  onMount(() => {
    initLighter()
  })
</script>
<canvas bind:this={canvas} class="canvas w-full h-full"></canvas>
<style>
  .canvas {
    background: url('/assets/home/lighter.png') center / cover no-repeat;
    opacity: .7;
  }
</style>
