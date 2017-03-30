import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import SpuComponent from '../components/Product/Spu';
import MainLayout from '../components/MainLayout/MainLayout';

function Spu(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <SpuComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Spu);
