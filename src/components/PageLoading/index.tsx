import * as React from 'react'
import { Icon } from 'antd'
import './index.less'

const Loading = ({ isLoading, error }) => {
  
  let res = <span/>

  if (error) {
    res = <span>Sorry, there was a problem loading the page.</span>
  }

  if (isLoading) {
    res = <Icon type='loading' />
  }

  return <div className='loading-center'>{res}</div>
}

export default Loading
