import * as React from 'react'
import './index.less'
import { Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { common } from '@actions'
import Utils from '@utils'
import menus from '@constant/menus'
import { Layout } from 'antd'
const { Sider } = Layout

class MenuComponent extends React.Component<any> {

  changeBreadcrumb = (breadcrumb: string) => {
    this.props.actions.changeBreadcrumb(breadcrumb)
  }

  renderMenus = () => {
    return menus.map(menu => (
      <Menu.Item key={`/${menu.route}`}>
        <Icon type={menu.icon} />
        <Link className="menu-item-link" to={`/${menu.route}`} onClick={this.changeBreadcrumb.bind(this, menu.route)} >
          <span className={this.props.collapsed ? 'collapsed' : ''}>{menu.title}</span>  
        </Link>
      </Menu.Item>
    ))
  }

  render() {
    const { pathname } = this.props.location
    return (
      <div className="menu-wrapper">

         <Sider
          style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }}
          collapsible
          collapsed={this.props.collapsed}
          onCollapse={this.props.onCollapse}
        >
          <div className="logo" />
          <Menu
            className="left-menu"
            defaultSelectedKeys={[pathname !== '/' ? pathname : '/home']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
          >
            { this.renderMenus() }
          </Menu>
        </Sider>
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
}) as any