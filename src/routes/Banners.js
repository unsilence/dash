import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import BannersComponent from '../components/Banners/Banner.js';
import HistryBannerModal from '../components/Banners/HistryBannerModal.js';
import BannerConsoleModal from '../components/Banners/BannerConsoleModal.js';
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

function BannerConsole(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <BannerConsoleModal />
        </div>
      </MainLayout>
  );
}
function mapStateToProps(state) {
  return {};
}

exports["banners"] = connect(mapStateToProps)(Banners);
exports["BannerConsole"] = connect(mapStateToProps)(BannerConsole);