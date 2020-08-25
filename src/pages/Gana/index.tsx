import React, { useState, useMemo } from 'react'
import { hita, kata, rome } from './constant'
import { Button, Modal, Radio } from 'antd'
import { RedoOutline } from '@constant/icons'
import './index.less'

const initRandomCount = () => {
  const count: number[] = []
  for (let i = 0; i < 45; i++) {
    count.push(i)
  }
  const randomCount = () => 0.5 - Math.random()
  count.sort(randomCount)
  return count
}

const typeList = [
  {
    label: '全',
    value: 'all'
  },
  {
    label: '平',
    value: 'hita'
  },
  {
    label: '片',
    value: 'kata'
  }
]

const Gana = () => {
  const [count, setCount] = useState(initRandomCount())
  const [type, setType] = useState('all')
  const [currIndex, setCurrIndex] = useState(-1)

  const refresh = () => {
    setCount(initRandomCount())
  }

  const renderItem = i => {
    switch(type) {
      case 'hita':
        return hita[i]
      case 'kata':
        return kata[i]
      default:
        return 0.5 - Math.random() > 0 ? hita[i] : kata[i]
    }
  }

  const blocks = useMemo(() => count.map(i => {
    return (
      <div
        key={i}
        className="item"
        onClick={()=> {
          setCurrIndex(i)
        }}
      >
        {renderItem(i)}
      </div>
    )
  }), [count, type])

  return (
    <div className="gana-wrapper">
      <div className="btn-wrapper">
        <Radio.Group
          className="type-radio"
          value={type}
          onChange={e => setType(e.target.value)}
          options={typeList}
          optionType="button"
          buttonStyle="solid"
        />
        <Button
          className="refresh-btn"
          icon={<RedoOutline />}
          type="primary"
          onClick={refresh}
        />
      </div>
      <div className="item-wrapper">
        {blocks}
      </div>
      <Modal
        visible={currIndex >= 0}
        centered
        onCancel={() => setCurrIndex(-1)}
        footer={null}
      >
        <div style={{ fontSize: 40, textAlign: 'center' }}>{hita[currIndex]} - {kata[currIndex]} - {rome[currIndex]}</div>
      </Modal>
    </div>
  )
}

export default Gana
