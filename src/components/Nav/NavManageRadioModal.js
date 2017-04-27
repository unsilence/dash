import React, { Component } from 'react';
import { Modal, Form, Checkbox, Row, Col, Button } from 'antd';

import NavManageRadioModalChild from "./NavManageRadioModal_child.js";
import styles from '../item.less';
import * as utils from '../utils.js';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
var navParentIds;
var _upData;
class NavManageRadioModal extends Component {
  
  constructor(props) {
    
    super(props);
    this.state = {
      visible: false,
      indeterminate: true,
      upData: [],
      navOjb : [],
      checkObj: {},
      text: "排序",
      sortShow: false,
      sort : []
    };
    this.isCheckedHandler = this.isCheckedHandler.bind(this);
  }
  // getCheckObj() {
  //   let obj = {};
  //   let { navMap } = this.props;
  //   if (navMap) {
  //     navMap[0].nav.forEach(v => {
  //       obj[v.categoryId] = true;
  //     })
  //   }
  //   return obj;
  // }
  getChildCheckItems(_ids) {
    return _ids.filter(v => { return this.state.checkObj[v] !== undefined });
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if(nextProps.navMap && nextProps.navMap[0]){
    
        this.state.upData = nextProps.navMap[0].nav;

    }
    if (this.props.navMap && this.props.navMap.length === 1) {
      this.state.navOjb = ([].concat(...this.props.navMap.map(v => { return v.nav }))).map(c =>{return c.categoryId});
      this.state.navOjb = Array.from(new Set(this.state.navOjb));
    }
    this.state.navOjb.map(v => {
      this.state.checkObj[v] = true;
    })
  }

