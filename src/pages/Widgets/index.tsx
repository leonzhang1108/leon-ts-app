// import DatePicker from '@cpt/DatePicker'
// import ImgZoomer from '@cpt/ImgZoomer'
import src from '@img/justice_league.jpg'
import Utils from '@utils'
import React from 'react'
import './index.less'
import * as imgzoomer from 'imgzoomer'
import { Button, Modal } from 'antd'

interface IProps {
  height: number,
  width: number
}

class Widgets extends React.Component<IProps> {
  svgLabelEditor
  imgZoomer

  componentDidMount () {
    const { height, width } = this.props
    const { Zoomer, SVGLabelEditor } = imgzoomer
    this.imgZoomer = new Zoomer('canvas', { width, height })
    this.imgZoomer.draw(src)

    this.svgLabelEditor = new SVGLabelEditor('svg-wrapper', {
      imgZoomer: this.imgZoomer,
      pointsList: [
        [
          { x: 415.84196194762626, y: 147.26284891271456 },
          { x: 600.8419619476263, y: 190.26284891271456 },
          { x: 653.8419619476264, y: 352.26284891271456 },
          { x: 376.1088135552601, y: 340.5695301104572 }
        ],
        [
          { x: 940.7072245800349, y: 338.003545055495 },
          { x: 1013.1629207825664, y: 471.97822859979857 },
          { x: 880.5553258458576, y: 447.37063366308996 }
        ]
      ]
    })
  }

  componentWillUnmount () {
    this.imgZoomer.removeEvents()
    this.svgLabelEditor.removeEvents()
  }

  getPoints = () => {
    Modal.info({
      title: 'Points',
      content: (
        <div>
          {
            this.svgLabelEditor.pointsList.map((item, i) => (
              <div key={i}>
                [{
                  item.map(({ x, y }, index) => <div key={index}>({ x }, { y })</div>)
                }]
              </div>
            ))
          }
        </div>
      )
    })
  }

  render () {
    // const fromDate = new Date('1991-11-8')
    // const toDate = new Date()
    return (
      <div className='widget-wrapper'>
        {/* <DatePicker fromDate={fromDate} toDate={toDate}/> */}
        {/* <ImgZoomer
          wrapperHeight={height}
          wrapperWidth={width}
          src={src}
        /> */}
        <svg id='svg-wrapper'/>
        <canvas id='canvas'/>
        <Button className='btn' type='primary' onClick={this.getPoints}>get points</Button>
      </div>
    )
  }
}

export default Utils.connect({
  component: Widgets,
  mapStateToProps: state => ({
    height: state.common.contentHeight,
    width: state.common.contentWidth
  })
})
