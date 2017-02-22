import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import CustomersComponent from '../components/Customers/Customers';
import MainLayout from '../components/MainLayout/MainLayout';

function Customers(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <CustomersComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Customers);
