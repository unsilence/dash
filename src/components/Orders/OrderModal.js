import React, { Component } from 'react';
import { Modal, Input,Select ,Row ,Col , Iocn , Steps, Button, Table} from 'antd';
import styles from '../item.less';

import AuditModal from "./auditModal.js";
const Step = Steps.Step;
// const FormItem = Form.Item;
const data = [{
  "key" : 1,
  "_id" : 123456,
  "name" : {
    "img" : "无",
    "text" : "loli纯天然羊毛手工地毯"
  },
  "props" : {"颜色" : "古典花纹" , "尺寸" : "200X180"},
  "unitPrice" : 1320,
  "num" : 3,
  "favourable" : "无" ,
  "otherMessage" : [{"date" : "2017.03.12" , "name" : "邸建" , "proJectName" : "朝阳大悦城别墅项目"},
                    {"date" : "2017.03.13" , "name" : "邸建" , "proJectName" : "朝阳大悦城别墅项目"},
                    {"date" : "2017.03.14" , "name" : "邸建" , "proJectName" : "朝阳大悦城别墅项目"}],
  "states" : "已预约"
}]
class OrderEditModal extends Component {

  constructor(props) {
    super(props);
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
    console.log(values);
    const current = this.state.current+1
    if(this.state.current < 6){
      this.setState({
        current : current
      })
    }
  }
  noPassHandler = (values) => {
    console.log(values);
    const current = this.state.current;
    const status = "status"+current;
    this.state.status[status] = "error";
    this.setState({
      status : this.state.status
    })
  }
  render() {
    const { children , projectData } = this.props;
    const { current } = this.state;
    console.log(projectData);
    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 14 },
    // };
    const columns = [{
      title : "商品编号",
      key : "_id",
      dataIndex : "_id"
    },{
      title : "名称",
      render : (text,data) => (
          <span key={data.name.text}>
            {data.name.text}
          </span>
        )
    },{
      title : "属性",
      render : (text,data) => {
        let dataArr = [];
        for(let t in data.props){
          dataArr.push(t);
        }
        return dataArr.map(v => (
          <p key={data.props[v]}><label>{v+":"}</label><span>{data.props[v]}</span></p>
        ))
      }
    },{
      title : "单价(元)",
      key : "unitPrice ",
      dataIndex : "unitPrice"
    },{
      title : "数量",
      key : "num",
      dataIndex : "num"
    },{
      title : "优惠",
      key : "favourable",
      dataIndex : "favourable"
    },{
      title : "其他预约信息",
      render : (text,data) => {
        return (
          data.otherMessage.map(v => (
            <p key={v.date}>{v.date + "/" + v.name + "/" + v.proJectName}</p>
          ))
        )
      }
    },{
      title : "状态",
      key : "states",
      dataIndex : "states"
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
            dataSource={data}
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
