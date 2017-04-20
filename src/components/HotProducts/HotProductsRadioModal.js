import React, { Component } from 'react';
import { Modal, Form, Checkbox ,Row,Col} from 'antd';
import styles from '../item.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
    const name = ["摆件","布艺","灯具","壁饰","地毯","其他"];
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    // const defaultCheckedList = ['Apple', 'Orange'];  // 设置默认选中的选项
class HotProductsRadioModal extends Component {
constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkedList: function (){
        return name.map(item => 
            ({
              item : []
            })
        )
      },
      indeterminate: true,
      checkAll: false,
    };
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };
   onCheckAllChange = (e) => {
      this.setState({
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    }
    onChangeHandler = (checkedList) => {
      this.setState({
        checkedList,
        qindeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
        checkAll: checkedList.length === plainOptions.length,

      })
    }
  render() {
    let { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
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
        >{
        name.map((item,index) => 
           (
              <Form horizontal onSubmit={this.okHandler} key = {index}>
                  <FormItem className={styles.FormItem} {...formItemLayout}>
                      {getFieldDecorator('radio_1',{initialvalue : "Apple"})(
                      <div>
                        <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={this.state.checkAll}
                        >
                            {item}
                        </Checkbox>
                        <br />
                        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChangeHandler}/>
                        </div>
                      )}
                  </FormItem>
                </Form>
          )
        )
        }</Modal>
      </span>
    );
  }
}

export default Form.create()(HotProductsRadioModal);
