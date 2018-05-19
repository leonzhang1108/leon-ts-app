import * as React from 'react'
import './index.less'
import { Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { RouteComponentProps } from 'react-router'
import { common } from '@actions'
import Utils from '@utils'
import menus from '@constant/menus'
import { Layout } from 'antd'
const { Sider } = Layout
const SubMenu = Menu.SubMenu


interface IProps {
  collapsed: boolean,
  actions: {
    changeBreadcrumb(v: string): void,
    toggleCollapse(): void
  }
}

class MenuComponent extends React.Component<IProps & RouteComponentProps<any>> {

  changeBreadcrumb = (breadcrumb: string) => {
    this.props.actions.changeBreadcrumb(breadcrumb)
  }

  renderMenus = (currMenus = menus) => currMenus.map(menu => 
    menu.childs
      ? (
        <SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}>
          { this.renderMenus(menu.childs) }
        </SubMenu>
      ) : (
        <Menu.Item key={`/${menu.route}`}>
          <Icon type={menu.icon} />
          <Link className="menu-item-link" to={`/${menu.route}`} onClick={this.changeBreadcrumb.bind(this, menu.route)} >
            <span className={this.props.collapsed ? 'collapsed' : ''}>{menu.title}</span>  
          </Link>
        </Menu.Item>
      )
  )

  render() {
    const { pathname } = this.props.location
    return (
      <Sider
        style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }}
        collapsible
        collapsed={this.props.collapsed}
        onCollapse={this.props.actions.toggleCollapse}
      >
        <div className="logo" />
        <Menu
          className="left-menu"
          defaultSelectedKeys={[pathname !== '/' ? pathname : '/home']}
          defaultOpenKeys={['echarts']}
          mode="inline"
          theme="dark"
        >
          { this.renderMenus() }
        </Menu>
      </Sider>
    )
  }
}


export default Utils.connect({
  component: withRouter(MenuComponent),
  mapStateToProps: state => ({
    collapsed: state.common.collapsed
  }),
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators({
      changeBreadcrumb: common.changeBreadcrumb,
      toggleCollapse: common.toggleCollapse
    }, dispatch)
  })
})