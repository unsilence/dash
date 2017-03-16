import React, { Component } from 'react';
import { Modal, Form, Input, Select,TreeSelect } from 'antd';
import styles from '../item.less';
import { getFormatData } from '../utils';
const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class BrandEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value:'',
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
    this.props.form.resetFields(['name','name_en','shortcut','firstletter','categoryId','note'])
  };
  onChange = (value) => {
    console.log('onChange ', value, arguments);
    this.setState({ value });
  }
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
    const { _id, name, name_en, shortcut, firstletter,categoryId, note } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let data = [];
    (this.props.record.categoryList || []).forEach(v => data.unshift(v));
    let brandstreeData = getFormatData(data);
    const tProps = {
      brandstreeData,
      value: this.state.value,
      onChange: this.onChange,
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: 300,
      },
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
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌所属分类" >  
              {getFieldDecorator('categoryId', { initialValue: categoryId })(<TreeSelect {...tProps} />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="介绍" >       {getFieldDecorator('note', { initialValue: note })(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(BrandEditModal);
