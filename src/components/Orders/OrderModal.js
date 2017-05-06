import React, { Component } from 'react';
import { Modal, Input,Select ,Row ,Col , Iocn , Steps, Button, Table} from 'antd';
import styles from '../item.less';

import AuditModal from "./auditModal.js";
import { getProductNum } from '../utils'
const Step = Steps.Step;
// const FormItem = Form.Item;

class OrderEditModal extends Component {

  constructor(props) {
    super(props);
    const { _list , itemId } = this.props; 

    this.state = {
      visible: false,
      current : 0,
      status : {
        status0 : "",
        status1 : "",
        status2 : "",
        status3 : "",
        status4 : "",
        status5 : ""
      }
    };


    if(_list[itemId].state.indexOf("失败") !== -1){
      switch(_list[itemId].state){
        case "提交审核失败":
        this.state.status.status0 = "error";
        break;
        case "审核失败":
        this.state.status.status1 = "error";
        break;
        case "物流确认失败":
        this.state.status.status2 = "error";
        break;
        case "上门服务失败":
        this.state.status.status3 = "error";
        break;
        case "点货失败":
        this.state.status.status4 = "error";
        break;
        case "结算失败":
        this.state.status.status5 = "error";
        break;

      }
    }else{
      switch(_list[itemId].state){
        case "等待审核" :
        this.state.current = 0;
        break;
        case "等待物流确认" :
        this.state.current = 1;
        break;
        case "等待上门服务" :
        this.state.current = 2;
        break;
        case "等待点货确认" :
        this.state.current = 3;
        break;
        case "等待结算" :
        this.state.current = 4;
        break;
        case "结算完成" :
        this.state.current = 5;
        break;
      }
    }
    
    let num;
    for(let v in this.state.status){
      if(this.state.status[v] === "error"){
        num = parseInt(v.substring(v.length-1,v.length));
      }
    }
    for(let k =0;k<num;k++){
      let temp = "status"+k;
      this.state.status[temp] = "finish";
    }
    this.okHandler = this.okHandler.bind(this);
    this.hideModelHandler = this.hideModelHandler.bind(this);
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
  };

  okHandler = () => {
    // const { onOk } = this.props;
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     onOk(values);
    //     this.hideModelHandler();
    //   }
    // });
    // const current = this.state.current+1
    // if(this.state.current < 7){
    //   this.setState({
    //     current : current
    //   })
    // }
  };
  passHandler = (values) => {
    const { _list , dispatch , itemId } = this.props; 
    console.log(values);
    console.log(_list);
    console.log(dispatch);
    const current = this.state.current+1
    if(this.state.current < 6){
      this.setState({
        current : current
      })
    }
      switch(current){
        case 0 :
        _list[itemId].state = "等待审核";
        break;
        case 1 :
        _list[itemId].state = "等待物流确认";
        break;
        case 2 :
        _list[itemId].state = "等待上门服务";
        break;
        case 3 :
        _list[itemId].state = "等待点货确认";
        break;
        case 4 :
        _list[itemId].state = "等待结算";
        break;
        case 5 :
        _list[itemId].state = "结算完成";
        break;
      }

    _list[itemId].refuseInfo = values;
    dispatch({
      type : "orders/patch",
      payload : {id : itemId , values : _list[itemId]}
    })

  }
  noPassHandler = (values) => {
    console.log(values);
    const { _list , dispatch , itemId } = this.props; 
    // const current = this.state.current+1
    const current = this.state.current;
    const status = "status"+current;
    this.state.status[status] = "error";
    this.setState({
      status : this.state.status
    })
    let num;
    for(let v in this.state.status){
      if(this.state.status[v] === "error") {
        num = parseInt(v.substring(v.length-1,v.length));
      }
    }

    switch(num){
        case 0:
        _list[itemId].state = "提交审核失败";
        break;
        case 1:
        _list[itemId].state = "审核失败";
        break;
        case 2:
        _list[itemId].state = "物流确认失败";
        break;
        case 3:
        _list[itemId].state = "上门服务失败";
        break;
        case 4:
        _list[itemId].state = "点货失败";
        break;
        case 5:
        _list[itemId].state = "结算失败";
        break;

      }
      _list[itemId].refuseInfo = values;

      dispatch({
      type : "orders/patch",
      payload : {id : itemId , values : _list[itemId]}
    })
  }

