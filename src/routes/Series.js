import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import SeriesComponent from '../components/Series/Series';
import MainLayout from '../components/MainLayout/MainLayout';

function Seriess(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <SeriesComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Seriess);
