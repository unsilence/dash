import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import LoginComponent from '../components/Login';


function Login(props) {
  return (
      <LoginComponent location={location}>

      </LoginComponent>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Login);
