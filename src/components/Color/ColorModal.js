import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class ColorEditModal extends Component {

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
    this.props.form.resetFields(['name','seriesId']);
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
    let { _id, name, seriesId } = this.props.record;
    const serialList = this.props.record.serialList || [];
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    if (typeof seriesId === 'undefined') {
      if (serialList.length !== 0) {
        seriesId = serialList[0]._id;
      }
    }
    const options = serialList.map(v => <Select.Option key={v._id} value={v._id}>{v.name}</Select.Option>);

    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title={_id ? "修改" : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="名字" > {getFieldDecorator('name', {rules:[{required: true, message: '请输入颜色名称!'}], initialValue: name })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="色系" > {getFieldDecorator('seriesId', {rules:[{required: true, message: '请选择所属色系!'}], initialValue: seriesId })(
              <Select size="small" {...{ defaultActiveFirstOption: true }} >{options}</Select>
            )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ColorEditModal);
