
import bamboo from '@img/bamboo.png'
import bird from '@img/bird.jpg'
import fulei from '@img/fulei.png'
import * as React from 'react'
import './index.less'

const renderSquare = () => (
  <table>
    <tbody>
      <tr>
        <td/><td/>
      </tr>
      <tr>
        <td/><td/>
      </tr>
    </tbody>
  </table>
)

const Calligraphy = () => (
  <div className='calligraphy-wrapper'>
    <div className='title'>书汉字之韵 写墨香童年</div>
    <div className='person'>班级：<span/>&nbsp;&nbsp;姓名：<span/></div>
    <div className='calligraphy-content'>
      <img className='fulei-logo' src={fulei}/>
      <img className='bird' src={bird}/>
      <img className='bamboo' src={bamboo}/>
      {
        Array(4).fill(0).map(_ => (
          <div className='row'>
            { Array(6).fill(0).map(renderSquare) }
          </div>
        ))
      }
    </div>
  </div>
)

export default Calligraphy
