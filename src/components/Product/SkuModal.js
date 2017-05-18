import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Icon, Button, Upload , Checkbox } from 'antd';
import styles from '../item.less';
import TagsInput from './TagsInput';
import 'react-tagsinput/react-tagsinput.css';
import { getFormatData, getColorSerialFormatData } from '../utils';
import NumericInput from './NumericInput';
import SizeInput from './SizeInput';
const FormItem = Form.Item;
var pinyin = require("pinyin");
const Option = Select.Option;
class SkuEditModal extends Component {

  constructor(props) {
    super(props);
    this.uuid = 0;
    this.keysValue = {};
    this.images = [];
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
      product: {},
      previewVisible: false,
      previewImage: '',
      fileList: this.props.product.images,
      note : this.props.product.spu.note || "",
      onfavorable :false
    };
  }
  handleImgCancel = () => this.setState({ previewVisible: false })


  handleImgPreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleImgChange = ({ fileList }) => {
    console.log(fileList);
    this.images = [];
    fileList.forEach(f => {
      console.log(f.name, '222222', f.status)
      if (f.status === 'done') {
        if (f.url) {
          this.images.push(f);
        }
        else {
          this.images.push({ name: f.name, uid: f.uid, url: '/api/file/' + f.response.md5list[0], status: f.status, md5: f.response.md5list[0] });
        }
      }
    })
    this.setState({ fileList })
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


  okHandler = (e) => {
    const { onOk } = this.props;
    // this.images = [];
    // console.log(this.state.fileList);
    // this.state.fileList.forEach(f => {
    //   console.log(f.name, '222222', f.status)
    //   if (f.status === 'done') {
    //     if (f.url) {
    //       this.images.push(f);
    //     }
    //     else {
    //       this.images.push({ name: f.name, uid: f.uid, url: '/api/file/' + f.response.md5list[0], status: f.status, md5: f.response.md5list[0] });
    //     }
    //   }
    // })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.images);
        values.images = this.images;
        console.log(values);
        onOk(values);
        // this.setState({
        //   note : values.note
        // })
        this.hideModelHandler();
      }else{
        console.log("提交出现错误！");
      }
    });
  };
  minusHandleChange = (value) => {   // 减满的选择回调

  }
  discountHandleChange = (value) => {  // 折扣的选择回调

  }
  onfavorableChange = (e) => {  // 是否使用优惠券的回调
    this.setState({
      onfavorable : e.target.checked
    })
  }
  render() {
    const { children } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { _id, name, note, key, categoryId ,name_prefix ,description ,spu ,images} = this.props.product;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // var  files = [];
    // console.log(fileList);
    // if(fileList)
    // fileList.map( (v,index) => {
    //   v.url = "/api/file/"+v.md5;
    // });
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
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品名字" >    
              {getFieldDecorator('name', { initialValue: name })(<Input size="small" />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="图片" >
              <Upload
                action="/api/file/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handleImgPreview}
                onChange={this.handleImgChange}
              >
                {(fileList || []).length >= 3 ? null : uploadButton}
              </Upload>
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品前缀" >    
              {getFieldDecorator('name_prefix', { initialValue: name_prefix })(<Input size="small" />)}
            </FormItem>
            {/*<FormItem className={styles.FormItem} {...formItemLayout} label="仓库位置" >    
              {getFieldDecorator('name_prefix', { initialValue: "请选择仓库位置" })
              (<Select style={{ width: "200px" }} onChange={this.minusHandleChange}>
                <Option value="武汉体验馆">武汉体验馆</Option>
                <Option value="北京体验馆">北京体验馆</Option>
                <Option value="北京仓库">北京仓库</Option>
              </Select >)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品促销" >    
              {getFieldDecorator('jianman', { initialValue: "请选择减满条件" })
              (<Select style={{ width: "200px" }} onChange={this.minusHandleChange}>
                <Option value="请选择减满条件">请选择减满条件</Option>
                <Option value="无">无</Option>
                <Option value="满1000减500">满1000减500</Option>
              </Select >)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品促销" >    
              {getFieldDecorator('zhekou', { initialValue: "请选择折扣条件" })
              (<Select style={{ width: "200px" }} onChange={this.discountHandleChange}>
                <Option value="请选择减满条件">请选择减满条件</Option>
                <Option value="无">无</Option>
                <Option value="2件9折">2件9折</Option>
                <Option value="3件8折">3件8折</Option>
              </Select >)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label=" " >    
              <Checkbox onChange={this.onfavorableChange}>可使用优惠券</Checkbox>
            </FormItem>*/}
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品介绍" >    
              <p>{spu.description}</p>
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品备注" >
              {getFieldDecorator('note', { initialValue: spu.note })
              (<textarea style={{width : "100%",height : "100px" , outline : "none"}}>{this.state.note ? this.state.note : spu.note}</textarea>)}    
            </FormItem>
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