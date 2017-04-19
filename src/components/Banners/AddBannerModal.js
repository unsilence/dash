import React, { Component } from 'react';
import { Modal, Form, Input, Select ,Button , Upload ,Icon} from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;




class BannerAddModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount(){
    this.props.form.validateFields();
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
    this.props.form.resetFields();
  };

  okHandler = () => {
    // const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        this.hideModelHandler();
      }
    });
  };
 
  render() {
    let {children} = this.props;
    let { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
            {children}
        </span>
        <Modal
          title="添加banner"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="URL:">
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout}>
                {getFieldDecorator('url', {
                  rules: [{
                    type: 'url', message: '请输入正确URL地址!',
                  }, {
                    required: true, message: '请输入URL地址!',
                  }],
                })(
                  <Input type="url" placeholder="请输入URL地址" className={styles.FormInput}/>
                )}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="标题:">
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout}>
              {getFieldDecorator('title', {
                  rules: [{
                    type: 'string', message: '请输入正确标题地址!',
                  }, {
                    required: true, message: '请输入标题地址!',
                  }],
                })(
                  <Input type="text" placeholder="请输入标题" className={styles.FormInput}/>
                )}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout}> 
                <strong><span>配图:</span></strong>
                <Upload
                  action="/api/file/upload"
                  listType="picture-card"
                  >
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
              </Upload>
            </FormItem>
            <FormItem style={{marginLeft :10}} {...formItemLayout}>
                <p>图片尺寸(100*200)</p>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(BannerAddModal);
