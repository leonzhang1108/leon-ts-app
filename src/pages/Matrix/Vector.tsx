import * as React from 'react'

const renderItem = (col, colIndex, rowIndex, props, rowTransform) => {
  const colTransform = props.transformCol && props.transformCol.start <= colIndex && props.transformCol.end >= colIndex 

  return (
    <li className={`
        col 
        ${colTransform ? 'col-transform' : ''} 
        ${props.hilightList && props.hilightList[rowIndex][colIndex] === 1 ? 'hilight' : ''}
      `} 
      key={colIndex}
    >
      { 
        props.editable
          ? <input type="text" value={col} 
              data-row={rowIndex} data-col={colIndex} 
              data-ventor={props.ventor}
              onChange={props.onInput} 
            />
          : <span style={{transform: `rotate(${props.rotate ? '90deg' : '0'})`}} className={`${col !== '' ? 'show' : ''}`}>{col}</span> 
      }
      {
        props.hasShadow
          ? <div className={`shadow ${rowTransform ? 'show' : ''}`}>×</div>
          : ''
      }
    </li> 
  )
}

const renderCol = (row, rowIndex, props) => {
  const rowTransform = props.transformRow && props.transformRow.start <= rowIndex && props.transformRow.end >= rowIndex 

  return (
    <ul className={`row ${rowTransform ? 'row-transform' : ''}`} 
      key={rowIndex}
    >
      {
        row.map((col, colIndex) => {

          return renderItem(col, colIndex, rowIndex, props, rowTransform)
        })
      }
    </ul>
  )
}

const renderRow = props => {
  if (!props.ventorList) {
    return <td/>
  }

  return (
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
}

const Vector = props => (
  <table className={`${props.ventorList ? 'show' : ''}`} style={{ 
    transform: `
      rotate(${props.rotate ? '-90deg' : '0'}) 
      translateX(${props.left || 0}px)
      translateY(${-props.top || 0}px)`,
    ...props.style
  }}>
    <tbody>
      <tr>
        {renderRow(props)}
      </tr>
    </tbody>
  </table>
)


export default Vector
