import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input , Modal} from 'antd';
import { routerRedux , browserHistory } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 5;
let PAGE_SIZE_P = 5;
import RecomModal from './RecomModal';
import {timeLayoutHandler} from "../utils.js";
import moment from 'moment'

const dateFormat = 'YYYY/MM/DD  hh:mm:ss';
/*
  ({ dispatch, list: dataSource, loading, total, page: current })
*/
class Recoms extends React.Component{
  constructor(props){
    super(props);
    this.state={
      visible : false,
      dataSource : props.dataSource || [],
      loading : props.loading,
      total : props.total,
      current : props.page,
      dispatch:props.dispatch,
      resourcesData : props.resourcesData,
      page:props.page ? props.page.page : 1,
      rpage:props.page ? props.page.rpage : 1
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      dataSource : nextProps.dataSource,
      loading : nextProps.loading,
      total : nextProps.total,
      current : nextProps.page,
      dispatch:nextProps.dispatch,
      resourcesData : nextProps.resourcesData,
      page:nextProps.page.page,
      rpage:nextProps.page.rpage
    })
  }
  deleteHandler = (itm) => {
    this.state.dispatch({
      type: 'recoms/remove',
      payload: {id:itm._id},
    });
  }

  pageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/recoms',
      query: { page },
    }));
  }
  pageChangeHandlerZ = (rpage) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/recoms',
      query: { rpage },
    }));
  }

  editHandler = (id, values) => {
      if(id){
          this.state.dispatch({
            type: 'recoms/patch',
            payload: { id, values },
          });
      }else {
          this.state.dispatch({
            type: 'recoms/add',
            payload: { id, values },
          });
      }

  }
  /*
    下线按钮的方法
  */
  downLineHandler = (value1) => {
    let value = {};
    value.is_online = false;
    value.is_history = true;
    value.pend = true;
    this.editHandler(value1._id,value);
  }
  /*
    发布上线按钮的方法
  */
  upLineHandler = (value1) => {
    let value = {};
    value.is_online = true;
    value.is_history = false;
    value.pstart = true;
    this.editHandler(value1._id,value);
    this.setState({
      visible : true,
    })
  }
  /*
  选择发布位置的确定按钮的方法
  */
  // handleOk = () => {
  //   let obj = this.state.resourceSelectData;
  //   console.log(obj);
  //   obj.rank = this.state.rank;
  //   obj.is_online = true;
  //   this.editHandler(obj._id,obj);
  //   this.setState({
  //     visible : false,
  //     resourceSelectData : {}
  //   })
  // }
  /*
  选择发布位置弹出框取消按钮方法
  */
  handleCancel = () => {
    this.setState({
      visible : false,
      resourceSelectData : {}
    })
  }
  /*
  选择发布位置弹出框的item 选择方法
  */
  // selectPositionHandler = (v,index) => {
  //   this.state.isClick = {};
  //   if(v.rank){
  //       this.state.isClick[v.rank] = true;
  //   }else{
  //       this.state.isClick[index+1] = true;
  //   }
  //
  //   this.setState({
  //     isClick : this.state.isClick,
  //     rank : index+1
  //   })
  // }
  /*
  删除已发布的组件
  <Popconfirm title={"确定要删除推荐吗？"} onConfirm={() => this.deleteHandler(serial)}>
    <Icon type="delete" className={styles.icon}/>
  </Popconfirm>

  <Modal
    title="请选择要发布的推荐位置"
    visible={this.state.visible}
    onOk={this.handleOk}
    onCancel={this.handleCancel}
    width={800}
    >
    <div style={{width:"100%",height:"300px"}}>
      <Row gutter={20}>
        {
          this.disposePositionDataHandler(this.state.dataSource).map((v,index) => (
            <Col span={6} key={index}>
              <div style={{width:"100%",height:"120px",marginBottom:"30px",}}
                className={this.state.isClick[index+1] ? styles.isClick : styles.noClick}
                onClick={() => this.selectPositionHandler(v,index)}
              >
              {
                v.image ?
                <img src={"/api/file/" + v.image} style={{width:"100%",height:"100%"}}/> :
                <span className={styles.modelItem}>{(index+1)}</span>
               }
              </div>
            </Col>
          ))
        }
      </Row>
    </div>
  </Modal>
  */
/*
  对选择推荐发布位置的数据进行处理
*/
// disposePositionDataHandler = (arr) => {
//   let sortArr = [];
//   if(arr.length > 0) {
//     for(let i = 0;i< 8 ; i++ ){
//       sortArr.push({});
//     }
//     arr.forEach(v => {
//       sortArr.splice((v.rank-1),1,v);
//     })
//   }
//   return sortArr;
// }
/*
  发布时长的数据计算方法
*/
endAtHandler = (time) => {
  let tim = new Date(time).getTime();
  let nowTim = new Date().getTime();
  let tl = (nowTim - tim) / 1000 / 60 / 60;
  if(tl < 0){
    tl = 0;
  }
  let dt = timeLayoutHandler(tl);
  let date;
  if(parseFloat(dt)  >= 72){
    date = timeLayoutHandler(parseFloat(dt) / 24) + "天";
  }else{
    date = dt+"小时";
  }
  return  date;
}
/*
  历史推荐跳转路由方法
*/
historyRecommendHandler = (e) => {
  e.preventDefault();
  browserHistory.push('/recoms/historyrecoms');
}

