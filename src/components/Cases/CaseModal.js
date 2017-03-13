import React, { Component } from 'react';
import { Modal, Form, Input, Select,Upload } from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class CaseEditModal extends Component {

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
    this.props.form.resetFields(['headline','releaseTime','release_time','click_rate']);
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
    const { _id, urladdress,headline,collocatImg} = this.props.case;
    // const nameError = isFieldTouched('name') && getFieldError('name');
    // const noteError = isFieldTouched('note') && getFieldError('note');
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
            <FormItem className={styles.FormItem} {...formItemLayout} label="URL" > {getFieldDecorator('urladdress', { initialValue: urladdress })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="标题" > {getFieldDecorator('headline', { initialValue: headline })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="配图" > {getFieldDecorator('collocatImg', { initialValue: collocatImg })(<Input size="small" />)}</FormItem>
           
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CaseEditModal);
