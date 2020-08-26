import { common } from '@actions'
import menus from '@constant/menus'
import Utils from '@utils'
import { Layout, Menu } from 'antd'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import './index.less'
const { Sider } = Layout
const SubMenu = Menu.SubMenu

interface IProps {
  collapsed: boolean;
  route: string;
  isMobile: boolean;
  breadcrumb: any[];
  openKeys: string[];
  h: number;
  actions: {
    changeBreadcrumb(v: any): void;
    toggleCollapse(): void;
    toggleOpenKeys(v: any): void;
  };
}

interface IMenuProps {
  className: string;
  selectedKeys: string[];
  mode: any;
  theme: any;
  defaultOpenKeys?: any;
}

class MenuComponent extends React.Component<IProps & RouteComponentProps<any>> {
  menuWrapper

  componentDidMount() {
    const { changeBreadcrumb } = this.props.actions

    // 前进后退
    window.addEventListener('popstate', ev => {
      Utils.findBreadcrumb(this.getRoute(), changeBreadcrumb)
    })
  }

  getRoute = () =>
    window.location.hash
      .split('/')
      .filter(i => i && i !== '#')
      .join('/')

  constructor(props) {
    super(props)
    Utils.findBreadcrumb(this.getRoute(), ({ breadcrumb }) => {
      this.props.actions.toggleOpenKeys({
        breadcrumb,
        isInit: true
      })
    })
  }

  changeBreadcrumb = (menu: any, parents: any[] = [], e: any) => {
    const { route } = menu
    this.props.actions.changeBreadcrumb({
      breadcrumb: parents.concat(menu),
      route
    })
    if (this.props.isMobile) {
      this.doCollapse()
    }
    e.stopPropagation()
  }

  onTitleClick = e => {
    e.domEvent.stopPropagation()
  }

  renderMenus = (currMenus: any = menus, parents: any[] = []) =>
    currMenus.map(menu =>
      menu.childs ? (
        <SubMenu
          key={menu.key}
          onTitleClick={this.onTitleClick}
          title={
            <span>
              {/* <Icon type={`${menu.icon}`} /> */}
              <i className={`anticon anticon-ts-app ${menu.icon}`} />
              <span>{menu.title}</span>
            </span>
          }
        >
          {this.renderMenus(menu.childs, parents.concat(menu))}
        </SubMenu>
      ) : (
        <Menu.Item key={`/${menu.route}`}>
          {/* <Icon type={`${menu.icon}`} /> */}
          <i className={`anticon anticon-ts-app ${menu.icon}`} />
          <Link
            className="menu-item-link"
            to={`/${menu.route}`}
            onClick={this.changeBreadcrumb.bind(this, menu, parents)}
            replace={menu.route === this.props.route}
          >
            <span
              className={
                !this.props.isMobile && this.props.collapsed ? 'collapsed' : ''
              }
            >
              {menu.title}
            </span>
          </Link>
        </Menu.Item>
      )
    )

  doCollapse = (e?) => {
    this.props.actions.toggleCollapse()
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
  }

  render() {
    const { collapsed, actions, route, openKeys, isMobile } = this.props

    const { toggleCollapse } = actions

    let width = 0

    const defaultOpenKeys = openKeys

    const showMenu = defaultOpenKeys !== null

    const menuProps: IMenuProps = {
      className: 'left-menu',
      selectedKeys: [route ? `/${route}` : '/home'],
      mode: 'inline',
      theme: '',
      defaultOpenKeys
    }

    if (this.menuWrapper) {
      width = this.menuWrapper.clientWidth
    }

    return isMobile ? (
      <div
        className="navbar"
        ref={dom => (this.menuWrapper = dom)}
        onClick={this.doCollapse}
        style={{
          transform: `translateX(${collapsed ? 0 : -width}px)`,
          width: '200px'
        }}
      >
        {
          showMenu ? (
            <Menu
              {...menuProps}
              style={{
                height: `${this.props.h + 82}px`,
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              {this.renderMenus()}
            </Menu>
          ) : null
        }
        <div
          className="icon"
          style={{ right: `-40px` }}
          onClick={this.doCollapse}
        >
          <i className="anticon anticon-ts-app icon-bars" />
        </div>
      </div>
    ) : (
      <Sider
        style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={toggleCollapse}
      >
        <div className="logo" />
        {
          showMenu ? (
            <Menu
              {...menuProps}
              mode="inline"
              style={{
                height: `${document.body.clientHeight - 98}px`,
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              {this.renderMenus()}
            </Menu>
          ) : null
        }
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
      collapsed: state.common.collapsed,
      isMobile: state.common.isMobile,
      h: state.common.contentHeight
    }
  },
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators(
      {
        changeBreadcrumb: common.changeBreadcrumb,
        toggleCollapse: common.toggleCollapse,
        toggleOpenKeys: common.toggleOpenKeys
      },
      dispatch
    )
  })
})
