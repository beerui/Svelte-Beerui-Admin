<script>
	import TableTreeData from './tableTreeData.svelte';
  import { BeCheckbox } from "@brewer/beerui";
export let header = []
export let data = []
export let selection = true
export let lazy = false
export let lazyLoad

const selectionChange = (e) => {
  console.log(e);
}
// const handlerAdd = (e) => {
//   console.log(e);
//   // dispatch("handlerAdd", data)
// } 
// const handlerEdit = (e) => {
//   console.log(e);
//   // dispatch("handlerEdit", data)
// } 
// const handlerDelete = (e) => {
//   console.log(e);
//   // dispatch("handlerDelete", data)
// } 
</script>

<div class="table-tree">
  <div class="table-header">
    {#if selection}
    <div style="width:55px">
      <!-- <BeCheckbox {checked} ></BeCheckbox> -->
    </div>
    {/if}
    {#each header as item}
    <div class="header-cell">{item.label}</div>
    {/each}
  </div>
  <div class="table-content">
    <TableTreeData {header} data = {data} {lazy} {lazyLoad} {selection} on:select={ selectionChange }>
      <div slot="tableSlot1" let:prop={row}><slot name="tableSlot1" prop={row}></slot></div> 
      <div slot="tableSlot2" let:prop={row}><slot name="tableSlot2" prop={row}></slot></div>
      <div slot="tableSlot3" let:prop={row}><slot name="tableSlot3" prop={row}></slot></div>
    </TableTreeData>
  </div>
</div>

<style>
  .table-header {
    display: flex;
    width: 100%;
    background: #F9F9F9;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    min-width: 0;
    padding: 12px 10px;
    position: relative;
    text-overflow: ellipsis;
    transition: background-color .25s ease;
    vertical-align: middle;
    color: #666666;
    font-weight: bold;
    font-size: 14px;
  }
  .table-content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .header-cell {
    flex: 1;
    
  }
</style>