import React, { useState } from 'react'
import FormulaInput from '@cpt/FormulaInput'
import NotAvailableOnMobile from '@cpt/NotAvailableOnMobile'
import Utils from '@utils'
import './index.less'

const options = [
  {
    field: 'superman',
    name: 'ClarkKent'
  },
  {
    field: 'batman',
    name: 'BruceWayne'
  },
  {
    field: 'theflash',
    name: 'BarryAllen'
  },
  {
    field: 'wonderwoman',
    name: 'DianaPrince'
  },
  {
    field: 'aquaman',
    name: 'ArthurCurry'
  },
  {
    field: 'cyborg',
    name: 'VictorStone'
  },
  {
    field: 'greenlantern',
    name: 'HalJordan'
  }
]

const FormulaInputDemo = (props: any) => {
  const { isMobile } = props
  const [value, setValue] = useState({
    formula: '1+superman+2-batman+3*aquaman+4/wonderwoman',
    vars: {
      superman: 'ClarkKent',
      batman: 'BruceWayne',
      aquaman: 'ArthurCurry',
      wonderwoman: 'DianaPrince'
    }
  })

  return !isMobile ? (
    <div className="formula-input-demo-wrapper">
      <h2>使用方法</h2>
      <h3>输入框内只能输入数字及 +-*/.@()，其中键入 @ 可触发下拉筛选变量</h3>
      <div style={{ marginBottom: 20 }}>
        small:
        <FormulaInput
          value={value}
          setValue={setValue}
          options={options}
          placeholder="输入「@」后选择指标"
          size="small"
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        mid:
        <FormulaInput
          value={value}
          setValue={setValue}
          options={options}
          placeholder="输入「@」后选择指标"
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        large:
        <FormulaInput
          value={value}
          setValue={setValue}
          options={options}
          placeholder="输入「@」后选择指标"
          size="large"
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        disabled:
        <FormulaInput
          value={value}
          setValue={setValue}
          options={options}
          placeholder="输入「@」后选择指标"
          disabled={true}
        />
      </div>
      <pre>{ JSON.stringify(value, null, 2) }</pre>
    </div>
  ) : <NotAvailableOnMobile />
}

export default Utils.connect({
  component: FormulaInputDemo,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})
