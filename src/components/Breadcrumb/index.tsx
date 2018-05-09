
import * as React from 'react'
import { Breadcrumb } from 'antd'
import './index.less'
import Utils from '@utils'

const BreadcrumbComponent = props => (
  <Breadcrumb style={{ margin: '16px 0' }}>
    <Breadcrumb.Item>{props.breadcrumb}</Breadcrumb.Item>
  </Breadcrumb>
)

export default Utils.connect(BreadcrumbComponent,
  state => ({
    breadcrumb: state.common.breadcrumb
  }),
  () => ({})
)
