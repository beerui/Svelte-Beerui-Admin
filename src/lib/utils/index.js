/**
 * 图片预览
 * @param src 当前图片链接
 * @param list 图片数组
 */
export const previewImages = (src, list) => {
    let container, body = document.body
    const previewImage = {
        index: 0,
        length: 0,
        node: null,
        list: [],
        init(imgDom, list, src) {
            let index = 0
            for (let i = 0; i < list.length; i++) {
                if (src === list[i]) {
                    index = i
                    break
                }
            }
            this.index = index
            this.list = list
            this.node = imgDom
            this.length = list.length - 1
            this.node.src = src
        },
        changeImage(type) {
            if (type === 'prev') this.index--
            if (type === 'next') this.index++
            if (this.index < 0) this.index = this.length
            if (this.index > this.length) this.index = 0
            this.node.src = this.list[this.index]
        },
        close() {
            body.removeChild(document.querySelector('.be-preview'))
            this.index = 0
            this.length = 0
            this.node = null
            this.list = []
        }
    }
    if (document.querySelector('.be-preview')) {
        container = document.querySelector('.be-preview')
    } else {
        container = document.createElement('div')
        container.classList = 'be-preview'
        container.innerHTML = `
            <div class="be-preview__mask"></div>
            <div class="be-preview__btn be-preview__close">×</div>
            <div class="be-preview__btn be-preview__prev"> ‹ </div>
            <div class="be-preview__btn be-preview__next"> › </div>
            <div class="be-preview__container">
                <img class="be-preview__img" alt="image preview" src="" />
            </div>
        `
    }
    const imgDom = container.querySelector('.be-preview__img')
    const maskDom = container.querySelector('.be-preview__mask')
    const closeDom = container.querySelector('.be-preview__close')
    const prevDom = container.querySelector('.be-preview__prev')
    const nextDom = container.querySelector('.be-preview__next')

    maskDom.addEventListener("click", () => previewImage.close(body))
    closeDom.addEventListener("click", () => previewImage.close(body))
    prevDom.addEventListener("click", () => previewImage.changeImage('prev'))
    nextDom.addEventListener("click", () => previewImage.changeImage('next'))
    previewImage.init(imgDom, list, src)
    console.log(previewImage)
    body.appendChild(container)
}
