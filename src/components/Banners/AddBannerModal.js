import React, { Component } from 'react';
import { Modal, Form, Input, Select, Button, Upload, Icon } from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;




class BannerAddModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      banner :this.props.banner,
      imageUrl:this.props.banner?this.props.banner.image:null
    };
  }

  componentWillReceiveProps(nextProps){
    console.log('00000000',nextProps);
  }

  componentWillUpdate(nextProps,  nextState){
      console.log(nextProps,  nextState);

  } 


  componentDidMount() {
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

   handleChange = (info) => {
    if (info.file.status === 'done') {
      this.setState({imageUrl:info.file.response.md5list[0]});
    }else if(info.file.status === 'removed'){
      this.setState({imageUrl:null});
    }
  }

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.image = this.state.imageUrl;
        console.log(values);
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    let { children } = this.props;
    let { getFieldDecorator } = this.props.form;
    let {title,url} = this.props.banner;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
     const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const imageUrl = this.state.imageUrl;

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
            <FormItem className={styles.FormItem} {...formItemLayout} label='URL'>
              {getFieldDecorator('url', {initialValue:url,
                rules: [{
                  type: 'url', message: '请输入正确URL地址!',
                }],
              })(
                <Input type="url" placeholder="请输入URL地址" className={styles.FormInput} />
                )}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="标题">
              {getFieldDecorator('title', {initialValue:title,
                rules: [{
                  type: 'string', message: '请输入正确标题地址!',
                }],
              })(
                <Input type="text" placeholder="请输入标题" className={styles.FormInput} />
                )}
            </FormItem>
              <FormItem className={styles.FormItem} {...formItemLayout} label="图片" >
                <Upload multiple={true} action='/api/file/upload' showUploadList={false} listType="picture-card" onChange={this.handleChange}>
                    {
                      imageUrl?
                       <img style={{width:"50px",heigth:"50px"}} src={'/api/file/'+imageUrl}/>
                      :
                      uploadButton
                    }
                </Upload>
              </FormItem>
            <FormItem style={{ marginLeft: 10 }} {...formItemLayout}>
              <p>图片尺寸(100*200)</p>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(BannerAddModal);
