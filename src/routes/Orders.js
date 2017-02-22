import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import OrdersComponent from '../components/Orders/Orders';
import MainLayout from '../components/MainLayout/MainLayout';

function Orders(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <OrdersComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Orders);
