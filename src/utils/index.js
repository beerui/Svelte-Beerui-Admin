import { goto } from "$app/navigation";
import { showNotice } from "@brewer/beerui";
import { MENU, ROUTER_MAP } from "$lib/stores";
export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.setAttribute('class', curClass);
  }
}
export const placeholderRegexHandle = (v) => v === undefined || v === 'undefined' || v === "" || v === null
/**
 * 提示消息弹框
 * @param title
 * @param message
 * @param type success, warning, info, error
 * @param duration
 * @param position top-right top-left bottom-right bottom-left
 * @param toast
 */
export const openNotice = ({ title = '提示', message = '提示信息', type = '', duration = 3000, position = 'top-right', toast = false }) => {
    showNotice({
        toast,
        title,
        position,
        message,
        type,
        duration
    })
}

export const showDebounceNotice = debounce((res) => {
    openNotice({
        toast: true,
        message: res.message || 'error',
        duration: 3000,
        type: 'error'
    })
}, 300)

export const openPage = (path) => {
  const name = path.split('?')[0]
  let active = ''
  for(let i in ROUTER_MAP) {
    const item = ROUTER_MAP[i]
    if(item.path === name) {
      active = findPath(item)
    }
  }
  if(active) MENU.set({ active: active, type: 'update' })
  goto(path)
}

export const isPermission = (list, key) => {
    if (list.length === 0) return false
    for (let i = 0; i < list.length; i++) {
        if (list[i].key.split('-')[1] === key) {
            return true
        }
    }
}

export const computedRouter = (list, parent = null) => {
    list.forEach(el => {
        if (el.children && el.children.length > 0) computedRouter(el.children, el)
        ROUTER_MAP[el.id] = Object.assign(el, { parent })
    })
}
const findPath = (item) => {
  if(item.hidden) {
   return findPath(item.parent)
  }
  return item.id
}

/**
 * 导出excel
 */
 export function exportExcel (url, _name) {
  const elink = document.createElement('a')
  elink.download = _name
  elink.href = url
  elink.style.display = 'none'
  document.body.appendChild(elink)
  elink.click()
  document.body.removeChild(elink)
}

/**
 * 获取url中的参数
 * @param page
 * @param params
 */
export const getParams = (page, params) => {
    return page.url.searchParams.get(params)
}

/**
 * 表单验证
 * 非必填字段可传required: false, pattern
 * @param pattern 正则
 * @param patternMessage 校验结果提示文字
 */
 export function checkValidateField(forms, rules) {
  const nodes = document.querySelectorAll('.be-form-item')
  const contentNodes = document.querySelectorAll('.be-form-item .be-form-item__content')
  const node = document.createElement('div');
  let isValid = true
  node.setAttribute('class', 'be-form-item__error')
  for(let i = 0; i < nodes.length; i++) {
    const item = nodes[i]
    const key = item.dataset?.prop
    let errorNode =  contentNodes[i].querySelector('.be-form-item__error')
    if(errorNode) contentNodes[i].removeChild(errorNode)
    if(key) {
      const cloneNode = node.cloneNode(true)
      if(!forms[key] && forms[key] !== 0 && rules[key].required) {
        cloneNode.innerHTML = rules[key].message || (key + 'is required')
        contentNodes[i].appendChild(cloneNode)
        isValid = false
      } else {
        // 处理必填字段且需要正则校验情况
        if (rules[key].required && rules[key].pattern) {
          if (!new RegExp(rules[key].pattern).test(forms[key])) {
            cloneNode.innerHTML = rules[key].patternMessage || '请输入正确的格式'
            contentNodes[i].appendChild(cloneNode)
            isValid = false
          }
        }
        // 处理非必填字段但是填了又需要正则校验情况
        if (!rules[key].required && forms[key] && rules[key].pattern) {
          if (!new RegExp(rules[key].pattern).test(forms[key])) {
            cloneNode.innerHTML = rules[key].patternMessage || '请输入正确的格式'
            contentNodes[i].appendChild(cloneNode)
            isValid = false
          }
        }
        // isValid =  true
      }
    }
  }
  return isValid
}


/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
 export function debounce(func,wait,immediate = false) {
  let timeout;

  return function () {
      let context = this;
      let args = arguments;

      if (timeout) clearTimeout(timeout);
      if (immediate) {
          var callNow = !timeout;
          timeout = setTimeout(() => {
              timeout = null;
          }, wait)
          if (callNow) func.apply(context, args)
      }
      else {
          timeout = setTimeout(function(){
              func.apply(context, args)
          }, wait);
      }
  }
}
