import React, {Component} from 'react';
import { browserHistory } from 'dva/router';
import {  Modal,  Form,  Input,  Select,  DatePicker,  Popconfirm
    ,  Row,message,  Col,  Button,  Icon,  Upload} from 'antd';

let styles ={}

import * as UserModel from '../model_mvp/user';


// const UserModel = require('../../models/user')

class _Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flag:false,
      number:60,
      btnCodeName:'发送验证码'
    };

  }

  login = async (e) => {
      let phone = this.refs.phoneInput.refs.input.value
      let code = this.refs.codeInput.refs.input.value
      let password = this.refs.password.refs.input.value
      let res = await UserModel.login({phone,code,password})
      console.log(res)
      if(res.status == 'success'){
          message.success('登录验证通过');
            browserHistory.push('/');

        }else{
            message.error('登录失败，请重新输入');
        }
  }
  sendCode = async (e) => {
      let phone = this.refs.phoneInput.refs.input.value
      let res = await UserModel.sendCode({phone})
      console.log(res)

      //点击的时候改变按钮的状态

      let btnCodeName = `${this.state.number}秒后 重新发送`;
      this.setState({flag:true,btnCodeName:btnCodeName})

      //设置定时器
       if(this.state.flag){

         this.timer = setInterval(function(){

              let number = this.state.number;
              number-=1;

              let btnCodeName = `${this.state.number}秒后 重新发送`;

              this.setState({
                  number:number>10?number:''+number,
                  btnCodeName:btnCodeName
              });

              if(this.state.number<0){
                 this.setState({
                    flag:false,
                    number:60,
                    btnCodeName:'发送验证码'
                });
                clearInterval(this.timer)
              }


         }.bind(this),1000)
       }

      if(res.status == 'success'){
            message.success('验证码已发送');
        }else{
            message.error('验证码发送失败');
        }


  }


  render() {
      console.log('componnents:: login/content will render')
    return (
      <span >
        <Row type="flex" justify="space-around" align="middle">
            <Col span={4} >
                <Row >
                  <Col span={24} style={{fontSize : "16px"}}>美学管家-后台管理系统</Col>
                </Row>
                <Row>
                  <Col span={24}><Input addonBefore={<Icon type="phone" />}  placeholder="手机号"  ref="phoneInput"/></Col>
                </Row>
                <Row style={{ marginTop:15 }}>
                  <Col span={24}><Input addonBefore={<Icon type="lock"/>} type="password" placeholder="密码"  ref="password"/></Col>
                </Row>
                <Row style={{ marginTop:15 }}>
                  <Col span={12}><Input  addonBefore={<Icon type="lock" />}  placeholder="验证码" ref="codeInput"/></Col>
                  <Col span={12}><Button disabled={this.state.flag} type="warning" onClick={this.sendCode} className={styles['login-form-button']}>{this.state.btnCodeName}</Button>
                  </Col>
                </Row>
                <Row style={{ marginTop:15 }}>
                  <Col span={24}><Button type="primary" onClick={this.login}   className={styles['login-form-button']}>登陆</Button></Col>
                </Row>
            </Col>
        </Row>
      </span>
    );
  }
}

export default _Main;
