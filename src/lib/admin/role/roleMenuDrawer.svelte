<script>
  import { BeDrawer, BeInput, BeButton, BeTree } from '@brewer/beerui' 
  import { fetchMenuTreeList, updateRoleMenu, fetchRoleMenuById } from '$api/role'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()
  export let visible = false
  export let forms = {
    roleName: '',
  }
  let roleFilterText = ''
  let menuTreeDom
  let menuTree = []

  $: if(visible) {
    getRoleMenuById()
  }
  // 获取菜单树
  const getMenu = () => {
    fetchMenuTreeList().then(res => {
      menuTree = res
    })
  }
  getMenu()
  // 修改角色权限
  const handleUpdateRole = () => {
    updateRoleMenu({
      id: forms.roleId,
      ids: menuTreeDom.getCheckedKeys()
    }).then(res => {
      visible = false
      dispatch('refresh')
    })
  }
  // 获取角色对应菜单,回显
  const getRoleMenuById = () => {
    fetchRoleMenuById({roleId: forms.roleId}).then(res => {
      menuTreeDom.setCheckedKeys(res)
    })
  }
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
  width="30%"
	direction='rtl'
  title="角色权限管理"
>
<div class="permisson-tip">该角色分配权限后，将拥有这些权限功能！</div>
<div class="form-content">
  <form class="be-form">
    <div class="be-form-item be-form--inline" data-prop='name'>
      <div class="be-form-item__label"><span class="required-box">*</span>角色名称：</div>
      <div class="be-form-item__content">
        <BeInput placeholder="请输入唯一的角色名称" bind:value = {forms.roleName} disabled/>
      </div>
    </div>
    <div class="be-form-item be-form--inline">
      <div class="be-form-item__label"><span class="required-box"></span>选择权限：</div>
      <div class="be-form-item__content">
        <BeInput placeholder="请输入权限名称" bind:value={roleFilterText} class="cursor-pointer" on:input={filterText}/>
        <BeTree bind:this={menuTreeDom} data={menuTree} showCheckbox nodeKey="id" filterNodeMethod={filterNodeMethod}/>
      </div>
    </div>
  </form>
  <div style="height:30px"></div>
  <div class="footer">
    <BeButton type="default" on:click={() => { visible = false }}>取消</BeButton>
    <BeButton on:click={handleUpdateRole}>确认</BeButton>
  </div>
</div>
</BeDrawer>

<style lang="scss">
  .permisson-tip {
    border-width: 0px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: inherit;
    background-color: rgba(245, 154, 35, 0.211764705882353);
    border: none;
    border-radius: 5px;
    padding-left: 20px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-size: 14px;
    color: #B8741A;
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