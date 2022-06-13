<script>
	import { BeCascader } from "@brewer/beerui";
	import { fetchAreaList } from "../../api/areaOrg.js";
	export let value = 5
	export let placeholder
	export let lazy = true
	export let checkStrictly = true
	export let clearable = true
	export let areaLevelPath = null
	let areaList= []
	// 行政区划懒加载
	const lazyLoad = (node, resolve) => {
		const { areaId } = node
		getAreaList(areaId, resolve)
	}
	
	/**
	 * 获取行政区划
	 * @param id (id默认为越城区的区划id)
	 * @param resolve
	 * @param type 新增/编辑
	 * @param areaLevelPath
	 */
	const getAreaList = (id = 5, resolve = undefined, areaLevelPath = []) => {
		const params = {
			areaId: id
		}
		fetchAreaList(params).then(res => {
			res.forEach(val => {
				val.children = []
			})
			areaLevelPath.splice(0, 1)
			if(!resolve) appendAreaListChildern(id, areaList, res)
			if (areaLevelPath.length > 1) {
				getAreaList(areaLevelPath[0], resolve, areaLevelPath)
			}
			if (resolve) {
				resolve(res)
			}
		})
	}
	// 获取完整的区划
	const getEditFullArea = () => {
    let levelPath = areaLevelPath ? areaLevelPath.match(/-\d+/g) : []
    levelPath = levelPath.map(val => Math.abs(val))
    const index = levelPath.findIndex(val => val === 7)
    levelPath.splice(0, index)
		if(levelPath.length === 1 && levelPath[0] === 7) return
    getAreaList(7, undefined, levelPath)
  }
	$:if(areaLevelPath){
		getEditFullArea()
	} 
	getAreaList()
	
	
	const appendAreaListChildern = (id, oldList, newList) => {
		if (!areaList.length) {
			areaList = newList
		} else {
			for (let i=0; i<oldList.length; i++) {
				if (oldList[i].areaId === id) {
					oldList[i].children = newList
					areaList = areaList
					return
				}
				if (oldList[i].children.length) {
					appendAreaListChildern(id, oldList[i].children, newList)
				}
			}
		}
	}

	// 获取行政区划选中的值
	const handleCascaderChange = ({ detail }) => {
		value = detail ? (detail[0] || '') : ''
	}
</script>
<BeCascader
	bind:value
	config={{value: 'areaId', label: 'areaName', children: 'children'}}
	{lazy}
	{placeholder}
	showAllLevels={false}
	bind:options={areaList}
	lazyLoad={lazyLoad}
	{clearable}
	{checkStrictly}
	on:change={handleCascaderChange}
	style={$$props.style}
/>
