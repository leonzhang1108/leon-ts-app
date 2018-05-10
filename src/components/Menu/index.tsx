import * as React from 'react'
import './index.less'
import { Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { bindActionCreators } from 'redux'
import { common } from '@actions'
import Utils from '@utils'
import menus from '@constant/menus'


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

  renderMenus = () => {
    return menus.map(menu => (
      <Menu.Item key={`/${menu.route}`}>
        <Icon type={menu.icon} />
        <Link className="menu-item-link" to={`/${menu.route}`} onClick={this.changeBreadcrumb.bind(this, menu.route)} >{menu.title}</Link>
      </Menu.Item>
    ))
  }

  render() {
    const { pathname } = this.props.location
    return (
      <div className="menu-wrapper">
        <div className="logo" />
        <Menu
          className="left-menu"
          defaultSelectedKeys={[pathname !== '/' ? pathname : '/op1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
          { this.renderMenus() }
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