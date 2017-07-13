import React,{Component} from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input} from 'antd';
import { routerRedux , browserHistory} from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 5;
import CaseManageModal from './CaseManageModal';
import SelectPositionModalComponent from "./SelectPosition.js";
import {timeLayoutHandler} from "../utils.js";

import moment from 'moment'

const dateFormat = 'YYYY/MM/DD  hh:mm:ss';
// ({ dispatch, list: dataSource, loading, total, page: current })
class Recommends extends Component{
  constructor(props){
    super(props);
    this.state={
      dispatch : props.dispatch,
      loading: props.loading,
      plist: props.plist,
      ptotal: props.ptotal,
      ppage: props.ppage,
      rlist: props.rlist,
      rtotal: props.rtotal,
      rpage: props.rtotal,
      searchWords:props.searchWords
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      dispatch : nextProps.dispatch,
      loading: nextProps.loading,
      plist: nextProps.plist,
      ptotal: nextProps.ptotal,
      ppage: nextProps.ppage,
      rlist: nextProps.rlist,
      rtotal: nextProps.rtotal,
      rpage: nextProps.rtotal,
      searchWords:nextProps.searchWords
    })
  }
  deleteHandler = (itm) => {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'casemanages/remove',
      payload: {id:itm._id},
    });
  }

  pPageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/casemanages',
      query: { page, rpage: this.state.rpage, searchWords: this.state.searchWords },
    }));
  }
  rPageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/casemanages',
      query: { page : this.state.ppage, rpage: page, searchWords: this.state.searchWords },
    }));
  }

  editHandler = (id, values) => {
      if(id){
          this.state.dispatch({
            type: 'casemanages/patch',
            payload: { id, values },
          });
      }else {
          this.state.dispatch({
            type: 'casemanages/add',
            payload: { id, values },
          });
      }

  }
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
  getImg = (images) => {
    if (images.length > 0) {
      return <img src={"/api/file/" + images} style={{ width: "30px", height: "30px" }} />
    } else {
      return '无图';
    }
  }
  /*
    发布上线的按钮方法
  */
  upLineHandler = (value) => {
    let obj ={};
    obj.is_online = true;
    obj.pstart = true;
    this.editHandler(value._id,obj);
  }
  goHistoryHandler = (e) => {
    e.preventDefault();
    browserHistory.push('/casemanages/historyrecoms');
  }
  /*
    下线按钮的方法
  */
  downLineHandler = (serial) => {
    let value = {};
    value.is_online = false;
    value.is_history = true;
    value.pend = true;
    this.editHandler(serial._id,value);
  }
  /*
    顶部搜索
  */
  search = (e) => {
    if(e.target){
      this.setState({
        searchWords : e.target.value
      })
    }
  }
render () {
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
      render : (text,serial) => <span>{moment(text).format(dateFormat)}</span>
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
      render : (text,serial) => <span>{text ? text : 0}</span>
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <Button type="danger" onClick={() => this.downLineHandler(serial)}>下线</Button>
          <CaseManageModal casemanage={serial} onOk={this.editHandler}>
            <Button type="edit">编辑</Button>
          </CaseManageModal>
        </span>
      ),
    },
  ];
  const rColumns = [
    {
      title: '序号',
      dataIndex: 'cnum',
      key: 'cnum',
    },
    {
      title:"URL",
      dataIndex :"url",
      key:"url"
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: text => <span>{this.getImg(text)}</span>
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <SelectPositionModalComponent plist={this.state.plist} >
            <Button style={{marginRight:"20px"}} type="danger" onClick={() => {}}>发布</Button>
          </SelectPositionModalComponent>
          <CaseManageModal casemanage={serial} onOk={(values) => this.editHandler(serial._id,values)}>
            <Button type="edit">编辑</Button>
          </CaseManageModal>
        </span>
      ),
    },
  ];
  return (
    <div className={styles.normal}>
      <div>
        <div style={{marginBottom:"20px"}}>
          <Row type="flex" justify="space-between" gutter={16}>
              <Col span={16}>
                <Input.Search
                  placeholder="搜索"
                  size="default"
                  value={this.state.searchWords}
                  onChange={v => this.search(v)}
                  onSearch={v => { this.search(v); this.rPageChangeHandler() }}
                />
              </Col>
              <Col span={8}>
                <Button style={{marginRight : "16px"}} onClick={this.goHistoryHandler}>历史推荐</Button>
                <Button style={{marginRight : "16px"}}>操作日志</Button>
                <CaseManageModal casemanage={{}} onOk={(value) => this.editHandler(null,value)}>
                  <Button>添加推荐</Button>
                </CaseManageModal>
              </Col>
          </Row>
        </div>
        <div style={{marginBottom:"20px",position:"relative"}}>
          <span style={{position:"absolute",left:"-5px",top:"0px",display:"inline-block",width:"15px",zIndex:"5000"}}>已发布</span>
          <Table
            columns={columns}
            dataSource={this.state.plist}
            loading={this.state.loading}
            rowKey={serial => serial._id}
            pagination={false}
          />
        <Row>
          <Pagination
            className="ant-table-pagination"
            total={this.state.ptotal}
            current={this.state.ppage || 1}
            pageSize={PAGE_SIZE}
            onChange={this.pPageChangeHandler}
          />
        </Row>
      </div>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:"-5px",top:"0px",display:"inline-block",width:"15px",zIndex:"5000"}}>资源池</span>
        <Table
          columns={rColumns}
          dataSource={this.state.rlist}
          loading={this.state.loading}
          rowKey={serial => serial._id}
          pagination={false}
        />
        <Row>
          <Pagination
            className="ant-table-pagination"
            total={this.state.rtotal}
            current={this.state.rpage || 1}
            pageSize={PAGE_SIZE}
            onChange={this.rPageChangeHandler}
          />
        </Row>
      </div>
      </div>
    </div>
  );
}

}

function mapStateToProps(state) {
  const {list, total, page ,categoryMap,searchWords} = state.casemanages;
  if (Array.isArray(list)) {
    return { loading: state.loading.models.banners,searchWords:searchWords }
  }else{
    return {
      loading: state.loading.models.casemanages,
      plist: list.p.data,
      ptotal: list.p.total,
      ppage: list.p.page,
      rlist: list.r.data,
      rtotal: list.r.total,
      rpage: list.r.page,
      searchWords:searchWords
    };
  }
}

function mapDispatchToProps (dispatch){
  return {
    dispatch
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recommends);