/*
  排序样式的方法
*/
getRank = (record) => {
  let opts = [];
  if ((this.state.dataSource.indexOf(record) + PAGE_SIZE_P * (this.state.page ? this.state.page - 1 : 0)) === 0) {
    opts.push(<Icon type="arrow-down" key="arrow-down" onClick={() => { this.upbottom(record) }} style={{ marginRight: "10px",cursor:"pointer"}} />)
  } else if ((this.state.dataSource.indexOf(record) + PAGE_SIZE_P * (this.state.page ? this.state.page - 1 : 0)) === this.state.total - 1) {
    opts.push(<Icon type="arrow-up" key="arrow-up" onClick={() => { this.upOnline(record) }} style={{ marginRight: "10px" ,cursor:"pointer"}} />);
  } else {
    opts.push(<Icon type="arrow-up" key="arrow-up" onClick={() => { this.upOnline(record) }} style={{ marginRight: "10px",cursor:"pointer" }} />);
    opts.push(<Icon type="arrow-down" key="arrow-down" onClick={() => { this.upbottom(record) }} style={{ marginRight: "10px" ,cursor:"pointer"}} />)
  }
  return <div> {opts}</div>
}
/*
  排序的向上按钮
*/
upOnline = (serial) => {
  this.state.dispatch({
    type:"recoms/uptop",
    payload : {record : serial}
  })
}

/*
  排序向下的按钮
*/
upbottom = (serial) => {
  this.state.dispatch({
    type: 'recoms/upbottom',
    payload: { record : serial, searchWords: this.state.searchWords },
  });
}
render () {
  console.log(this.state.dataSource);
  const columns = [
    {
      title: '序号',
      dataIndex: 'cnum',
      key: 'cnum',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'pstart',
      key: 'pstart',
      render: text => <span>{moment(text).format(dateFormat)}</span>
    },
    {
      title: '发布时长',
      dataIndex: 'pstart',
      key: 'pstart_at_1',
      render : text => <span>{this.endAtHandler(text)}</span>
    },
    {
      title: '点击量',
      dataIndex: 'hot',
      key: 'hot',
    },
    {
      title : "排序",
      key : "sort",
      render : (text,serial) => this.getRank(serial)
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <Button type="primary" onClick={() => this.downLineHandler(serial)}>下线</Button>
          <RecomModal recommend={serial} onOk={() => this.editHandler(serial._id)}>
            <Button type="danger">编辑</Button>
          </RecomModal>
        </span>
      ),
    },
  ];

  const resource = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title:"标题",
      dataIndex:"title",
      key :"title"
    },
    {
      title:"图片",
      key:"image",
      dataIndex: 'image',
      render : (text,serial) => {
        if(text){
          return <img src={"/api/file/" + text} style={{ width: "30px", height: "30px" }} />
        }else{
          return (<span>无图</span>)
        }
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <Button type="primary" onClick={() => this.upLineHandler(serial)}>发布</Button>
          <RecomModal recommend={serial} onOk={() => this.editHandler(serial._id)}>
            <Button type="danger">编辑</Button>
          </RecomModal>
        </span>
      ),
    }
  ]
  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="space-between" gutter={16}>
            <Col span={16}>
              <Input />
            </Col>
            <Col span={8}>
              <Button style={{marginRight : "16px"}} onClick={this.historyRecommendHandler}>历史推荐</Button>
              <Button style={{marginRight : "16px"}}>操作日志</Button>
              <RecomModal recommend={{}} onOk={(values) => this.editHandler(null,values)}>
                <Button>添加推荐</Button>
              </RecomModal>
            </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={this.state.dataSource}
          loading={this.state.loading}
          rowKey={serial => serial._id}
          pagination={false}
        />
      <Row>
        <Col>
          <Pagination
            className="ant-table-pagination"
            total={this.state.total}
            current={this.state.current}
            pageSize={PAGE_SIZE}
            onChange={this.pageChangeHandler}
          />
        </Col>
      </Row>

        <Table
          columns={resource}
          dataSource={this.state.resourcesData}
          loading={this.state.loading}
          rowKey={serial => serial._id}
          pagination={false}
        />
        <Row>
          <Col>
            <Pagination
              className="ant-table-pagination"
              total={this.state.total}
              current={this.state.current}
              pageSize={PAGE_SIZE}
              onChange={this.pageChangeHandlerZ}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
}

function mapStateToProps(state) {
  const {list, total, page ,categoryMap} = state.recoms;
  return {
    loading: state.loading.models.recoms,
    dataSource:list.updata,
    resourcesData:list.resourcesData,
    total:total ? total.updata : 1,
    resourcesTotal:total ? total.resourcesData : 1,
    page,
    categoryMap
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch: dispatch }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recoms);
