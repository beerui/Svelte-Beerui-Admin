<script>
    import { COLLAPSE, MENU, PERMISSION_ROUTER } from "$lib/stores";
    import NavMenu from "$lib/admin/NavMenu.svelte";
    import { BeIcon, BeMenu } from "@brewer/beerui";
    import { goto } from "$app/navigation";

    let menus = []
    let BeMenuDom = null
    // 菜单数据改变重置菜单
    PERMISSION_ROUTER.subscribe(items => menus = items)
    // 点击面包屑 更新菜单状态
    MENU.subscribe(item => BeMenuDom && item.type === 'update' && BeMenuDom.setMenuActive(item.active))

    // 展示隐藏
    const toggleCollapse = () => COLLAPSE.set({ collapse: !$COLLAPSE.collapse })
    // 菜单改变触发
    let menuClickHandle = ({ detail }) => {
        if (detail && detail.type !== 'submenu') {
            goto(detail.path)
            MENU.set({ active: detail.id, type: '' })
        }
    };
</script>

<div class="g-admin-slider"
     class:collapse-open={!$COLLAPSE.collapse}
     class:collapse-close={$COLLAPSE.collapse}
>
  <div class="m-menu-collapse" on:click|stopPropagation={toggleCollapse}>
    {#if $COLLAPSE.collapse}
      <BeIcon color="#666666" width="20" height="20" name="menu-fold"/>
    {:else}
      <BeIcon color="#666666" width="20" height="20" name="menu-unfold"/>
    {/if}
  </div>
  <div class="g-admin-slider-container">
	  {#key menus}
	    <BeMenu bind:this={BeMenuDom} on:click={menuClickHandle} data={menus} bind:active={$MENU.active} mode="vertical" trigger="click" bind:collapse={$COLLAPSE.collapse}>
	      <NavMenu {menus}/>
	    </BeMenu>
	  {/key}
  </div>
</div>

