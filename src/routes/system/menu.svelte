<script>
import { BeForm, BeFormItem, BeInput, BeButton, BeDrawer, BeSelectTree, BeRadioGroup, BeRadio, loading, showNotice, messageBox } from '@brewer/beerui';
import TableTree from '$lib/admin/tableTree.svelte';
import { fetchMenuList, createMenu, updateMenu, deleteMenu } from '$api/common'
let form = {
  title: ''
}
let ruleFormDom = ''
let drawerType = 'add'
let load = false
let drawerVisible = false
let defaultProps = { children: 'children', label: 'title' }
let drawerformData = {
  parentId: [],
  type:'1',
  redirect:'0',
  hidden:'0',
  title:'',
  key:'',
  path:'',
  sort: ''
}
const tableTreeHeader = [
      {   
        prop:'title',
        label: '菜单名称'
      },
      {
        prop:'tableSlot1',
        label: '是否隐藏'
      },
      {
        prop:'icon',
        label: '菜单图标'
      },
      {
        prop:'tableSlot2',
        label: '操作'
      }
]
const rules = {
  title: [
		{ required: true, message: '请输入菜单名称', trigger: 'blur' }
	],
  key: [
		{ required: true, message: '请输入权限标识', trigger: 'blur' }
	],
  path: [
		{ required: true, message: '请输入路由地址', trigger: 'blur' }
	]
}
let tableTreeData = []

const getList = () => {
  load = true
  fetchMenuList(form).then(res => {
    tableTreeData = res
    load = false
  })
}
getList()
const handlerEdit = () => {
  updateMenu(drawerformData).then(res => {
    drawerVisible = false
  })
}
const handlerAdd = () => {
  createMenu(drawerformData).then(res => {
    drawerVisible = false
  })
};
const handlerDelete = (row) => {
  messageBox({
    message: '是否确认删除？',
    confirm: () => {
      deleteMenu({id: row.id}).then(res => {
        showNotice({message: '操作成功', toast: true, type: 'success'})
      })
    }
  })
}
const openDrawer = (row, type) => {
  drawerType = type
  initData()
  drawerVisible = true
  if(drawerType === 'add') drawerformData.parentId = [row.id]
  if(drawerType === 'edit') {
    drawerformData = row
    drawerformData.redirect = row.redirect ? '1' : '0'
    drawerformData.hidden = row.hidden ? '1' : '0'
  }
}
const handleConfirm = () => {
  ruleFormDom.validate((valid) => {
    if (valid) {
      drawerType === 'add' ? handlerAdd() : handlerEdit()
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
const initData = () => {
  drawerformData = {
    parentId: [],
    type:'1',
    redirect:'0',
    hidden:'0',
    title:'',
    key:'',
    path:'',
    sort: ''
  }
}
</script>

<div class="page-list">
  <div class="page-list-header">
    <BeForm bind:model={form} inline labelWidth="80px">
      <BeFormItem label='菜单名称'>
        <BeInput bind:value={form.title} />
      </BeFormItem>
      <BeFormItem>
        <BeButton type='primary' on:click={ getList }>搜索</BeButton>
        <BeButton>重置</BeButton>
      </BeFormItem>
    </BeForm>
  </div>
  <div class="page-list-content" use:loading="{load}">
    <div class="page-list-content__function">
      <BeButton on:click={() => {drawerVisible = true; initData()}}>新增</BeButton>
    </div>
    <TableTree header = { tableTreeHeader } data = { tableTreeData } selection = {false}>
      <div slot="tableSlot1" class="flex" let:prop={row}>
        <span>{row.hidden ? '是' : '否'}</span>
      </div>
      <div slot="tableSlot2" class="flex" let:prop={row}>
        <div class="cursor-pointer m-view" on:click={() => openDrawer(row, 'add')}>新增</div>
        <div class="cursor-pointer m-view" on:click={() => openDrawer(row, 'edit')}>修改</div>
        <div class="cursor-pointer m-view" on:click={() => handlerDelete(row)}>删除</div>
      </div>
    </TableTree>
  </div>
  <BeDrawer 
  title={drawerType === 'add' ? '新增菜单' : '编辑菜单'} 
  bind:visible={drawerVisible} 
  size="580px" 
  isShowClose={true}
>
  <div class="be-drawer-container flex h-full">
    <BeForm bind:model={drawerformData} {rules} bind:this={ruleFormDom} labelWidth="120px">
      <BeFormItem label='上级菜单：'>
        <BeSelectTree bind:data={tableTreeData} defaultProps={defaultProps} bind:value={drawerformData.parentId} nodeKey='id' />
      </BeFormItem>
      <BeFormItem label='菜单类型：'>
        <BeRadioGroup bind:checked={drawerformData.type}>
          <BeRadio label='1'>目录</BeRadio>
          <BeRadio label='2'>页面</BeRadio>
          <BeRadio label='3'>按钮</BeRadio>
        </BeRadioGroup>
      </BeFormItem>
      <BeFormItem label='重定向：'>
        <BeRadioGroup bind:checked={drawerformData.redirect}>
          <BeRadio label='1'>是</BeRadio>
          <BeRadio label='0'>否</BeRadio>
        </BeRadioGroup>
      </BeFormItem>
      <BeFormItem label='是否隐藏：'>
        <BeRadioGroup bind:checked={drawerformData.hidden}>
          <BeRadio label='1'>是</BeRadio>
          <BeRadio label='0'>否</BeRadio>
        </BeRadioGroup>
      </BeFormItem>
      <BeFormItem label='菜单名称：' prop='title'>
        <BeInput placeholder="eg:系统管理" bind:value={drawerformData.title}  />
      </BeFormItem>
      <BeFormItem label='权限标识：' prop='key'>
        <BeInput placeholder="路由的name" bind:value={drawerformData.key}  />
      </BeFormItem>
      <BeFormItem label='路由地址：' prop='path'>
        <BeInput placeholder="请输入路由地址（path）" bind:value={drawerformData.path}  />
      </BeFormItem>
      <!-- <BeFormItem label='排序：'>
        <BeInput placeholder="菜单展示顺序" bind:value={drawerformData.sort}  />
      </BeFormItem> -->
      <BeFormItem style="text-align: right;">
        <BeButton type="default" on:click={() => drawerVisible = false}>取 消</BeButton>
        <BeButton type="primary" on:click={handleConfirm}>确 定</BeButton>
      </BeFormItem>
    </BeForm>
  </div>
</BeDrawer>
</div>