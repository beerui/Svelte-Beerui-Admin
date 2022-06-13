<script>
  import { tick, createEventDispatcher } from "svelte"
  import {
    BeDrawer,
    BeInput,
    BeTree,
    BeButton,
    showNotice
  } from '@brewer/beerui'
  import {
    alreadyBind,
    updateBind
  } from '$api/user'
  import { fetchMenuTreeList } from '$api/role'
  import { debounce } from '$utils'

  export let visible = false
  export let title = '添加权限'
  export let permissionForms = {
    id: '',
    account: '',
    ids: []
  }

  let dispatch = createEventDispatcher()
  
  let permissionTree = null
  let permissionList = []
  let bindPermissionList = [] // 绑定的菜单权限

  $: {
    if (visible) {
      getBindPermissionList(permissionForms.id)
    }
  }

  // 获取绑定的菜单权限
  const getBindPermissionList = (userId) => {
    const params = {
      userId: userId
    }
    alreadyBind(params).then(res => {
      bindPermissionList = res
      getPermissionMenu()
    })
  }

  // 获取菜单权限列表
  const getPermissionMenu = () => {
    fetchMenuTreeList().then(res => {
      permissionList = res
    })
  }

  // 搜索权限
  const handleSearchPermission = debounce((val) => {
    permissionTree.filter(val.detail)
  }, 300)

  const filterPermissionMethod = (value, data) => {
    if (!value) return true;
	  return data.label.indexOf(value) !== -1;
  }

  // 提交菜单权限
  const handleConfirm = () => {
    permissionForms.ids = permissionTree.getCheckedKeys()
    // if (!permissionForms.ids.length) {
    //   showNotice({ message: '请选择权限', toast: true, type: 'warning' })
    //   return
    // }
    updateBind(permissionForms).then(res => {
      visible = false
      showNotice({message: '操作成功', toast: true, type: 'success'})
      dispatch('updateSuccess')
    })
  }

</script>
<BeDrawer title={title} bind:visible={visible} size="580px">
  <div class="be-drawer-container h-full flex">
    <div class="be-alert permission">用户加入到角色后，将拥有该角色的所有权限！</div>
    <div class="flex-1" style="overflow: auto;">
      <form class="be-form">
        <div class="be-form-item be-form--inline">
          <div class="be-form-item__label" style="width: 90px">用户账号：</div>
          <div class="be-form-item__content">
            <BeInput placeholder="用户账号" bind:value={permissionForms.account} readonly style="width: 445px" />
          </div>
        </div>
        <div class="be-form-item be-form--inline">
          <div class="be-form-item__label" style="width: 90px">选择权限：</div>
          <div class="be-form-item__content">
            <BeInput placeholder="请输入权限名称" style="width: 445px" on:input={handleSearchPermission} />
          </div>
        </div>
      </form>
      {#key permissionList}
        <BeTree
          bind:this={permissionTree}
          data={permissionList}
          showCheckbox
          nodeKey="id"
          highlightCurrent
          defaultCheckedKeys={bindPermissionList}
          filterNodeMethod={filterPermissionMethod}
        />
      {/key}
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
  }
  .be-alert {
    height: 40px;
    font-size: 14px;
    border-radius: 4px;
    margin-bottom: 10px;
    padding-left: 30px;
  }
  .permission {
    background: rgba(245, 154, 35, 0.2);
    color: #B8741A;
  }
  .be-drawer__footer {
    text-align: right;
  }
</style>