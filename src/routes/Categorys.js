import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import CategorysComponent from '../components/Category/Categorys';
import MainLayout from '../components/MainLayout/MainLayout';

function Categorys(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <CategorysComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Categorys);
