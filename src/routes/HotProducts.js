import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import HotProductComponent from '../components/HotProducts/HotProducts';
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

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(HotProducts);
