import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Icon, Button } from 'antd';
import styles from '../item.less';
import TagsInput from './TagsInput';
import 'react-tagsinput/react-tagsinput.css';
import { getFormatData, getColorSerialFormatData } from '../utils';
import NumericInput from './NumericInput';
import SizeInput from './SizeInput';
const FormItem = Form.Item;
var pinyin = require("pinyin");

import EditableTable from './EditableTable';
// let uuid = 0;

class SkuEditModal extends Component {

  constructor(props) {
    super(props);
    this.uuid = 0;
    this.keysValue = {};
    this.state = {
      visible: false,
      keyAttr: [],
      sellAttr: [],
      otherAttr: [],
      tableData: {},
      tableFormatData: [],
      columnsDatas: [],
      key: [],
      categoryId: [],
      product: {}
    };
  }

  componentWillMount() {
    console.log(this.props.product, '-----------componentWillMount');
  }
  componentDidMount() {
    console.log('-----------componentDidMount');
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
          </Form>
        </Modal>
      </span>
    );
  }

}
export default Form.create()(SkuEditModal);

/**
 * 获取组合数据
 * @param {} doubleArrays
 */
function doExchange(doubleArrays) {
  var len = doubleArrays.length
  if (len >= 2) {
    var len1 = doubleArrays[0].length
    var len2 = doubleArrays[1].length
    var newlen = len1 * len2
    var temp = new Array(newlen);
    var index = 0
    for (var i = 0; i < len1; i++) {
      for (var j = 0; j < len2; j++) {
        temp[index] ? temp[index].push(doubleArrays[0][i], doubleArrays[1][j]) : temp[index] = [doubleArrays[0][i], doubleArrays[1][j]]
        index++
      }
    }
    var newArray = new Array(len - 1)
    for (var i = 2; i < len; i++) {
      newArray[i - 1] = doubleArrays[i]
    }
    newArray[0] = temp
    return doExchange(newArray)
  } else {
    return doubleArrays[0]
  }
}