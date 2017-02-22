import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import UsersComponent from '../components/Users/Users';
import MainLayout from '../components/MainLayout/MainLayout';

function Users2(props) {
    console.log('Router render')
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <UsersComponent />
        </div>
      </MainLayout>
  );
}

class User3 extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <MainLayout location={location}>
              <div className={styles.normal}>
                <UsersComponent />
              </div>
            </MainLayout>
        );
    }
}

function mapStateToProps(state) {
    console.log('Router mapStateToProps')
  return {};
}

export default connect(mapStateToProps)(User3);
