import React, { Component } from 'react';
import { Modal, Form, Checkbox ,Row,Col , Button} from 'antd';
import styles from '../item.less';
import * as utils from '../utils.js';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
class NavManageRadioModalChild extends Component {
constructor(props) {
    super(props);
    this.state = {
      indeterminate: true,
      checkObj:this.getCheckObj(),
      text : "排序"
    };
  }
  getCheckObj(){
    let { checkedChildIds , child} = this.props;
    let obj = {};
    if(checkedChildIds && checkedChildIds[child._id] && checkedChildIds[child._id].length > 0){
      obj.checkedList = checkedChildIds[child._id];
    }
    return obj;
  }
  componentWillReceiveProps (nextProps) {
    if(nextProps.childrenList !== undefined){
      this.setState({
        checkObj : {"checkedList" : nextProps.childrenList}
      })
    }
  }
  getChildCheckItems(_ids){
    return _ids.filter(v => {return this.state.checkObj[v] !== undefined});
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
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
    onOk(this.state.checkObj.checkedList);
    this.hideModelHandler();
  };
  onChangeHandler = (checkedList) => {
    this.state.checkObj.checkedList = checkedList;
    this.setState({
      checkObj : this.state.checkObj
    })
  }
  sortClickHandler = () => {
    if(this.state.text === "排序"){
      this.setState({
        text : "勾选"
      })
    }else{
      this.setState({
        text : "排序"
      })
    }
  }
  render() {
    const { child , rootObj ,children ,childrenList ,checkedChildIds} = this.props;
    let childList = rootObj[child._id];
    const { getFieldDecorator } = this.props.form;
    // const { parentList ,navMap ,tablist} = this.props;
    // // 选中子级的过滤方法 




    // // 过滤处理单选弹出框的方法
    // let list = [];
    // let childList = [];
    // let rootObj = {};
    // for(let i=0;i<parentList.length;i++){
    //   if(!parentList[i].parentId){
    //     list.push(parentList[i]);
    //   }else{
    //     childList.push(parentList[i])
    //   }
    // }
    // for(let i =0;i<list.length;i++){
    //   rootObj[list[i]._id] = [];
    //   for(let j =0;j<childList.length;j++){
    //     if(childList[j].parentId === list[i]._id){
    //       rootObj[list[i]._id].push({label:childList[j].name,value:childList[j]._id})
    //     }
    //   }
    // }
    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title={`${child.name}展示`}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form layout="vertical" onSubmit={this.okHandler}>
            <Row type="flex" justify="end">
                <span style={{marginRight:"20px" }} onClick={this.sortClickHandler}>{this.state.text}</span>
            </Row> 
            <FormItem className={styles.FormItem}>
                <div>
                  <CheckboxGroup options={childList} value={this.state.checkObj.checkedList} onChange={this.onChangeHandler}/>            
                </div>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(NavManageRadioModalChild);
