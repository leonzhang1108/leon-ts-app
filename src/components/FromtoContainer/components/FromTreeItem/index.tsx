import React, { useEffect, useRef, useState, useMemo, useContext } from 'react'
import { Button } from 'antd'
import Context from '../../context'
import './index.less'

interface ItemProps {
  name?: string
  value?: any
  childItem?: ItemProps[]
}

interface FromTreeItemProps {
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
  const [{ childrenWidth, childrenHeight }, setChildrenSize] = useState<any>({
    childrenWidth: undefined,
    childrenHeight: undefined,
  })
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
        setChildrenSize({
          childrenHeight: height,
          childrenWidth: width,
        })
        visibleWidth.current = width
        visibleHeight.current = height
        setTimeout(() => {
          setChildrenSize({
            childrenHeight: 0,
            childrenWidth: 0,
          })
        }, 10)
        setTimeout(() => {
          setVisible(!visible)
          setIsTransforming(false)
          setVisibleChangeCount(new Date().getTime())
        }, 310)
      } else {
        // 展开
        setVisible(!visible)
        setChildrenSize({
          childrenHeight: 0,
          childrenWidth: 0,
        })
        setTimeout(() => {
          setChildrenSize({
            childrenHeight: visibleHeight.current,
            childrenWidth: visibleWidth.current,
          })
        }, 10)
        setTimeout(() => {
          setChildrenSize({
            childrenHeight: undefined,
            childrenWidth: undefined,
          })
          setIsTransforming(false)
          setVisibleChangeCount(new Date().getTime())
        }, 310)
      }
    }
    onItemClick &&
      onItemClick({ item, type: 'from', index: indexList, visible: !visible })
  }

  const onContextMenu = (e) => {
    e.preventDefault()
    onItemRightClick &&
      onItemRightClick({
        item,
        type: 'from',
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
      setChildrenSize({
        childrenHeight: undefined,
        childrenWidth: 0,
      })
      setTimeout(() => {
        setChildrenSize({
          childrenHeight: undefined,
          childrenWidth: itemWidth + 100,
        })
      }, 10)
      setTimeout(() => {
        setChildrenSize({
          childrenHeight: undefined,
          childrenWidth: undefined,
        })
        setIsTransforming(false)
        setVisibleChangeCount(new Date().getTime())
      }, 310)
    }
  }, [childItem])

  return (
    <div className={`from-tree-item ${align}`} ref={parantRef}>
      <div
        className="from-tree-cpt-animation"
        style={{ width: childrenWidth, opacity, height: childrenHeight }}
      >
        {childItem && childItem.length ? (
          <FromTreeItem
            indexList={indexList}
            itemVisible={visible}
            data={childItem}
          />
        ) : null}
      </div>
      <div
        className="from-tree-item-detail"
        style={{ width: itemWidth }}
        onClick={onDetailClick}
        onContextMenu={onContextMenu}
      >
        {renderItem(rest)}
      </div>
    </div>
  )
}

const FromTreeItem = (props: FromTreeItemProps) => {
  const { data, itemVisible = true, indexList } = props
  const {
    align,
    pageSize,
    itemWidth,
    visibleChangeCount,
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
    const parentItem = wrapper.parentElement.nextElementSibling
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
          fromY = top + lineWidth / 2
          toY = lineWidth / 2
          break
        case 'bottom':
          fromY = top + height - lineWidth / 2 - maxWidth / 2
          toY =
            parentOffsetTop + parentHeight - lineWidth / 2 - wrapperOffsetTop
          break
        default:
          fromY = top + height / 2 - 5
          toY = canvasHeight / 2 - 5
          break
      }
      context.moveTo(0, fromY)
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
      className={`from-tree-item-cpt ${itemVisible ? '' : 'hidden'}`}
    >
      <div ref={itemRef} className="from-tree-item-wrapper">
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
      <canvas
        className="canvas-container"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  )
}

export default FromTreeItem
