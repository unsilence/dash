import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import RecommendComponent from '../components/Recommend/Recom';
import MainLayout from '../components/MainLayout/MainLayout';

function Recommends(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <RecommendComponent />
        </div>
      </MainLayout>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Recommends);
