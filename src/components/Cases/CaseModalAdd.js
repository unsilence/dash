import React, { Component } from 'react';
import { Modal, Form, Input, Select,Upload,Icon,Button,Radio } from 'antd';
import styles from '../item.less';
import TagsInput from '../Product/TagsInput';
import 'react-tagsinput/react-tagsinput.css';
import Editor from 'react-umeditor';
import moment from 'moment';
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

class CaseEditModalAdd extends Component {

  constructor(props) {
    super(props);

    this.images = [];
    this.state = {
      visible: false,
      value: 1,
      tags: [],
      content: "",
      beforefileList :  [],
      imageUrl: props.case.collocatImg,
      previewVisible: false,
      previewImage: '',
      afterfileList: [],
      editor : "请输入文本"
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
  afterhandleImgChange = ({ fileList }) => {
    // fileList.forEach(f => {
    //   f.case_type = "after";
      // if (f.status === 'done') {
      //   if (f.url) {
      //     this.images.push(f);
      //   }
      //   else {
      //     this.images.push({ name: f.name, url: '/api/file/' + f.response.md5list[0], md5: f.response.md5list[0] ,case_type : "after"});
      //   }
      // }
    // })
    // this.state.afterfileList.forEach(v => {
    //   if(v.case_type === "after"){
    //       v = fileList[0]
    //   }
    // })
    fileList[0].case_type = "after";
    this.setState({ afterfileList :fileList })
  }
  beforehandleImgChange = ({ fileList }) => {
    //   fileList.forEach(f => {
    //     f.case_type = "before";
    //     if (f.status === 'done') {
    //       if (f.url) {
    //         this.images.push(f);
    //       }
    //       else {
    //         this.images.push({ name: f.name, url: '/api/file/' + f.response.md5list[0], md5: f.response.md5list[0] ,case_type : "before"});
    //       }
    //     }
    //   })
    //   this.state.beforefileList.forEach(v => {
    //   if(v.case_type === "before"){
    //       v = fileList[0]
    //   }
    // })
      fileList[0].case_type = "before";
      this.setState({ beforefileList : fileList })
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
      tags : []
    });
    this.props.form.resetFields();
  }
  handleChangeInput (tags) {
    this.setState({ tags });
  }
  tagsHandler = (value) => {
    this.setState({
      tags : value
    })
  }
  okHandler = (e) => {
    const { onOk } = this.props;
    let item = Object.assign({}, this.props.record);

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let imgs = this.state.beforefileList.concat(this.state.afterfileList);
        imgs.forEach(v => {
          this.images.push({name : v.name,url : "/api/file/"+v.response.md5list[0],md5 : v.response.md5list[0] ,case_type : v.case_type })
        })
        values.images = this.images;
        values.qtext = this.state.tags;
        console.log(values);
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
  handleSubmitForm() {
    var content = this.state.content;
    alert(content.editor);
  }
  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { _id, urladdress, projectName, headline, key, caseNote, images, caseDoormodel, caseSpace, caseStyle, createAt, updateAt } = this.props.case;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const imageUrl = this.state.imageUrl;
    const casespaceButton = caseSpaces.map((t,index) => <RadioButton value={t.value} key={index}>{t.value}</RadioButton>);
    const casemodelButton = caseModels.map((v,index) => <RadioButton value={v.value} key={index}>{v.value}</RadioButton>);
    const casestyleButton = caseStyles.map((a,index) => <RadioButton value={a.value} key={index}>{a.value}</RadioButton>);
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
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="URL" > {getFieldDecorator('url', { rules: [{ required: true, message: '请输入URL!' }]})(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="项目名称" > {getFieldDecorator('project_name', { rules: [{ required: true, message: '请输入项目名称!' }]})(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="标题" > {getFieldDecorator('title', { rules: [{ required: true, message: '请输入标题!' }]})(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >
              {<TagsInput value={this.state.tags} {...{ 'onlyUnique': true }} onChange={this.tagsHandler} />}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="案例介绍" >
              {getFieldDecorator('note', {  rules: [{ required: true, message: '请输入案例介绍内容!' }]})
                (<Editor icons={icons} onChange={this.handleAlter.bind(this)} plugins={plugins} />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="添加软装后案例图(长X宽)" >
              <Upload
                action="/api/file/upload"
                listType="picture-card"
                fileList={this.state.afterfileList}
                onPreview={this.handleImgPreview}
                onChange={this.afterhandleImgChange}
              >
                {(fileList || []).length > 1  ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="添加软装前案例图(长X宽)" >
              <Upload
                action="/api/file/upload"
                listType="picture-card"
                fileList={this.state.beforefileList}
                onPreview={this.handleImgPreview}
                onChange={this.beforehandleImgChange}
              >
                {(fileList || []).length > 1 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例户型" > {getFieldDecorator('layout', { rules: [{ required: true, message: '请选择案例户型!' }]})(<RadioGroup  size="small">
              {casemodelButton}
            </RadioGroup>)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例空间" > {getFieldDecorator('space_node', { rules: [{ required: true, message: '请选择案例空间!' }]})(<RadioGroup  size="small">
              {casespaceButton}
            </RadioGroup>)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例风格" > {getFieldDecorator('style', { rules: [{ required: true, message: '请选择案例风格!' }]})(<RadioGroup  size="small">
              {casestyleButton}
            </RadioGroup>)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="发布时间" style={_id ? { display: 'block' } : { display: 'none' }}>    {getFieldDecorator('publish_at', { })(
              <Input size="small" />
            )}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CaseEditModalAdd);