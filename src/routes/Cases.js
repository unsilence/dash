import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import CasesComponent from '../components/Cases/Cases';
import MainLayout from '../components/MainLayout/MainLayout';

function Cases(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <CasesComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  console.log(state,'--------------------');
  return state.cases;
}

export default connect(mapStateToProps)(Cases);
