import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Select } from 'antd'
import {
  getHTMLList,
  str2dom,
  dom2str,
  isHTML,
  validKeys,
  setFocus,
  getDiffIndex,
} from './utils'
import './index.less'

interface OptionItemProps {
  field: string;
  value: string;
}

interface ValueProps {
  formula: string;
  vars: {
    [key: string]: string;
  };
}

export interface DICFormulaInputProps {
  disabled?: boolean;
  placeholder?: string;
  options: OptionItemProps[];
  value: ValueProps;
  setValue: (v: ValueProps) => void;
  size?: 'large' | 'small' | 'middle';
}

const DICFormulaInput = (props: any) => {
  const {
    disabled = false,
    placeholder = '',
    options,
    value,
    setValue: resetValue,
    size = 'middle',
  } = props
  const wrapperRef: any = useRef()
  const formulaRef: any = useRef()
  const selectionRef: any = useRef()
  const selectRef: any = useRef()
  const [filter, setFilter] = useState('')
  const [showSelection, setShowSelection] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const displayOptions = useMemo(() => {
    return options.filter(({ name }) => name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())).map(item => ({
      label: item.name,
      value: item.field,
    }))
  }, [options, filter])

  const setValue = () => {
    setErrorMsg('')
    let formula = ''
    const vars = {}
    const text = formulaRef.current.innerHTML.replace(
      /\sdata-spm-anchor-id=".*?"/g,
      '',
    )
    const list = getHTMLList({
      text,
      prefix: '<div contenteditable="false">',
      suffix: '</div>',
    })
    list.forEach(item => {
      const [v1, v2] = getHTMLList({
        text: item,
        prefix: '<span>',
        suffix: '</span>',
      })
      if (v2) {
        formula += v2
        vars[v2] = v1
      } else {
        formula += v1
      }
    })
    const res = {
      formula,
      vars,
    }
    resetValue && resetValue(res)
  }

  const resetDisplay = (from, to = '') => {
    let text = formulaRef.current.innerHTML
    if (text.includes(from)) {
      text = text.replace(new RegExp(from, 'g'), to)
      formulaRef.current.innerHTML = text
    }
    setValue()
  }

  const removeSelection = (e) => {
    setShowSelection(false)
    window.removeEventListener('click', removeSelection)
    e && resetDisplay('@')
  }

  const onEsc = (e) => {
    if (e.key === 'Escape') {
      window.removeEventListener('keydown', onEsc)
      const index = formulaRef.current.innerHTML.indexOf('@')
      const target = formulaRef.current
      resetDisplay('@', '')
      setShowSelection(false)
      setFocus(target, index)
    }
  }

  const addEventListener = () => {
    // 添加全局click监听
    window.addEventListener('click', removeSelection)
    window.addEventListener('keydown', onEsc)
  }

  const onKeyUp = () => {
    const target = formulaRef.current
    const originStr = target.innerHTML
    let list: any = str2dom(originStr)
    list = list.map(v => (isHTML(v)
      ? dom2str(v)
      : v.data
        .split('')
        .filter(v => validKeys.includes(v))
        .join('')))
    const filteredStr = list.join('')
    if (originStr !== filteredStr) {
      const index = getDiffIndex(originStr, filteredStr)
      formulaRef.current.innerHTML = filteredStr
      setFocus(formulaRef.current, index)
    }
  }

  const openSelection = () => {
    setFilter('')
    setShowSelection(true)
    setTimeout(() => {
      // append to wrapper
      wrapperRef.current.appendChild(selectionRef.current)
      // 绑定监听
      addEventListener()
      // 焦点到下拉框filter input中
      selectRef.current.focus()
    }, 0)
  }

  const onKeyDown = e => {
    const { key } = e
    switch (key) {
      // 禁止回车
      case 'Enter':
        e.preventDefault()
        break
      case '@':
      case 'Process': // 中文输入法的 @
        onKeyUp()
        openSelection()
        break
      default:
    }
  }

  const optionClick = (item) => {
    const { name, field } = item
    const res = `<div contenteditable="false">${name}<span>${field}</span></div>`
    const index = formulaRef.current.innerHTML.indexOf('@')
    const { length } = res
    resetDisplay('@', res)
    setTimeout(() => {
      setShowSelection(false)
      const target = formulaRef.current
      setFocus(target, index + length)
    }, 0)
  }

  const initDisplay = () => {
    const { vars, formula } = value
    let result = formula
    Reflect.ownKeys(vars).forEach((key: string) => {
      const rule = new RegExp(key, 'g')
      const name = `<div contenteditable="false">${vars[key]}<span>${key}</span></div>`
      result = result.replace(rule, (v, index, string) => {
        const { length } = v
        const str = string.slice(index - 1, length + index + 1)
        if (str.startsWith('_') || str.endsWith('_')) {
          return key
        } else {
          return name
        }
      })
    })
    formulaRef.current.innerHTML = result
  }

  useEffect(() => {
    initDisplay()
  }, [value])

  const stopNativeEvent = useCallback(
    e => {
      e.preventDefault()
      return false
    },
    [],
  )

  return (
    <div className="formula-input-wrapper" ref={wrapperRef}>
      <div
        ref={formulaRef}
        className={`formula-input ${size} ${errorMsg ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        contentEditable={!disabled}
        placeholder={placeholder}
        onClick={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={setValue}
        onCut={stopNativeEvent}
        onPaste={stopNativeEvent}
        onCopy={stopNativeEvent}
      />
      {
        !!errorMsg ? (
          <div className="hint">{ errorMsg }</div>
        ) : null
      }
      <div
        className={`formula-input-selection ${showSelection ? 'visible' : ''}`}
        ref={selectionRef}
        onClick={e => e.stopPropagation()}
      >
        <Select
          ref={selectRef}
          value={undefined}
          open={showSelection}
          showSearch
          autoFocus
          style={{ width: '100%' }}
          options={displayOptions}
          optionFilterProp="label"
          onChange={(v) => {
            const value = options.find(item => item.field === v)
            optionClick(value)
          }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          placeholder="输入关键字筛选"
        />
      </div>
    </div>
  )
}

export default DICFormulaInput
