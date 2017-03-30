import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import SkuComponent from '../components/Product/Sku';
import MainLayout from '../components/MainLayout/MainLayout';

function Sku(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <SkuComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Sku);
