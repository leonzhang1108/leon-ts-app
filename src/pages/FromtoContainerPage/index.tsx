import DICFromtoContainer from "@cpt/FromtoContainer"
import { Radio } from 'antd'
import React, { useState } from 'react'
import './index.less'

const options = [
  { label: 'top', value: 'top' },
  { label: 'middle', value: 'middle' },
  { label: 'bottom', value: 'bottom' },
]

const parentNames = ['爸爸', '妈妈', '叔叔', '阿姨']

const sonNames = ['儿子', '女儿', '侄子', '侄女']

const demoData = {
  name: '我',
  value: '8888',
  from: [
    {
      name: '爸爸',
      value: '2222'
    },
    {
      name: '妈妈',
      value: '2222'
    },
    {
      name: '叔叔',
      value: '2222'
    },
    {
      name: '阿姨',
      value: '2222'
    },
  ],
  to: [
    {
      name: '儿子',
      value: '2222'
    },
    {
      name: '女儿',
      value: '2222'
    },
    {
      name: '侄子',
      value: '2222'
    },
    {
      name: '侄女',
      value: '2222'
    },
  ],
}

const randomNum = (min, max) => parseInt(Math.random()*(max - min + 1) + min, 10)

const FromtoContainerCpt = () => {
  const [align, setAlign] = useState<any>('middle')
  const [tree, setTree] = useState(demoData)

  const onItemClick = ({ item, index, type, visible }) => {
    const { childItem, name } = item || {}
    if (['from', 'to'].includes(type) && (!childItem || !childItem.length)) {
      const [first, ...rest] = index
      const temp = [...tree[type]]
      let res = temp[first]
      rest.forEach(i => {
        res = res.childItem[i]
      })
      const randChild = randomNum(2, 6)
      res['childItem'] = []
      for (let i = 0; i <= randChild; i++) {
        let suffix = ''
        switch (type) {
          case 'from':
            suffix = parentNames[randomNum(0, 3)]
            break
          case 'to':
            suffix = sonNames[randomNum(0, 3)]
            break
          default:
            suffix = parentNames[randomNum(0, 3)]
        }
        res['childItem'].push({
          name: `${name}的${suffix}`,
          value: randomNum(100, 1000)
        })
      }
      
      setTree({
        ...tree,
        [type]: temp
      })
    }
  }

  const onItemRightClick = item => {
    console.log(item)
  }

  return (
    <div className="fromto-container-demo-wrapper">
      <Radio.Group
        value={align}
        options={options}
        optionType="button"
        onChange={e => setAlign(e.target.value)}
      />
      <h1 style={{ margin: '20px 0' }}>align {align}</h1>
      <h1 style={{ margin: '20px 0' }}>请点击节点查看效果</h1>
      <div style={{ border: '1px solid #dcdcdc', padding: 10 }}>
        <DICFromtoContainer
          data={tree}
          align={align}
          itemWidth={200}
          onItemClick={onItemClick}
          onItemRightClick={onItemRightClick}
          pageSize={3}
          renderItem={item => (
            <div style={{ margin: 10 }}>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.name}</div>
              <div style={{ fontSize: 15 }}>{item.value}</div>
            </div >
          )}
        />
      </div>
    </div>
  )
}

export default FromtoContainerCpt
