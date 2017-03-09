import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Radio } from 'antd';
const RadioGroup = Radio.Group;
import styles from '../item.less';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

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

  getFormatData(data) {
    let rst = [];
    if (data) {
      data.forEach(v => {
        !v.parentId && rst.push({ "value": v._id, "label": v.name, "_id": v._id });
      })

      data.forEach(v => {
        v.parentId && getParent(v, rst);
      })
      function getParent(item, elems) {
        if (!elems) {
          return;
        }
        elems.forEach(v => {
          if (v._id === item.parentId) {
            v.children ? v.children.push({ "value": item._id, "label": item.name, "_id": item._id }) : (v.children = [{ "value": item._id, "label": item.name, "_id": item._id }]);
          } else {
            return getParent(item, v.children);
          }
        })
      }
    }
    return rst;
  };

  cascaderOnChange = (value) => {

  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { _id, name, categoryId, type, etype, stype, isNull, svalue ,createAt,updateAt} = this.props.record;
    let data = [];
    (this.props.record.categoryList || []).forEach(v => data.unshift(v));
    let cascaderOptions = this.getFormatData(data);
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
              {getFieldDecorator('categoryId', { initialValue: name })(<Cascader options={cascaderOptions} onChange={this.cascaderOnChange} placeholder='Please select' />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性分类" >    {getFieldDecorator('type', { initialValue: type })(
              <RadioGroup >
                <Radio value={'1'}>关键属性</Radio>
                <Radio value={'2'}>销售属性</Radio>
                <Radio value={'3'}>其他属性</Radio>
              </RadioGroup>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性名称" >    {getFieldDecorator('name', { initialValue: name })(
              <Input size="small" />
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性选项" >    {getFieldDecorator('stype', { initialValue: stype })(
              <RadioGroup key=''>
                <Radio value={'1'}>运营输入</Radio>
                <Radio value={'2'}>使用SKU配图</Radio>
                <Radio value={'3'}>下拉使用</Radio>
              </RadioGroup>

            )
            }
              {getFieldDecorator('svalue', { initialValue: svalue||[] })(<TagsInput value={[]} onChange={v=>{console.log(v)}}/>)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="可以为空"> {getFieldDecorator('isNull', { initialValue: isNull })(
              <RadioGroup key=''>
                <Radio value={'1'}>是</Radio>
                <Radio value={'2'}>否</Radio>
              </RadioGroup>
              )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="创建时间" >    {getFieldDecorator('createAt', { initialValue: createAt })(
              <Input size="small" />
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="客户经理" >    {getFieldDecorator('updateAt', { initialValue: updateAt })(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AttributeModalEditModal);
