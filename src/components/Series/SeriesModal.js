import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class SeriesEditModal extends Component {

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
    const { _id, cnum, name, address, channel, channel_name, market_master, design_center
      , bzman, designer, center_master, operator_master, city_master, note, status, finishAt } = this.props.record;
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
          title={_id ? "修改：" + cnum : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="客户姓名" >    {getFieldDecorator('name', { initialValue: name })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="业务渠道" >    {getFieldDecorator('channel', { initialValue: channel })(
              <Select size="small">{['其他', '设计师', '客户经理', '客源一部', '客源二部', '网销部', '外部渠道', '特殊渠道', '回头客'].map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}</Select>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="城市总监" >    {getFieldDecorator('city_master', { initialValue: city_master })(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(SeriesEditModal);
