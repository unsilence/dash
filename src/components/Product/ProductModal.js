import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class ProductEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  // componentDidMount() {
  //   // To disabled submit button at the beginning.
  //   this.props.form.validateFields();
  // }
  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields(['name','note']);
  };

  okHandler = (e) => {
    const { onOk } = this.props;
    // if(!e){
    //   return
    // }
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { _id, name, note } = this.props.serial;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title={_id ? "修改：": '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="色系名字" >    {getFieldDecorator('name',{rules:[{required: true, message: '请输入色系名字!'}],initialValue: name})(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="备注" >    {getFieldDecorator('note',{rules:[{required: true, message: '请输入备注!'}],initialValue: note})(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ProductEditModal);
