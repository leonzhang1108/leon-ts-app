
import * as React from 'react'
import './index.less'
import imgSrc from '@img/fulei.png'

const renderSquare = () => (
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

const Calligraphy = () => (
  <div className='calligraphy-wrapper'>
    <div className='title'>书汉字之韵 写墨香童年</div>
    <div className='person'>班级：<span/>&nbsp;&nbsp;姓名：<span/></div>
    <div className='calligraphy-content'>
      <div className='anticon anticon-ts-app icon-brush'/>
      <div className='anticon anticon-ts-app icon-teddy'/>
      <img className='fulei-logo' src={imgSrc}/>
      <div className='row'>
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
      </div>
      <div className='row'>
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
      </div>
      <div className='row'>
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
        { renderSquare() }
      </div>
    </div>
  </div>
)

export default Calligraphy
