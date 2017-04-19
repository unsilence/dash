import React, { Component } from 'react';
import { Modal, Form, Input, Select ,Button} from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;

class BannerAddModal extends Component {

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
    this.props.form.resetFields(['name','parentId','note']);
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

  render() {
    let {children} = this.props;
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
          title="添加banner"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="分类" >   </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="父分类" > 
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="备注" > </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(BannerAddModal);
