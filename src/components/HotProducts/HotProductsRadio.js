import React ,{ Component }from 'react';
import { connect } from 'dva';
import {Row,Col,Button,Icon ,Radio} from 'antd';
import { routerRedux } from 'dva/router';
import HotProductsRadioModal from "./HotProductsRadioModal";
import styles from '../list.less';

const RadioGroup = Radio.Group;
export default class HotProductsRadio extends Component {
  constructor(props) {
      super(props);
      this.state = {
        value : '',
        childValue : [],
        categoryMap : {},
        dataSource : []
      };
    }
  componentWillReceiveProps (nextProps) {
     const { list , categoryMap , hotList } = nextProps;
    let options = [];
    let _list = [];
    let categoryList = [];
    console.log(hotList);
    list.forEach(v => {
      _list.push(v.category_num);
    })
    if(hotList != undefined){
      for(let v in categoryMap){
        for(let t in hotList){
          hotList[t].forEach(k => {
            if(k == categoryMap[v]._id){
              options.push(categoryMap[v]);
            }
          })
        }
      } 
    } 
    this.setState({
      childValue : options
    })
  }
  changeHandler_ = (e) => {
    if (e) e.stopPropagation();
    const { changeHandler } = this.props;
    this.setState({
      value : e.target.value
    })
    changeHandler( e.target.value);
  }
  onOk = (_value) => {
    console.log(_value);
    const { dispatch ,hotList} = this.props;
    let hotProduct = [];
    let id = Object.keys(hotList)[0];
    _value.forEach(v => {
      hotProduct.push(v._id);
    })
    let value = JSON.stringify(hotProduct);
    let key = 'hot';
    let values = {key:key ,value:value};

    if(id){
      dispatch({
        type: 'hotproducts/hotpatch',
        payload: { id, values },
      })
    }else{
      dispatch({
        type: 'hotproducts/addCategory',
        payload: { id, values },
      })
    }
  }
  // checkInfo = () => {
  //   const { list , categoryMap } = this.props;
  //   let options = [];
  //   let _list = [];
  //   list.forEach(v => {
  //     _list.push(v.category_num);
  //   })
  //   for(let v in categoryMap){
  //     categoryList.push(categoryMap[v]);
  //     _list.forEach(t => {
  //       if(v == t){
  //           options.push(categoryMap[v]);
  //       }
  //     })
  //   }
  //   this.setState({
  //     childValue : options
  //   })
  // }
  render(){
    const { categoryMap ,infoCheck , list ,hotList} = this.props;
    
    let categoryList = [];
    for(let v in categoryMap){
      categoryList.push(categoryMap[v]);
    }
    
    return (
        <span>
          <Row type="flex" justify="start" gutter={10} style={{marginBottom : "10px" ,marginTop : "10px"}}>
                <Col span={2} style={{marginLeft:"20px"}}>
                    <span>分类：</span>
                </Col>
                <Col span={18} className="gutter-row">
                    <RadioGroup onChange={this.changeHandler_} value={this.state.value ? this.state.value : infoCheck}>
                      {
                        this.state.childValue.map((v,index) => <Radio value={v._id} key={index}>{v.name}</Radio>)
                      }
                    </RadioGroup>
                    <HotProductsRadioModal onOk={this.onOk} categoryList={categoryList} checkInfo={this.state.childValue}>
                        <Icon type="select" />
                    </HotProductsRadioModal>
                </Col>
           </Row>
        </span>     
      )
  }
}