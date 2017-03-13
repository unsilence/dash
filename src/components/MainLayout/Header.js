import React from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

import { Link } from 'dva/router';

function Header({ location }) {
  return (
    <Menu
      selectedKeys={[location.pathname]}
      mode="vertical"
      theme="dark"
    >
      <Menu.Item key="/">
        <Link to="/"><Icon type="home" />首页</Link>
      </Menu.Item>
      <Menu.Item key="brands">
        <Link to="/brands"><Icon type="smile" />品牌</Link>
      </Menu.Item>
      <Menu.Item key="users">
        <Link to="/users"><Icon type="smile" />系统用户</Link>
      </Menu.Item>
      <Menu.Item key="attributes">
        <Link to="/attributes"><Icon type="user" />属性</Link>
      </Menu.Item>
      <Menu.Item key="countrys">
        <Link to="/countrys"><Icon type="pay-circle" />国家</Link>
      </Menu.Item>
      <Menu.Item key="cases">
        <Link to="/cases"><Icon type="pay-circle" />案例</Link>
      </Menu.Item>
      {/*<Menu.Item key="/orders">
        <Link to="/orders"><Icon type="file" />订单</Link>
      </Menu.Item>*/}
      <Menu.Item key="categorys">
        <Link to="/categorys"><Icon type="rocket" />分类</Link>
      </Menu.Item>
      {/*<SubMenu key='color' title={<span><Icon type="book" /><span>Navigation One</span></span>}>*/}
      <Menu.Item key="colors">
        <Link to="/colors"><Icon type="calculator" />颜色</Link>
      </Menu.Item>
      <Menu.Item key="serials">
        <Link to="/serials"><Icon type="calculator" />色系</Link>
      </Menu.Item>
      {/*</SubMenu>*/}
      <Menu.Item key="404">
        <Link to="/page-you-dont-know"><Icon type="frown-circle" />404</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Header;
