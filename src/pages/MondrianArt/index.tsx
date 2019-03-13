import * as React from 'react'
import Utils from '@utils'
import './index.less'
const { useState, useEffect } = React

const colorMap = [
  'rgb(248, 217, 45)',
  'rgb(248, 217, 45)',
  'rgb(242, 245, 241)',
  'rgb(11, 84, 164)',
  'rgb(214, 0, 20)',
  'rgb(11, 84, 164)'
]

const generateBlocks = isMobile =>
  Array.from(Array(isMobile ? 20 : 50).keys()).map(i => (
    <div
      key={i}
      className={`block-${i}`}
      style={{
        animationDelay: `${i * 0.15}s`,
        gridColumn: `span ${Utils.random(1, isMobile ? 4 : 5)}`,
        gridRow: `span ${Utils.random(1, isMobile ? 4 : 5)}`,
        backgroundColor: colorMap[Utils.random(0, 5)]
      }}
    />
  ))

const getBoundary = v => {
  let res = 10
  while (v - res > 120) {
    res += 60
  }
  return res
}

const MondrianArt = ({ isMobile, h, w }) => {

  const height = isMobile ? 430 : getBoundary(h)
  const width = isMobile ? 250 : getBoundary(w)
  const [blocksKey, setBlocksKey] = useState(1)
  const interval = setInterval(
    () => setBlocksKey(blocksKey ? 0 : 1),
    isMobile ? 5000 : 7000
  )

  useEffect(() => () => clearInterval(interval))

  return (
    <div className='mondrian-wrapper'>
      <div className='mondrian-inner-wrapper'>
        <div
          key={blocksKey}
          className='mondrian-art'
          style={{ height, width }}
        >
          { generateBlocks(isMobile) }
        </div>
      </div>
    </div>
  )
}

export default Utils.connect({
  component: MondrianArt,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
    h: state.common.contentHeight,
    w: state.common.contentWidth
  })
})
