import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import ReportsComponent from '../components/Reports/Reports';
import MainLayout from '../components/MainLayout/MainLayout';

function Reports(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <ReportsComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Reports);
