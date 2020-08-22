import React, { useState } from 'react'
import { hita, kata, rome } from './constant'
import { Button, message } from 'antd'
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

const Gana = () => {
  const [count, setCount] = useState(initRandomCount())
  
  const itemClick = i => {
    message.info({
      content: `${hita[i]} - ${kata[i]} - ${rome[i]}`
    })
  }
  const refresh = e => {
    setCount(initRandomCount())
  }
  return (
    <div className="gana-wrapper">
      <div className="item-wrapper">
        {
          count.map(i => <div key={i} className="item" onClick={()=> itemClick(i)}>{0.5 - Math.random() > 0 ? hita[i] : kata[i]}</div>)
        }
      </div>
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
