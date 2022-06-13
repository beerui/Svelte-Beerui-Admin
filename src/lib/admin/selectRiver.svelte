<script>
  import { onMount, createEventDispatcher } from "svelte"
  import {
    BeDialog,
    BeInput,
    BeButton,
    BeTable,
    BeTableColumn,
    BePagination,
  } from "@brewer/beerui";
  import { relate_river_list } from '../../api/river.js'
  import { placeholderRegexHandle } from "$utils/index.js";

  export let visible = false

  let dispatch = createEventDispatcher()
  let tableData = []
  let total = 0
  let forms = {
    waterNameAndAliasName: '',
    pageNum: 1,
    pageSize: 10
  }
  let pageOptions = {
      card: true,
      scroll: true,
      showNumber: 6,
      icon: {} // 上一页 下一页的大小和颜色
  }

  const getList = () => {
    relate_river_list(forms).then(res => {
      tableData = res.list || []
      total = res.total || 0
    })
  }

  const indexMethod = (index) => {
    const curpage = forms.pageNum
    const limitpage = forms.pageSize
    return (index + 1) + (curpage - 1) * limitpage
  }

  const handleSearch = () => {
    forms.pageNum = 1
    getList()
  }

  const changePage = (evt) => {
    forms.pageNum = Number(evt.detail)
    getList()
  }

  const pageSizeChange = ({ detail }) => {
    forms.pageSize = detail
    forms.pageNum = 1
    getList()
  }

  const handleView = (row) =>{
    const obj = {
      waterId: row.waterId,
      waterName: row.waterName,
      areaId: row.areaId
    }
    dispatch('selectRiver', obj)
    visible = false
  }


  onMount(() => {
    getList()
  })
  

</script>
<BeDialog title="选择河湖" bind:visible={visible} closeOnClickModal={false}>
  <div class="page-list">
    <form class="be-form">
      <div class="be-form-item be-form--inline">
        <div class="be-form-item__content">
          <BeInput placeholder="河道名称/河道别名" bind:value={forms.waterNameAndAliasName} />
        </div>
        <div class="be-form-item__content">
          <BeButton on:click={handleSearch}>搜索</BeButton>
        </div>
      </div>
    </form>
    <BeTable
      data={tableData}
      indexMethod={indexMethod}
      placeholder="--"
      height="300px"
      placeholderRegex={placeholderRegexHandle}
    >
      <BeTableColumn type="index" prop="index" label="序号" width="55" />
      <BeTableColumn prop="waterName" label="河道名称" />
      <BeTableColumn prop="aliasName" label="河道别名" />
      <BeTableColumn prop="waterBasin" label="所在流域" />
      <BeTableColumn prop="tableSlot" name='tableSlot1' label="操作" />
      <div slot="tableSlot1" let:prop={row}>
        <span class="cursor-pointer m-view" on:click={() => handleView(row)}>选择</span>
      </div>
    </BeTable>
    <div class="page-list-footer">
      <BePagination
        card
        currentPage={forms.pageNum}
        pageSize={forms.pageSize}
        {total}
        async
        layouts="prev, pager, next, sizes, jumper, info"
        on:changePage={changePage}
        on:pageSizeChange={pageSizeChange}
        options={pageOptions}
      />
    </div>
  </div>
  <div slot="footer">
    <span class='be-dialog-footer'> </span>
  </div>
</BeDialog>