  sizeHandler = (skuPropsList , value) => {
    let text = "";
    let temp;
    skuPropsList.forEach(v => {
      v.attributes.forEach(t => {
        if(t.attributeID === value._id && value.colors === undefined){
          temp = t.value;
        }
      })
    })
    temp = JSON.parse(temp);
    for(let a in temp){
      text += temp[a]+"X";
    }
    text = text.substr(0,text.length-1);
    return text;
  }
  colorHandler = (v) => {
    let text = "";
    v.forEach(p => {
      if(p !== undefined){
        text += p.name+"、";
      }
    })
    text = text.substr(0,text.length-1);
    return text;
  }
  render() {
    const { children , projectData , skuPropsList , skuProjectList ,categoryMap,skuattributeIDs ,dataSource } = this.props;
    const { current } = this.state;
    console.log(dataSource);
    console.log(skuPropsList);
    console.log(categoryMap);
    console.log(skuProjectList);
    

    const columns = [{
      title : "商品编号",
      key : "skuNum",
      dataIndex : "skuNum",
      render : (text ,data) => <span>{getProductNum(data.categoryId,categoryMap)+data.spu.productNum+text}</span>
    },{
      title : "名称",
      dataIndex : "name",
      render : (text,data) => <span style={{display:"block",width:"100%",height:"100%",lineHeight:"60px"}}><img src={data.images[0].url} style={{width:"60px",height:"60px",float:"left",marginRight:"10px"}}/>{text}</span>
    },{
      title : "属性",
      render : (text,data) => {
        return skuattributeIDs.map(v => (
          <p key={v.name}><label>{v.name+":"}</label><span>{v.colors !== undefined ? this.colorHandler(v.colors) : this.sizeHandler(skuPropsList,v)}</span></p>
        ))
      }
    },{
      title : "单价(元)",
      key : "price",
      render : (text,data) => {
        let price ="";
        dataSource.forEach(t => {
          t.skuNumList.map(v => {
            if(v.skuNum === data._id){
                price = v.price;
            }
          })
        })
        return <span>{price}</span>
      }
    },{
      title : "数量",
      key : "count",
      render : (text,data) => {
        let count = "";
        dataSource.forEach(t => {
          t.skuNumList.map(v => {
            if(v.skuNum === data._id){
                count = v.count;
            }
          })
        })
        return <span>{count}</span>
      }
    },{
      title : "优惠",
      key : "favourable",
      dataIndex : "favourable"
    },{
      title : "其他预约信息",
      key : "outo",
      render : (text,data) => {
          return  skuProjectList.map(v => (<p key={v.createAt}>{v.createAt.split("T")[0]+"/"+v.designerName+"/"+v.name}</p>))
      }
    },{
      title : "状态",
      key : "state",
      dataIndex : "state"
    }]
    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="编辑订单"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          width={1200}
          footer={
            <Row type="flex" justify="end" gutter={50}>
              <Col><Button>操作日志</Button><Button>锁定订单</Button><Button>关闭订单</Button><Button>打印清单</Button></Col>
              <Col>
                <Button onClick={this.hideModelHandler}>取消</Button>
                <AuditModal pass={this.passHandler} noPass={this.noPassHandler}>
                  <Button onClick={this.okHandler} type="primary" style={{marginLeft : "20px"}}>审核订单</Button>
                </AuditModal>
              </Col>
            </Row>
          }
          maskClosable={false}
        >
          <Row type="flex" justify="start" gutter={20} style={{marginTop : "10px" , marginBottom : "10px"}}>
            <Col span={4}>订单编号:{projectData.orderNum}</Col>
            <Col span={4}>联系人:{projectData.designerName}</Col>
            <Col span={4}>联系电话:{projectData.designerPhone}</Col>
            <Col>创建时间:{projectData.createAt}</Col>
            <Col span={4}>上门时间:{projectData.doorTime}</Col>
          </Row>
          <Row type="flex" justify="start" gutter={20}>
            <Col span={4}>上门地址:{projectData.address}</Col>
            <Col>备注信息:{projectData.note}</Col>
          </Row>
          <Row type="flex" justify="start" gutter={20} style={{marginTop : "20px" , marginBottom : "50px"}}>
              <Steps current={current}>
                <Step title="提交审核" status={this.state.status.status0}/>
                <Step title="等待审核" status={this.state.status.status1}/>
                <Step title="物流确认" status={this.state.status.status2}/>
                <Step title="上门服务" status={this.state.status.status3}/>
                <Step title="点货确认" status={this.state.status.status4}/>
                <Step title="结算完成" status={this.state.status.status5}/>
              </Steps>
          </Row>
          <Table
            columns={columns}
            dataSource={skuPropsList}
            pagination={false}
          />
          <Row type="flex" justify="end" gutter={20} style={{marginTop : "20px"}}>
              <Col>订单折扣:</Col>
              <Col>总共:131件商品</Col>
              <Col>已下架:55</Col>
              <Col>剩余:200</Col>
              <Col pull={1}>剩余总价:555555</Col>
          </Row>
        </Modal>
      </span>
    );
  }
}

export default OrderEditModal;
