<script>
	import { uploader } from '$api/common';
	import { onMount } from 'svelte';
  import E from 'wangeditor'
  let editor
  onMount(() => {
    editor = new E('#wangeditor')
    editor.config.zIndex = 100
    // 配置 server 接口地址
    // editor.config.uploadImgServer = UPLOAD_URL
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      const formData = new FormData()
      formData.append('filePathType', '1')
      formData.append('file', resultFiles[0])
      uploader(formData).then(res => {
        // 上传图片，返回结果，将图片插入到编辑器中
        const imgUrl = res[0].url + res[0].serviceFileName
        insertImgFn(imgUrl)
      })
    }
    editor.create()
  })
  export const getValue = () => {
    return editor.txt.html()
  }
  export const setValue = (val) => {
    editor.txt.html(val)
  }
</script>

<div id="wangeditor"></div>

<style>
  #wangeditor {
    width: 100%;
    /* height: 200px; */
  }
</style>