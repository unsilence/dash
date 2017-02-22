import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import BuysComponent from '../components/Buys/Buys';
import MainLayout from '../components/MainLayout/MainLayout';

function Buys(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <BuysComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Buys);
