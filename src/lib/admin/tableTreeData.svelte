<script>
import { BeCheckbox, BeIcon } from "@brewer/beerui";
import { createEventDispatcher } from "svelte";
export let header = []
export let data = []
export let selection = true
export let level = 0
export let checkList = []
export let lazy = false
export let lazyLoad
const dispatch = createEventDispatcher()
let width = '0%'
let checked = false
width = (100 / header.length) + '%'
const show = (index) => {
  const list = data[index].children
  if(!lazy) {
    if(!list || list.length < 0) return
    data[index].showChildren = !!!data[index].showChildren
    if(!data[index].showChildren) setChildren(list)
    data = data
  } else {
    const item = data[index]
    if(item.children && item.children.length > 0) {
      data[index].showChildren = !!!data[index].showChildren
      setChildren(item.children)
      data = data
    } else {
      lazyLoad(item).then(res => {
        data[index].showChildren = !!!data[index].showChildren
        data[index].children = res
        setChildren(data[index].children)
        data = data
      })
    }
  }
}
const setChildren = (list) => {
  list.forEach(item => {
    item.showChildren = false
    if(item.children && item.children.length > 0) {
      setChildren(item.children)
    }
  })
}
const change = (index) => {
  data[index].checked = !!!data[index].checked
  data = data
  getCheckedList(data[index])
  dispatch("select", checkList)
}
const getCheckedList = (data) => {
  const checkedItem = JSON.parse(JSON.stringify(data))
  delete checkedItem.children
  delete checkedItem.showChildren
  delete checkedItem.checked
  let isAdd = true
  checkList.forEach((item, index) => {
    if(Object.entries(checkedItem).toString() === Object.entries(item).toString()) {
      checkList.splice(index, 1)
      isAdd = false
    }
  })
  if(isAdd) checkList.push(checkedItem)
}
// const handlerAdd = (data) => {
//   dispatch("handlerAdd", data)
// } 
// const handlerEdit = (data) => {
//   dispatch("handlerEdit", data)
// } 
// const handlerDelete = (data) => {
//   dispatch("handlerDelete", data)
// } 
</script>
{#if data.length > 0}
  {#each data as row, i}
    <div class="table-column">
      {#each header as h, index}
        <!-- {#if h.prop == 'OPERATION'}
        <div class="cell">
          {#if h.list.includes('add')}
          <div class="cursor-pointer m-view" on:click={() => handlerAdd(row)}>新增</div>
          {/if}
          {#if h.list.includes('edit')}
          <div class="cursor-pointer m-view" on:click={() => handlerEdit(row)}>修改</div>
          {/if}
          {#if h.list.includes('delete')}
          <div class="cursor-pointer m-view" on:click={() => handlerDelete(row)}>删除</div>
          {/if}
        </div> -->
        {#if h.prop === 'tableSlot1'}
          <div class="cell" style="width:{width}"><slot name="tableSlot1" prop={row}></slot></div>
        {:else if h.prop === 'tableSlot2'}
          <div class="cell" style="width:{width}"><slot name="tableSlot2" prop={row}></slot></div>
        {:else if h.prop === 'tableSlot3'}
          <div class="cell" style="width:{width}"><slot name="tableSlot3" prop={row}></slot></div>
        {:else}
          {#if index == 0}
            <div class="cell" style="width:{width}">
              <div style={"padding-left: "+ (16 * level) + "px"}></div>
              {#if selection}
              <div>
                <BeCheckbox {checked} on:change={() => change(index)}></BeCheckbox>
              </div>
              {/if}
              {#if (row.children && row.children.length > 0) || row.hasChild}
              <div class="icon" class:rotate = {row.showChildren} on:click={ () => { show(i)} }>
                <BeIcon name="chevron-right" />
              </div>
              {:else}
              <div style="width:16px"></div>
              {/if}
              {row[h.prop]}
            </div>
          {:else}
            <div class="cell" style="width:{width}">{row[h.prop]}</div>
          {/if}
        {/if}
      {/each}
    </div>
    {#if row.showChildren}
     <svelte:self data={row.children} {header} {selection} {checkList} {lazy} {lazyLoad} level = {++level} on:select={ dispatch("select", checkList) }>
      <div slot="tableSlot1" let:prop={row}><slot name="tableSlot1" prop={row}></slot></div> 
      <div slot="tableSlot2" let:prop={row}><slot name="tableSlot2" prop={row}></slot></div>
      <div slot="tableSlot3" let:prop={row}><slot name="tableSlot3" prop={row}></slot></div>
    </svelte:self>
    {/if}
  {/each}
{/if}

<style>
  .table-column {
    display: flex;
    width: 100%;
    color: #666666;
    font-size: 14px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    min-width: 0;
    padding: 12px 10px;
    position: relative;
    text-overflow: ellipsis;
    vertical-align: middle;
    align-items: center;
  }
  .cell {
    display: flex;
    align-items: center;
  }
  .icon {
    padding: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: all .3s;
  }
  .rotate {
    transform: rotate(90deg);
  }
  .m-view {
    margin-right: 10px;
  }
</style>