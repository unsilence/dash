import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import StockComponent from '../components/Product/Stock';
import MainLayout from '../components/MainLayout/MainLayout';

function Stock(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <StockComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Stock);
