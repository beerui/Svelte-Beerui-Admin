<script>
 import { BeDrawer, BeInput, BeTree, BeButton, BeTable, BeTableColumn, showNotice } from '@brewer/beerui' 
 import { checkValidateField, placeholderRegexHandle } from "$utils/index.js";
 import { fetchMenuTreeList, createRole, updateRole, fetchUserList, fetchRoleMenuById, fetchRoleUserById } from '$api/role'
  import { createEventDispatcher } from 'svelte';
 export let visible = false
 export let status = 'add'
 const dispatch = createEventDispatcher()
 $: if(visible && status == 'edit') {
  getRoleMenuById()
  getRoleUserById()
 }
 export let forms = {
   roleId: '',
   roleName: '',
   roleDescription: '',
   menuIds: [],
   userIds: []
 }
 let userTable
 let menuTreeDom
 let userName = ''
 let menuTree = []
 let userData = []
 const rules = {
  roleName: { required: true, message: '请输入角色名称'},
  roleDescription: { required: true, message: '请输入角色说明'}
}
let roleFilterText = ''
// 获取菜单树
fetchMenuTreeList().then(res => {
  menuTree = res
})
// 获取用户列表
const getUserList = () => {
  fetchUserList({
    loginName: userName,
    pageSize: 100
  }).then(res => {
    userData = res.list
  })
}
getUserList()
// 新增/编辑角色
const addRole = () => {
  const result = checkValidateField(forms, rules)
  if(!result) return
  forms.menuIds = menuTreeDom.getCheckedKeys()
  if(status == 'add') {
    createRole(forms).then(res => {
      showNotice({ 
        toast: true,
        message: '新增成功',
        duration: 3000,
        type: 'success'
      })
      dispatch('refresh')
    })
  }
  if(status == 'edit') {
    updateRole(forms).then(res => {
      showNotice({
        toast: true,
        message: '修改成功',
        duration: 3000,
        type: 'success'
      })
      dispatch('refresh')
    })
  }
  visible = false
}
  // 弹窗用户列表搜索
const searchUserList = (e) => {
  if(e.keyCode !== 13) return
  getUserList()
}
// 获取角色对应菜单,回显
const getRoleMenuById = () => {
  fetchRoleMenuById({roleId: forms.roleId}).then(res => {
    forms.menuIds = res
    menuTreeDom.setCheckedKeys(res)
  })
}
// 获取角色对应用户,回显
const getRoleUserById = () => {
  fetchRoleUserById({roleId: forms.roleId}).then(res => {
    forms.userIds = res
    userTable.toggleRowSelection(res, true)
  })
}
// 新增弹窗-获取选中的用户ids
const handleSelectionChangeGetId = ({ detail }) => forms.userIds = detail
const filterText = () => {
  menuTreeDom.filter(roleFilterText)
}
const filterNodeMethod = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}
</script>
<BeDrawer
	bind:visible={visible}
  beforeClose={() => { userTable.clearSelection();return true }}
  width="30%"
	direction='rtl'
  title={status == 'add' ? '新增角色' : '修改角色'}
>
<div class="form-content">
  <form class="be-form">
    <div class="be-form-item be-form--inline" data-prop='roleName'>
      <div class="be-form-item__label"><span class="required-box">*</span>角色名称：</div>
      <div class="be-form-item__content">
        <BeInput placeholder="请输入唯一的角色名称" bind:value = {forms.roleName} maxlength=30/>
      </div>
    </div>
    <div class="be-form-item be-form--inline" data-prop='roleDescription'>
      <div class="be-form-item__label"><span class="required-box">*</span>角色说明：</div>
      <div class="be-form-item__content">
        <textarea name="" id="" placeholder="输入角色说明，便于分类管理哦~~" bind:value={forms.roleDescription} rows="4"></textarea>
      </div>
    </div>
    <div class="be-form-item be-form--inline">
      <div class="be-form-item__label"><span class="required-box"></span>选择权限：</div>
      <div class="be-form-item__content">
        <BeInput placeholder="请输入权限名称" bind:value={roleFilterText} class="cursor-pointer" on:input={filterText}/>
        <BeTree bind:this={menuTreeDom} data={menuTree} showCheckbox nodeKey="id" filterNodeMethod={filterNodeMethod}/>
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
    <BeButton type="default" on:click={() => visible = false}>取消</BeButton>
    <BeButton on:click={addRole}>确认</BeButton>
  </div>
</div>
</BeDrawer>

<style lang="scss">
  .form-content {width: 100%;
    .required-box {display: inline-block;width: 15px;color: #E34D59;text-align: center;}
    .be-form-item__content {
      textarea {
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        outline: none;
        width: 100%;
        padding: 0 15px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      }
    }
  }
    /* 推荐 */
  textarea::-webkit-input-placeholder{
    color: rgba(0,0,0,.4);
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