<script>
    import {
      BeButton,
      BeInput,
      BeTable,
      BeTableColumn,
      BeRadio,
      BeRadioGroup,
      BeDatePicker,
      BeDrawer,
      BeCascader
  } from "@brewer/beerui";
  import Uploader from "$lib/admin/Uploader.svelte";
  import { createEventDispatcher, tick } from 'svelte'
  import { showNotice } from "@brewer/beerui";
  import { fetchRoleList } from '$api/role'
  import { userUpdateDetail, userAlreadyBindRoles } from '$api/user'
  import { fetchAreaList } from '$api/areaOrg'
  import { debounce, placeholderRegexHandle,checkValidateField } from '$utils/index'
  

  export let visible = false
  export let type = 'add'
  export let userId = ''

  let dispatch = createEventDispatcher()

  let defaultAreaId = 5
  let drawerformData = {
    userNick: '', // 昵称
    loginName: '', // 用户账号
    userTelephone: '', // 用户手机号
    departmentUnit: '', // 部门单位
    departmentTelephone: '', // 单位电话
    emailAddress: '', // 电子邮箱
    areaId: '', // 行政地区ID
    userPwd: '123456', // 密码
    isAlone: '1', // 是否多人同时在线
    // 账号永久开始时间传很小的时间和很大的时间
    getStartTime: '1740-01-01', // 账号开始时间
    expirationTime: '3999-01-01', // 账号失效时间
    userAvatar: '', // 头像
    roleIds: []
  }
  let rules = {
    userNick: {required: true, message: '请输入用户名（昵称）'},
    loginName: {required: true, message: '请输入用户账号', pattern: /^[A-z0-9]{6,8}$/g, patternMessage: '请输入6-8位的数字或字母'},
    userTelephone: {required: false, pattern: /^1[3456789]\d{9}$/, patternMessage: '请输入正确的手机号码格式' },
    departmentTelephone: {required: false, pattern: /^\d{4}-\d{8}$/,patternMessage: '请输入正确的座机号码格式' },
    areaId: {required: true, message: '请选择所在地区'},
    userPwd: {required: true, message: '请输入自定义密码', pattern: /^[A-z0-9]{6,8}$/g,  patternMessage: '请输入6-8位的数字或字母'},
    isAlone: {required: true, message: '请选择是否允许多人在线'},
    getStartTime: {required: true, message: '请选择账号失效时间'}
  }
  let expiration = '' // 账号失效时间
  // 密码类型
  let passwardType = '0'
  // 账号失效类型
  let expirationType = '0'
  let firstChange = true
  // 图片列表
  let picList = []
  // 角色列表
  let filterRoleName = ''
  let roleList = []
  let filterRoleList = [] // 筛选的角色数据
  let roleToggleRowTable = null
  // 行政区划
  let areaList = []

  $: {
    if (visible) {
      resetFormData()
      getRoleList()
      if (type === 'add') {
        getAreaList()
      }
      firstChange = true
      if (type === 'edit') {
        getUserDetail()
      }
    }
  }
  
  // 用户信息回显
  const getUserDetail = () => {
    const params = {
      userId: userId
    }
    userUpdateDetail(params).then(res => {
      drawerformData = res
      getEditFullArea(res.areaLevelPath)
      // 转成字符
      drawerformData.isAlone = String(drawerformData.isAlone)
      // 修改信息密码统一改为默认密码
      drawerformData.userPwd = '123456'
      // 判断账号失效时间选中的是默认还是自定义
      if (drawerformData.getStartTime !== '1940-01-01' && drawerformData.expirationTime !== '3999-01-01') {
        expirationType = '1'
        expiration = [res.getStartTime, res.expirationTime]
      }
      // 获取已绑定的角色
      getUserBindRoles()
      picList = res.userAvatar ? res.userAvatar.split(',').map(val => {
        const r = val.match(/(.+.cn)|(\/upload\/.+)/g)
        return {
          response: {
            data: [
              {
                url: r[0],
                serviceFileName: r[1]
              }
            ]
          },
          url: val
        }
      }) : []
    })
  }

  /**
   * 获取行政区划
   * @param id (id默认为越城区的区划id)
   * @param resolve
   * @param type 新增/编辑
   */
  const getAreaList = (id = defaultAreaId, resolve = undefined, type = 'add', areaLevelPath = []) => {
    const params = {
      areaId: id
    }
    fetchAreaList(params).then(res => {
      res.forEach(val => {
        val.children = []
      })
      areaLevelPath.splice(0, 1)
      if(!resolve) appendAreaListChildern(id, areaList, res)
      if (type === 'edit') {
        if (areaLevelPath.length > 1) {
          getAreaList(areaLevelPath[0], resolve, type, areaLevelPath)
        }
      }
      if (resolve) {
        resolve(res)
      }
    })
  }

  // 获取完整的区划
  const getEditFullArea = (areaLevelPath) => {
    let levelPath = areaLevelPath ? areaLevelPath.match(/-\d+/g) : []
    levelPath = levelPath.map(val => Math.abs(val))
    const index = levelPath.findIndex(val => val === defaultAreaId)
    levelPath.splice(0, index)
    getAreaList(undefined, undefined, 'edit', levelPath)
  }

  const appendAreaListChildern = (id, oldList, newList) => {
    if (!areaList.length) {
      areaList = newList
    } else {
      for (let i=0; i<oldList.length; i++) {
       if (oldList[i].areaId === id) {
        oldList[i].children = newList
        areaList = areaList
         return
       }
       if (oldList[i].children.length) {
        appendAreaListChildern(id, oldList[i].children, newList)
       }
     }
    }
  }

  // 行政区划懒加载
  const lazyLoad = (node, resolve) => {
    const { areaId } = node
    getAreaList(areaId, resolve)
  }

  // 获取行政区划选中的值
  const handleCascaderChange = (evt) => {
    drawerformData.areaId = evt.detail ? evt.detail[0] : ''
  }

  // 获取已绑定的角色
  const getUserBindRoles = () => {
    const params = {
      userId: userId
    }
    userAlreadyBindRoles(params).then(res => {
      drawerformData.roleIds = res
      roleToggleRowTable.toggleRowSelection(res)
    })
  }

  const getRoleList = () => {
    const params = {
      roleName: '',
      pageNum: 0,
      pageSize: 0
    }
    fetchRoleList(params).then(res => {
      roleList = res.list
      filterRoleList = res.list
      resetRoleIdList()
    })
  }

  const handlePawwordTypeChange = (value) => {
    if (value.detail === '0') {
      drawerformData.userPwd = '123456'
    } else {
      drawerformData.userPwd = ''
    }
  }

  const handleExpirationTypeChange = (evt) => {
    if (!firstChange) {
      expiration = ''
      if (evt.detail === '1') {
        drawerformData.getStartTime = ''
        drawerformData.expirationTime = ''
      } else {
        drawerformData.getStartTime = '1740-01-01'
        drawerformData.expirationTime = '3999-01-01'
      }
    }
    firstChange = false
  }

  // 账号失效时间改变
  const handleExpirationChange = (value) => {
    if (value.detail) {
      drawerformData.getStartTime = value.detail[0]
      drawerformData.expirationTime = value.detail[1]
    } else {
      drawerformData.getStartTime = ''
      drawerformData.expirationTime = ''
    }
  }

  const beforeImgUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2
    const types = ['image/jpeg', 'image/jpg', 'image/png']
    if (!types.includes(file.type)) {
      showNotice({
        message: '文件格式错误!只能是.jpeg,.jpg,.png',
        type: 'warning'
      })
      return false
    }
    if (!isLt2M) {
      showNotice({ message: '上传图片大小不能超过 2MB!', type: 'warning' })
    }
    return isLt2M;
  }

  const onExceed = (files, fileList) => {
    const len = files.length + fileList.length
    if (len > 9) {
      showNotice({ message: '上传超过限制！', type: 'warning' })
    }
  }

  const roleToggleRowSelectionHandle = (item) => {
    roleToggleRowTable.toggleRowSelection(item)
  }

  const resetRoleIdList = async () => {
    await tick()
    roleToggleRowSelectionHandle([])
    drawerformData.roleList = []
  }

  const resetFormData = () => {
    passwardType = '0'
    expirationType = '0'
    expiration = ''
    picList = []
    drawerformData = {
      userNick: '', // 昵称
      loginName: '', // 用户账号
      userTelephone: '', // 用户手机号
      departmentUnit: '', // 部门单位
      departmentTelephone: '', // 单位电话
      emailAddress: '', // 电子邮箱
      areaId: '', // 行政地区ID
      userPwd: '123456', // 密码
      isAlone: '1', // 是否多人同时在线
      getStartTime: '1740-01-01', // 账号失效时间
      expirationTime: '3999-01-01', // 账号失效时间
      userAvatar: '', // 头像
      roleIds: []
    }
  }

  // 搜索角色
  const handleSearchRole = (debounce(() => {
    const result = roleList.filter(val => val.roleName.indexOf(filterRoleName) !== -1)
    filterRoleList = result
  }, 300))

  // 获取选中的角色id
  const handleRoleListChangeGetId = (evt) => {
    drawerformData.roleIds = evt.detail
  }

  const handleConfirm = () => {
    const result = checkValidateField(drawerformData, rules)
    if (result) {
      const formData = Object.assign({}, drawerformData)
      formData.userAvatar = picList.length > 0 ? picList[0].response.data[0].serviceFileName : ''
      dispatch('confirm', formData)
    }
  }
