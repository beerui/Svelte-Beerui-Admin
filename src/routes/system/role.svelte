<script>
  import { BeForm, BeFormItem, BeInput, BeTable, BeTableColumn, BePagination, BeSwitch, BeSelect, BeOption, BeButton, BeDrawer, BeTree, loading, showNotice, messageBox } from '@brewer/beerui';
  import { fetchMenuList, fetchRoleList, createMenu, updateMenu, deleteMenu } from '$api/common'
  let search = {
    name: '',
    enable: '',
    pageSize: 10,
    pageNum: 1
  }
  let total = 0
  let menuTreeDom = null
  let roleFilterText = ''
  let menuTree = []
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
  const options = [
    {
      value: '1',
      label: '启用',
    },
    {
      value: '0',
      label: '停用',
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
  // 当前展示列表
  let list = []
  // 选中的角色id
  let roleIds = []
  const getList = () => {
    load = true
    fetchRoleList(search).then(res => {
      list = res.list
      total = res.total
      load = false
    })
  }
  getList()
  fetchMenuList({title: ''}).then(res => {
    menuTree = res
  })
  const beforeSwitchChange = (row) => {

  }
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
  const handleDelete = (row) => {
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
    console.log(menuTreeDom.getCheckedKeys());
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
   // 获取角色列表选中的角色id
   const handleGetRoleId = (e) => {
    roleIds = e.detail
  }
  // 列表序号
  const indexMethod = (index) => {
    const curpage = search.pageNum
    const limitpage = search.pageSize
    return (index + 1) + (curpage - 1) * limitpage
  }
    // 分页切换
  const changePage = (evt) => {
    search.pageNum = evt.detail
    getList()
  };
  const pageSizeChange = ({ detail }) => {
    search.pageSize = detail
    getList()
  }
  // tree 过滤方法
  const filterText = () => {
    menuTreeDom.filter(roleFilterText)
  }
  const filterNodeMethod = (value, data) => {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }
  </script>
  
  <div class="page-list">
    <div class="page-list-header">
      <BeForm bind:model={search} inline labelWidth="80px">
        <BeFormItem label='角色名称'>
          <BeInput bind:value={search.name} placeholder="角色名称"/>
        </BeFormItem>
        <BeFormItem label='角色状态'>
          <BeSelect placeholder="角色状态" bind:value={search.enable} clearable={true}>
            {#each options as option}
              <BeOption label={option.label} value={option.value}/>
            {/each}
          </BeSelect>
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
      <BeTable label='id' data={list}  indexMethod={indexMethod} on:handleSelectionChangeGetId={handleGetRoleId} placeholder="--" placeholderRegex={(v) => !v}>
        <BeTableColumn prop='selection' width="55" />
        <BeTableColumn prop='index' label="序号" width="55" />
        <BeTableColumn prop="name" label="角色名称" />
        <!-- <BeTableColumn prop="address" label="用户账号" /> -->
        <BeTableColumn prop="tableSlot" name='tableSlot2' label="角色状态" />
        <div slot="tableSlot2" let:prop={row}>
          {row.enable === '1' ? '启用' : '停用'} <BeSwitch checked={row.enable === '1'} beforeChange={() => beforeSwitchChange(row)}/>
        </div>
        <BeTableColumn prop="tableSlot" name='tableSlot1' label="操作" width="300"/>
        <div slot="tableSlot1" class="flex" let:prop={row}>
          <div class="cursor-pointer m-view" on:click={() => openDrawer(row)}>权限设置</div>
          <div class="cursor-pointer m-view" on:click={() => openDrawer(row)}>修改</div>
          <div class="cursor-pointer m-view" on:click={() => handleDelete(row)}>删除</div>
        </div>
      </BeTable>
    </div>
    <div class="page-list-footer">
      <BePagination
        card
        currentPage={search.pageNum}
        pageSize={search.pageSize}
        {total}
        async
        layouts="prev, pager, next, sizes, jumper, info"
        on:changePage={changePage}
        on:pageSizeChange={pageSizeChange}
        options={{
          card: true,
          scroll: true,
        }}
      />
    </div>
  </div>
  <BeDrawer 
  title={drawerType === 'add' ? '新增角色' : '编辑角色'} 
  bind:visible={drawerVisible} 
  size="580px" 
  isShowClose={true}
>
  <div class="be-drawer-container flex h-full">
    <BeForm bind:model={drawerformData} {rules} bind:this={ruleFormDom} labelWidth="120px" style="width:100%">
      <BeFormItem label='角色名称：' prop='name'>
        <BeInput placeholder="请输入角色名称" bind:value={drawerformData.name}  />
      </BeFormItem>
      <BeFormItem label='选择权限：' prop='role'>
        <BeInput placeholder="请输入权限名称" bind:value={roleFilterText} class="cursor-pointer" on:input={filterText}/>
        <BeTree bind:this={menuTreeDom} data={menuTree} props={defaultProps} showCheckbox nodeKey="key" filterNodeMethod={filterNodeMethod}/>
      </BeFormItem>
      <BeFormItem style="text-align: right;">
        <BeButton type="default" on:click={() => drawerVisible = false}>取 消</BeButton>
        <BeButton type="primary" on:click={handleConfirm}>确 定</BeButton>
      </BeFormItem>
    </BeForm>
  </div>
</BeDrawer>