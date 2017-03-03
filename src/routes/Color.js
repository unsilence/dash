import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import ColorsComponent from '../components/Color/Colors';
import MainLayout from '../components/MainLayout/MainLayout';

function Colors(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <ColorsComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Colors);
