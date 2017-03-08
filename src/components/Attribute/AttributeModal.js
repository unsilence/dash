import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class AttributeModalEditModal extends Component {

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
          title={_id ? "修改" : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="所属分类" >    
              {getFieldDecorator('name', { initialValue: name })(<Select size="small">{['其他'].map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}</Select> ) }
              {getFieldDecorator('name', { initialValue: name })(<Select size="small">{['其他'].map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}</Select> ) }
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="客户地址" >    {getFieldDecorator('address', { initialValue: address })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="业务渠道" >    {getFieldDecorator('channel', { initialValue: channel })(
              <Select size="small">{['其他', ].map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}</Select>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="渠道姓名" >    {getFieldDecorator('channel_name', { initialValue: channel_name })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="客源/网销主管"> {getFieldDecorator('market_master', { initialValue: market_master })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="设计中心" >    {getFieldDecorator('design_center', { initialValue: design_center })(
              <Select size="small">{['其他'].map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}</Select>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="客户经理" >    {getFieldDecorator('bzman', { initialValue: bzman })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="设计师" >      {getFieldDecorator('designer', { initialValue: designer })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="中心经理" >    {getFieldDecorator('center_master', { initialValue: center_master })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="运营总监" >    {getFieldDecorator('operator_master', { initialValue: operator_master })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="城市总监" >    {getFieldDecorator('city_master', { initialValue: city_master })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="备注" >       {getFieldDecorator('note', { initialValue: note })(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AttributeModalEditModal);