  componentWillUpdate(nextProps, nextState) {

    if(typeof navParentIds ==  "object"){
      // if(navParentIds.length > 0 ){
        this.state.navOjb = navParentIds;
      // }
    }
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
      this.setState({ imageUrl: info.file.response.md5list[0] });
    } else if (info.file.status === 'removed') {
      this.setState({ imageUrl: null });
    }
  }

  okHandler = () => {
    const { onOk } = this.props;
    let temp = {};
    if (this.props.navMap && this.props.navMap.length 　=== 1) {
      temp = this.props.navMap[0];
    }
   
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(_upData != undefined){
          this.state.upData = _upData;
        }
        temp.nav = this.state.upData;
        onOk(temp._id, temp);
        this.hideModelHandler();
      }
    });
  };
  onCheckAllChange = (e, item, rootObj) => {
    if(navParentIds == undefined){
        navParentIds = this.state.navOjb;
        navParentIds = Array.from(new Set(navParentIds));
      }
    if(_upData == undefined){
      _upData = this.state.upData;
    }
    if (this.state.checkObj[item._id]) {  // 判断 一级分类是否被选中

      // this.state.checkObj[item._id] = !this.state.checkObj[item._id];

      navParentIds.indexOf(item._id) === -1 ? navParentIds.push(item._id) : navParentIds.splice(navParentIds.indexOf(item._id),1);
      this.state.checkObj[item._id + "child"] = [];
      if (navParentIds.indexOf(item._id) !== -1) {
        for (let i = 0; i < rootObj[item._id].length; i++) {
          this.state.checkObj[item._id + "child"].push(rootObj[item._id][i].value);
        }
        // let temp = this.state.upData;
        // this.state.upData = [];
        // temp.map((v,index) => {
        //   if(this.state.navOjb.indexOf(v.categoryId) !== -1){
        //     this.state.upData.push(v);
        //   }
        // })
        if(_upData.length > 0){
          _upData.map(v => {
            if(v.categoryId === item._id){
              v.childIds = this.state.checkObj[item._id + "child"];
            }else{
              _upData.push({ "categoryId": item._id, "childIds": this.state.checkObj[item._id + "child"] })
            }
          })
        }else{
          _upData.push({ "categoryId": item._id, "childIds": this.state.checkObj[item._id + "child"] })
        }
        
      } else {
        this.state.checkObj[item._id + "child"] = [];
        _upData.map((v,index) => {
          if(v.categoryId === item._id){
            _upData.splice(index,1);
          }
        })
        this.state.checkObj[item._id] = false;
      }
    } else {
      // this.state.checkObj[item._id] = true;
      // navParentIds = this.state.navOjb;
      navParentIds.indexOf(item._id) === -1 ? navParentIds.push(item._id) : navParentIds.splice(navParentIds.indexOf(item._id),1);
      this.state.checkObj[item._id + "child"] = [];
      for (let i = 0; i < rootObj[item._id].length; i++) {
        this.state.checkObj[item._id + "child"].push(rootObj[item._id][i].value);
      }
      _upData.push({ "categoryId": item._id, "childIds": this.state.checkObj[item._id + "child"] });
      this.state.checkObj[item._id] = true;
    }
  }
  // onChangeHandler = (checkedList, item, rootObj) => {
  //   this.state.checkObj[item._id + "child"] = checkedList;
  //   checkedList.length > 0 ? this.state.checkObj[item._id] = true : this.state.checkObj[item._id] = false;

  // }
  isCheckedHandler = (tabList, navMap) => {
    // console.log(navMap);
    const navArr = [];
    const idList = [];
    const checked = [];
    for (let item in navMap) {
      navArr.push(navMap[item])
    }
    // console.log(navArr);
    for (let v of navArr) {
      idList.push(v._id);
    }
    for (let i = 0; i < tabList.length; i++) {
      if (idList.includes(tabList[i])) {
        checked.push(idList[i])
      }
    }
    return checked;
  }
  childOkCallback = (valuesList, item, rootObj) => {
    if(navParentIds == undefined){
      navParentIds = this.state.navOjb;
    }
    if(_upData == undefined){
      _upData = this.state.upData;
    }
    // }
    if (valuesList.length > 0) {
      // this.state.checkObj[item._id] = true;
      navParentIds.push(item._id);
      navParentIds = Array.from(new Set(navParentIds));
      if (_upData.length > 0) {
        _upData.forEach(v => {
          if (v.categoryId === item._id) {
            this.state.checkObj[item._id + "child"] = valuesList;
            v.childIds = valuesList;
            this.state.checkObj[item._id] = true;
            this.setState({
              checkObj : this.state.checkObj
            })
          } else {
            _upData.push({ "categoryId": item._id, "childIds": valuesList });
            this.state.checkObj[item._id + "child"] = valuesList;
            this.state.checkObj[item._id] = true;
            this.setState({
              checkObj : this.state.checkObj
            })
          }
        })
      } else {
        _upData.push({ "categoryId": item._id, "childIds": valuesList })
        this.state.checkObj[item._id + "child"] = valuesList;
        this.state.checkObj[item._id] = true;
        this.setState({
          checkObj : this.state.checkObj
        })
      }  // 二级分类确定返回的选定 数组 在大于 0 的情况下
    } else {  // 二级分类确定返回的选定 数组 在 小于 0 的情况下
      this.state.checkObj[item._id] = false;
      if(navParentIds.indexOf(item._id) !== -1){  // 判断一级分类已选中的数组中有无该分类 这是有的情况
        navParentIds.splice(navParentIds.indexOf(item._id),1);
        this.state.checkObj[item._id + "child"] = [];
        let temp = _upData;
        _upData = [];
        temp.map((v,index) => {
          if(this.state.navOjb.indexOf(v.categoryId) !== -1){
            _upData.push(v);
            this.state.checkObj[v.categoryId] = true;
          }else{
            this.state.checkObj[v.categoryId] = false;
          }
        })
        this.setState({
          navOjb : navParentIds,
          checkObj : this.state.checkObj
        })
      }else{  // 判断一级分类已选中的数组中有无该分类 这是无的情况
        this.state.checkObj[item._id + "child"] = [];
        let temp = _upData;
        _upData = [];
        temp.map((v,index) => {
          if(this.state.navOjb.indexOf(v.categoryId) !== -1){
            _upData.push(v);
            this.state.checkObj[v.categoryId] = true;
          }else{
            this.state.checkObj[v.categoryId] = false;
          }
        })
        this.setState({
          navOjb : navParentIds,
          checkObj : this.state.checkObj
        })
      }
    }
    // this.setState({ checkObj: this.state.checkObj })
  }
  sortHandler = () => {
    let { parentList } = this.props;
    if (this.state.text === "排序") {
      this.setState({
        text: "勾选",
        sortShow: true
      })
      parentList.map(v => {
      if(this.state.navOjb.indexOf(v._id) !== -1){
          this.state.sort.push(v);
          this.setState({
            sort : this.state.sort
          })
        }
      })
    } else {
      this.setState({
        text: "排序",
        sortShow: false
      })
      this.state.sort = [];
      this.setState({
        sort : this.state.sort
      })
    }
  }
  // editHandler = () => {
  //   if(navParentIds !== undefined){
  //     if(navParentIds.length <= 0){
  //       navParentIds = this.state.navOjb;
  //     }
  //   }
  // }
  render() {
    let { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { parentList, navMap, tablist, childIdList, checkedChildIds } = this.props;

    // let navOjb = [];
    // if (this.props.navMap && this.props.navMap.length === 1) {
    //   navOjb = ([].concat(...this.props.navMap.map(v => { return v.nav }))).map(c =>{return c.categoryId});
    // }

    // 过滤处理单选弹出框的方法
    let rootObj = {};
    for (let i = 0; i < parentList.length; i++) {
      rootObj[parentList[i]._id] = [];
      for (let j = 0; j < childIdList.length; j++) {
        if (childIdList[j].parentId === parentList[i]._id) {
          rootObj[parentList[i]._id].push({ label: childIdList[j].name, value: childIdList[j]._id })
        }
      }
    }
    //  ==================================================
    // const formItemLayout = {
    //   labelCol: { span: 2 },
    //   wrapperCol: { span: 18 },
    // };
    console.log(parentList ,this.state.navOjb,'----比较------')
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
        >
          <Form layout="horizontal" onSubmit={this.okHandler}>
            <Row type="flex" justify="end">
              <span style={{ marginRight: "20px" }} onClick={this.sortHandler}>{this.state.text}</span>
            </Row>
            {!this.state.sortShow ?
              <FormItem className={styles.FormItem}>
                {getFieldDecorator('radio_1')(
                  <div>{
                    parentList.map((item, index) => (
                      <span key={index}>
                        <Checkbox
                          indeterminate={rootObj[item._id].indeterminate}
                          onChange={(e) => this.onCheckAllChange(e, item, rootObj)}
                          checked={this.state.navOjb.indexOf(item._id) !== -1 }
                        >
                          {item.name}
                        </Checkbox>
                        <NavManageRadioModalChild child={item} rootObj={rootObj} onOk={(valuesList) => this.childOkCallback(valuesList, item, rootObj)} childrenList={this.state.checkObj[item._id + "child"]} checkedChildIds={checkedChildIds}>
                          <span style={{ marginLeft: "0px", marginRight: "0px", color: "#00f" }}>编辑</span>
                        </NavManageRadioModalChild>
                      </span>
                    ))
                  }</div>
                )}
              </FormItem> :
              <FormItem className={styles.FormItem}>
                {getFieldDecorator('radio_1')(
                  <div>{
                    this.state.sort.map((item, index) => (
                      <span key={index} style={{ padding: "10px", border: "1px solid #666", borderRadius: "5px" }}>
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
