import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import CountrysComponent from '../components/Country/Country';
import MainLayout from '../components/MainLayout/MainLayout';

function Countrys(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <CountrysComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Countrys);
