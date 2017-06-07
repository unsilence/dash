import React, {Component} from 'react';
import {Modal, Form, Input, Select} from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  showModelHandler = (e) => {
    if (e) 
      e.stopPropagation();
    this.setState({visible: true});
  };

  hideModelHandler = () => {
    this.setState({visible: false});
  };

  okHandler = () => {
    const {onOk} = this.props;
    this
      .props
      .form
      .validateFields((err, values) => {
        if (!err) {
          onOk(values);
          this.hideModelHandler();
        }
      });
  };

  render() {
    const {children} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {
      _id,
      cnum,
      name,
      address,
      channel,
      channel_name,
      market_master,
      design_center,
      bzman,
      designer,
      center_master,
      operator_master,
      city_master,
      note,
      status,
      finishAt
    } = this.props.record;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title={_id
          ? "修改：" + cnum
          : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}>
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="电话号码">
              {getFieldDecorator('phone', {initialValue: name})(<Input size="small"/>)}</FormItem>
            < FormItem className={styles.FormItem} { ...formItemLayout } label="密码">
              {getFieldDecorator('password', {initialValue: note})(<Input size="small"/>)
}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="角色">
              {getFieldDecorator('role', {initialValue: channel})(
                <Select size="small">{[
                    {
                      "label": '内容运营',
                      "value": "substance"
                    }, {
                      "label": '线上运营',
                      "value": "onlines"
                    }, {
                      "label": '线下运营',
                      "value": "offlines"
                    }
                  ].map(v =>< Select.Option key = {
                    v.value
                  }
                  value = {
                    v.value
                  } > {
                    v.label
                  } </Select.Option>)}</Select>
              )}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
