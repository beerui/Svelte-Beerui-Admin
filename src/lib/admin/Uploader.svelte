<script>
  import {
    BeUpload,
    BeIcon,
    BeButton
  } from "@brewer/beerui";
  import { UPLOAD_URL } from "$utils/config.js";
  export let limit = 9
  export let tip = '只能上传jpg/png文件，且不超过500kb'
  export let dragTip = '将文件拖到此处，或<em>点击上传<\/em>'
  export let accept = 'image/*'
  export let fileList = []
  export let hideUpload = false
  export let showFileList = true
  export let autoUpload  = true
  export let action = UPLOAD_URL
  // fileType: 1-图片，2-附件，3-图片和附件，4-视频，5-不限制文件类型，6-语音, 7-图片自定义slot
  export let type = '1'
  export let beforeUpload = () => {}
  export let beforeImgUpload = () => {}
  export let onExceed = () => {}
  export let onExceedFile = () => {}
  export let onSuccess = () => {}
  export let httpRequest = () => {}
  export let beforeRemove = () => {}
  let uploader = null
  /**
   * 处理 FileList 数据
   * @param list 绑定的 fileList 列表
   * @param isSource 是否获取源数据
   * @return {*['a.jpg', 'b.jpg']}
   */
  export const getListUrl = (list, isSource = false) => {
      const result = []
      list.forEach(el => {
          const item = el.response
          if (item && item.code === 20000) {
              if (isSource) {
                  result.push(item.data[0])
              } else {
                result.push(item.data[0]['serviceFileName'])
              }
          } else {
            result.push({
              serviceFileName: el.url,
              fileName: el.name
            })
          }
      })
      return result
  }
  /**
   * 自定义上传
   */
   export const submit = () => {
     uploader.submit()
  }
</script>
<div class="uploader-box" style={$$props.style}>
  {#if String(type) === '1'}
    <BeUpload
      bind:this = {uploader}
      action={action}
      multiple
      {autoUpload}
      {accept}
      data={{ 'filePathType': '1' }}
      listType="picture-card"
      bind:limit={limit}
      bind:fileList={fileList}
      beforeUpload={beforeImgUpload}
      bind:hideUpload={hideUpload}
      onExceed={onExceed}
      beforeRemove={beforeRemove}
    >
      <div class="upload-card"><BeIcon name="add" width="40" height="40" /></div>
      <p slot="tip">{tip}</p>
    </BeUpload>
  {:else if String(type) === '2'}
    <BeUpload
    bind:this = {uploader}
      action={action}
      multiple
      {autoUpload}
      {accept}
      data={{ 'filePathType': '3' }}
      bind:limit={limit}
      bind:fileList={fileList}
      beforeUpload={beforeUpload}
      onExceed={onExceedFile}
      beforeRemove={beforeRemove}
    >
      <BeButton size="small" type="primary">点击上传</BeButton>
      <p slot="tip">{tip}</p>
    </BeUpload>
  {:else if String(type) === '7'}
    <BeUpload
      bind:this = {uploader}
      action={action}
      multiple
      {autoUpload}
      {accept}
      data={{ 'filePathType': '1' }}
      bind:showFileList={showFileList}
      bind:limit={limit}
      bind:fileList={fileList}
      beforeUpload={beforeImgUpload}
      bind:hideUpload={hideUpload}
      onExceed={onExceed}
      onSuccess={onSuccess}
      beforeRemove={beforeRemove}
    >
      <slot />
    </BeUpload>
  {:else}
    {#if action}
      <BeUpload
        bind:this = {uploader}
        action={action}
        drag
        {autoUpload}
        accept={accept}
        data={{ 'filePathType': '3' }}
        bind:limit={limit}
        bind:fileList={fileList}
        beforeUpload={beforeUpload}
        onExceed={onExceedFile}
        beforeRemove={beforeRemove}
      >
        <div class="upload-card__drag">
          <div class="upload-card__icon">
            <BeIcon name="upload" width="40" height="40" />
          </div>
          <div class="be-upload__text">{@html dragTip}</div>
        </div>
        <p slot="tip">{tip}</p>
      </BeUpload>
    {:else}
      <BeUpload
        bind:this = {uploader}
        drag
        {autoUpload}
        action=''
        accept={accept}
        data={{ 'filePathType': '3' }}
        bind:limit={limit}
        bind:fileList={fileList}
        beforeUpload={beforeUpload}
        onExceed={onExceedFile}
        httpRequest={httpRequest}
        beforeRemove={beforeRemove}
      >
        <div class="upload-card__drag">
          <div class="upload-card__icon">
            <BeIcon name="upload" width="40" height="40" />
          </div>
          <div class="be-upload__text">{@html dragTip}</div>
        </div>
        <p slot="tip">{tip}</p>
      </BeUpload>
    {/if}
  {/if}
</div>
<style lang="scss">
  .uploader-box {width: 360px;}
</style>
