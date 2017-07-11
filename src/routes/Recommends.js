import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import RecommendComponent from '../components/Recommend/Recom';
import RecommendHistoryComponent from '../components/Recommend/RecommendHistoryComponent';
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

function RecommendsHistory(props) {
console.log('11111111111111111111111111111111')
  return (

      <MainLayout location={location}>
        <div className={styles.normal}>
          <RecommendHistoryComponent />
        </div>
      </MainLayout>
  );
}
function mapStateToProps(state) {
  return {};
}

exports["Recommends"] = connect(mapStateToProps)(Recommends);
exports["RecommendsHistory"] = connect(mapStateToProps)(RecommendsHistory);
