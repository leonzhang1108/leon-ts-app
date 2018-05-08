
import * as React from 'react'
import './index.less'
import { Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'

const SubMenu = Menu.SubMenu

const MenuComponent = withRouter(props => {

  const { location } = props

  console.log(location)

  return (
    <div className="menu-wrapper">
      <div className="logo" />
      <Menu
        className="left-menu"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
      >
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <Link className="menu-item-link" to="op1">Option 1</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="desktop" />
          <Link className="menu-item-link" to="op2">Option 2</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="inbox" />
          <Link className="menu-item-link" to="op3">Option 3</Link>
        </Menu.Item>
        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
        </SubMenu>
      </Menu>
    </div>
  )
})

export default MenuComponent
