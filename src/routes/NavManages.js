import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import NavManageComponent from '../components/Nav/NavManage';
import MainLayout from '../components/MainLayout/MainLayout';

function NavManage(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <NavManageComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(NavManage);
