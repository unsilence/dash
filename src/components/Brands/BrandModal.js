import React, { Component } from 'react';
import { Modal, Form, Input, Select, TreeSelect } from 'antd';
import styles from '../item.less';
import { getFormatData } from '../utils';
const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const brandLetter = [{key:"1",value:"A"},{key:"2",value:"B"},{key:"3",value:"C"},{key:"4",value:"D"},{key:"5",value:"E"},
					{key:"6",value:"F"},{key:"7",value:"G"},{key:"8",value:"H"},{key:"9",value:"I"},{key:"10",value:"J"},
					{key:"11",value:"K"},{key:"12",value:"L"},{key:"13",value:"M"},{key:"14",value:"N"},{key:"15",value:"O"},
					{key:"16",value:"P"},{key:"17",value:"Q"},{key:"18",value:"R"},{key:"19",value:"S"},{key:"20",value:"T"},
					{key:"21",value:"U"},{key:"22",value:"V"},{key:"23",value:"W"},{key:"24",value:"X"},{key:"25",value:"Y"},
					{key:"26",value:"Z"}];
const brandcounty = [{key:"1",value:"中国"},{key:"2",value:"美国"},{key:"3",value:"日本"},{key:"4",value:"德国"},{key:"5",value:"法国"},{key:"6",value:"英国"}];
class BrandEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: "58c8f5cf1c74a5278ad3e404",
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
    this.props.form.resetFields(['name', 'name_en', 'shortcut', 'firstletter', 'categoryId', 'note','logo','definition','countryId','key'])
  };
  onChange = (value) => {
    console.log('onChange ', value, arguments);
    this.setState({ value:value });
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
    const brandCountry = brandcounty.map(t=><Option value={t.value}>{t.value}</Option>);
    const brandFirstletter = brandLetter.map(a=><Option value={a.value}>{a.value}</Option>);
    const { getFieldDecorator } = this.props.form;
    const { _id, name, name_en, shortcut, firstletter, categoryId, note,logo,definition,countryId,key } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    
    
    
    let data = [];
    (this.props.record.categoryList || []).forEach(v => data.unshift(v));
    let treeData = getFormatData(data);
    const tProps = {
      treeData,
      onChange: this.onChange.bind(this),
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
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
            <FormItem className={styles.FormItem} {...formItemLayout} label="中文品牌名称" >    {getFieldDecorator('name', {rules:[{required: true, message: '请输入中文品牌名称!'}], initialValue: name })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="英文品牌名称" >    {getFieldDecorator('name_en', {rules:[{required: true, message: '请输入英文品牌名称!'}], initialValue: name_en })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌缩写" >    {getFieldDecorator('shortcut', {rules:[{required: true, message: '请输入品牌缩写!'}], initialValue: shortcut })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌首字母" >    {getFieldDecorator('firstletter', {rules:[{required: true, message: '请选择品牌首字母!'}], initialValue: firstletter })
            (<Select size="large">
				{brandFirstletter}
            </Select>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌所属分类" >
              {getFieldDecorator('categoryId', {rules:[{required: true, message: '请选择品牌所属分类!'}], initialValue: categoryId })(<TreeSelect {...tProps} />)}
            </FormItem>
            
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌介绍" >       {getFieldDecorator('note', {rules:[{required: true, message: '请输入品牌介绍!'}], initialValue: note })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌LOGO" >       {getFieldDecorator('logo', {rules:[{required: true, message: '请上传品牌LOGO!'}], initialValue: logo })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌定义" >       {getFieldDecorator('definition', {rules:[{required: true, message: '请输入品牌定义!'}], initialValue: definition })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌国家" >      {getFieldDecorator('countryId', {rules:[{required: true, message: '请选择品牌国家!'}], initialValue: countryId })(
            <Select size="large" defaultValue="中国">
				 {brandCountry}
            </Select>
             )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >       {getFieldDecorator('key', {rules:[{required: true, message: '请输入搜索关键字!'}], initialValue: key })(<Input size="small" />)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(BrandEditModal);
