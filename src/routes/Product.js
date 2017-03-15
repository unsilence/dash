import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import ProductComponent from '../components/Product/Products';
import MainLayout from '../components/MainLayout/MainLayout';

function Product(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <ProductComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Product);
