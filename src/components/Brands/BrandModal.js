import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class BrandEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

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
    this.props.form.resetFields(['name','name_en','shortcut','firstletter','note'])
  };

  okHandler = () => {
    const { onOk } = this.props;
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
    const { _id, name, name_en, shortcut, firstletter, note } = this.props.record;
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
          title={_id ? "修改：" : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler} ref='brandfrom'>
            <FormItem className={styles.FormItem} {...formItemLayout} label="中文品牌名称" >    {getFieldDecorator('name', { initialValue: name })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="英文品牌名称" >    {getFieldDecorator('name_en', { initialValue: name_en })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌缩写" >    {getFieldDecorator('shortcut', { initialValue: shortcut })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌首字母" >    {getFieldDecorator('firstletter', { initialValue: firstletter })(
              <Select size="small">{['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}</Select>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="介绍" >       {getFieldDecorator('note', { initialValue: note })(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(BrandEditModal);
