import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import BannersComponent from '../components/Banners/Banner.js';
import MainLayout from '../components/MainLayout/MainLayout';

function Banners(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <BannersComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Banners);
