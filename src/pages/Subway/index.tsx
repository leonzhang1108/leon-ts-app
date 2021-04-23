import React, { useRef, useEffect, useState } from 'react'
import { getScript } from '@utils'
import Loader from '@cpt/Loader'
import './index.less'

const mapUrl = 'https://api.map.baidu.com/api?type=subway&v=1.0&ak=mS6bT1vyU9WYtFEqhUevBrhRji8CDmlO'

const getSubwayCity = (cityname: string) => {
  const { BMapSub }: any = window
  const list = BMapSub.SubwayCitiesList
  let subwaycity: any = null
  for (var i = 0; i < list.length; i++) {
    if (list[i].name === cityname) {
      subwaycity = list[i]
      break
    }
  }
  return subwaycity
}

const Subway = () => {
  const mapRef = useRef<any>()
  const markerRef = useRef<any>()
  const wrapperRef = useRef<any>()
  const [loadingMap, setLoadingMap] = useState(true)
  const [fromto, setFromto] = useState<any>({
    from: null,
    to: null,
  })

  useEffect(() => {
    const { BMapSub }: any = window
    if (loadingMap) return
    const subwaycity = getSubwayCity('上海')
    const subway = new BMapSub.Subway('subway', subwaycity.citycode)
    subway.addControl({
      offset: new BMapSub.Size(10, 100),
    })
    subway.setZoom(0.5)
    subway.setCenter('静安寺')
    mapRef.current = subway

    // 绑定zoom方法
    function onMouseWheel(e) {
      const scale = e.wheelDelta / 300
      const factor = Math.pow(1.1, scale)
      mapRef.current.setZoom(mapRef.current.getZoom() * factor)
      e.preventDefault()
    }

    wrapperRef.current.addEventListener('wheel', onMouseWheel)
    return () => {
      wrapperRef.current.removeEventListener('wheel', onMouseWheel)
    }
  }, [loadingMap])

  const setMark = (name) => {
    const { BMapSub }: any = window
    if (!BMapSub) return
    const startIcon = new BMapSub.Icon(
      'https://api.map.baidu.com/images/subway/start-bak.png',
      new BMapSub.Size(50, 80)
    )
    const marker = new BMapSub.Marker(name, { icon: startIcon })
    mapRef.current.addMarker(marker)
    // mapRef.current.setCenter(name)
    // mapRef.current.setZoom(0.5)
    markerRef.current = marker
  }

  useEffect(() => {
    const { BMapSub }: any = window
    if (loadingMap) return
    const { from, to } = fromto
    mapRef.current.addEventListener('tap', function handler(e) {
      const { station } = e
      if (from && to) {
        // 设置起点
        setFromto({
          from: station,
          to: null,
        })
        setMark(station.name)
      } else if (from) {
        // 设置终点
        setFromto({
          ...fromto,
          to: station,
        })
        mapRef.current.removeMarker(markerRef.current)
      } else {
        // 设置起点
        setFromto({
          ...fromto,
          from: station,
        })
        setMark(station.name)
      }
      mapRef.current.removeEventListener('tap', handler)
    })

    if (from && to) {
      const drct = new BMapSub.Direction(mapRef.current)
      drct.search(from, to)
    }
  }, [loadingMap])

  useEffect(() => {
    const { BMapSub }: any = window
    if (BMapSub) {
      setLoadingMap(false)
    } else {
      getScript(mapUrl).then(() => {
        setLoadingMap(false)
      })
    }
  }, [])

  return !loadingMap ? (
    <div className="subway-wrapper" ref={wrapperRef}>
      <div id="subway" />
    </div>
  ) : (
    <div className="loading-center">
      <Loader />
    </div>
  )
}

export default Subway
