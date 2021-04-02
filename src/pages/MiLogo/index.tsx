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
    }

    return [...list1, ...list2.reverse(), ...list3.reverse(), ...list4]
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
          <svg
            className="icon"
            style={{ verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden' }}
            viewBox="0 0 1024 1024"
            version="1.1"
            height={squareSize / 2}
            width={squareSize / 2}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M733.83895837 811.96552989V351.20041984c0-104.69224675-84.84450873-189.5751771-189.52511375-189.57517824H11.54756494c-4.10763264 0-7.43635285 3.31009138-7.43635285 7.37580942v642.9598208c0 4.06571805 3.32755513 7.36067357 7.43635285 7.36067357h142.30712661c4.10879773 0 7.43169479-3.31241927 7.43169594-7.40142307V307.27273131c0-4.09715485 3.32755513-7.42121699 7.43635171-7.42121699h306.01981952c57.46611086 0 104.06818475 46.57995207 104.06818475 104.05304888v408.00042326c0 4.09366187 3.32289821 7.39793123 7.41073806 7.3979301H726.43404117c4.07852601 0 7.41073806-3.30194034 7.41073806-7.36067357l-0.00582086 0.0232869z m-287.37596303-0.05006564a7.3874523 7.3874523 0 0 1-7.40608 7.40608114H296.78355229c-4.10879773 0-7.43635285-3.31241927-7.43635286-7.40608114V425.20767033c0-4.09366187 3.32755513-7.41655893 7.43635286-7.41656007h142.27336305a7.39909518 7.39909518 0 0 1 7.40608 7.41656007V811.93525817v-0.01979392m568.94092743 0c0 4.09715485-3.33221205 7.40608114-7.43984469 7.40608114H865.72331577c-4.11927552 0-7.46895246-3.31241927-7.46895246-7.40608114V169.06974436c0-4.11228957 3.34967694-7.43169479 7.46895246-7.43169479h142.24076231a7.42820295 7.42820295 0 0 1 7.43984469 7.43169479v642.84571989" />
          </svg>
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
        <Slider max={125} min={75} step={1} value={size} onChange={setSize} />
        <h4>
          幂: (x^{power} + y^{power}) = 1
        </h4>
        <Slider max={10} min={1} step={0.1} value={power} onChange={setPower} />
      </div>
    </div>
  )
}

export default MiLogo
