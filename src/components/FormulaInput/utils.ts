export const getHTMLList = ({ text, prefix, suffix }) => text
  .replace(new RegExp(prefix, 'g'), ',')
  .replace(new RegExp(suffix, 'g'), ',')
  .split(',')
  .filter(v => !!v)

export const str2dom = v => {
  const objE: any = document.createElement('div')
  objE.innerHTML = v
  return [...objE.childNodes]
}

export const dom2str = node => {
  let tmpNode: any = document.createElement('div')
  tmpNode.appendChild(node)
  const str = tmpNode.innerHTML
  tmpNode = null
  node = null
  return str
}

export const isHTML = v => Object.prototype.toString.call(v) === '[object HTMLDivElement]'

export const validKeys = '0123456789+-*/@.()'

export const getDiffIndex = (s1, s2) => {
  const l1 = s1.split('')
  const l2 = s2.split('')
  const max = Math.max(l1.length, l2.length)
  let index = 0
  for (let i = 0; i < max; i++) {
    if (l1[i] === l2[i]) {
      index += 1
    } else {
      break
    }
  }
  return index
}

export const setFocus = (el, index) => {
  const range = document.createRange()
  const sel: any = window.getSelection()
  let nodeIndex = 0
  let offsetIndex = 0
  let innerIndex = index
  const list = str2dom(el.innerHTML)
  for (let i = 0; i < list.length; i++) {
    const v: any = list[i]
    if (!innerIndex) break
    if (isHTML(v)) {
      const { length } = dom2str(v)
      if (innerIndex >= length) {
        innerIndex -= dom2str(v).length
      }
    } else if (innerIndex >= v.length) {
      innerIndex -= v.length
    } else {
      offsetIndex = innerIndex
      break
    }
    nodeIndex += 1
  }

  range.selectNodeContents(el)
  range.collapse(false)

  if (el.childNodes[nodeIndex] && isHTML(el.childNodes[nodeIndex])) {
    let currIndex = nodeIndex - 1
    let currDom = el.childNodes[currIndex].cloneNode()
    while (isHTML(currDom) && currIndex !== 0) {
      currIndex -= 1
      currDom = el.childNodes[currIndex].cloneNode()
    }
    if (currIndex >= 0) {
      const { length } = el.childNodes[currIndex]
      range.setStart(el.childNodes[currIndex], length)
    }
  } else if (el.childNodes[nodeIndex] && !isHTML(el.childNodes[nodeIndex])) {
    range.setStart(el.childNodes[nodeIndex], offsetIndex > 0 ? offsetIndex : 0)
  }

  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
}

export const getParentNode = (el, className) => {
  if (!el) return null
  do {
    el = el.parentNode
  } while (el && !el.className.includes(className))
  return el
}