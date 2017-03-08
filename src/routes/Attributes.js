import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import AttributesComponent from '../components/Attribute/Attributes';
import MainLayout from '../components/MainLayout/MainLayout';

function Attributes(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <AttributesComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {  
  return {};
}

export default connect(mapStateToProps)(Attributes);
