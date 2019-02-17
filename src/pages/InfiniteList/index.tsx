
import * as React from 'react'
import './index.less'

interface IState {
  list: any[],
  // 可视区域top
  top: number,
  // 数据总高度
  contentHeight: number,
  // 可见高度
  visibleHeight: number,
  // 可见列表
  visibleData: any[],
  // 上下预加载个数
  offset: number,
  // 间隔
  interval: number
}

class InfiniteList extends React.Component<{}, IState> {

  wrapper

  randomBoolean = () => Math.random() - 0.5 > 0

  componentWillMount () {
    this.initState()
    // init data
    const list: any[] = []

    for (let val = 0; val < 777; val++) {
      // randam height
      const height = this.randomBoolean() ? 60 : 30

      const obj: any = { val, height }

      if (!val) {
        obj.offsetTop = height
      }

      list.push(obj)
    }

    const contentHeight = list.reduce((p, c) => p + c.height, 0)

    this.setState({ list, contentHeight })
  }

  initState = () => {
    this.setState({
      // 总列表，及offsetTop
      list: [],
      // 可视区域top
      top: 0,
      // 数据总高度
      contentHeight: 0,
      // 可见高度
      visibleHeight: 0,
      // 可见列表
      visibleData: [],
      // 上下预加载个数
      offset: 10,
      // 间隔
      interval: 2
    })
  }

  componentDidMount () {
    // init height & visible data
    const visibleHeight = this.wrapper.clientHeight

    this.setState({
      visibleHeight,
      ...this.doCalculate(0)
    })
  }

  calculateOffset = index => {
    const { list } = this.state

    if (index === list.length) {return}

    // 取缓存
    if (list[index].offsetTop) {return list[index].offsetTop}

    let offsetTop = list[index].height

    offsetTop += this.calculateOffset(index - 1)

    // 添加缓存
    list[index] = {
      ...list[index],
      offsetTop
    }

    this.setState({ list })

    return offsetTop
  }

  doCalculate = startIndex => {
    const { list, offset } = this.state

    const innerOffset = startIndex = startIndex - offset

    startIndex = startIndex > 0 ? startIndex : 0

    let endIndex = this.findEndIndex(startIndex) + offset * 2 + 1

    endIndex = innerOffset < 0 ? endIndex + innerOffset : endIndex

    endIndex = endIndex > list.length ? list.length : endIndex

    const visibleData = list.slice(startIndex, endIndex)

    const top = this.findTopByIndex(startIndex)

    return { visibleData, top }
  }

  findTopByIndex = index => index ? this.state.list[index - 1].offsetTop : 0

  findStartIndex = top => {
    const { list } = this.state

    let index = 0

    while (index < list.length) {
      if (!list[index].offsetTop) {this.calculateOffset(index)}

      if (top < list[index].offsetTop) {break}

      index++
    }

    return index
  }

  findEndIndex = startIndex => {
    let { visibleHeight } = this.state
    const { list } = this.state

    // 取缓存
    if (list[startIndex].endIndex) { return list[startIndex].endIndex }

    visibleHeight = visibleHeight || this.wrapper.clientHeight

    // 计算endIndex
    const endIndex = this.calculateEndIndex(visibleHeight, startIndex)

    // 加入缓存
    list[startIndex].endIndex = endIndex

    this.setState({ list })

    return endIndex
  }

  calculateEndIndex = (visibleHeight, index = 0) => {
    const { list } = this.state

    while (visibleHeight > 0) {
      const i = index + 1
      if (i !== list.length) {
        visibleHeight -= list[++index].height
      } else {
        break
      }
    }

    return index
  }

  scrollHandler = e => {
    const { interval } = this.state

    const startIndex = this.findStartIndex(e.target.scrollTop)

    if (startIndex % interval === 0) {this.setState(this.doCalculate(startIndex))}
  }

  render () {
    const { visibleData, contentHeight, top } = this.state

    return (
      <div className='infinite-list-wrapper' onScroll={this.scrollHandler} ref={ref => { this.wrapper = ref }}>
        <div className='infinite-list-ghost' style={{ height: contentHeight }} />
        <div className='infinite-list' style={{ transform: `translate3d(0, ${top}px, 0)` }}>
          { visibleData.map((item, i) => {
            const style = { height: `${ item.height }px`, lineHeight: `${ item.height }px` }
            return <div className='item' key={i} style={style}>{`item-${item.val}`}</div>
          }) }
        </div>
      </div>
    )
  }
}

export default InfiniteList
