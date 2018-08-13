import * as React from 'react'
import { Breadcrumb } from 'antd'
import Utils from '@utils'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { common } from '@actions'
import './index.less'

interface IProps {
  breadcrumb: any[],
  actions: {
    changeBreadcrumb (v): void
  }
}

class BreadcrumbComponent extends React.Component<IProps & RouteComponentProps<any>> {

  componentWillMount () {
    this.initBreadcrumb()
  }

  initBreadcrumb () {
    const route = this.props.location.pathname.split('/').filter(i => i).join('/')

    Utils.findBreadcrumb(route, this.props.actions.changeBreadcrumb)

  }

  render () {
    return (
      <Breadcrumb style={{ margin: '10px 0' }}>
        {
          this.props.breadcrumb.length
            ? this.props.breadcrumb.map((v, i) =>
              <Breadcrumb.Item key={i}>{v.title}</Breadcrumb.Item>
            ) : <Breadcrumb.Item>home</Breadcrumb.Item>
        }
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
