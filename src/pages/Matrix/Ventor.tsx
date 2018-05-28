import * as React from 'react'

const renderItem = (col, colIndex, rowIndex, props) => (
  <li className='col' key={colIndex}>
    { 
      props.editable
        ? <input type="text" value={col} 
            data-row={rowIndex} data-col={colIndex} 
            data-ventor={props.ventor}
            onChange={props.onInput} 
          />
        : <span style={{transform: `rotate(${props.rotate ? '90deg' : '0'})`}}>{col}</span> 
    }
  </li> 
)

const renderCol = (row, rowIndex, props) => (
  <ul className='row' key={rowIndex}>
    {
      row.map((col, colIndex) => 
        renderItem(col, colIndex, rowIndex, props)
      )
    }
  </ul>
)

const renderRow = props => (
  <td>
    <div className='border-left'/>
    {
      props.ventorList.map((row, rowIndex) => 
        renderCol(row, rowIndex, props)
      )
    }
    <div className='border-right'/>
  </td>
)

const Vector = props => (
  <table style={{ 
    transform: `
      rotate(${props.rotate ? '-90deg' : '0'}) 
      translateX(${props.left || 0}px)
      translateY(${-props.top || 0}px)`
  }}>
    <tbody>
      <tr>
        {renderRow(props)}
      </tr>
    </tbody>
  </table>
)


export default Vector
