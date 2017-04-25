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
    const { okHandler } = this.props;
      okHandler(value);
    // this.setState({
    //   childValue : value
    // })

  }
  render(){
    const { categoryMap ,navMap ,tablist} = this.props;
    let dataArr = [];
    for (let item in categoryMap) {
      dataArr.push(categoryMap[item])
    }
    return (
        <span>
          <Row type="flex" justify="start" gutter={10} style={{marginBottom : "10px" ,marginTop : "10px"}}>
                <Col span={2} style={{marginLeft:"20px"}}>
                    <span>分类：</span>
                </Col>
                <Col span={18} className="gutter-row">
                    <RadioGroup onChange={this.changeHandler} value={this.state.value}>
                    {
                      dataArr.map((item,index) => {
                        return (
                            item.parentId? "" : <Radio value={item.name} key={item._id}>{item.name}</Radio>
                          )
                      })
                    }      
                    </RadioGroup>
                    <NavManageRadioModal onOk={this.onOk} parentList={dataArr} navMap={navMap} tablist={tablist}>
                        <Icon type="select"/>
                    </NavManageRadioModal>
                </Col>
                <Col span={2}>
                    <Button style={{marginRight : "16px"}}>更新导航栏</Button>
                </Col>
           </Row>
        </span>     
      )
  }
}