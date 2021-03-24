import React, { useCallback, useRef, useEffect } from 'react'
import Utils from '@utils'
import Word from './Word'
import './index.less'


const Giorno = (props: any) => {
  const { h, w } = props
  const canvas = useRef<any>()
  const interval = useRef<any>()

  const initCanvas = useCallback(() => {
    const c = canvas.current.getContext('2d')
    const wordsAttr: any[] = []

    c.fillStyle = '#dcdcdc'

    for (let i = 0; i < 20; i++) {
      wordsAttr.push(new Word({ key: '無駄', w, h }))
    }

    const move = () => {
      wordsAttr.forEach((_, i) => {
        if (wordsAttr[i].x > w) {
          wordsAttr[i].x = -wordsAttr[i].width
          wordsAttr[i].y = Math.random() * h
        } else {
          wordsAttr[i].x += wordsAttr[i].speed
        }
      })
    }

    const animation = () => {
      wordsAttr.forEach((_, i) => {
        c.font = wordsAttr[i].font
        c.fillText(wordsAttr[i].text, wordsAttr[i].x, wordsAttr[i].y)
        wordsAttr[i].width = c.measureText(wordsAttr[i].text).width
        c.stroke()
      })
      move()
    }

    const init = () => {
      c.clearRect(0, 0, w, h)
      animation()
    }

    if (!!requestAnimationFrame) {
      const loop = () => {
        init()
        interval.current = requestAnimationFrame(loop)
      }
      loop()
    } else {
      interval.current = setInterval(init, 24)
    }
  }, [canvas])

  useEffect(() => {
    initCanvas()
    return () => {
      if (!!requestAnimationFrame) {
        cancelAnimationFrame(interval.current)
      } else {
        clearInterval(interval.current)
      }
    }
  }, [])

  return (
    <div className="giorno-wrapper" >   
      <canvas className="muda" ref={canvas} height={h} width={w}/>
      <div className="icon-body">
        <div className="top">
          <div className="nose" />
          <div className="eye left" />
          <div className="eye right" />
        </div>
        <div className="heart-wrapper">
          <div className="left-spot-1" />
          <div className="right-spot-1" />
          <div className="left-spot-2" />
          <div className="right-spot-2" />
          <div className="left-spot-3" />
          <div className="right-spot-3" />
          <div className="line" />
          <div className="heart">
            <div className="heart-left" />
            <div className="heart-right" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Utils.connect({
  component: Giorno,
  mapStateToProps: state => ({
    h: state.common.contentHeight,
    w: state.common.contentWidth
  })
})
