<script>
  import { BeDrawer, BeInput, BeButton, BeTable, BeTableColumn } from '@brewer/beerui' 
  import { fetchUserList, updateRoleUser, fetchRoleUserById } from '$api/role'
  import { createEventDispatcher } from 'svelte';
  import { placeholderRegexHandle } from "$utils/index.js";
  const dispatch = createEventDispatcher()
  export let visible = false
  export let forms = {
    roleName: '',
  }
  let userTable
  let userName
  let userData = []
  let selectUserIds = []
  $: if(visible) {
    getRoleUserById()
  }
  // 弹窗用户列表搜索
  const searchUserList = (e) => {
    if(e.keyCode !== 13) return
    getUserList()
  }
  // 获取用户列表
  const getUserList = () => {
    fetchUserList({
      loginName: userName,
      pageSize: 100
    }).then(res => {
      userData = res.list
      setTimeout(() => {
        userTable.toggleRowSelection(selectUserIds, true)
      }, 100);
    })
  }
  // 获取角色对应用户,回显
  const getRoleUserById = () => {
    fetchRoleUserById({roleId: forms.roleId}).then(res => {
      forms.userIds = res
      selectUserIds = res
      getUserList()
    })
  }
  // 修改角色用户
  const handleUpdateUser = () => {
    updateRoleUser({
      id: forms.roleId,
      ids: forms.userIds
    }).then(res => {
      visible = false
      dispatch('refresh')
    })
  }
  // 新增弹窗-获取选中的用户ids
  const handleSelectionChangeGetId = ({ detail }) => forms.userIds = detail
</script>

<BeDrawer
	bind:visible={visible}
  beforeClose={() => { userTable.clearSelection();return true }}
  width="30%"
	direction='rtl'
  title="角色用户管理"
>
<div class="tip">用户加入到角色后，将拥有该角色的所有权限！</div>
<div class="form-content">
  <form class="be-form">
    <div class="be-form-item be-form--inline">
      <div class="be-form-item__label"><span class="required-box">*</span>角色名称：</div>
      <div class="be-form-item__content">
        <BeInput placeholder="请输入唯一的角色名称" bind:value = {forms.roleName} disabled/>
      </div>
    </div>
    <div class="be-form-item be-form--inline">
      <div class="be-form-item__label"><span class="required-box"></span>选择用户：</div>
      <div class="be-form-item__content">
        <BeInput placeholder="请输入用户账号" bind:value={userName} class="cursor-pointer" on:keydown={searchUserList}/>
      </div>
        <BeTable label='userId' bind:this={userTable} data={userData} style="margin-top:20px" height='192px' on:handleSelectionChangeGetId={handleSelectionChangeGetId} placeholder="--" placeholderRegex={placeholderRegexHandle}>
          <BeTableColumn prop='selection' width="55" />
          <BeTableColumn prop="loginName" label="用户账号" />
          <BeTableColumn prop="userNick" label="用户名称" />
        </BeTable>
    </div>
  </form>
  <div style="height:30px"></div>
  <div class="footer">
    <BeButton type="default" on:click={() => {visible = false}}>取消</BeButton>
    <BeButton on:click={handleUpdateUser}>确认</BeButton>
  </div>
</div>
</BeDrawer>
<style lang="scss">
  .tip {
    border-width: 0px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: inherit;
    background-color: rgba(24, 144, 255, 0.211764705882353);
    border: none;
    border-radius: 5px;
    padding-left: 20px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-size: 14px;
    color: #02A7F0;
    text-align: left;
    margin-bottom: 20px;
  }
  .footer {
    position: absolute;
    bottom:0;
    left: 0;
    right: 0;
    z-index: 1;
    // height: 50px;
    padding: 10px 20px;
    text-align: right;
    background-color: #fff;
    box-shadow: 0 -2px 3px -1px rgba($color: #000000, $alpha: 0.2);
  }
</style>