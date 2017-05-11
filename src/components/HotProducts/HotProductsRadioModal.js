import React, { Component } from 'react';
import { Modal, Form, Checkbox ,Row,Col} from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
    // const name = ["摆件","布艺","灯具","壁饰","地毯","其他"];
    // const plainOptions = ['Apple', 'Pear', 'Orange'];
    // const defaultCheckedList = ['Apple', 'Orange'];  // 设置默认选中的选项
class HotProductsRadioModal extends Component {
constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkedList: [],
      indeterminate: true,
      checkAll: false,
    };
  }


  getCheckList () {
    const { categoryIds , categoryMap } = this.props;
  }

  componentWillReceiveProps(nextProps){
  }

  componentWillUpdate(nextProps,  nextState){

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
    const { onOk , categoryList} = this.props;
    let list = [];
    categoryList.forEach(v => {
      this.state.checkedList.forEach(t => {
        if(v.name === t){
          list.push(v);
        }
      })
    })
        onOk(list);
        this.hideModelHandler();
  };
    onChangeHandler = (checkedList) => {
      console.log(checkedList);
      this.setState({
        checkedList : checkedList
      })
    }
    defaultValue = () => {
      const { categoryList ,checkInfo} = this.props;
      console.log(checkInfo);
      let defaultValueArr = [];
      checkInfo.forEach(v => {
        defaultValueArr.push(v.name);
      })
      return defaultValueArr;
    }
  render() {
    let { children , categoryList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
    let plainOptions = [];
    categoryList.forEach(v => {
      plainOptions.push(v.name);
    })
    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title="热品分类展示"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <CheckboxGroup options={plainOptions} defaultValue={this.defaultValue()} onChange={this.onChangeHandler} />
        </Modal>
      </span>
    );
  }
}

export default Form.create()(HotProductsRadioModal);
