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
        childValue : null,
        updata : {}
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
  onOk = (id,value) => {
    this.setState({
      updata : {id,value}
    })
  }
  upData = () => {
    const { okHandler } = this.props;
    if(this.state.updata.id && this.state.updata.value){
      okHandler(this.state.updata.id,this.state.updata.value);
    }else{
      console.log("没有新的数据提交！");
    }
  }
  render(){
    const { categoryMap ,navMap ,tablist} = this.props;
    let dataArr = [];
    let parentList = [];
    let childIdList = [];
    let checkedChildIds = {};
    if(categoryMap){
      for(let v in categoryMap){
        if(!categoryMap[v].parentId){
          dataArr.push(categoryMap[v]);
        }else{
          childIdList.push(categoryMap[v]);
        }
      }
    }
    console.log(navMap);
    if(navMap){
      if(navMap.length > 0 && navMap[0].nav.length > 0){
        for(let v of dataArr){
          for(let k of navMap[0].nav){
            if(k.categoryId === v._id){
              parentList.push(v);
              checkedChildIds[k.categoryId] = k.childIds;
            }
          }
        }
      }else{
        parentList = [];
      }
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
                      parentList.map((item,index) => {
                        return (
                            item.parentId? "" : <Radio value={item.name} key={item._id}>{item.name}</Radio>
                          )
                      })
                    }      
                    </RadioGroup>
                    <NavManageRadioModal onOk={this.onOk} parentList={dataArr} navMap={navMap} tablist={tablist} checkedChildIds={checkedChildIds} childIdList={childIdList}>
                        <Icon type="select"/>
                    </NavManageRadioModal>
                </Col>
                <Col span={2}>
                    <Button style={{marginRight : "16px"}} onClick={this.upData}>更新导航栏</Button>
                </Col>
           </Row>
        </span>     
      )
  }
}