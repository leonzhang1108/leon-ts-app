import React, { useEffect, useRef, useState, useMemo, useContext } from 'react'
import { Button } from 'antd'
import Context from '../../context'
import './index.less'

interface ItemProps {
  name?: string
  value?: any
  childItem?: ItemProps[]
}

interface ToTreeItemProps {
  data: ItemProps[]
  itemVisible?: boolean
  indexList: number[]
}

const canvasWidth = 100

const maxWidth = 20

const SingleItem = (props: any) => {
  const { item, indexList } = props
  const {
    align,
    renderItem,
    itemWidth,
    onItemClick,
    onItemRightClick,
    setVisibleChangeCount,
  } = useContext(Context)
  const { childItem, ...rest } = item
  const [visible, setVisible] = useState(!!(childItem && childItem.length))
  const parantRef: any = useRef()
  const [childrenWidth, setChildrenWidth] = useState<any>(undefined)
  const [childrenHeight, setChildrenHeight] = useState<any>(undefined)
  const visibleWidth = useRef(0)
  const visibleHeight = useRef(0)
  const [isRoot, setIsRoot] = useState(!(childItem && childItem.length))
  const [isTransforming, setIsTransforming] = useState(false)

  const opacity = useMemo(() => {
    if (childrenWidth === undefined) {
      return 1
    } else {
      return childrenWidth ? 1 : 0
    }
  }, [childrenWidth])

  const onDetailClick = () => {
    if (!isTransforming && childItem && childItem.length) {
      setIsTransforming(true)
      if (visible) {
        // 收起
        const width = parantRef.current.clientWidth - itemWidth
        const height = parantRef.current.clientHeight
        setChildrenWidth(width)
        setChildrenHeight(height)
        visibleWidth.current = width
        visibleHeight.current = height
        setTimeout(() => {
          setChildrenWidth(0)
          setChildrenHeight(0)
        }, 10)
        setTimeout(() => {
          setVisible(!visible)
          setIsTransforming(false)
          setVisibleChangeCount(new Date().getTime())
        }, 310)
      } else {
        // 展开
        setVisible(!visible)
        setChildrenWidth(0)
        setChildrenHeight(0)
        setTimeout(() => {
          setChildrenWidth(visibleWidth.current)
          setChildrenHeight(visibleHeight.current)
        }, 10)
        setTimeout(() => {
          setChildrenWidth(undefined)
          setChildrenHeight(undefined)
          setIsTransforming(false)
          setVisibleChangeCount(new Date().getTime())
        }, 310)
      }
    }
    onItemClick &&
      onItemClick({ item, type: 'to', index: indexList, visible: !visible })
  }

  const onContextMenu = (e) => {
    e.preventDefault()
    onItemRightClick &&
      onItemRightClick({
        item,
        type: 'to',
        index: indexList,
        visible: !visible,
      })
    return false
  }

  useEffect(() => {
    if (isRoot && childItem && childItem.length) {
      setIsTransforming(true)
      setIsRoot(false)
      // 展开
      setVisible(true)
      setChildrenWidth(0)
      setChildrenHeight(0)
      setTimeout(() => {
        setChildrenWidth(itemWidth + 100)
        setChildrenHeight(undefined)
      }, 10)
      setTimeout(() => {
        setChildrenWidth(undefined)
        setChildrenHeight(undefined)
        setIsTransforming(false)
        setVisibleChangeCount(new Date().getTime())
      }, 310)
    }
  }, [childItem])

  return (
    <div className={`to-tree-item ${align}`} ref={parantRef}>
      <div
        className="to-tree-item-detail"
        style={{ width: itemWidth }}
        onClick={onDetailClick}
        onContextMenu={onContextMenu}
      >
        {renderItem(rest)}
      </div>
      <div
        className="from-tree-cpt-animation"
        style={{ width: childrenWidth, opacity, height: childrenHeight }}
      >
        {childItem && childItem.length ? (
          <ToTreeItem
            indexList={indexList}
            itemVisible={visible}
            data={childItem}
          />
        ) : null}
      </div>
    </div>
  )
}

