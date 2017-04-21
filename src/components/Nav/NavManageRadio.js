import React ,{ Component }from 'react';
import { connect } from 'dva';
import {Row,Col,Button,Icon ,Radio} from 'antd';
import { routerRedux } from 'dva/router';
import NavManageRadioModal from "./NavManageRadioModal";
import styles from '../list.less';

const RadioGroup = Radio.Group;
export default class NavManageRadio extends Component {
  constructor(props) {
      super(props);
      this.state = {
        value : 1,
        childValue : null
      };
    }
  changeHandler = (e) => {
    if (e) e.stopPropagation();
    const { change } = this.props;
    this.setState({
      value : e.target.value
    })
    change(this.state.value,{...this.state});
  }
  onOk = (value) => {
    console.log(value); // 从radio 组件获取的选中信息
    this.setState({
      childValue : value
    })
  }
  render(){
    return (
        <span>
          <Row type="flex" justify="start" gutter={10} style={{marginBottom : "10px" ,marginTop : "10px"}}>
                <Col span={2} style={{marginLeft:"20px"}}>
                    <span>分类：</span>
                </Col>
                <Col span={18} className="gutter-row">
                    <RadioGroup onChange={this.changeHandler} value={this.state.value}>
                      <Radio value={1}>摆件</Radio>
                      <Radio value={2}>灯饰</Radio>
                      <Radio value={3}>地毯</Radio>
                      <Radio value={4}>窗帘</Radio>
                    </RadioGroup>
                    <NavManageRadioModal onOk={this.onOk}>
                        <Icon type="select" onClick={this.props.disp}/>
                    </NavManageRadioModal>
                </Col>
           </Row>
        </span>     
      )
  }
}