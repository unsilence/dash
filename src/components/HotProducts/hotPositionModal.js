import React , {Component} from "react";
import { Modal  , Row , Col } from "antd";

import style from "../list.less";




class HotSelectPositionModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible : false,
      plist : props.plist || [],
      isClick : {},
      rank : "",
      slectItem : props.slectItem || {}
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      plist : nextProps.plist,
      slectItem : nextProps.slectItem
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
    this.setState({
      isClick:{},
      rank:"",
      slectItem : {}
    })
  }
  /*
  发布modal 的确认按钮 方法
  */
  handleOk = () => {
    const { onHandler } = this.props;
    this.setState({
      isClick:{},
      rank:"",
      slectItem : {}
    })
    onHandler(this.state.slectItem);
  }
  /*
    对选择推荐发布位置的数据进行处理
  */
  disposePositionDataHandler = (arr) => {
    let sortArr = [];
    if(arr.length > 0) {
      for(let i = 0;i< 7 ; i++ ){
        sortArr.push({});
      }
      arr.forEach(v => {
        sortArr.splice((v.rank-1),1,v);
      })
    }else{
      for(let i = 0;i< 7 ; i++ ){
        sortArr.push({});
      }
    }
    return sortArr;
  }
  /*
  选择发布位置弹出框的item 选择方法
  */
  selectPositionHandler = (index) => {
    this.state.isClick = {};
    this.state.isClick[index+1] = true;
    this.state.slectItem.rank = index+1;
    this.setState({
      isClick : this.state.isClick,
      rank : index+1,
      slectItem : this.state.slectItem
    })
  }
  render () {
    let arr = this.disposePositionDataHandler(this.state.plist);
    let dataArr = arr.slice(1,arr.length);
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
          width={1000}
          >
          <div style={{width:"100%",height:"300px"}}>
            <Row gutter={20}>
              <Col span={8}>
                <div className={this.state.isClick[1] ? style.selectLeft_big_pic : style.left_big_pic}
                  onClick={() => this.selectPositionHandler(0)}>
                  {
                    this.disposePositionDataHandler(this.state.plist)[0] && this.disposePositionDataHandler(this.state.plist)[0].image ?
                    <img src={"/api/file/" + this.disposePositionDataHandler(this.state.plist)[0].image} style={{width:"100%",height:"100%"}}/> :
                    <span className={style.left_big_pic_text}>1</span>
                  }
                </div>
              </Col>
              <Col span={16}>
                <div className={style.left_small_pic_box}>
                  {
                    dataArr.map((v,index) => (
                      <span className={this.state.isClick[(index+2)] ? style.selectLeft_small_pic_box_item : style.left_small_pic_box_item}
                            key={index}
                            onClick={() => this.selectPositionHandler(index+1)}
                            style={{width:"200px"}}
                      >
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

export default HotSelectPositionModalComponent;
