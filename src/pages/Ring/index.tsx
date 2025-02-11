import React, { useEffect, useRef, useState } from 'react'
import Loader from '@cpt/Loader'
import './index.less'
import Ring from './ring'

const RingIndex = () => {
  const [loading, setLoading] = useState(true)

  return (
    <div className="ring-wrapper">
      {loading && <Loader />}
      <Ring setLoading={setLoading} />
    </div>
  )
}

export default RingIndex
