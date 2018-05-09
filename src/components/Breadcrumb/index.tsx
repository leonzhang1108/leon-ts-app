import * as React from 'react'
import { Breadcrumb } from 'antd'
import './index.less'
import Utils from '@utils'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { common } from '@actions'

interface IProps {
  breadcrumb: string,
  actions: {
    changeBreadcrumb(v): void
  }
}

class BreadcrumbComponent extends React.Component<IProps & RouteComponentProps<any>> {

  componentWillMount() {
    this.props.actions.changeBreadcrumb(this.props.location.pathname.split('/').filter(i => i).join(''))
  }

  render() {
    return (
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>{this.props.breadcrumb}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }
}


export default Utils.connect({
  component: withRouter(BreadcrumbComponent),
  mapStateToProps: state => ({
    breadcrumb: state.common.breadcrumb
  }),
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators({ 
      changeBreadcrumb: common.changeBreadcrumb
    }, dispatch)
  })
})