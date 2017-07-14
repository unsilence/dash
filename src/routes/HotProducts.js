import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import HotProductComponent from '../components/HotProducts/HotProducts';
import HotProductsHistoryComponent from "../components/HotProducts/HotProductsHistoryComponent.js";
import MainLayout from '../components/MainLayout/MainLayout';

function HotProducts(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <HotProductComponent />
        </div>
      </MainLayout>
  );
}

function HotProductsHistory(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <HotProductsHistoryComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

exports["HotProducts"] = connect(mapStateToProps)(HotProducts);
exports["HotProductsHistory"] = connect(mapStateToProps)(HotProductsHistory);
