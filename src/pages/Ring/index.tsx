import React, { useEffect, useRef, useState } from 'react'
import Loader from '@cpt/Loader'
import './index.less'
import Ring from './ring'

const RingIndex = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  return (
    <div className="ring-wrapper">
      {loading && <Loader />}
      {error ? (
        <div>{error}</div>
      ) : (
        <Ring setLoading={setLoading} setError={setError} />
      )}
    </div>
  )
}

export default RingIndex
