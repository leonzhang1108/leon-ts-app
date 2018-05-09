import * as React from 'react'
import './index.less'
import { Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { bindActionCreators } from 'redux'
import { common } from '@actions'
import Utils from '@utils'


interface IProps {
  breadcrumb: string,
  actions: {
    changeBreadcrumb(v): void
  }
}

class MenuComponent extends React.Component<IProps & RouteComponentProps<any>> {

  changeBreadcrumb = (breadcrumb: string) => {
    this.props.actions.changeBreadcrumb(breadcrumb)
  }

  render() {
    const { pathname } = this.props.location

    return (
      <div className="menu-wrapper">
        <div className="logo" />
        <Menu
          className="left-menu"
          defaultSelectedKeys={[pathname || '/op1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="/op1">
            <Icon type="pie-chart" />
            <Link className="menu-item-link" to="/op1" onClick={this.changeBreadcrumb.bind(this, 'op1')} >Option 1</Link>
          </Menu.Item>
          <Menu.Item key="/op2">
            <Icon type="desktop" />
            <Link className="menu-item-link" to="/op2" onClick={this.changeBreadcrumb.bind(this, 'op2')} >Option 2</Link>
          </Menu.Item>
          <Menu.Item key="/op3">
            <Icon type="inbox" />
            <Link className="menu-item-link" to="/op3" onClick={this.changeBreadcrumb.bind(this, 'op3')} >Option 3</Link>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}


export default Utils.connect({
  component: withRouter(MenuComponent),
  mapStateToProps: state => ({
    breadcrumb: state.common.breadcrumb
  }),
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators({
      changeBreadcrumb: common.changeBreadcrumb
    }, dispatch)
  })
})