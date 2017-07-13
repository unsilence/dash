import React , {Component} from "react";
import { Modal  , Row , Col } from "antd";

import style from "../list.less";




class SelectPositionModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible : false,
      plist : props.plist || []
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      plist : nextProps.plist
    })
  }
  /*
  显示modal 的方法
  */
  showModelHandler = () => {
    this.setState({
      visible : true
    })
  }
  /*
  隐藏modal 的方法
  */
  hideModelHandler = () => {
    this.setState({
      visible : false
    })
  }
  /*
  关闭modal , 取消 modal 的方法
  */
  handleCancel = () => {
    this.hideModelHandler();
  }
  /*
    对选择推荐发布位置的数据进行处理
  */
  disposePositionDataHandler = (arr) => {
    let sortArr = [];
    if(arr.length > 0) {
      for(let i = 0;i< 5 ; i++ ){
        sortArr.push({});
      }
      arr.forEach(v => {
        sortArr.splice((v.rank-1),1,v);
      })
    }
    return sortArr;
  }
  /*
  选择发布位置弹出框的item 选择方法
  */
  selectPositionHandler = (v,index) => {
    this.state.isClick = {};
    if(v.rank){
        this.state.isClick[v.rank] = true;
    }else{
        this.state.isClick[index+1] = true;
    }

    this.setState({
      isClick : this.state.isClick,
      rank : index+1
    })
  }
  render () {
    let arr = this.disposePositionDataHandler(this.state.plist);
    console.log(arr);
    let dataArr = this.disposePositionDataHandler(this.state.plist).slice(1,this.disposePositionDataHandler(this.state.plist).length);
    return (
      <span>
        <span onClick={this.showModelHandler}>
          {this.props.children}
        </span>
        <Modal
          title="请选择要发布的推荐位置"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
          >
          <div style={{width:"100%",height:"300px"}}>
            <Row gutter={20}>
              <Col span={12}>
                <div className={style.left_big_pic} onClick={() => this.selectPositionHandler()}>
                  {
                    this.disposePositionDataHandler(this.state.plist)[0].image ?
                    <img src={"/api/file/" + this.disposePositionDataHandler(this.state.plist)[0].image} style={{width:"100%",height:"100%"}}/> :
                    <span className={style.left_big_pic_text}>1</span>
                  }
                </div>
              </Col>
              <Col span={12}>
                <div className={style.left_small_pic_box}>
                  {
                    dataArr.map((v,index) => (
                      <span className={style.left_small_pic_box_item} key={index}>
                        {
                          v.image ?
                          <img src={"/api/file/" + v.image} style={{width:"100%",height:"100%"}} />  :
                          <span className={style.left_small_pic_box_item_text}>{(index+2)}</span>
                        }
                      </span>
                    ))
                  }
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
      </span>
    )
  }
}

export default SelectPositionModalComponent;
