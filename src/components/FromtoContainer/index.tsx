import React, { useState } from 'react'
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

  const onRootClick = () => {
    onItemClick &&
      onItemClick({
        item: rest,
        type: 'root',
        visible: !treeVisible,
        index: [],
      })
    setTreeVisible(!treeVisible)
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
      <div className={`dic-fromto-container ${align}`}>
        <div>
          {(from || []).length ? (
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
        <div>
          {(to || []).length ? (
            <ToTreeItem indexList={[]} data={to} itemVisible={treeVisible} />
          ) : null}
        </div>
      </div>
    </Context.Provider>
  )
}

export default DICFromtoContainer
