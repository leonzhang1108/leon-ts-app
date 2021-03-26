import React from 'react'
import Utils from '@utils'
import './index.less'

const Mando = (props: any) => {
  const { isMobile } = props
  return (
    <div className="mando-wrapper">
      <div className={`icon-wrapper ${isMobile ? '' : 'pc'}`}>
        <div className="casco-top">
          <div className="rayas-casco" />
        </div>
        <div className="linea" />
        <div className="cara">
          <div className="visor" />
          <div className="visor-abajo" />
          <div className="circulo-1" />
          <div className="circulo-2" />
          <div className="costado-1" />
          <div className="costado-2" />
          <div className="corte-casco-1" />
          <div className="corte-casco-2" />
        </div>
      </div>
      <div className="text">
        <h2 className="title">
          <span>THE MANDALORIAN</span>
          THIS IS THE WAY
        </h2>
      </div>
    </div>
  )
}

export default Utils.connect({
  component: Mando,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})

