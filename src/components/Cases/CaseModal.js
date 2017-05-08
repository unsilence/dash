import React, { Component } from 'react';
import { Modal, Form, Input, Select,Upload,Icon,Button,Radio ,Layout , Row , Col , Table ,Popconfirm} from 'antd';
import styles from '../item.less';
import TagsInput from '../Product/TagsInput';
import 'react-tagsinput/react-tagsinput.css';
import Editor from 'react-umeditor';
import moment from 'moment';
import * as utils from "../utils.js";
const { Header, Footer, Sider, Content } = Layout;
const Search = Input.Search;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const caseModels = [{ key: "1", value: "别墅" }, { key: "2", value: "平层" }];
const caseSpaces = [{ key: "1", value: "客厅" }, { key: "2", value: "书房" }, { key: "3", value: "卧室" }, { key: "4", value: "餐厅" }, { key: "5", value: "厨房" }, { key: "6", value: "洗漱间" }, { key: "7", value: "儿童房" }];
const caseStyles = [{ key: "1", value: "现代" }, { key: "2", value: "欧式" }, { key: "3", value: "美式" }, { key: "4", value: "古典" }, { key: "5", value: "田园" }, { key: "6", value: "混搭" }];
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
const pops = {
  action: '/api/file/upload',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      
           let newMd5 = file.response.md5list[0]
          console.log('new md5',newMd5)
          getBase64(file.originFileObj, imageUrl => this.setState({ imageUrl:newMd5}));
      console.log(file, fileList);
    }
  },
  defaultFileList: [],
};


const img = [{
  md5:"b797f86724abaca3b0542fb963e8679a",
  name:"file.png",
  status:"done",
  uid:"rc-upload-1492242576856-2",
  url:"/api/file/b797f86724abaca3b0542fb963e8679a"
  }]
const tempData = [{
    "_id" : 1,
    "name" : "富贵花开",
    "url" : "/api/file/b797f86724abaca3b0542fb963e8679a",
    "brank" : "达克宁",
    "type" : "治脚气",
    "price" : "9956"
}]
  

class CaseEditModal extends Component {

