import React from 'react';
import { Menu, Icon } from 'antd';
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
      <Menu.Item key="/users">
        <Link to="/users"><Icon type="smile" />系统用户</Link>
      </Menu.Item>
      <Menu.Item key="/customers">
        <Link to="/customers"><Icon type="user" />客户</Link>
      </Menu.Item>
      <Menu.Item key="/receives">
        <Link to="/receives"><Icon type="pay-circle" />收款</Link>
      </Menu.Item>
      <Menu.Item key="/orders">
        <Link to="/orders"><Icon type="file" />订单</Link>
      </Menu.Item>
      <Menu.Item key="/buys">
        <Link to="/buys"><Icon type="rocket" />支付</Link>
      </Menu.Item>
      <Menu.Item key="/reports">
        <Link to="/reports"><Icon type="calculator" />已竣工</Link>
      </Menu.Item>
      <Menu.Item key="/404">
        <Link to="/page-you-dont-know"><Icon type="frown-circle" />404</Link>
      </Menu.Item>

    </Menu>
  );
}

export default Header;
