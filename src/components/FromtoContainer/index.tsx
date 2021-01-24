/* eslint-disable no-debugger */
import React, { useState, useRef, useCallback } from 'react'
import FromTreeItem from './components/FromTreeItem'
import ToTreeItem from './components/ToTreeItem'
import Context from './context'
import './index.less'

interface ItemProps {
  name?: string
  value?: any
  childItem?: ItemProps[]
}

interface RootItemProps extends ItemProps {
  from: ItemProps[]
  to: ItemProps[]
}

export interface DICFromtoContainerProps extends ItemProps {
  data: RootItemProps
  align?: 'top' | 'bottom' | 'middle'
  renderItem: Function
  itemWidth: number
  onItemClick: Function
  onItemRightClick?: Function
  pageSize?: number
}

const defaultRenderItem = (item) => (
  <>
    <span>{item.name}:</span>
    <span>{item.value}</span>
  </>
)

const DICFromtoContainer = (props: DICFromtoContainerProps) => {
  const {
    data,
    align = 'middle',
    renderItem = defaultRenderItem,
    itemWidth = 150,
    onItemClick,
    onItemRightClick,
    pageSize = 5,
  } = props
  const { from, to, ...rest } = data || {}
  const [visibleChangeCount, setVisibleChangeCount] = useState(0)
  const [treeVisible, setTreeVisible] = useState(true)
  const [isTransforming, setIsTransforming] = useState(false)
  const [isAbsolute, setIsAbsolute] = useState(false)
  const [{ leftWidth, leftHeight }, setLeftSize] = useState<any>({
    leftWidth: undefined,
    leftHeight: undefined,
  })
  const [{ rightWidth, rightHeight }, setRightSize] = useState<any>({
    rightWidth: undefined,
    rightHeight: undefined,
  })
  const leftRef: any = useRef()
  const rightRef: any = useRef()
  const leftHeightRef: any = useRef(0)
  const rightHeightRef: any = useRef(0)

  const openChildren = useCallback(() => {
    // 展开
    setTreeVisible(true)
    setLeftSize({
      leftWidth: 0,
      leftHeight: 0,
    })
    setRightSize({
      rightWidth: 0,
      rightHeight: 0,
    })
    setTimeout(() => {
      setLeftSize({
        leftHeight: leftHeightRef.current,
        leftWidth: itemWidth + 100,
      })
      setRightSize({
        rightHeight: rightHeightRef.current,
        rightWidth: itemWidth + 100,
      })
    }, 10)
    setTimeout(() => {
      setLeftSize({
        leftWidth: undefined,
        leftHeight: undefined,
      })
      setRightSize({
        rightWidth: undefined,
        rightHeight: undefined,
      })
      setIsTransforming(false)
    }, 310)
  }, [])

  const closeChildren = useCallback(() => {
    // 收起
    const leftWidthTemp = leftRef.current.clientWidth
    const leftHeightTemp = leftRef.current.clientHeight
    const rightWidthTemp = rightRef.current.clientWidth
    const rightHeightTemp = rightRef.current.clientHeight
    setLeftSize({
      leftWidth: leftWidthTemp,
      leftHeight: leftHeightTemp,
    })
    setRightSize({
      rightWidth: rightWidthTemp,
      rightHeight: rightHeightTemp,
    })
    leftHeightRef.current = leftHeightTemp
    rightHeightRef.current = rightHeightTemp
    setTimeout(() => {
      setLeftSize({
        leftWidth: 0,
        leftHeight: 0,
      })
      setRightSize({
        rightWidth: 0,
        rightHeight: 0,
      })
    }, 10)
    setTimeout(() => {
      setTreeVisible(false)
      setIsTransforming(false)
    }, 310)
  }, [])

  const getChildrenHeight = useCallback(() => {
    return new Promise((success) => {
      setTreeVisible(true)
      setIsAbsolute(true)
      setLeftSize({
        leftHeight: undefined,
        leftWidth: 0,
      })
      setRightSize({
        rightHeight: undefined,
        rightWidth: 0,
      })
      setTimeout(() => {
        leftHeightRef.current = leftRef.current.clientHeight
        rightHeightRef.current = rightRef.current.clientHeight
        setIsAbsolute(false)
        success('success')
      }, 0)
    })
  }, [])

  const onRootClick = () => {
    if (!isTransforming) {
      setIsTransforming(true)
      if (treeVisible) {
        closeChildren()
      } else {
        getChildrenHeight().then(openChildren)
      }
    }
    onItemClick &&
      onItemClick({
        item: rest,
        type: 'root',
        visible: !treeVisible,
        index: [],
      })
  }

  const onContextMenu = (e) => {
    e.preventDefault()
    onItemRightClick &&
      onItemRightClick({
        item: rest,
        type: 'root',
        index: [],
        visible: !treeVisible,
      })
    return false
  }

  return (
    <Context.Provider
      value={{
        visibleChangeCount,
        setVisibleChangeCount,
        align,
        renderItem,
        itemWidth,
        onItemClick,
        onItemRightClick,
        pageSize,
      }}
    >
      <div className="dic-fromto-container-wrapper">
        <div className={`dic-fromto-container ${align}`}>
          <div
            className="tree-wrapper left"
            ref={leftRef}
            style={{
              width: leftWidth,
              height: leftHeight,
              position: isAbsolute ? 'absolute' : 'relative',
            }}
          >
            {(from || []).length && treeVisible ? (
              <FromTreeItem
                indexList={[]}
                data={from}
                itemVisible={treeVisible}
              />
            ) : null}
          </div>
          <div
            className="root-item"
            onClick={onRootClick}
            style={{ width: itemWidth }}
            onContextMenu={onContextMenu}
          >
            {renderItem(rest)}
          </div>
          <div
            className="tree-wrapper right"
            ref={rightRef}
            style={{
              width: rightWidth,
              height: rightHeight,
              position: isAbsolute ? 'absolute' : 'relative',
            }}
          >
            {(to || []).length && treeVisible ? (
              <ToTreeItem indexList={[]} data={to} itemVisible={treeVisible} />
            ) : null}
          </div>
        </div>
      </div>
    </Context.Provider>
  )
}

export default DICFromtoContainer
