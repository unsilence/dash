import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader } from 'antd';
import styles from '../item.less';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { getFormatData } from '../utils'
const FormItem = Form.Item;

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
  // componentDidMount() {
  //   // To disabled submit button at the beginning.
  //   this.props.form.validateFields();
  // }

  cascaderOnChange = (value) => {
    this.handleAttr(value);
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
    const { _id, name, note, key, categoryId } = this.props.product;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    let data = [];
    (this.props.product.categoryList || []).forEach(v => data.unshift(v));
    let cascaderOptions = getFormatData(data);

    //属性处理

    let keyOptions = this.state.keyAttr.map(ko => { return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} >    {getFieldDecorator(ko._id, {})(<Input size="small" />)}</FormItem> })
    if (keyOptions.length !== 0) keyOptions.unshift(<span>关键属性</span>)

    let otherOption = this.state.otherAttr.map(ko => { return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} >    {getFieldDecorator(ko._id, {})(<Input size="small" />)}</FormItem> })
    if (otherOption.length !== 0) otherOption.unshift(<span>其他属性</span>)
    
    let sellOptions = this.state.sellAttr.map(ko => { return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} >    {getFieldDecorator(ko._id, {})(<Input size="small" />)}</FormItem> })
    if (sellOptions.length !== 0) sellOptions.unshift(<span>销售属性</span>)

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
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品名字" >    {getFieldDecorator('name', { initialValue: name })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >    {getFieldDecorator('key', { initialValue: key || [] })(<TagsInput value={[]} {...{ 'onlyUnique': true }} onChange={v => { console.log(v) }} />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品分类" >
              {getFieldDecorator('categoryId', { initialValue: categoryId })(<Cascader options={cascaderOptions} onChange={this.cascaderOnChange.bind(this)} placeholder='Please select' />)}
            </FormItem>
            {keyOptions}
            {sellOptions}
            {otherOption}
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(ProductEditModal);
