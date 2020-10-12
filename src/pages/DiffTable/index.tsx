import React from 'react'
import DiffTableCpt from './diff-table-cpt'
import './index.less'

const table1 = {
  head: [
    {
      label: 'label1',
      key: 'key1'
    },
    {
      label: 'label2',
      key: 'key2'
    },
    {
      label: 'label3',
      key: 'key3'
    }
  ],
  body: [
    {
      key1: '111',
      key2: '22asdfasdf2'
    },
    {
      key1: '333',
      key2: '444'
    }
  ]
}

const table2 = {
  head: [
    {
      label: 'label1',
      key: 'key1'
    },
    {
      label: 'label2',
      key: 'key2'
    },
    {
      label: 'label4',
      key: 'key4'
    }
  ],
  body: [
    {
      key1: '111',
      key2: '2222',
      key4: '12'
    },
    {
      key1: '333',
      key2: '444'
    }
  ]
}

const DiffTable = () => {
  return <DiffTableCpt newData={table2} oldData={table1} />
}

export default DiffTable
