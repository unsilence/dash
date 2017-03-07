import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import SerialsComponent from '../components/Serial/Serials';
import MainLayout from '../components/MainLayout/MainLayout';

function Serials(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <SerialsComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  console.log(state,'--------------------');
  return state.serials;
}

export default connect(mapStateToProps)(Serials);
