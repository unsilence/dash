import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import TestsComponent from '../components/Test/Tests';
import MainLayout from '../components/MainLayout/MainLayout';

function Tests(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <TestsComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  console.log(state,'--------------------');
  return state.tests;
}

export default connect(mapStateToProps)(Tests);