</script>
<BeDrawer title={type === 'add' ? '新增用户' : '用户信息修改'} bind:visible={visible} size="700px">
  <div class="be-drawer-container flex h-full">
    <div class="flex-1" style="overflow: auto;">
      <form class="be-form">
        <div class="be-form-item be-form--inline" data-prop="userNick">
          <div class="be-form-item__label"><span class="required-box">*</span>用户名（昵称）：</div>
          <div class="be-form-item__content">
            <BeInput placeholder="请输入" bind:value={drawerformData.userNick} style="width: 445px" />
          </div>
        </div>
        <div class="flex">
          <div class="be-form-item be-form--inline" data-prop="loginName">
            <div class="be-form-item__label"><span class="required-box">*</span>用户账号：</div>
            <div class="be-form-item__content">
              <BeInput placeholder="支持数字或字母6-8位字符" bind:value={drawerformData.loginName} style="width: 150px" />
            </div>
          </div>
          <div class="be-form-item be-form--inline" data-prop="userTelephone">
            <div class="be-form-item__label" style="width: 126px">手机号码：</div>
            <div class="be-form-item__content">
              <BeInput placeholder="请输入" bind:value={drawerformData.userTelephone} style="width: 150px" />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="be-form-item be-form--inline">
            <div class="be-form-item__label">部门单位：</div>
            <div class="be-form-item__content">
              <BeInput placeholder="请输入" bind:value={drawerformData.departmentUnit} style="width: 150px" />
            </div>
          </div>
          <div class="be-form-item be-form--inline" data-prop="departmentTelephone">
            <div class="be-form-item__label" style="width: 126px">单位电话：</div>
            <div class="be-form-item__content">
              <BeInput placeholder="请输入区号-8位座机号码" bind:value={drawerformData.departmentTelephone} style="width: 150px" />
            </div>
          </div>
        </div>
        <div class="be-form-item be-form--inline">
          <div class="be-form-item__label">电子邮箱：</div>
          <div class="be-form-item__content">
            <BeInput placeholder="请输入" bind:value={drawerformData.emailAddress} style="width: 445px" />
          </div>
        </div>
        <div class="be-form-item be-form--inline" data-prop="areaId">
          <div class="be-form-item__label"><span class="required-box">*</span>所在地区：</div>
          <div class="be-form-item__content">
            <BeCascader
              bind:value={drawerformData.areaId}
              config={{value: 'areaId', label: 'areaName', children: 'children'}}
              lazy={true} bind:options={areaList}
              lazyLoad={lazyLoad}
              clearable={false}
              checkStrictly={true}
              style="width: 445px"
              on:change={handleCascaderChange}
            />
          </div>
        </div>
        <div class="be-form-item be-form--inline" data-prop="userPwd">
          <div class="be-form-item__label"><span class="required-box">*</span>默认密码：</div>
          <div class="be-form-item__content">
            <BeRadioGroup bind:checked={passwardType} on:change={handlePawwordTypeChange}>
              <BeRadio label='0'>默认密码：123456</BeRadio>
              <BeRadio label='1'>
                {#if passwardType === '0'}
                  <BeInput value="" placeholder="自定义密码： 6-8位数字或字母组合" readonly />
                {:else}
                  <BeInput type="password" placeholder="自定义密码： 6-8位数字或字母组合" bind:value={drawerformData.userPwd}  />
                {/if}
              </BeRadio>
            </BeRadioGroup>
          </div>
        </div>
        <div class="be-form-item be-form--inline" data-prop="isAlone">
          <div class="be-form-item__label"><span class="required-box">*</span>是否允许多人在线：</div>
          <div class="be-form-item__content">
            <BeRadioGroup bind:checked={drawerformData.isAlone}>
              <BeRadio label='1'>是</BeRadio>
              <BeRadio label='0'>否</BeRadio>
            </BeRadioGroup>
          </div>
        </div>
        <div class="be-form-item be-form--inline" data-prop="getStartTime">
          <div class="be-form-item__label"><span class="required-box">*</span>账号失效时间：</div>
          <div class="be-form-item__content">
            <BeRadioGroup bind:checked={expirationType} on:change={handleExpirationTypeChange} style="display: flex; align-items: center;">
              <BeRadio label='0'>永久</BeRadio>
              <BeRadio label='1' style="display: flex; align-items: center;">
                <BeDatePicker bind:value={expiration} placeholder='选择日期时间' selectMode="daterange" style="width: 150px" on:change={handleExpirationChange} />
              </BeRadio>
            </BeRadioGroup>
          </div>
        </div>
        <div class="be-form-item be-form--inline">
          <div class="be-form-item__label">上传头像：</div>
          <div class="be-form-item__content">
            <Uploader
              fileList={picList}
              accept=".jpg,.jpeg,.png"
              beforeImgUpload={beforeImgUpload}
              onExceed={onExceed}
              hideUpload={true}
              limit={1}
              tip=""
            />
          </div>
        </div>
        <div class="be-form-item be-form--inline">
          <div class="be-form-item__label" style="width: 90px">选择角色：</div>
          <div class="be-form-item__content">
            <BeInput placeholder="请输入角色名称" bind:value={filterRoleName} style="width: 445px" on:input={handleSearchRole} />
          </div>
        </div>
        <BeTable
          bind:this={roleToggleRowTable}
          label='roleId'
          data={filterRoleList}
          height="192px"
          on:handleSelectionChangeGetId={handleRoleListChangeGetId}
          placeholder="--"
          placeholderRegex={placeholderRegexHandle}
        >
          <BeTableColumn prop='selection' width="55" align="center" />
          <BeTableColumn prop="roleName" label="用户角色" align="center" />
          <BeTableColumn prop="roleDescription" label="角色说明" align="center" />
        </BeTable>
      </form>
    </div>
    <div class="be-drawer__footer">
      <BeButton type="default" on:click={() => visible = false}>取 消</BeButton>
      <BeButton type="primary" on:click={handleConfirm}>确 定</BeButton>
    </div>
  </div>
</BeDrawer>
<style lang="scss">
  .be-drawer-container {
    flex-direction: column;
    .be-drawer__footer {
      height: 56px;
      line-height: 56px;
      text-align: right;
    }
  }
  .be-form-item__label {
    width: 170px;
    .required-box {display: inline-block;width: 15px;color: #E34D59;text-align: center;}
  }
</style>
