import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import ReactDOM from 'react-dom';
import Editor from 'react-umeditor';
const FormItem = Form.Item;
class TestEditModal extends Component {
  constructor(props) {
    super(props);
        this.state = {
            // content: ""
            form_data: {
                text: "123",
                editor: "<p>789</p>"
            }
        }
  }
  // handleChange(content){
  //       this.setState({
  //           content: content
  //       })
  //   }
    getIcons(){
        return [
            "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "paragraph fontfamily fontsize | superscript subscript | ",
            "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal date time  | image emotion spechars | inserttable"
        ]
       
    }
    getDefaultUploader(){
        return {
            url:'/api/upload',
            name:"file",
            request: "url"
        }
    }
    getQiniuUploader(){
        return {
            url:'http://upload.qiniu.com',
            type:'qiniu',
            name:"file",
            request: "url",
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
    handleFormChange(e){
        e = e || event;
        var target = e.target || e.srcElement;
        var value = target.value;
        var editor = this.refs.editor.getContent();
        var form_data = this.state.form_data;
        form_data.text = value;
        form_data.editor = editor;
        this.setState({
            form_data: form_data
        })
    }
    handleSubmitForm(){
        var form_data = this.state.form_data;
        alert(form_data.editor);
    }
  render() {
    var icons = this.getIcons();
        var uploader = this.getQiniuUploader();
        // 本地上传调用
        // var uploader = this.getDefaultUploader();
        // 注意上传接口的返回值，应该是  {'data': {'image_src': xxx} , 'status':'success'}
        var plugins = {
            image:{
                uploader:uploader
            }
        }
        // var count = 100;
        // var editors = [];
        // for(var i=0;i<count;i++){
        //     editors.push({
        //         icons:icons,
        //         plugins:plugins
        //     })
        // }
        let form_data = this.state.form_data;
   return <div>
                <Editor ref="editor" icons={icons} plugins={plugins} value={form_data.editor}/>
                <input type="text" value={form_data.text} onChange={this.handleFormChange.bind(this)}/>
                <input type="submit" value="提交" onClick={this.handleSubmitForm.bind(this)} />
               </div>
  }
}

export default Form.create()(TestEditModal);
