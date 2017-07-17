import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Row, Pagination, Popconfirm,Col,Input} from 'antd';
import { routerRedux } from 'dva/router';
import * as service from '../../services';
import { connect } from 'dva';
import {timeLayoutHandler} from "../utils.js";
import moment from 'moment'

const dateFormat = 'YYYY/MM/DD  hh:mm:ss';


class NavProductsHistoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state={
      historyList : props.historyList,
      historyCount : props.historyCount,
      page : props.page,
      dispatch : props.dispatch,
      user : {}
    }
  }
  userdata = async () => {
      let user = await service["UserService"].fetch({filter : {"cnum" : JSON.parse(localStorage.user).cnum}});
      this.setState({
        user : user.data.data.list[0]
      })
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      historyList : nextProps.historyList,
      historyCount : nextProps.historyCount,
      page : nextProps.page,
      dispatch : nextProps.dispatch
    })
  }
  componentDidMount () {
    this.userdata ();
  }
  pageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: 'recoms/historyrecoms',
      query: { page },
    }));
  }
  deleteHandler = (itm) => {
    this.state.dispatch({
      type: 'navmanages/historyrecoms/remove',
      payload: {id:itm._id},
    });
  }
  timeLayoutHandler = (record) => {
    console.log(record);
    let startTm = new Date(record.pstart).getTime();
    let endTm = new Date(record.pend).getTime();
    let date;
    let tm = timeLayoutHandler((endTm - startTm) / 1000 / 60 / 60);
    if( tm < 72 ) {
      date = tm + "小时";
    }else{
      date = timeLayoutHandler(tm / 24)+"天";
    }
    return date;
  }
  render () {
    console.log(this.state.user.phone);
    const columns = [{
      title: '序号',
      dataIndex: 'cnum',
      key: 'cnum',
      render: (text, record) => <span>{(this.state.historyList.indexOf(record) + 1) + 10 * (this.state.page ? this.state.page - 1 : 0)}</span>
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '发布时间',
      dataIndex: 'pstart',
      key: 'pstart',
      render: text => <span>{moment(text).format(dateFormat)}</span>
    }, {
      title: '结束时间',
      key: 'pend',
      dataIndex:"pend",
      render : text => <span>{moment(text).format(dateFormat)}</span>
    }, {
      title: "发布时长",
      key : "timeLong",
      render : (text,record) => <span>{this.timeLayoutHandler(record)}</span>
    }, {
      title: "操作账户",
      key:"userPhone",
      render : () => <span>{this.state.user.phone}</span>
    }, {
      title: "点击量",
      dataIndex: "hot",
      key:"hot",
      render : (text,serial) => <span>{text ? text : 0}</span>
    }, {
      title: "操作",
      dataIndex: "",
      render: (text, record) => (
        <span >
          <Popconfirm title={"确定要删除【" + record.title + "】吗？"} onConfirm={() => this.deleteHandler(record)}>
            <Icon type="delete" />
          </Popconfirm>
        </span>
      ),
    }];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.historyList}
          loading={this.props.loading}
          rowKey={record => record._id}
          pagination={false}
        />
        <Pagination
          className="ant-table-pagination"
          total={this.state.historyCount}
          current={this.props.page}
          pageSize={10}
          onChange={this.pageChangeHandler}
        />
      </div>
    )
  }
}

function mapStateToProps (state){
  const {list, total, page } = state["navmanages/historyrecoms"];
  return {
    loading: state.loading.models["navmanages/historyrecoms"],
    historyList : list,
    historyCount : total ? total : 0,
    page
  };
}
function mapDispatchToProps (dispatch){
  return {
    dispatch
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(NavProductsHistoryComponent);
