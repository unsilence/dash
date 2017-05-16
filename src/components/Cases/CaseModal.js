import React, { Component } from 'react';
import { Modal, Form, Input, Select,Upload,Icon,Button,Radio ,Layout , Row , Col , Table ,Popconfirm} from 'antd';
import styles from '../item.less';
import TagsInput from '../Product/TagsInput';
import 'react-tagsinput/react-tagsinput.css';
import Editor from 'react-umeditor';
import moment from 'moment';
import * as utils from "../utils.js";
import * as service from '../../services.js';
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


// const img = [{
//   md5:"b797f86724abaca3b0542fb963e8679a",
//   name:"file.png",
//   status:"done",
//   uid:"rc-upload-1492242576856-2",
//   url:"/api/file/b797f86724abaca3b0542fb963e8679a"
//   }]

class CaseEditModal extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.cases);
    this.images = [];
    this.state = {
      visible: false,
      value: 1,
      tags: this.props.cases.tags ||  [],
      content: "",
      searchData : [],
      imageUrl: this.props.cases.collocatImg,
      previewVisible: false,
      previewImage: '',
      fileList:  [],
      addAfter: [],
      addBefore : [],
      points : []
    };
  }

  componentWillReceiveProps (nextprops){
    console.log(nextprops);
      if(nextprops.cases.points && nextprops.cases.points.length > 0 ){
        nextprops.cases.points.forEach(v => {
          nextprops.skuList.forEach(k => {
            if(v.sku_num == k.cnum){
              this.state.points.push({span : v ,prop : k})
            }
          })
        })
      }

      if(nextprops.cases.images && nextprops.cases.images.length > 0 ){
        nextprops.cases.images.forEach(v => {if(v.case_type == "after"){this.state.addAfter.push(v)}})

        nextprops.cases.images.forEach(v => {if(v.case_type == "before"){this.state.addBefore.push(v)}})
        this.setState({
        addBefore : this.state.addBefore,
        addAfter : this.state.addAfter
      })
      }
      

      
      
      this.setState({
        points : this.state.points,
        addBefore : this.state.addBefore,
        addAfter : this.state.addAfter
      })
  }

  componentDidUpdate () {
    utils.initalPoints(this.props.cases.points);
  }
  handleImgCancel = () => this.setState({ previewVisible: false })

  handleImgPreview = (file) => {
    console.log(file);
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
    //addAfter:this.props.case.images ?  this.props.case.images.map(v => v.case_type == "after" ?  v : [])  : [],
      // addBefore : this.props.case.images ?  this.props.case.images.map(v => v.case_type == "before" ?  v : [])  : [],
  }
  addAfterImgHandler = ({fileList}) => {
      console.log(fileList);
      this.setState({
        addAfter : fileList
      })
  }
  addBeforeImgHandler = ({fileList}) => {
    console.log(fileList);
      this.setState({
        addBefore : fileList
      })
  }
  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  }
  hideModelHandler = () => {
    this.setState({
      addAfter: [],
      addBefore : [],
      points : [],
      visible: false,
    });
    this.props.form.resetFields();

  }
  handleChangeInput(tags) {
    this.setState({ tags });
  }
  okHandler = (e) => {
    const { onOk , cases } = this.props;
    let item = Object.assign({}, this.props.record);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // values.images = this.images;
        values.points = [];
        console.log(values);
        console.log(this.state.points);
        console.log(this.state.addAfter);
        if(this.state.points.length > 0){
          this.state.points.forEach(v => {
            values.points.push({"imgage_md5" : this.state.addAfter[0].md5 , "sku_num" : v.prop.cnum , "position_x" : v.span.style.left , "position_y" : v.span.style.top})
          })
        }
        console.log(values);
        onOk(cases._id , values);
        this.hideModelHandler();
      }else{
        console.log(err);
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
  searchData = () => { // 整理搜索商品ID得到的数据的结构整理方法   SKU1704190003


  }
  handleSubmitForm = () => {
    var content = this.state.content;
    alert(content.editor);
  }
  searchHandler = async (value) => {
    console.log(value);
    let searchData = await service.getDataService("Sku",{"cnum":value});
    let list = searchData.data.data.list;
    let categorys = await service.getDataService("Category",{"_id" : {"$in":list[0].category_num}});
    let categoryList = categorys.data.data.list;
    list[0].category = categoryList[0].name;
    console.log(categoryList);
    // list[0].category_num
    console.log(list);
    this.setState({
      searchData :list
    })
  }
  tagsHandler = (value) => {
    this.setState({
      tags : value
    })
  }
  confirm = (id) => {
    console.log("aaaaaaaaaaaaaaa");
  }
  render() {
    const { children ,cases } = this.props;
    const { getFieldDecorator } = this.props.form;
    console.log(cases);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    var  files = [];
    this.state.fileList.map( (v,index) => {
      v.status = 'done';
      v.uid = 'asdf'+ index;
      v.url = "/api/file/"+v.md5;
      files.push(v);
    });
    const imageUrl = this.state.imageUrl;
    console.log(this.state.addAfter);
    const column = [{
      title : "图片",
      key : "url",
      dataIndex : "url",
      render : (text,data) => (<img src={data.images[0].url ? data.images[0].url : ""} style={{width : "50px",height : "50px"}} key={data.images[0].url}/>)
    },{
      title:"ID",
      dataIndex : "cnum",
      key :"cnum"
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
      dataIndex : "category",
      key : "category"
    },{
      title : "价格",
      dataIndex : "price",
      key : "price"
    }]



    const columnIn = [{
      title : "ID",
      dataIndex : "cnum",
      key :"cnum",
      render : (text,data) => <span>{data.prop.cnum}</span>
    },{
      title : "商品名称",
      dataIndex : "name",
      key : "name",
      render : (text,data) => <span>{data.prop.name}</span>
    },{
      title : "品牌",
      dataIndex : "brank",
      key : "brank"
    },{
      title : "类别",
      dataIndex : "category",
      key : "category",
      render : (text,data) => <span>{data.prop.category}</span>
    },{
      title : "价格",
      dataIndex : "price",
      key : "price",
      render : (text,data) => <span>{data.prop.price}</span>
    },{
      title : "操作",
      key : "todo",
      dataIndex :"todo",
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
      <div id="addAffterParent" style={{width: "200px" , height : "200px" , posotion : "relative"}}>
          {this.state.addAfter.length > 0  ? <img id="addAffter" src={this.state.addAfter[0].url} style={{width: "200px" , height : "200px"}}/> : null}
      </div>
    )
    const beforeAdd = (
      <div id="addBeforeParent" style={{width: "200px" , height : "200px" , posotion : "relative"}}>
          {this.state.addBefore.length > 0  ? <img id="addBefore" src={this.state.addBefore[0].url} style={{width: "200px" , height : "200px"}}/> : null}
      </div>
    )
    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title={cases._id ? "修改：" : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          width={1400}
        >
        <Form horizontal onSubmit={this.okHandler}>
          <Row justify="space-between">
            <Col span={12}>
                <FormItem className={styles.FormItem} {...formItemLayout} label="URL" > {getFieldDecorator('url', { rules: [{ required: true, message: '请输入URL!' }], initialValue: cases.url })(<Input size="small" />)}</FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="项目名称" > {getFieldDecorator('project_name', { rules: [{ required: true, message: '请输入项目名称!' }], initialValue: cases.project_name })(<Input size="small" />)}</FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="标题" > {getFieldDecorator('title', { rules: [{ required: true, message: '请输入标题!' }], initialValue: cases.title })(<Input size="small" />)}</FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >
                  {<TagsInput value={this.state.tags} {...{ 'onlyUnique': true }} onChange={this.tagsHandler} />}
                </FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="案例介绍" >
                  {getFieldDecorator('note', { rules: [{ required: true, message: '请输入案例介绍内容!' }], initialValue: cases.note })
                (<Editor icons={icons} onChange={this.handleAlter.bind(this)} plugins={plugins} />)}
                </FormItem>
              <FormItem className={styles.FormItem} {...formItemLayout} label="添加软装后案例图(长X宽)" >
              {this.state.addAfter.length > 0 ? afterAdd : <Upload
                action="/api/file/upload"
                listType="picture-card"
                fileList={this.state.addAfter}
                onPreview={this.handleImgPreview}
                onChange={this.addAfterImgHandler}
              >
                {uploadButton}
              </Upload>}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="添加软装前案例图(长X宽)" >
              {this.state.addBefore.length > 0 ? beforeAdd : <Upload
                action="/api/file/upload"
                listType="picture-card"
                filteList={this.state.addBefore}
                onPreview={this.handleImgPreview}
                onChange={this.addBeforeImgHandler}
              >
                {uploadButton}
              </Upload>}
            </FormItem>
            </Col>
            <Col span={12}>
                <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例户型" > {getFieldDecorator('layout', { rules: [{ required: true, message: '请选择案例户型!' }], initialValue: cases.layout })(<RadioGroup  size="default">
                  {caseModels.map((v,index) => <RadioButton value={v.value} key={index}>{v.value}</RadioButton>)}
                </RadioGroup>)}
                </FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例空间" > {getFieldDecorator('space_node', { rules: [{ required: true, message: '请选择案例空间!' }], initialValue: cases.space_node })(<RadioGroup size="default">
                  {caseSpaces.map((t,index) => <RadioButton value={t.value} key={index}>{t.value}</RadioButton>)}
                </RadioGroup>)}
                </FormItem>
                <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例风格" > {getFieldDecorator('style', { rules: [{ required: true, message: '请选择案例风格!' }], initialValue: cases.style })(<RadioGroup size="default">
                  {caseStyles.map((a,index) => <RadioButton value={a.value} key={index}>{a.value}</RadioButton>)}
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
                      onSearch={this.searchHandler}
                    />
                  </Col>
                  <Col>
                      <Button size="large">创建商品</Button>
                  </Col>
                </Row>
                <Row className={styles.Row}>
                    <Table 
                        columns={column}
                        dataSource={this.state.searchData}
                        pagination={false}
                        onRowClick={(record, index) => {
                          utils.imgMove(record,(points) => {
                              this.setState({
                                points :points 
                              })
                          });
                        }}
                    />
                </Row>
                <Row className={styles.Row}>
                    <p><b>场景内商品</b></p>
                </Row>
                <Row className={styles.Row}>
                    <Table 
                        columns={columnIn}
                        dataSource={this.state.points}
                        pagination={false}
                    />
                </Row>
            </Col>
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
        <Row className={styles.Row}>
            <p style={{marginBottom : "20px"}}><b>同类型房间案例</b></p>
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
        </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CaseEditModal);