<script>
  import { BePagination } from '@brewer/beerui'

  let label = ['序号', '排水口号', '节点性质', '埋深', '管径', '排水量', '地面高程', '管径高程', '问题类型', '污染类型', '排水性质', '单位名称', '运维人员']
  let list = [
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' },
    { discharge: 'W出水口1', node: '阳台洗衣机房水', burialDepth: '1.339', pipeDiameter: '300.0', displacement: '1321', groundElevation: '6.969', pipeElevation: '5.57', problemTypes: '——', pollutionType: '生活污水', drainageProperties: '——', organization: '杭州九问数字科技有限公司', operation: '某某某 82625388' }
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
        <td>{item.displacement}</td>
        <td>{item.groundElevation}</td>
        <td>{item.pipeElevation}</td>
        <td>{item.problemTypes}</td>
        <td>{item.pollutionType}</td>
        <td>{item.drainageProperties}</td>
        <td>{item.organization}</td>
        <td>{item.operation}</td>
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
