import * as React from 'react'
import './index.less'
import { Menu, Icon, Popover } from 'antd'
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
  isMobile: boolean,
  breadcrumb: any[],
  openKeys: any[],
  actions: {
    changeBreadcrumb(v: any): void,
    toggleCollapse(): void,
    toggleOpenKeys(v: any): void
  }
}

interface IMenuProps {
  className: string,
  selectedKeys: string[],
  mode: any,
  theme: any,
  openKeys?: string[]
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
    if (!this.props.collapsed) {
      this.props.actions.toggleOpenKeys({key})
    }
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
    const { collapsed, actions, route, openKeys, isMobile} = this.props

    const { toggleCollapse } = actions

    const menuProps: IMenuProps = {
      className: 'left-menu',
      selectedKeys: [route ?  `/${route}` : '/home'],
      mode: 'inline',
      theme: ''
    }

    if (!collapsed) {
      menuProps.openKeys = openKeys
    }

    return isMobile 
      ? (
        <Sider
          style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }}
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapse}
        >
          <div className="logo" />
          <Menu mode='inline' {...menuProps} >
            { this.renderMenus() }
          </Menu>
        </Sider>
      ) : (
        <Popover placement="bottomLeft" trigger="click" 
          content={<Menu {...menuProps} >{this.renderMenus()}</Menu>}
        >
          <div className='navbar'>
            <div className='icon'><Icon type="bars" /></div>
          </div>
        </Popover>
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
      collapsed: state.common.collapsed,
      isMobile: state.common.isMobile
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