const ToTreeItem = (props: ToTreeItemProps) => {
  const { data, itemVisible = true, indexList } = props
  const {
    visibleChangeCount,
    align,
    pageSize,
    itemWidth,
    setVisibleChangeCount,
  } = useContext(Context)
  const [currPage, setCurrPage] = useState(1)
  const canvasRef: any = useRef()
  const itemRef: any = useRef()
  const wrapperRef: any = useRef()
  const [canvasHeight, setCanvasHeight] = useState(0)

  useEffect(() => {
    setVisibleChangeCount(new Date().getTime())
  }, [currPage, itemVisible])

  const visibleData = useMemo(() => {
    return data.slice(0, currPage * pageSize)
  }, [data, currPage, pageSize])

  const loadMoreVisible = useMemo(() => {
    return data.length > visibleData.length
  }, [data, currPage, pageSize])

  const resetVisible = useMemo(() => {
    return currPage !== 1
  }, [currPage])

  const maxValue = useMemo(() => {
    let max = 0
    visibleData.forEach((item) => {
      max = Math.max(item.value, max)
    })
    return max
  }, [visibleData])

  useEffect(() => {
    const childs = itemRef.current.childNodes
    if (!childs || !childs.length || !itemVisible) return
    const context = canvasRef.current.getContext('2d')
    context.strokeStyle = '#f2f2f2'
    context.lineCap = 'square'
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    const wrapper = wrapperRef.current
    const wrapperOffsetTop = wrapper.parentElement.offsetTop
    const parentItem = wrapper.parentElement.previousElementSibling
    if (!parentItem) return
    const parentHeight = parentItem.clientHeight
    const parentOffsetTop = parentItem.offsetTop
    childs.forEach((item, i) => {
      const { value } = data[i] || {}
      const { className } = item
      if (!value || className === 'load-btn-wrapper') return
      const top = item.offsetTop
      const height = item.clientHeight
      const lineWidth = (Number(value) / maxValue) * maxWidth
      context.beginPath()
      context.lineWidth = lineWidth > 1 ? lineWidth : 1
      let fromY
      let toY
      switch (align) {
        case 'top':
          toY = top + lineWidth / 2
          fromY = lineWidth / 2
          break
        case 'bottom':
          toY = top + height - lineWidth / 2 - maxWidth / 2
          fromY =
            parentOffsetTop + parentHeight - lineWidth / 2 - wrapperOffsetTop
          break
        default:
          toY = top + height / 2 - 5
          fromY = canvasHeight / 2 - 5
          break
      }
      context.moveTo(10, fromY)
      context.bezierCurveTo(
        canvasWidth / 2 + 20,
        fromY,
        canvasWidth / 2 - 20,
        toY,
        canvasWidth,
        toY
      )
      context.stroke()
    })
  }, [canvasHeight, align, visibleChangeCount, maxValue])

  useEffect(() => {
    const childs = itemRef.current.childNodes
    if (!childs || !childs.length || !itemVisible) return
    let height = 0
    childs.forEach((item) => {
      height += item.clientHeight
    })
    setCanvasHeight(height)
  }, [data, visibleChangeCount])

  return (
    <div
      ref={wrapperRef}
      className={`to-tree-item-cpt ${itemVisible ? '' : 'hidden'}`}
    >
      <canvas
        className="canvas-container"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
      <div ref={itemRef} className="to-tree-item-wrapper">
        {(visibleData || []).map((item, i) => (
          <SingleItem indexList={[...indexList, i]} item={item} key={i} />
        ))}
        <div className="load-btn-wrapper" style={{ width: itemWidth }}>
          <Button
            disabled={!loadMoreVisible}
            style={{ width: itemWidth / 2 - 5 }}
            onClick={() => loadMoreVisible && setCurrPage(currPage + 1)}
          >
            加载更多
          </Button>
          <Button
            disabled={!resetVisible}
            style={{ width: itemWidth / 2 - 5 }}
            onClick={() => resetVisible && setCurrPage(1)}
          >
            收起
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ToTreeItem
