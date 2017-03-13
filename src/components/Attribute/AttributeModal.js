import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Radio, Checkbox } from 'antd';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import styles from '../item.less';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import moment from 'moment';

const FormItem = Form.Item;

class AttributeModalEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      extendsOption: []
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

  etypeOnClick = (e) => {

    console.log(e);
  }

  etypeOnChange = (e) => {
    let key = e.target.value;
    this.props.form.setFieldsValue({ 'name': this.setExtendsText(key) });
    switch (key) {
      case "1":
        this.setState({ extendsOption: ['长', '宽', '高', '半径'] })
        break;
      case "2":
      case "3":
      case "4":
        this.setState({ extendsOption: [] })
        this.props.form.resetFields(['size']);
        break;
    }
  }

  setExtendsText = (type) => {
    let strExt = '';
    if (type === '1') {
      strExt = '尺寸';
    }
    else if (type === '2') {
      strExt = '颜色';
    }
    else if (type === '3') {
      strExt = '原产地';
    }
    else if (type === '4') {
      strExt = '品牌国别';
    }
    return strExt;
  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { _id, name, categoryId, type, etype, stype, isNull, svalue, createAt, updateAt, size } = this.props.record;
    let data = [];
    (this.props.record.categoryList || []).forEach(v => data.unshift(v));
    let cascaderOptions = this.getFormatData(data);

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    let checkOptions = getFieldDecorator('size', { initialValue: size })(<CheckboxGroup options={this.state.extendsOption} />);
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
            <FormItem className={styles.FormItem} {...formItemLayout} label="继承公共属性" >    {getFieldDecorator('etype', { initialValue: etype })(
              <RadioGroup onChange={this.etypeOnChange} onClick={this.etypeOnClick}>
                <Radio value={'1'}>尺寸</Radio>
                <Radio value={'2'}>颜色</Radio>
                <Radio value={'3'}>原产地</Radio>
                <Radio value={'4'}>品牌国别</Radio>
              </RadioGroup>
            )}
              {checkOptions}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性名称" >    {getFieldDecorator('name', { initialValue: name })(
              <Input size="small" />
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性选项" >    {getFieldDecorator('stype', { initialValue: stype })(
              <RadioGroup key='' >
                <Radio value={'1'}>运营输入</Radio>
                <Radio value={'2'}>使用SKU配图</Radio>
                <Radio value={'3'}>下拉使用</Radio>
              </RadioGroup>
            )
            }
              {getFieldDecorator('svalue', { initialValue: svalue || [] })(<TagsInput value={[]} {...{ 'onlyUnique': true }} onChange={v => { console.log(v) }} />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="可以为空"> {getFieldDecorator('isNull', { initialValue: isNull })(
              <RadioGroup key=''>
                <Radio value={'1'}>是</Radio>
                <Radio value={'2'}>否</Radio>
              </RadioGroup>
            )}</FormItem>

            <FormItem className={styles.FormItem} {...formItemLayout} label="创建时间" style={_id ? { display: 'block' } : { display: 'none' }}>    {getFieldDecorator('createAt', { initialValue: moment(new Date(createAt)).format('YYYY-MM-DD HH:mm:ss') })(
              <Input size="small" />
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="客户经理" style={_id ? { display: 'block' } : { display: 'none' }}>    {getFieldDecorator('updateAt', { initialValue: moment(new Date(updateAt)).format('YYYY-MM-DD HH:mm:ss') })(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AttributeModalEditModal);
