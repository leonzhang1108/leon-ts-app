import React, { useState } from 'react'
import { hita, kata, rome } from './constant'
import { Button, message, Radio } from 'antd'
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
  
  const itemClick = i => {
    message.info({
      content: `${hita[i]} - ${kata[i]} - ${rome[i]}`
    })
  }

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

  return (
    <div className="gana-wrapper">
      <div className="item-wrapper">
        {
          count.map(i => <div key={i} className="item" onClick={()=> itemClick(i)}>{renderItem(i)}</div>)
        }
      </div>
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
  )
}

export default Gana
