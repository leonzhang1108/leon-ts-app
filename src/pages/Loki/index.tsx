import React, { useEffect, useRef, useState } from 'react'
import Utils from '@utils'
import './index.scss'

const fonts = [
  'Kirang Haerang',
  'Indie Flower',
  'Rye',
  'Amatic SC',
  'Bangers',
  'Fredericka the Great'
]

const Loki = (props: any) => {

  const loki = useRef<any>()
  const [count, setCount] = useState(0)

  const { isMobile } = props

  useEffect(() => {
    const letters: any = loki.current.querySelectorAll('.letter')
    const rollIntro = () => {
      letters.forEach(letter => {
        let randomFontIndex = Math.floor(Math.random() * fonts.length)
        let randomFont = fonts[randomFontIndex]
        letter.style.fontFamily = randomFont
      })
    }

    const timeout = setTimeout(() => {
      rollIntro()
      setCount(count + 1)
    }, 350)

    return () => {
      clearTimeout(timeout)
    }
  }, [count])

  return (
    <div className="loki-container">
      <h2 className={`loki ${isMobile ? 'mobile' : ''}`} ref={loki}>
        <p className="letter">L</p>
        <p className="letter">O</p>
        <p className="letter">K</p>
        <p className="letter">I</p>
      </h2>
    </div>
  )
}

export default Utils.connect({
  component: Loki,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})