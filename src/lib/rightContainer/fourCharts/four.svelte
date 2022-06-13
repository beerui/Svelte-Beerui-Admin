<script>
  import { BePagination } from '@brewer/beerui'

  let label = ['序号', '位置', '图号', '编号', '所在河道', '排出口', '类型', '描述', '处理意见']
  let list = [
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' },
    { location: '24幢3单元', imgNum: 'T001', num: 'HP504', riverway: '——', outlet: 'W出水口1', type: '雨水接入污水', describe: '雨水管接入', sugggest: '立项解决' }
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
        <td>{item.location}</td>
        <td>{item.imgNum}</td>
        <td>{item.num}</td>
        <td>{item.riverway}</td>
        <td>{item.outlet}</td>
        <td>{item.type}</td>
        <td>{item.describe}</td>
        <td>{item.sugggest}</td>
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
