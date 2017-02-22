import React from 'react';
import { Form, Icon, Input, Button, Checkbox,Col,Row } from 'antd';
const FormItem = Form.Item;
import { browserHistory } from 'dva/router';
import styles from './login.less'
import * as models from '../models'


const LoginLayout = Form.create()(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        (async function() {
            let rt = await models.login()
            console.log('login ',rt)
            browserHistory.push('/')
        })();
      }
    });
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <Row type="flex" justify="space-around" align="middle" className={styles.login_wrap}>
      <Col span={4} justify="space-around" align="middle">
      <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className={styles['login-form-forgot']}>Forgot password</a>
          <Button type="primary" htmlType="submit" className={styles['login-form-button']}>
            Log in
          </Button>
          Or <a>register now!</a>
        </FormItem>
      </Form>
      </Col>
      </Row>
    );
  },
}));
export default LoginLayout;
