<script>
	import { page } from '$app/stores';
    import { BeBreadcrumb, BeBreadcrumbItem } from '@brewer/beerui'
    import { MENU, PERMISSION_ROUTER } from '../stores.js';
    import { afterNavigate, goto } from '$app/navigation';

    let curRouterPath = []
    let indexRouter = {}
	
		const genParams = (item) => {
			const params = {
				path: item.path,
				id: item.id,
				name: item.title
			}
			if (item.redirect && item.children && item.children.length > 0) {
				params.path = item.children[0].path
				params.id = item.children[0].id
			}
			return params
		}
    afterNavigate((page) => {
        curRouterPath = []
        if (!indexRouter || page.to.pathname === indexRouter.path) return
        findParentRouter($PERMISSION_ROUTER, page.to.pathname)
        curRouterPath = curRouterPath
        curRouterPath.unshift(indexRouter)
    })
    const findParentRouter = (list, path) => {
        if (!list || list.length === 0) return false
        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item.path === path) {
                const params = genParams(item)
                curRouterPath.push(params)
                return true
            }
            if (findParentRouter(item.children, path)) {
                const params = genParams(item)
                curRouterPath.unshift(params)
                return true
            }
        }
        return false
    }
    PERMISSION_ROUTER.subscribe(items => {
        indexRouter = {
            path: items[0]?.path,
            id: items[0]?.id,
            name: items[0]?.title
        }
        curRouterPath = []
        if (!indexRouter || $page.url.pathname === indexRouter.path) return
        findParentRouter(items, $page.url.pathname)
        curRouterPath = curRouterPath
        curRouterPath.unshift(indexRouter)
    })
    const openPage = item => {
        goto(item.path)
        MENU.set({ active: item.id, type: 'update' })
    }
</script>
{#if curRouterPath && curRouterPath.length > 0}
  <BeBreadcrumb separator="/">
    {#each curRouterPath as item, index}
     {#if index === curRouterPath.length -1}
        <span style="color:#606266">{item.name || ''}</span>
     {:else}
      <BeBreadcrumbItem>
        <span style="cursor: pointer;" on:click={() => openPage(item)}>{item.name || ''}</span>
      </BeBreadcrumbItem>
      {/if}
    {/each}
  </BeBreadcrumb>
{/if}
