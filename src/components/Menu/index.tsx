import * as React from 'react'
import './index.less'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
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
  route: string,
  actions: {
    changeBreadcrumb(v: any): void,
    toggleCollapse(): void
  }
}

class MenuComponent extends React.Component<IProps & RouteComponentProps<any>> {

  componentDidMount() {

    const { changeBreadcrumb } = this.props.actions

    // 前进后退
    window.addEventListener('popstate', ev => {
      const route = window.location.pathname.split('/').filter(i => i).join('/')
      
      Utils.findBreadcrumb(route, changeBreadcrumb)
    })
  }

  changeBreadcrumb = (menu: any, parents: any[] = []) => {
    const { title, route } = menu
    this.props.actions.changeBreadcrumb({
      breadcrumb: parents.concat(title),
      route
    })
  }

  renderMenus = (currMenus = menus, parents: any[] = []) => currMenus.map(menu => 
    menu.childs
      ? (
        <SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}>
          { this.renderMenus(menu.childs, parents.concat(menu.title)) }
        </SubMenu>
      ) : (
        <Menu.Item key={`/${menu.route}`}>
          <Icon type={menu.icon} />
          <Link className="menu-item-link" to={`/${menu.route}`} onClick={this.changeBreadcrumb.bind(this, menu, parents)} >
            <span className={this.props.collapsed ? 'collapsed' : ''}>{menu.title}</span>  
          </Link>
        </Menu.Item>
      )
  )

  render() {
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
          selectedKeys={[this.props.route ?  `/${this.props.route}` : '/home']}
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
  component: MenuComponent,
  mapStateToProps: state => ({
    route: state.common.route,
    collapsed: state.common.collapsed
  }),
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators({
      changeBreadcrumb: common.changeBreadcrumb,
      toggleCollapse: common.toggleCollapse
    }, dispatch)
  })
})