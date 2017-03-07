import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import BrandsComponent from '../components/Brands/Brands';
import MainLayout from '../components/MainLayout/MainLayout';

function Brands(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <BrandsComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Brands);
