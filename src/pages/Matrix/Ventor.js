
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
        : <span>{col}</span> 
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
    <div className='border-left'></div>
    {
      props.ventorList.map((row, rowIndex) => 
        renderCol(row, rowIndex, props)
      )
    }
    <div className='border-right'></div>
  </td>
)

const Vector = props => (
  <table>
    <tbody>
      <tr>
        {renderRow(props)}
      </tr>
    </tbody>
  </table>
)


export default Vector
