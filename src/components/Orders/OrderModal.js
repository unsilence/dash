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
    const { dataSource } = props; 

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

    if(dataSource.status.indexOf("失败") !== -1){
      switch(dataSource.status){
        case "提交审核失败":
        this.state.status.status0 = "error";
        break;
        case "运营审核失败":
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
      switch(dataSource.status){
        case "等待运营审核" :
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
    // // const { onOk } = this.props;
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     // onOk(values);
    //     console.log(values);
    //     this.hideModelHandler();
    //   }
    // });
    // // const current = this.state.current+1
    // // if(this.state.current < 7){
    // //   this.setState({
    // //     current : current
    // //   })
    // // }
  };
  passHandler = (values) => {
    const { dispatch  , dataSource ,_list} = this.props; 
    console.log(_list);
    let temp;
    _list.forEach(v => {
      if(v._id == dataSource._id){
        temp = v;
      }
    })
    const current = this.state.current+1
    if(this.state.current < 6){
      this.setState({
        current : current
      })
    }
      switch(current){
        case 0 :
        temp.status = "等待运营审核";
        break;
        case 1 :
        temp.status = "等待物流确认";
        break;
        case 2 :
        temp.status = "等待上门服务";
        break;
        case 3 :
        temp.status = "等待点货确认";
        break;
        case 4 :
        temp.status = "等待结算";
        break;
        case 5 :
        temp.status = "结算完成";
        break;
      }

    temp.result_info = values;

    dispatch({
      type : "orders/patch",
      payload : {id : dataSource._id , values :temp}
    })

  }
  noPassHandler = (values) => {
    const { dispatch  , dataSource ,_list} = this.props; 
    console.log(_list);
    let temp;
    _list.forEach(v => {
      if(v._id == dataSource._id){
        temp = v;
      }
    })
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
        temp.status = "提交审核失败";
        break;
        case 1:
        temp.status = "运营审核失败";
        break;
        case 2:
        temp.status = "物流确认失败";
        break;
        case 3:
        temp.status = "上门服务失败";
        break;
        case 4:
        temp.status = "点货失败";
        break;
        case 5:
        temp.status = "结算失败";
        break;

      }
      temp.result_info = values; 

      dispatch({
      type : "orders/patch",
      payload : {id : dataSource._id , values :temp}
    })
  }

/* 表格属性数据的解析方法*/
  getPropsHandler = (data) => {
    console.log(data);
    let _data = [];
    data.skuProps.attributes.map(v => {
      let value = '';
      if(v.dtype == "array"){
        if(v.colorProps){
          v.colorProps.forEach(k => {
            value += k.name+"、";
          })
        }
      }else if(v.dtype == "object"){
        let a = JSON.parse(v.value.replace(/\\/g,""));
        value = a.chang+"X"+a.kuan+"X"+a.gao;
      }
 
      _data.push({"name" : v.attributeProps.name,"value" :value })

    })
    console.log(_data);
    return _data;
  }

  render() {
    const { children , projectData , skuPropsList , skuProjectList ,categoryMap,skuattributeIDs ,dataSource } = this.props;  //.addressProps
    const { current } = this.state;
    console.log(projectData);
    console.log(dataSource);
    console.log(skuPropsList);
    console.log(categoryMap);
    console.log(skuProjectList);
     //  得到 商品编号的数据的数据结构
    const columns = [{
      title : "商品编号",
      key : "skuNum",
      render : (text ,data) => {  
        return (<span>{getProductNum(data.skuProps.category_num,categoryMap)+data.skuProps.spuProps.unique_num+data.skuProps.unique_num}</span>)
      }
    },{
      title : "名称",
      key : "name",
      render : (text,data) => <span style={{display:"block",width:"100%",height:"100%",lineHeight:"60px"}}><img src={data.skuProps.images[0].url} style={{width:"60px",height:"60px",float:"left",marginRight:"10px"}}/>{data.skuProps.name}</span>
    },{
      title : "属性",
      key : "attributes",
      dataIndex : "skuProps.attributes",
      render : (text,data) => {
        return  this.getPropsHandler(data).map(v => <p key={v.name}><label>{v.name+":"}</label><span>{v.value}</span></p>)
      }
    },{
      title : "单价(元)",
      key : "price",
      dataIndex : "skuProps.price"
      
    },{
      title : "数量",
      key : "count",
      dataIndex : "skuProps.count"
    },{
      title : "优惠",
      key : "favourable",
      dataIndex : "favourable"
    },{
      title : "其他预约信息",
      key : "messages",
      render : (text ,data) => {
        return data.addressProps.map(v => (<p key={v.create_at}>{v.create_at.split("T")[0]+"/"+v.designer_name+"/"+v.name}</p>))
      }
    },{
      title : "状态",
      key : "skuProps.is_online",
      dataIndex : "skuProps.is_online"
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
            <Col span={4}>订单编号:{projectData.cnum}</Col>
            <Col span={4}>联系人:{projectData.addressProps.designer_name}</Col>
            <Col span={4}>联系电话:{projectData.addressProps.designer_phone}</Col>
            <Col>创建时间:{projectData.create_at}</Col>
            <Col span={4}>上门时间:{projectData.addressProps.door_at}</Col>
          </Row>
          <Row type="flex" justify="start" gutter={20}>
            <Col span={4}>上门地址:{projectData.addressProps.location}</Col>
            <Col>备注信息:{projectData.note}</Col>
          </Row>
          <Row type="flex" justify="start" gutter={20} style={{marginTop : "20px" , marginBottom : "50px"}}>
              <Steps current={current}>
                <Step title="提交审核" status={this.state.status.status0}/>
                <Step title="运营审核" status={this.state.status.status1}/>
                <Step title="物流确认" status={this.state.status.status2}/>
                <Step title="上门服务" status={this.state.status.status3}/>
                <Step title="点货确认" status={this.state.status.status4}/>
                <Step title="结算完成" status={this.state.status.status5}/>
              </Steps>
          </Row>
          <Table
            columns={columns}
            dataSource={dataSource.skus}
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
