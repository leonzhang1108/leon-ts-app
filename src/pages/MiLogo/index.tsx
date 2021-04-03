import React, { useMemo, useState } from 'react'
import { Slider } from 'antd'
import './index.less'

const precision = 10000

const MiLogo = () => {
  const [power, setPower] = useState(3)
  const [size, setSize] = useState(100)
  const [step, setStep] = useState(0.05)
  const [strokeWidth] = useState(4)

  const points = useMemo(() => {
    let list1: string[] = []
    let list2: string[] = []
    let list3: string[] = []
    let list4: string[] = []
    let center = ''

    const range = Math.pow(0.5, 1 / power)

    for (
      let i = -range;
      i <= range;
      i = Math.round((i + step) * precision) / precision
    ) {
      const x = Math.pow(1 - Math.pow(Math.abs(i), power), 1 / power)
      const x1 = (1 + x) * size + strokeWidth
      const x2 = (1 - x) * size + strokeWidth
      const y = (1 + i) * size + strokeWidth
      const ax1 = Math.round(x1 * precision) / precision
      const ax2 = Math.round(x2 * precision) / precision
      const ay = Math.round(y * precision) / precision
      list1.push(`${ax1},${ay}`)
      list2.push(`${ay},${ax1}`)
      list3.push(`${ax2},${ay}`)
      list4.push(`${ay},${ax2}`)
      if (i === -range) {
        center = `${x1},${x1}`
      }
    }

    return [...list1, center, ...list2.reverse(), ...list3.reverse(), ...list4]
  }, [power, size, step])

  const squareSize = useMemo(() => {
    return (size + strokeWidth) * 2
  }, [size, strokeWidth])

  return (
    <div className="mi-logo-wrapper">
      <div className="logo-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          style={{ background: '#fff' }}
          width={squareSize}
          height={squareSize}
        >
          <polygon
            points={points.join(' ')}
            fill="#EE722E"
            stroke="#EE722E"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
        <div className="mi-logo">
          <i className="anticon anticon-ts-app ts-app icon-mi" style={{ fontSize: squareSize / 2 }} />
        </div>
      </div>
      <div className="slider-wrapper">
        <h4>精度</h4>
        <Slider
          max={0.5}
          min={0.002}
          step={0.002}
          value={step}
          onChange={setStep}
        />
        <h4>大小</h4>
        <Slider max={150} min={50} step={2} value={size} onChange={setSize} />
        <h4>
          幂: (x^{power} + y^{power}) = 1
        </h4>
        <Slider max={10} min={0.5} step={0.1} value={power} onChange={setPower} />
      </div>
    </div>
  )
}

export default MiLogo
