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
    let obj = {};
    let { navMap } = this.props;
    if(navMap){
      navMap[0].nav.forEach(v => {
        obj[v.categoryId] = true;
      })
    }
    return obj;
  }
  getChildCheckItems(_ids){
    return _ids.filter(v => {return this.state.checkObj[v] !== undefined});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.navMap){
      this.setState({
        upData : nextProps.navMap[0].nav
      })
    }
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
     let temp = {};   
    if(this.props.navMap && this.props.navMap.length　=== 1 ){
    　temp = this.props.navMap[0];
    }
    else{
      // return ;
    }
    console.log(this.state.upData);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        temp.nav = this.state.upData;
        onOk(temp._id,temp);
        this.hideModelHandler();
      }
    });
  };
   onCheckAllChange = (e,item,rootObj) => {
    if(item._id in this.state.checkObj){

      this.state.checkObj[item._id] = !this.state.checkObj[item._id];
      this.state.checkObj[item._id+"child"] = [];
      if(this.state.checkObj[item._id]){
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
          this.state.upData.push({"categoryId" : item._id ,"childIds" : this.state.checkObj[item._id+"child"]});
        }
        console.log(this.state.upData);
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
            if(v.categoryId === item._id){
                v.categoryId = item._id;
                v.childIds = valuesList;
                this.state.checkObj[item._id+"child"] = valuesList;
            }else{
                this.state.upData.push({"categoryId" : item._id , "childIds" : valuesList });
                this.state.checkObj[item._id+"child"] = valuesList;
            }
          })
        }else{
          this.state.upData.push({"categoryId" : item._id , "childIds" : valuesList})
          this.state.checkObj[item._id+"child"] = valuesList;
        }
      }else{
        this.state.checkObj[item._id] = false;
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
    const { parentList ,navMap ,tablist , childIdList ,checkedChildIds} = this.props;
    console.log(parentList);
    console.log(childIdList);
    // 选中子级的过滤方法 
    let navOjb = null;
    if(this.props.navMap && this.props.navMap.length === 1)
    {
      navOjb = this.props.navMap[0]._id;
    }

    // 过滤处理单选弹出框的方法
    let rootObj = {};
    for(let i =0;i<parentList.length;i++){
      rootObj[parentList[i]._id] = [];
      for(let j =0;j<childIdList.length;j++){
        if(childIdList[j].parentId === parentList[i]._id){
          rootObj[parentList[i]._id].push({label:childIdList[j].name,value:childIdList[j]._id})
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
                              parentList.map((item,index) => (
                              <span key={index}>
                              <Checkbox
                                  indeterminate={rootObj[item._id].indeterminate}
                                  onChange={(e) => this.onCheckAllChange(e,item,rootObj)}
                                  checked={this.state.checkObj[item._id]}
                              >
                                  {item.name}
                              </Checkbox>
                              <NavManageRadioModalChild child={item} rootObj={rootObj} onOk={(valuesList) => this.childOkCallback(valuesList,item,rootObj)} childrenList={this.state.checkObj[item._id+"child"]} checkedChildIds={checkedChildIds}>
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
