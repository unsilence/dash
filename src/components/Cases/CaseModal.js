import React, { Component } from 'react';
import { Modal, Form, Input, Select,Upload,Icon,Radio } from 'antd';
import styles from '../item.less';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import Editor from 'react-umeditor';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const caseModels = [{key:"1",value:"别墅"},{key:"2",value:"平层"}];
const caseSpaces = [{key:"1",value:"客厅"},{key:"2",value:"书房"},{key:"3",value:"卧室"},{key:"4",value:"餐厅"},{key:"5",value:"厨房"},{key:"6",value:"洗漱间"},{key:"7",value:"儿童房"}];
const caseStyles = [{key:"1",value:"现代"},{key:"2",value:"欧式"},{key:"3",value:"美式"},{key:"4",value:"古典"},{key:"5",value:"田园"},{key:"6",value:"混搭"}];
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class CaseEditModal extends Component {

  constructor(props) {
    super(props);
       

    this.state = {
      visible: false,
      value: 1,
      tags: [],
      content: "",
      imageUrl:props.case.collocatImg,
      
    };
  }
 
  handleCancel = () => this.setState({ previewVisible: false });
  updatePic = (info)=>{
      if (info.file.status === 'done') {
          console.log('info',info)
          let newMd5 = info.file.response.md5list[0]
          console.log('new md5',newMd5)
          getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl:newMd5}));
      }
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
    this.props.form.resetFields(['headline','releaseTime','release_time','click_rate']);
  }
  handleChangeInput(tags) {
    this.setState({tags});
  }
  okHandler = (e) => {
    const { onOk } = this.props;
    let collocatImg = this.state.imageUrl;
    let item = Object.assign({},this.props.record);
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.collocatImg = collocatImg;
        onOk(values);
        this.hideModelHandler();
      }
    });
  }
  handleAlter(content){
        this.setState({
            content: content
        })
    }
  getIcons(){
        var icons = [
            "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "paragraph fontfamily fontsize | superscript subscript | ",
            "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal date time  | image emotion spechars | inserttable"
        ];
        return icons;
       
    }
  getQiniuUploader(){
        return {
            url:'http://upload.qiniu.com',
            type:'qiniu',
            name:"file",
            request: "image_src",
            qiniu:{
                app:{
                    Bucket:"liuhong1happy",
                    AK:"l9vEBNTqrz7H03S-SC0qxNWmf0K8amqP6MeYHNni",
                    SK:"eizTTxuA0Kq1YSe2SRdOexJ-tjwGpRnzztsSrLKj"
                },
                domain:"http://o9sa2vijj.bkt.clouddn.com",
                genKey:function(options){
                    return options.file.type +"-"+ options.file.size +"-"+ options.file.lastModifiedDate.valueOf() +"-"+ new Date().valueOf()+"-"+options.file.name;
                }
            }
        }
    }
   handleSubmitForm(){
        var content = this.state.content;
        alert(content.editor);
    }
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
    const { _id, urladdress,projectName,headline,key,caseNote,collocatImg,caseDoormodel,caseSpace,caseStyle,createAt,updateAt} = this.props.case;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const imageUrl = this.state.imageUrl;
    const casespaceButton = caseSpaces.map(t=><RadioButton value={t.value}>{t.value}</RadioButton>);
    const casemodelButton = caseModels.map(v=><RadioButton value={v.value}>{v.value}</RadioButton>);
    const casestyleButton = caseStyles.map(a=><RadioButton value={a.value}>{a.value}</RadioButton>);
    var icons = this.getIcons();
        var uploader = this.getQiniuUploader();
        var plugins = {
            image:{
                uploader:uploader
            }
        }
        var count = 100;
        var editors = [];
        for(var i=0;i<count;i++){
            editors.push({
                icons:icons,
                plugins:plugins
            })
        }
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
            <FormItem className={styles.FormItem} {...formItemLayout} label="URL" > {getFieldDecorator('urladdress', {rules:[{required: true, message: '请输入URL!'}], initialValue: urladdress })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="项目名称" > {getFieldDecorator('projectName', {rules:[{required: true, message: '请输入项目名称!'}], initialValue: projectName })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="标题" > {getFieldDecorator('headline', {rules:[{required: true, message: '请输入标题!'}], initialValue: headline })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" > 
            {getFieldDecorator('key', {rules:[{required: true, message: '请输入搜索关键字!'}], initialValue: [] })( <TagsInput value={[]} {...{ 'onlyUnique': true }} onChange={v => { console.log(v) }} />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="案例介绍" > 
            {getFieldDecorator('caseNote', {rules:[{required: true, message: '请输入案例介绍内容!'}], initialValue: caseNote })
            (<Editor  icons={icons} value={this.state.content} defaultValue="<p>提示文本</p>" onChange={this.handleAlter.bind(this)} plugins={plugins} />)}
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="配图" > 
            {getFieldDecorator('collocatImg', {rules:[{required: true, message: '请上传配图!'}], initialValue: collocatImg })
            (<Upload multiple={true} action='/api/file/upload' onChange={this.updatePic}>
                <img style={{width:"50px",heigth:"50px"}} src={'/api/file/'+this.state.imageUrl}/>
            </Upload>
          )}
        </FormItem>
        <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例户型" > {getFieldDecorator('caseDoormodel', {rules:[{required: true, message: '请选择案例户型!'}], initialValue: caseDoormodel })(<RadioGroup defaultValue="别墅" size="small">
              {casemodelButton}
           </RadioGroup>)}
           </FormItem>
           <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例空间" > {getFieldDecorator('caseSpace', {rules:[{required: true, message: '请选择案例空间!'}], initialValue: caseSpace })(<RadioGroup defaultValue="客厅" size="small">
              {casespaceButton}
           </RadioGroup>)}
           </FormItem>
           <FormItem className={styles.FormItem} {...formItemLayout} label="请选择案例风格" > {getFieldDecorator('caseStyle', {rules:[{required: true, message: '请选择案例风格!'}], initialValue: caseStyle })(<RadioGroup defaultValue="现代" size="small">
             {casestyleButton}
           </RadioGroup>)}
           </FormItem>
           <FormItem className={styles.FormItem} {...formItemLayout} label="发布时间" style={_id ? { display: 'block' } : { display: 'none' }}>    {getFieldDecorator('createAt', { initialValue: moment(new Date(createAt)).format('YYYY-MM-DD HH:mm:ss') })(
              <Input size="small" />
            )}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CaseEditModal);