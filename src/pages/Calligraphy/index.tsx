
import * as React from 'react'
import './index.less'

class Calligraphy extends React.Component {

  renderSquare = () => (
    <table>
      <tbody>
        <tr>
          <td/><td/><td/>
        </tr>
        <tr>
          <td/><td/><td/>
        </tr>
        <tr>
          <td/><td/><td/>
        </tr>
      </tbody>
    </table>
  )

  render () {
    return (
      <div className='calligraphy-wrapper'>
        <div className='title'>书汉字之韵 写墨香童年</div>
        <div className='person'>班级：<span/>&nbsp;&nbsp;姓名：<span/></div>
        <div className='calligraphy-content'>
          <div className='anticon anticon-ts-app icon-brush'/>
          <div className='anticon anticon-ts-app icon-teddy'/>
          <div className='row'>
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
          </div>
          <div className='row'>
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
          </div>
          <div className='row'>
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
            { this.renderSquare() }
          </div>
        </div>
      </div>
    )
  }
}

export default Calligraphy
