import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Icon, Button } from 'antd';
import styles from '../item.less';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { getFormatData } from '../utils'
const FormItem = Form.Item;

import EditableTable from './EditableTable';
let uuid = 0;
class ProductEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      keyAttr: [],
      sellAttr: [],
      otherAttr: [],
    };
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.getFieldDecorator('keys', { initialValue: [] });
    this.props.form.setFieldsValue({ keys: this.state.sellAttr })
  }

  cascaderOnChange = (value) => {
    this.handleAttr(value);
  }

  /**
   * 添加一个销售组件
   */
  addSellComponent = (com) => {
    let temp = Object.assign({}, com);
    temp.sellId = temp._id + "_" + (uuid++);
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(temp);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  /**
   * 删除一个指定的销售组建
   */
  removeSellComponent = (com) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    function check() {
      return keys.filter(v => { return v._id === com._id }).length > 1 ? true : false;
    }
    if (!check()) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== com),
    });
  }



  handleAttr = (_cascader) => {
    let cas = _cascader.toString();
    let keyAttr = [];
    let sellAttr = [];
    let otherAttr = [];
    let arr = Object.values(this.props.product.attributeMap)
      .filter(v => {
        return v.categoryId.toString() === cas;
      }).forEach(v => {
        if (v.type === '1') {
          keyAttr.push(v);
        } else if (v.type === '2') {
          v.sellId = v._id + "_" + (uuid++);
          sellAttr.push(v);
        } else if (v.type === '3') {
          otherAttr.push(v);
        }
      })
    this.setState({
      keyAttr: keyAttr,
      sellAttr: sellAttr,
      otherAttr: otherAttr,
    })
    this.props.form.setFieldsValue({ keys: sellAttr })
  }


  createTable =()=>{

  }

  sellChange=(e)=>{
    console.log(e.target.value,'------------------');
    const keys = this.props.form.getFieldValue('keys');
    console.log(keys,this.props.form.getFieldsValue());
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
    this.props.form.resetFields(['name', 'note']);
  };

  okHandler = (e) => {
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
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { _id, name, note, key, categoryId } = this.props.product;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    let data = [];
    (this.props.product.categoryList || []).forEach(v => data.unshift(v));
    let cascaderOptions = getFormatData(data);

    //属性处理

    let keyOptions = this.state.keyAttr.map(ko => { return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >    {getFieldDecorator(ko._id, {})(<Input size="small" />)}</FormItem> })
    if (keyOptions.length !== 0) keyOptions.unshift(<span key='keyword'>关键属性</span>)

    let otherOption = this.state.otherAttr.map(ko => { return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name}  key={ko._id}>    {getFieldDecorator(ko._id, {})(<Input size="small" />)}</FormItem> })
    if (otherOption.length !== 0) otherOption.unshift(<span key='otherword'>其他属性</span>)

    getFieldDecorator('keys', { initialValue: [] });
    let keys = getFieldValue('keys').sort(keysrt('_id', true));
    const sellOptions = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayout}
          label={k.name}
          required={false}
          key={k.sellId}
        >
          {getFieldDecorator(`${k.sellId}`, {
            validateTrigger: ['onChange', 'onBlur'],
            trigger:'onChange',
            rules: [{
              required: true,
              whitespace: true,
              message: "fuck .",
            }],
          })(
            <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} onChange={this.sellChange.bind(this)} />
            )}
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.removeSellComponent(k)}
          />
          <Icon type="plus-circle-o" onClick={this.addSellComponent.bind(this, k)} />
        </FormItem>
      );
    });

    if (sellOptions.length !== 0) {
      sellOptions.unshift(<span key='sellword'>销售属性</span>);
    }
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
          <Form horizontal onSubmit={this.okHandler} key={"alkdkdkdk"}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品名字" >    {getFieldDecorator('name', { initialValue: name })(<Input size="small" />)}</FormItem>
            {/*<FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >    {getFieldDecorator('key', { initialValue: key || [] })(<TagsInput value={[]} {...{ 'onlyUnique': true }} onChange={v => { console.log(v) }} />)}</FormItem>*/}
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品分类" >
              {getFieldDecorator('categoryId', { initialValue: categoryId })(<Cascader options={cascaderOptions} onChange={this.cascaderOnChange.bind(this)} placeholder='Please select' />)}
            </FormItem>
            {keyOptions}
            {otherOption}
            {sellOptions}
            <EditableTable key='gagagagagaga' data={this.props.form.getFieldsValue()}/>
          </Form>
        </Modal>
      </span>
    );
  }
}

function keysrt(key, desc) {
  return function (a, b) {
    return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}

export default Form.create()(ProductEditModal);
