<script>
  import { BePagination } from '@brewer/beerui'
  import { previewImages } from "$lib/utils/index.js"

  let label = ['序号', '排水口号', '节点性质', '埋深', '管径', '材质','地面高程', '管底高程', '所在位置', '图片', '背景图片', '备注']
  let list = [
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''},
    { discharge: 'W出水口1', node: '污水井', burialDepth: '1.339', pipeDiameter: '300.0', texture: '砼',groundElevation: '6.969', pipeElevation: '5.57', location: '——', img1: '/assets/home/img1.png', img2: '/assets/home/img2.png', remark: ''}
  ]
  const options = {
		card: true,
		icon: {
			width: 12,
			height: 12,
			color: '#fff'
		}
	}

  function changePage(val) {
    console.log(val)
  }
</script>
<table>
  <thead>
    {#each label as item(item)}
      <td>{item}</td>
    {/each}
  </thead>
  <tbody>
    {#each list as item, index(item)}
      <tr>
        <td>{index + 1}</td>
        <td>{item.discharge}</td>
        <td>{item.node}</td>
        <td>{item.burialDepth}</td>
        <td>{item.pipeDiameter}</td>
        <td>{item.texture}</td>
        <td>{item.groundElevation}</td>
        <td>{item.pipeElevation}</td>
        <td>{item.location}</td>
        <td>
          <img src="{item.img1}" alt="" style="width: 58px;" class="cursor-pointer" on:click={() => previewImages(item.img1, [item.img1])}>
        </td>
        <td>
          <img src="{item.img2}" alt="" style="width: 58px;" class="cursor-pointer" on:click={() => previewImages(item.img2, [item.img2])}>
        </td>
        <td>{item.remark}</td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="flex table-pagination" style="justify-content: flex-end;">
  <BePagination style="color: #fff" currentPage={1} pageSize={11} total={11} async layouts='' on:changePage={changePage} {options} />
</div>
<style lang="scss">
  table {
    width: 100%;
    font-size: 12px;
    color: #ECF6FA;
    td {
      height: 48px;
      padding: 0 12px;
    }
    thead {
      height: 48px;
      background: rgba(27, 108, 230, .32);
    }
  }
</style>
