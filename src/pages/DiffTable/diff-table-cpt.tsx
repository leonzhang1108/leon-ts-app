import React from 'react'
import './diff-table-cpt.less'

interface HeaderProps {
  label: string
  key: string
}

interface DataProps {
  head: HeaderProps[]
  body: any[]
}

interface SingleTableProps {
  data: DataProps
  compareData: DataProps
  type: "old" | "new"
}

interface DiffTableCptProps {
  newData: DataProps
  oldData: DataProps
}

const SingleTable = (props: SingleTableProps) => {
  const { data, type, compareData } = props
  return (
    <table className={`diff-table ${type}`}>
      <thead>
        <tr>
          {
            (data.head || []).map((item, key) => {
              const compareKey = compareData.head[key].key
              let className = ''
              if (item.key !== compareKey) {
                className = type ==='old' ? 'red' : 'green'
              }
              return <th className={className} key={key}>{item.label}</th>
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          (data.body || []).map((row, rowIndex) => {
            const compareRow = compareData.body[rowIndex] || {}
            const compareRowList = (compareData.head || []).map(item => item.key)
            return (
              <tr key={rowIndex}>
                {
                  (data.head || []).map((column, index) => {
                    const { key } = column
                    let className = ''
                    const compareKey = compareRowList[index]
                    if (key !== compareKey || row[key] !== compareRow[compareKey]) {
                      className = type ==='old' ? 'red' : 'green'
                    }
                    return <td className={className} key={index}>{row[key]}</td>
                  })
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}


const DiffTableCpt = (props: DiffTableCptProps) => {
  const { newData, oldData } = props
  return (
    <div className="diff-table-wrapper">
      <SingleTable data={oldData} compareData={newData} type="old"/>
      <SingleTable data={newData} compareData={oldData} type="new"/>
    </div>
  )
}


export default DiffTableCpt
