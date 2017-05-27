import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Radio, Checkbox } from 'antd';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import {getFormatData} from '../utils'
import styles from '../item.less';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import moment from 'moment';

const FormItem = Form.Item;

const extendsObject = {"0":'不继承','1':'尺寸','2':'颜色','3':'原产地','4':'品牌'};

class AttributeModalEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      extendsOption: [],
      disabled: false,
      tagsInputDisabled:false,//tagsInput
      threeDisabled: false,//选择颜色、原产地、品牌时间状态
      isNullValue: '1',//默认值
      useSkuImg: false,//使用sku配图的状态
      isNullDisabled:false,//isNull的状态 为销售属性时不能修改
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
    this.setState({ extendsOption: [] });
    this.props.form.resetFields(['name', 'categoryId', 'type', 'etype', 'stype', 'isNull', 'createAt', 'updateAt', 'size'])
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


  cascaderOnChange = (value) => {

  }

  stypeOnChange = (e) => {
    let stype = e.target.value;
    if(stype === '3')
    {
      this.setState({ tagsInputDisabled:false});
    }
    else {
      this.setState({ tagsInputDisabled:true});
    }

  }

  etypeOnClick = (e) => {

    console.log(e);
  }

  /**
   * 属性分类切换
   */
  typeOnChange = (e) => {
    let type = e.target.value;
    if (type === '2') {
      this.props.form.setFieldsValue({ 'is_null': '2' });
      this.setState({useSkuImg:false,isNullDisabled:true})
    }
    else {
      this.props.form.setFieldsValue({ 'is_null': '1' });
      this.setState({useSkuImg:true,isNullDisabled:false})
    }
  }

  etypeOnChange = (e) => {
    let key = e.target.value;
    this.props.form.setFieldsValue({ 'name': key === '0' ? '': this.setExtendsText(key) });
    switch (key) {
      case "1":
        this.setState({ extendsOption: ['长', '宽', '高', '半径'] })
        this.setState({ disabled: true ,tagsInputDisabled:true})
        break;
      case "2":
      case "3":
      case "4":
        this.setState({ extendsOption: [] })
        this.props.form.resetFields(['size']);
        this.setState({ disabled: true ,tagsInputDisabled:true})
        break;
      case "0":
        this.setState({ extendsOption: [] })
        this.props.form.resetFields(['size']);
        this.setState({ disabled: false ,tagsInputDisabled:false})
        break;
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({ 'select_value': this.props.record.select_value || [] });
  }

  setExtendsText = (type) => {
    return extendsObject[type]?extendsObject[type]:'';
  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { _id, name, category_num, vital_type, extends_type, select_type, is_null, select_value, create_at, update_at, sizes,rank,is_show} = this.props.record;
    let data = [];

    (this.props.record.categoryList || []).forEach(v => data.unshift(v));
    let cascaderOptions = getFormatData(data);
    console.log(cascaderOptions);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    let checkOptions = getFieldDecorator('size', { initialValue: ['长', '宽', '高', '半径']})(<CheckboxGroup  disabled={true} options={this.state.extendsOption} />);
    let tagsInput = <TagsInput disabled={this.state.tagsInputDisabled} value={[]} {...{ 'onlyUnique': true }} onChange={v => { console.log(v) }} />;
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
              {getFieldDecorator('category_num', {rules:[{required: true, message: '请选择所属分类!'}], initialValue: category_num })(<Cascader options={cascaderOptions} onChange={this.cascaderOnChange} expandTrigger="hover"placeholder='Please select' />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性分类" >    {getFieldDecorator('vital_type', { initialValue: vital_type || '3'})(
              <RadioGroup key='typeSelect' onChange={this.typeOnChange}>
                <Radio value={'1'}>关键属性</Radio>
                <Radio value={'2'}>销售属性</Radio>
                <Radio value={'3'}>其他属性</Radio>
              </RadioGroup>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="继承公共属性" >    {getFieldDecorator('extends_type', { initialValue: extends_type || '0' })(
              <RadioGroup onChange={this.etypeOnChange} onClick={this.etypeOnClick}>
                <Radio value={'0'}>不继承</Radio>
                <Radio value={'1'}>尺寸</Radio>
                <Radio value={'2'}>颜色</Radio>
                <Radio value={'3'}>原产地</Radio>
                <Radio value={'4'}>品牌</Radio>
              </RadioGroup>
            )}
              {checkOptions}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性名称" >    {getFieldDecorator('name', {rules:[{required: true, message: '请输入属性名称!'}], initialValue: name })(
              <Input size="small" disabled={this.state.disabled} />
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="属性选项" >    {getFieldDecorator('select_type', { initialValue: select_type || '3' })(
              <RadioGroup key='' disabled={this.state.disabled} onChange={this.stypeOnChange}>
                <Radio value={'3'}>下拉使用</Radio>
                <Radio value={'1'} >运营输入</Radio>
                <Radio value={'2'} disabled={this.state.useSkuImg}>使用SKU配图</Radio>
              </RadioGroup>
            )
            }
              {getFieldDecorator('select_value')(tagsInput)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="可以为空" > {getFieldDecorator('is_null', { initialValue: is_null || '1' })(
              <RadioGroup key='is_null' disabled={this.state.isNullDisabled}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="前台显示" > {getFieldDecorator('is_show', { initialValue: is_show || false })(
              <RadioGroup key='is_show' disabled={this.state.isNullDisabled}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="前台显示顺序" > {getFieldDecorator('rank', { initialValue: rank || '1' })(
               <Input size="small"  />
            )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="创建时间" style={_id ? { display: 'block' } : { display: 'none' }}>    {getFieldDecorator('create_at', { initialValue: moment(new Date(create_at)).format('YYYY-MM-DD HH:mm:ss') })(
              <Input size="small" />
            )}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AttributeModalEditModal);
