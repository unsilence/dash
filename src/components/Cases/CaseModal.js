import React, { Component } from 'react';
import { Modal, Form, Input, Select,Upload,Icon,Radio } from 'antd';
import styles from '../item.less';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class CaseEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: 1,
      previewVisible: false,
      previewImage: '',
      fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }], 

    };
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ fileList }) => this.setState({ fileList })
  // componentDidMount() {
  //   // To disabled submit button at the beginning.
  //   this.props.form.validateFields();
  // }
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
    this.props.form.resetFields(['headline','releaseTime','release_time','click_rate']);
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
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { _id, urladdress,headline,key,caseNote,collocatImg,caseDoormodel,caseSpace,caseStyle,createAt,recommenCoeff} = this.props.case;
    // const nameError = isFieldTouched('name') && getFieldError('name');
    // const noteError = isFieldTouched('note') && getFieldError('note');
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
          title={_id ? "修改：": '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="URL" > {getFieldDecorator('urladdress', { initialValue: urladdress })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="标题" > {getFieldDecorator('headline', { initialValue: headline })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" > {getFieldDecorator('key', { initialValue: key })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="案例介绍" > {getFieldDecorator('caseNote', { initialValue: caseNote })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="配图" > {getFieldDecorator('collocatImg', { initialValue: collocatImg })(<Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>)}</FormItem>
        <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例户型" > {getFieldDecorator('caseDoormodel', { initialValue: caseDoormodel })(<RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>别墅</Radio>
              <Radio value={2}>平层</Radio>
           </RadioGroup>)}
           </FormItem>
           <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例空间" > {getFieldDecorator('caseSpace', { initialValue: caseSpace })(<RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>客厅</Radio>
              <Radio value={2}>书房</Radio>
              <Radio value={3}>卧室</Radio>
              <Radio value={4}>餐厅</Radio>
              <Radio value={5}>厨房</Radio>
              <Radio value={6}>洗漱间</Radio>
              <Radio value={7}>儿童房</Radio>
           </RadioGroup>)}
           </FormItem>
           <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例风格" > {getFieldDecorator('caseStyle', { initialValue: caseStyle })(<RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>现代</Radio>
              <Radio value={2}>欧式</Radio>
              <Radio value={3}>美式</Radio>
              <Radio value={4}>古典</Radio>
              <Radio value={5}>田园</Radio>
              <Radio value={6}>混搭</Radio>
           </RadioGroup>)}
           </FormItem>
           <FormItem className={styles.FormItem} {...formItemLayout} label="发布时间" style={_id ? { display: 'block' } : { display: 'none' }}>    {getFieldDecorator('createAt', { initialValue: moment(new Date(createAt)).format('YYYY-MM-DD HH:mm:ss') })(
              <Input size="small" />
            )}</FormItem>
           <FormItem className={styles.FormItem} {...formItemLayout} label="推荐系数" style={_id ? { display: 'block' } : { display: 'none' }}>    {getFieldDecorator('recommenCoeff', { initialValue: moment(new Date(recommenCoeff)).format('YYYY-MM-DD HH:mm:ss') })(
              <Input size="small" />
            )}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CaseEditModal);
