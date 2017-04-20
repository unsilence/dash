import React from 'react';
import {Layout, Menu, Breadcrumb,Button, Icon,Col,Row} from 'antd';
const {Header, Content, Footer, Sider} = Layout;
import styles from './MainLayout.less';
import _Header from './Header';
import * as models from '../../models'
import { browserHistory } from 'dva/router';

function MainLayout({ children, location }) {
    let handleSubmit = (e) => {
      e.preventDefault();
      (async function() {
          let rt = await models.logout()
          browserHistory.push('/login')
      })();
    }

    let BannerHandler = (e) => {
      e.preventDefault();
      (async function() {
          browserHistory.push('/banners')
      })();
    }
    let RecommendHandler = (e) =>{
        e.preventDefault();
        (async function() {
            browserHistory.push('/recoms')
        })();
    }
    let CaseManageHandler = (e) =>{
        e.preventDefault();
        (async function() {
            browserHistory.push('/casemanages')
        })();
    }
  return (
  <Layout className={styles.layout_wrap}>
    <Sider className={styles.layout_left}>
      <Row type="flex" justify="space-around" align="middle" className={styles.logo}>

      </Row>
      <_Header location={location}/>
    </Sider>
    <Layout>
      <Header className={styles.layout_top}>
          <Button>美学管家</Button>
          <Button onClick = {BannerHandler}>Banner管理</Button>
          <Button onClick = {RecommendHandler}>推荐管理</Button>
          <Button onClick = {CaseManageHandler}>案例管理</Button>
          <Button>热品管理</Button>
          <Button>导航栏管理</Button>
          <Button onClick={handleSubmit}>退出</Button>
      </Header>
      <Content className={styles.layout_body_wrap}>
        <div className={styles.layout_body}>
          {children}
        </div>
      </Content>
      <Footer className={styles.layout_bottom}>
        :> ©2016 Created by ABCDEFG
      </Footer>
    </Layout>
  </Layout>)
 }
export default MainLayout;
