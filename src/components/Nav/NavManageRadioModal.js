import React, { Component } from 'react';
import { Modal, Form, Checkbox ,Row,Col , Button} from 'antd';

import NavManageRadioModalChild from "./NavManageRadioModal_child.js";
import styles from '../item.less';
import * as utils from '../utils.js';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
class NavManageRadioModal extends Component {
constructor(props) {
    super(props);
    this.state = {
      visible: false,
      indeterminate: true,
      upData : [],
      checkObj:this.getCheckObj(),
      text : "排序",
      sortShow : false
    };
    this.isCheckedHandler = this.isCheckedHandler.bind(this);
  }
  getCheckObj(){
    let ck = {};
    for(let key in this.props.navMap){
      ck[key] = true;
      this.props.navMap[key].childIds.forEach(v =>{
        ck[v] = true;
      })
    }
    return ck;
  }

  getChildCheckItems(_ids){
    return _ids.filter(v => {return this.state.checkObj[v] !== undefined});
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
    // this.props.form.resetFields();
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
        console.log(this.state.upData);
        onOk(this.state.upData);
        this.hideModelHandler();
      }
    });
  };
   onCheckAllChange = (e,item,rootObj) => {
    if(item._id in this.state.checkObj){

      this.state.checkObj[item._id] = !this.state.checkObj[item._id];
      this.state.checkObj[item._id+"child"] = [];
      if(this.state.checkObj[item._id])
          {
            rootObj[item._id].forEach(v => {
              this.state.checkObj[v._id] = true;
            })
            for(let i = 0;i<rootObj[item._id].length;i++){
              this.state.checkObj[item._id+"child"].push(rootObj[item._id][i].value);
            }
          }else{
            this.state.checkObj[item._id+"child"] = [];
          }
        }else{
          this.state.checkObj[item._id] = true;
          this.state.checkObj[item._id+"child"] = [];
          for(let i = 0;i<rootObj[item._id].length;i++){
            this.state.checkObj[item._id+"child"].push(rootObj[item._id][i].value);
          }
        }
        console.log(this.state.checkObj[item._id+"child"]);
    }
    onChangeHandler = (checkedList,item,rootObj) => {
      this.state.checkObj[item._id+"child"] = checkedList;
      checkedList.length > 0 ? this.state.checkObj[item._id] = true : this.state.checkObj[item._id] = false;

    }
    isCheckedHandler = (tabList,navMap) => {
      console.log(navMap);
      const navArr = [];
      const idList = [];
      const checked = [];
      for(let   item in navMap){
        navArr.push(navMap[item])
      }
      console.log(navArr);
      for( let v of navArr){
        idList.push(v._id);
      }
      for(let i = 0;i<tabList.length;i++){
          if(idList.includes(tabList[i])){
            checked.push(idList[i])
          }
      }
      return checked;
    }
    childOkCallback = (valuesList,item,rootObj) => {
      if(valuesList.length > 0){
        this.state.checkObj[item._id] = true;
        if(this.state.upData.length > 0){
          this.state.upData.forEach(v => {
            if(v.parentId == item._id){
                v.parentId = item._id;
                v.children = valuesList;
                this.state.checkObj[item._id+"child"] = valuesList;
            }else{
                this.state.upData.push({"categoryId" : item._id , "childIds" : valuesList })
                this.state.checkObj[item._id+"child"] = valuesList;
            }
          })
        }else{
          this.state.upData.push({"categoryId" : item._id , "childIds" : valuesList})
          this.state.checkObj[item._id+"child"] = valuesList;
        }
      }
      this.setState({checkObj:this.state.checkObj})
    }
    sortHandler = () => {
      if(this.state.text === "排序"){
        this.setState({
          text : "勾选",
          sortShow : true
        })
      }else{
        this.setState({
          text : "排序",
          sortShow : false
        })
      }
    }
  render() {
    let { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { parentList ,navMap ,tablist} = this.props;
    // 选中子级的过滤方法 




    // 过滤处理单选弹出框的方法
    let list = [];
    let childList = [];
    let rootObj = {};
    for(let i=0;i<parentList.length;i++){
      if(!parentList[i].parentId){
        list.push(parentList[i]);
      }else{
        childList.push(parentList[i])
      }
    }
    for(let i =0;i<list.length;i++){
      rootObj[list[i]._id] = [];
      for(let j =0;j<childList.length;j++){
        if(childList[j].parentId === list[i]._id){
          rootObj[list[i]._id].push({label:childList[j].name,value:childList[j]._id})
        }
      }
    }
    //  ==================================================
    // const formItemLayout = {
    //   labelCol: { span: 2 },
    //   wrapperCol: { span: 18 },
    // };
    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title="导航栏一级分类展示"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          width={600}
        >{/*
        list.map((item,index) => 
           (
              <Form horizontal onSubmit={this.okHandler} key = {index}>
                  <FormItem className={styles.FormItem} {...formItemLayout}>
                      {getFieldDecorator('radio_1')(
                      <div>
                        <Checkbox
                            indeterminate={rootObj[item._id].indeterminate}
                            onChange={(e) => this.onCheckAllChange(e,item,rootObj)}
                            checked={this.state.checkObj[item._id]}
                        >
                            {item.name}
                        </Checkbox>
                        <br />
                        <CheckboxGroup options={rootObj[item._id]} value={this.state.checkObj[item._id+"child"]} onChange={(list) => this.onChangeHandler(list,item,rootObj)} key={index}/>
                      </div>
                      )}
                  </FormItem>
                </Form>
          )
        )
        */}
              <Form layout="horizontal" onSubmit={this.okHandler}>
                      <Row type="flex" justify="end">
                          <span style={{marginRight:"20px" }} onClick={this.sortHandler}>{this.state.text}</span>
                      </Row>  
                      {!this.state.sortShow ?
                        <FormItem className={styles.FormItem}>
                          {getFieldDecorator('radio_1')(
                            <div>{
                              list.map((item,index) => (
                              <span key={index}>
                              <Checkbox
                                  indeterminate={rootObj[item._id].indeterminate}
                                  onChange={(e) => this.onCheckAllChange(e,item,rootObj)}
                                  checked={this.state.checkObj[item._id]}
                              >
                                  {item.name}
                              </Checkbox>
                              <NavManageRadioModalChild child={item} rootObj={rootObj} onOk={(valuesList) => this.childOkCallback(valuesList,item,rootObj)} childrenList={this.state.checkObj[item._id+"child"]}>
                                <span style={{marginLeft : "0px",marginRight : "0px" , color : "#00f" }}>编辑</span>
                              </NavManageRadioModalChild>
                              </span>
                              ))               
                            }</div>
                          )}
                      </FormItem> :
                      <FormItem className={styles.FormItem}>
                          {getFieldDecorator('radio_1')(
                            <div>{
                              list.map((item,index) => (
                              <span key={index} style={{padding : "10px" , border : "1px solid #666" ,borderRadius : "5px"}}>
                                 {item.name} 
                              </span>
                              ))               
                            }</div>
                          )}
                      </FormItem>
                    }
                </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(NavManageRadioModal);
