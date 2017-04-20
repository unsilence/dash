import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import CaseManageComponent from '../components/CaseManages/CaseManage';
import MainLayout from '../components/MainLayout/MainLayout';

function CaseManages(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <CaseManageComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CaseManages);
