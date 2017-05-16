import React ,{ Component }from 'react';
import { connect } from 'dva';
import {Row,Col,Button,Icon ,Radio} from 'antd';
import { routerRedux } from 'dva/router';
import NavManageRadioModal from "./NavManageRadioModal";
import styles from '../list.less';
let inInfo;
const RadioGroup = Radio.Group;
export default class NavManageRadio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value : "",
      childValue : null,
      updata : {}
    };
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.isHasId){return};
    this.setState({
      value : nextProps.isHasId.inInfo
    })
  }
  changeHandler = (e) => {
    if (e) e.stopPropagation();
    const { change } = this.props;
    // this.setState({
    //   value : e.target.value
    // })
    inInfo = e.target.value;
    console.log(e.target.value);
    change(e.target.value);
  }
  onOk = (values) => {
    const { change } = this.props;
    if(!inInfo){inInfo = values[0].categoryId; change(inInfo);};
    let value = JSON.stringify(values);
    this.setState({
      updata : {value}
    })
  }
  upData = () => {
    const { okHandler ,isHasId } = this.props;
    if(this.state.updata.value){
      okHandler(isHasId.isHasId,this.state.updata.value);
    }else{
      console.log("没有新的数据提交！");
    }
  }


  render(){
    const { categoryMap ,navList ,tablist} = this.props;
    let parentList_ = [];
    let isNull = [];
    for(let v in categoryMap){   // 验证 categoryMap 是不是 一个空对象
      if(v){
        isNull.push(v);
      }
    }
    console.log(categoryMap);
    if(isNull.length > 0){
      if(navList){
        navList.forEach(v => {
          if(categoryMap[v.categoryId]){
            parentList_.push(categoryMap[v.categoryId]);
          }
        })
      }
    }
    
    let parentList = [];
    let childIdList = [];
    if(categoryMap){
      for(let v in categoryMap){
        if(!categoryMap[v].father_num){
          parentList.push(categoryMap[v]);   //  parentList 存储的是没有tather_num 的分类 一级分类
        }else{
          childIdList.push(categoryMap[v]); // childIdList 存储的是有tather_num 的分类 二级分类
        }
      }
    }
    return (
      <span>
      <Row type="flex" justify="start" gutter={10} style={{marginBottom : "10px" ,marginTop : "10px"}}>
      <Col span={2} style={{marginLeft:"20px"}}>
      <span>分类：</span>
      </Col>
      <Col span={18} className="gutter-row">
      <RadioGroup onChange={this.changeHandler} value={inInfo ? inInfo : this.state.value}>
      {
        parentList_.map((item,index) => {
          return (
            <Radio value={item._id} key={item._id}>{item.name}</Radio>
            )
          })
        }      
        </RadioGroup>
        <NavManageRadioModal onOk={this.onOk} parentList={parentList} navMap={navList} tablist={tablist} childIdList={childIdList}>
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