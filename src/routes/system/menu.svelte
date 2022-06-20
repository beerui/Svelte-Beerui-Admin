<script>
import { BeForm, BeFormItem, BeInput, BeButton } from '@brewer/beerui';
import TableTree from '$lib/admin/tableTree.svelte';
import { PERMISSION_ROUTER } from '$lib/stores';
import { fetchMenuList } from '$api/common'
let form = {
  title: ''
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
let tableTreeData = []

const getList = () => {
  fetchMenuList(form).then(res => {
    tableTreeData = res
    console.log(tableTreeData);
  })
}
getList()
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
  <div class="page-list-content">
    <div class="page-list-content__function">
      <BeButton>新增</BeButton>
    </div>
    <TableTree header = { tableTreeHeader } data = { tableTreeData } selection = {false}>
      <div slot="tableSlot1" class="flex" let:prop={row}>
        <span>{row.hidden ? '否' : '是'}</span>
      </div>
      <div slot="tableSlot2" class="flex" let:prop={row}>
        <div class="cursor-pointer m-view" on:click={() => handlerEdit(row)}>新增</div>
        <div class="cursor-pointer m-view" on:click={() => handlerEdit(row)}>修改</div>
        <div class="cursor-pointer m-view" on:click={() => handlerEdit(row)}>删除</div>
      </div>
    </TableTree>
  </div>
</div>