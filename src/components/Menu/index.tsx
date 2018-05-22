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
  breadcrumb: any[],
  openKeys: any[],
  actions: {
    changeBreadcrumb(v: any): void,
    toggleCollapse(): void,
    toggleOpenKeys(v: any): void
  }
}

class MenuComponent extends React.Component<IProps & RouteComponentProps<any>> {

  componentDidMount() {

    const { changeBreadcrumb } = this.props.actions

    // 前进后退
    window.addEventListener('popstate', ev => {
      Utils.findBreadcrumb(this.getRoute(), changeBreadcrumb)
    })
  }

  getRoute = () => window.location.pathname.split('/').filter(i => i).join('/')

  componentWillMount() {
      
    Utils.findBreadcrumb(this.getRoute(), ({ breadcrumb }) => {
      this.props.actions.toggleOpenKeys({
        breadcrumb, 
        isInit: true
      })
    })
  }

  changeBreadcrumb = (menu: any, parents: any[] = []) => {
    const { route } = menu
    this.props.actions.changeBreadcrumb({
      breadcrumb: parents.concat(menu),
      route
    })
  }

  onTitleClick = key => {
    this.props.actions.toggleOpenKeys({key})
  }

  renderMenus = (currMenus: any = menus, parents: any[] = []) => currMenus.map(menu => 
    menu.childs
      ? (
        <SubMenu 
          onTitleClick={this.onTitleClick.bind(this, menu.key)}
          key={menu.key} 
          title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}
        >
          { this.renderMenus(menu.childs, parents.concat(menu)) }
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
          openKeys={this.props.openKeys}
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
  mapStateToProps: state => {
    return {
      route: state.common.route,
      breadcrumb: state.common.breadcrumb,
      openKeys: state.common.openKeys,
      collapsed: state.common.collapsed
    }
  },
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators({
      changeBreadcrumb: common.changeBreadcrumb,
      toggleCollapse: common.toggleCollapse,
      toggleOpenKeys: common.toggleOpenKeys
    }, dispatch)
  })
})