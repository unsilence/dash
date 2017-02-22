import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import ReceivesComponent from '../components/Receives/Receives';
import MainLayout from '../components/MainLayout/MainLayout';

function Receives(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <ReceivesComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Receives);
