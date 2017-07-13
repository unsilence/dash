import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import CaseManageComponent from '../components/CaseManages/CaseManage';
import CaseManagesHistoryComponent from "../components/CaseManages/CaseManagesHistoryComponent";
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

function CaseManagesHistory(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <CaseManagesHistoryComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

exports["CaseManages"] = connect(mapStateToProps)(CaseManages);
exports["CaseManagesHistory"] = connect(mapStateToProps)(CaseManagesHistory);
