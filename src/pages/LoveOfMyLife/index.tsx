import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Utils from '@utils'
import './index.less'

const FONT_FAMILY =
  'Helvetica, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuan Yi Micro Hei", sans-serif'
const fontWeight = 'bold'
const BORDER_WIDTH = 0
const BG_COLOR = 'rgba(0,0,0,1)'
const rand = Math.random

const config = {
  traceK: 0.5,
}

const textList = ['發財', '服翼']

const LoveOfMyLife = (props: any) => {
  const { h, w, isMobile } = props
  const canvasRef = useRef<any>()
  const bgCanvasRef = useRef<any>()
  const rafRef = useRef<any>()
  const [text, setText] = useState<string>()
  const [ctx, setCtx] = useState<any>(null)
  const [bgCtx, setBgCtx] = useState<any>(null)
  const [matrix, setMatrix] = useState<any>([])
  const [initiated, setInitiated] = useState(false)
  const [globalE, setGlobalE] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  const CELL_SIZE = useMemo(() => {
    return isMobile ? 5 : 10
  }, [isMobile])

  const CELL_DISTANCE = useMemo(() => {
    return CELL_SIZE + BORDER_WIDTH
  }, [CELL_SIZE])

  const MAX_FONT_SIZE = useMemo(() => {
    return isMobile ? 300 : 500
  }, [isMobile])

  const height = useMemo(() => {
    return isMobile ? w : h
  }, [isMobile])

  const width = useMemo(() => {
    return isMobile ? h : w
  }, [isMobile])

  const traceCount = useMemo(() => {
    return isMobile ? 5 : 7
  }, [isMobile])

  const getE = useCallback(
    (max, width, height) => {
      const e: any = []
      for (let i = 0; i < max; i++) {
        const x = rand() * width
        const y = rand() * height
        e[i] = {
          vx: 0,
          vy: 0,
          R: 2,
          speed: rand() + isMobile ? 15 : 10,
          q: ~~(rand() * max),
          D: 2 * (i % 2) - 1,
          force: 0.2 * rand() + 0.7,
          f:
            'hsla(0,' +
            ~~(40 * rand() + 60) +
            '%,' +
            ~~(60 * rand() + 20) +
            '%,1)',
          trace: [],
        }
        for (let k = 0; k < traceCount; k++) {
          e[i].trace[k] = {
            x,
            y,
          }
        }
      }
      return e
    },
    [isMobile]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const bgCanvas = bgCanvasRef.current
    const context = canvas.getContext('2d')
    const bgContext = bgCanvas.getContext('2d')
    setCtx(context)
    setBgCtx(bgContext)
    return () => {
      rafRef.current && cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (!bgCtx) return
    const fontFamily = FONT_FAMILY
    bgCtx.clearRect(0, 0, width, height)
    bgCtx.textAlign = 'center'
    bgCtx.textBaseline = 'middle'
    bgCtx.fillStyle = BG_COLOR
    bgCtx.font = `${fontWeight} ${MAX_FONT_SIZE}px ${fontFamily}`
    const scale = width / bgCtx.measureText(text).width
    const fontSize = Math.min(MAX_FONT_SIZE, MAX_FONT_SIZE * scale * 0.8)
    bgCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    bgCtx.fillText(text, width / 2, height / 2)
    const matrix: any = []
    const pixels = bgCtx.getImageData(0, 0, width, height).data
    for (let i = 0; i < height; i += CELL_DISTANCE) {
      for (let j = 0; j < width; j += CELL_DISTANCE) {
        const alpha = pixels[(j + i * width) * 4 + 3]

        if (alpha > 0) {
          matrix.push([Math.floor(j), Math.floor(i)])
        }
      }
    }
    setMatrix(matrix)
  }, [bgCtx, height, width, text])

  const loop = () => {
    // ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(0,0,0,.1)'
    ctx.fillRect(0, 0, width, height)
    for (let i = globalE.length; i--; ) {
      const u = globalE[i] || {}
      const q = matrix[u.q] || []
      const dx = u.trace[0].x - (q[0] || width * rand())
      const dy = u.trace[0].y - (q[1] || height * rand())
      const length = Math.sqrt(dx * dx + dy * dy)
      if (10 > length) {
        if (0.95 < rand()) {
          u.q = ~~(rand() * matrix.length)
        } else {
          if (0.99 < rand()) {
            u.D *= -1
          }
          u.q += u.D
          u.q %= matrix.length
          if (0 > u.q) {
            u.q += matrix.length
          }
        }
      }
      u.vx += (-dx / length) * u.speed
      u.vy += (-dy / length) * u.speed
      u.trace[0].x += u.vx
      u.trace[0].y += u.vy
      u.vx *= u.force
      u.vy *= u.force
      for (let k = 0; k < u.trace.length - 1; ) {
        const T = u.trace[k]
        const N = u.trace[++k]
        N.x -= config.traceK * (N.x - T.x)
        N.y -= config.traceK * (N.y - T.y)
      }
      ctx.fillStyle = u.f
      for (let k = 0; k < u.trace.length; k++) {
        ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1)
      }
    }
    rafRef.current = window.requestAnimationFrame(loop)
  }

  const doLoop = useCallback(() => {
    rafRef.current && cancelAnimationFrame(rafRef.current)
    matrix.length && globalE.length && loop()
  }, [matrix, globalE])

  useEffect(() => {
    globalE && doLoop()
  }, [globalE])

  useEffect(() => {
    if (!matrix.length) return
    if (!initiated) {
      setInitiated(true)
      const e: any = getE(matrix.length, width, height)
      setGlobalE(e)
    } else {
      let nextE: any = []
      if (globalE.length > matrix.length) {
        nextE = globalE.slice(0, matrix.length)
        for (let i = 0; i < nextE.length; i++) {
          nextE[i].q = ~~(rand() * matrix.length)
        }
      } else {
        const e: any = getE(matrix.length - globalE.length, width, height)
        nextE = [...globalE, ...e]
      }

      setGlobalE(nextE)
    }
  }, [matrix, initiated])

  useEffect(() => {
    setText(textList[index % textList.length])
  }, [index])

  const canvasOnClick = useCallback(() => {
    setIndex((index) => index + 1)
  }, [])

  const canvasStyle = useMemo(() => {
    if (isMobile) {
      return {
        transform: 'rotate(90deg)',
        transformOrigin: `${height / 2}px ${height / 2}px`,
      }
    } else {
      return {}
    }
  }, [isMobile])

  return (
    <div className="love-of-my-life-wrapper" onClick={canvasOnClick}>
      <canvas
        style={canvasStyle}
        ref={canvasRef}
        height={height}
        width={width}
      />
      <canvas
        className="bg-canvas"
        style={canvasStyle}
        ref={bgCanvasRef}
        height={height}
        width={width}
      />
    </div>
  )
}

export default Utils.connect({
  component: LoveOfMyLife,
  mapStateToProps: (state) => ({
    h: state.common.contentHeight,
    w: state.common.contentWidth,
    isMobile: state.common.isMobile,
  }),
})
