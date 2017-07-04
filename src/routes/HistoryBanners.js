import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import HistryBannerModal from '../components/Banners/HistryBannerModal.js';
import MainLayout from '../components/MainLayout/MainLayout';


function HistryBanner(props) {
  return (
    <MainLayout location={location}>
      <div className={styles.normal}>
        <HistryBannerModal />
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(HistryBanner);