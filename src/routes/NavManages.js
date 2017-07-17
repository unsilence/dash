import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import NavManageComponent from '../components/Nav/NavManage';
import NavProductsHistoryComponent from "../components/Nav/NavHistory.js";
import MainLayout from '../components/MainLayout/MainLayout';

function NavManage(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <NavManageComponent />
        </div>
      </MainLayout>
  );
}

function NavProductsHistory (props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <NavProductsHistoryComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

exports["NavManage"] = connect(mapStateToProps)(NavManage);
exports["NavProductsHistory"] = connect(mapStateToProps)(NavProductsHistory);
