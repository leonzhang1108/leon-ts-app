import * as React from 'react'
import './index.less'

const Loading = ({ isLoading, error }) => {

  let res = <span/>

  if (error) {
    res = <span>Sorry, there was a problem loading the page.</span>
  }

  if (isLoading) {
    res = <div className='loader'/>
  }

  return <div className='loading-center'>{res}</div>
}

export default Loading