  constructor(props) {
    super(props);

    this.images = [];
    this.state = {
      visible: false,
      value: 1,
      tags: [],
      content: "",

      imageUrl: props.case.collocatImg,
      previewVisible: false,
      previewImage: '',
      fileList: this.props.case.images || [],
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
  }
  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields(['headline','releaseTime','collocatImg','release_time','click_rate']);
  }
  handleChangeInput(tags) {
    this.setState({ tags });
  }
  okHandler = (e) => {
    const { onOk } = this.props;
    let item = Object.assign({}, this.props.record);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.images = this.images;
        onOk(values);
        this.hideModelHandler();
      }
    });
  }
  handleAlter(content) {
    this.setState({
      content: content
    })
  }
  getIcons() {
    var icons = [
      "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
      "paragraph fontfamily fontsize | superscript subscript | ",
      "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
      "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
      "horizontal date time  | image emotion spechars | inserttable"
    ];
    return icons;

  }
  getQiniuUploader() {
    return {
      url: 'http://upload.qiniu.com',
      type: 'qiniu',
      name: "file",
      request: "image_src",
      qiniu: {
        app: {
          Bucket: "liuhong1happy",
          AK: "l9vEBNTqrz7H03S-SC0qxNWmf0K8amqP6MeYHNni",
          SK: "eizTTxuA0Kq1YSe2SRdOexJ-tjwGpRnzztsSrLKj"
        },
        domain: "http://o9sa2vijj.bkt.clouddn.com",
        genKey: function (options) {
          return options.file.type + "-" + options.file.size + "-" + options.file.lastModifiedDate.valueOf() + "-" + new Date().valueOf() + "-" + options.file.name;
        }
      }
    }
  }
  // clickImgHandler = (e) => {
  //   console.log(e.target);
  // }
  handleSubmitForm() {
    var content = this.state.content;
    alert(content.editor);
  }
  confirm = (id) => {
    console.log("aaaaaaaaaaaaaaa");
  }
  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { _id, urladdress, projectName, headline, key, caseNote, images, caseDoormodel, caseSpace, caseStyle, createAt, updateAt } = this.props.case;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    console.log(this.state.fileList);
    const imageUrl = this.state.imageUrl;
    const casespaceButton = caseSpaces.map(t => <RadioButton value={t.value}>{t.value}</RadioButton>);
    const casemodelButton = caseModels.map(v => <RadioButton value={v.value}>{v.value}</RadioButton>);
    const casestyleButton = caseStyles.map(a => <RadioButton value={a.value}>{a.value}</RadioButton>);
    const column = [{
      title : "图片",
      key : "url",
      dataIndex : "url",
      render : (text,data) => (<img src={text} style={{width : "50px",height : "50px"}} />)
    },{
      title:"ID",
      dataIndex : "_id",
      key :"_id"
    },{
      title : "商品名称",
      dataIndex : "name",
      key : "name"
    },{
      title : "品牌",
      dataIndex : "brank",
      key : "brank"
    },{
      title : "类别",
      dataIndex : "type",
      key : "type"
    },{
      title : "价格",
      dataIndex : "price",
      key : "price"
    }]
    const columnIn = [{
    title : "ID",
    dataIndex : "_id",
    key :"_id"
  },{
    title : "商品名称",
    dataIndex : "name",
    key : "name"
  },{
    title : "品牌",
    dataIndex : "brank",
    key : "brank"
  },{
    title : "类别",
    dataIndex : "type",
    key : "type"
  },{
    title : "价格",
    dataIndex : "price",
    key : "price"
  },{
    title : "操作",
    key : "_id",
    dataIndex :"_id",
    render : (text,data) => {
      return (<Popconfirm placement="left" title={text} onConfirm={(text) => this.confirm(text)} okText="确定" cancelText="取消">
                <span>删除</span>
              </Popconfirm>)
    }
  }]
    var icons = this.getIcons();
    var uploader = this.getQiniuUploader();
    var plugins = {
      image: {
        uploader: uploader
      }
    }
    var count = 100;
    var editors = [];
    for (var i = 0; i < count; i++) {
      editors.push({
        icons: icons,
        plugins: plugins
      })
    }

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const afterAdd = (
      <div id="addAffterParent" style={{width: "200px" , height : "200px" , posotion : "relative" ,background : "#000"}}>
          {img.length > 0 ?<img id="addAffter" src={img[0].url} style={{width: "200px" , height : "200px"}}/> : null}
      </div>
    )
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
          width={1400}
        >
        <Form horizontal onSubmit={this.okHandler}>
          <Row justify="space-between">
            <Col span={12}>
                <FormItem className={styles.FormItem} {...formItemLayout} label="URL" > {getFieldDecorator('urladdress', { rules: [{ required: true, message: '请输入URL!' }], initialValue: urladdress })(<Input size="small" />)}</FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="项目名称" > {getFieldDecorator('projectName', { rules: [{ required: true, message: '请输入项目名称!' }], initialValue: projectName })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="标题" > {getFieldDecorator('headline', { rules: [{ required: true, message: '请输入标题!' }], initialValue: headline })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >
              {getFieldDecorator('key', { rules: [{ required: true, message: '请输入搜索关键字!' }], initialValue: [] })(<TagsInput value={[]} {...{ 'onlyUnique': true }} onChange={v => { console.log(v) }} />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="案例介绍" >
              {getFieldDecorator('caseNote', { rules: [{ required: true, message: '请输入案例介绍内容!' }], initialValue: caseNote })
                (<Editor icons={icons} value={this.state.content} defaultValue="<p>提示文本</p>" onChange={this.handleAlter.bind(this)} plugins={plugins} />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="添加软装后案例图(长X宽)" >
              {(img || []).length > 0 ? afterAdd : <Upload
                action="/api/file/upload"
                listType="picture-card"
                onPreview={this.handleImgPreview}
                onChange={this.handleImgChange}
              >
                {uploadButton}
              </Upload>}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="添加软装前案例图(长X宽)" >
              {(img || []).length > 0 ? afterAdd : <Upload
                action="/api/file/upload"
                listType="picture-card"
                onPreview={this.handleImgPreview}
                onChange={this.handleImgChange}
              >
                {uploadButton}
              </Upload>}
            </FormItem>
            </Col>
            <Col span={12}>
                <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例户型" > {getFieldDecorator('caseDoormodel', { rules: [{ required: true, message: '请选择案例户型!' }], initialValue: caseDoormodel })(<RadioGroup defaultValue="别墅" size="default">
                  {casemodelButton}
                </RadioGroup>)}
                </FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例空间" > {getFieldDecorator('caseSpace', { rules: [{ required: true, message: '请选择案例空间!' }], initialValue: caseSpace })(<RadioGroup defaultValue="客厅" size="default">
                  {casespaceButton}
                </RadioGroup>)}
                </FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例风格" > {getFieldDecorator('caseStyle', { rules: [{ required: true, message: '请选择案例风格!' }], initialValue: caseStyle })(<RadioGroup defaultValue="现代" size="default">
                  {casestyleButton}
                </RadioGroup>)}
                </FormItem>
                <Row>
                  <p><b>添加商品</b>(请安住商品拖动到左侧案例图上对应商品为止)</p>
                </Row>
                <Row justify="space-between" className={styles.Row}>
                  <Col span={16}>
                    <Search 
                      placeholder="请输入商品ID"
                      style={{ width: 300 }}
                      size="large"
                      onSearch={value => console.log(value)}
                    />
                  </Col>
                  <Col>
                      <Button size="large">创建商品</Button>
                  </Col>
                </Row>
                <Row className={styles.Row}>
                    <Table 
                        columns={column}
                        dataSource={tempData}
                        pagination={false}
                        onRowClick={(record, index) => {
                          utils.imgMove(record.url,record);
                        }}
                    />
                </Row>
                <Row className={styles.Row}>
                    <p><b>场景内商品</b></p>
                </Row>
                <Row className={styles.Row}>
                    <Table 
                        columns={columnIn}
                    />
                </Row>
            </Col>
          </Row>
        </Form>
        <Row className={styles.Row}>
            <p style={{marginBottom : "20px"}}><b>同户型其他房间案例</b></p>
            <Upload
                action="/api/file/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handleImgPreview}
                onChange={this.handleImgChange}
            >
                {(fileList || []).length >= 10 ? null : uploadButton}
            </Upload>
        </Row>
        <Row className={styles.Row}>
            <p style={{marginBottom : "20px"}}><b>同户型其他房间案例</b></p>
            <Upload
                action="/api/file/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handleImgPreview}
                onChange={this.handleImgChange}
            >
                {(fileList || []).length >= 10 ? null : uploadButton}
            </Upload>
        </Row>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CaseEditModal);