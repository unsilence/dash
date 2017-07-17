import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Table,
  Pagination,
  Popconfirm,
  Row,
  Col,
  Button,
  Icon,
  Input,
  Radio
} from 'antd';
import {routerRedux , browserHistory} from 'dva/router';
import NavManageRadio from "./NavManageRadio";
import styles from '../list.less';
import {timeLayoutHandler} from "../utils.js";

import moment from 'moment'

const dateFormat = 'YYYY/MM/DD  hh:mm:ss';
import * as models from "../../models.js";
let PAGE_SIZE = 10;
let tempId;
import NavManageModal from './NavManageModal.js';
class NavManage extends Component { //{ dispatch, list: dataSource, loading, total, page: current ,categoryMap ,navList ,isHasId}
  constructor(props) {
    super(props);
    this.state = {
      fetchId: '',
      recommeneds: '',
      loading : props.loading,
      plist : props.plist,
      ppage : props.ppage,
      ptotal : props.ptotal,
      rlist : props.rlist,
      rpage : props.rpage,
      rtotal : props.rtotal,
      categoryMap : props.categoryMap,
      isHasId : props.isHasId,
      navList : props.navList
    }
  }

  componentWillReceiveProps(nextProps) {
    const {navList} = nextProps;
    if (navList) {
      if (navList.length > 0) {
        this.setState({
          fetchId: navList[0].categoryId,
          loading : nextProps.loading,
          plist : nextProps.plist,
          ppage : nextProps.ppage,
          ptotal : nextProps.ptotal,
          rlist : nextProps.rlist,
          rpage : nextProps.rpage,
          rtotal : nextProps.rtotal,
          categoryMap : nextProps.categoryMap,
          isHasId : nextProps.isHasId,
          navList : nextProps.navList
        })
      }
    }
  }
  // deleteHandler = (itm) => {
  //   // console.log('deleteHandler',itm) const { dispatch } = this.props; dispatch({
  //   //  type: 'navmanages/remove',   payload: {id:itm._id}, });
  //   let num = tempId
  //     ? tempId
  //     : this.state.fetchId;
  //   models
  //     .removeNavList(itm._id, num)
  //     .then((value) => {
  //       this.setState({recommeneds: value.data.data.list})
  //     })
  // }
  //
  // pageChangeHandler = (page) => {
  //   const {dispatch} = this.props;
  //   dispatch(routerRedux.push({pathname: '/navmanages', query: {
  //       page
  //     }}));
  // }

  editHandler = (id, values) => {
    const {dispatch} = this.props;
    if(id){
      dispatch({
        type: 'navmanages/patch',
        payload: { id, values ,page : this.state.ppage, rpage:this.state.rpage,searchWords:this.state.searchWords,categoryId:this.state.isHasId.inInfo}
      });
    }else {
      dispatch({
         type:'navmanages/add',
         payload: { id, values ,page : this.state.ppage, rpage:this.state.rpage,searchWords:this.state.searchWords,categoryId:this.state.isHasId.inInfo }
      });
    }
  }
  /*
  分类单选按钮的方法
  */
  fetchNav = (id) => {
    const {dispatch} = this.props;
    dispatch({
      type:'navmanages/fetch',
      payload : {id ,page : this.state.ppage, rpage:this.state.rpage,searchWords:this.state.searchWords}
    })
    this.state.isHasId.inInfo = id;
    this.setState({
      isHasId : this.state.isHasId.inInfo
    })
  }
  okHandler = (id, value) => {
    const {dispatch} = this.props;
    console.log(value);
    let values = {
      "key": "nav",
      "value": value
    };
    if (value) {
      if (id) {
        dispatch({
          type: 'navmanages/patchNav',
          payload: {
            id,
            values
          }
        });
      } else {
        dispatch({
          type: 'navmanages/addNav',
          payload: {
            id,
            values
          }
        });
      }
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
  发布上线的方法
  */
  upLineHandler = (serial) => {
    if(this.state.plist.length >= 1){
      let obj = {};
      let upObj = {};
      obj.is_online = false;
      obj.is_history = true;
      obj.pend = true;
      upObj.is_online = true;
      upObj.pstart = true;
      upObj.is_history = false;
      this.editHandler(this.state.plist[0]._id,obj);
      this.editHandler(serial._id,upObj);
    }else{
      let upObj = {};
      upObj.is_online = true;
      upObj.pstart = true;
      upObj.is_history = false;
      this.editHandler(serial._id,upObj);
    }
  }
  /*
  跳转历史导航的方法
  */
  goHistoryHandler = (e) => {
    e.preventDefault();
    browserHistory.push("/navmanages/historyrecoms")
  }
  /*
  搜索方法
  */
  search = (e) => {
    if(e.target){
      this.setState({
        searchWords : e.target.value
      })
    }
  }
  rPageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/navmanages',
      query: { id:this.state.isHasId.inInfo ,page : this.state.ppage, rpage: page, searchWords: this.state.searchWords },
    }));
  }
  searchWordsHandler = () => {
    this.fetchNav(this.state.isHasId.inInfo);
  }
  render() {
    console.log(this.state.plist);
    const columns = [
      {
        title: '序号',
        dataIndex: 'cnum',
        key: 'cnum'
      }, {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      }, {
        title: '发布时间',
        dataIndex: 'pstart',
        key: 'pstart',
        render : (text,serial) => <span>{moment(text).format(dateFormat)}</span>
      }, {
        title: '发布时长',
        dataIndex: 'pstart',
        key: 'pstart_at_1',
        render : text => <span>{this.endAtHandler(text)}</span>
      }, {
        title: '点击量',
        dataIndex: 'hot',
        key: 'hot',
        render : text => <span>{text ? text : 0}</span>
      }, {
        title: '操作',
        key: 'operation',
        render: (text, serial) => (
          <span className={styles.operation2}>
            <NavManageModal
              navmanage={serial}
              onOk={(values) => this.editHandler(serial._id,values)}
              fetchId={this.state.isHasId.inInfo}
            >
              <Button type="edit">编辑</Button>
            </NavManageModal>
          </span>
        )
      }
    ];
    const rColumns = [
      {
        title: '序号',
        dataIndex: 'cnum',
        key: 'cnum',
      },
      {
        title:"URL",
        dataIndex : "url",
        key : "url"
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title : "图片",
        dataIndex:"image",
        key : "image",
        render: text => <span>{this.getImg(text)}</span>
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, serial) => (
          <span className={styles.operation2}>
            <Button type="danger" onClick={() => this.upLineHandler(serial)}>发布</Button>
            <NavManageModal
              navmanage={serial}
              onOk={(values) => this.editHandler(serial._id,values)}
              fetchId={this.state.isHasId.inInfo}
            >
              <Button type="edit">编辑</Button>
            </NavManageModal>
          </span>
        ),
      },
    ];

    return (
      <div className={styles.normal}>
        <div>
          <Row type="flex" justify="space-between" gutter={16}>
            <Col span={16}>
              <Input.Search
                placeholder="搜索"
                size="default"
                value={this.state.searchWords}
                onChange={v => this.search(v)}
                onSearch={v => { this.search(v); this.searchWordsHandler() }}
              />
            </Col>
            <Col span={8}>
              <Button style={{marginRight: "16px"}} onClick={this.goHistoryHandler}>历史导航</Button>
              <Button style={{marginRight: "16px"}}>操作日志</Button>
              <NavManageModal
                navmanage={{}}
                onOk={this.editHandler.bind(null, "")}
                fetchId={tempId ? tempId : this.state.fetchId}
              >
                <Button>添加资源</Button>
              </NavManageModal>
            </Col>
          </Row>
          <NavManageRadio
            change={this.fetchNav}
            categoryMap={this.props.categoryMap}
            navList={this.props.navList}
            tablist={this.props.dataSource}
            okHandler={this.okHandler}
            isHasId={this.props.isHasId}/>
          <div>
            <Table
              columns={columns}
              dataSource={this.state.plist}
              loading={this.state.loading}
              rowKey={serial => serial._id}
              pagination={false}
            />
          </div>
          <div style={{marginTop:"30px"}}>
            <Table
              columns={rColumns}
              dataSource={this.state.rlist}
              loading={this.state.loading}
              rowKey={serial => serial._id}
              pagination={false}/>
            <Row>
            <Pagination
              className="ant-table-pagination"
              total={this.state.rtotal}
              current={this.state.rpage}
              pageSize={PAGE_SIZE}
              onChange={this.rPageChangeHandler}/>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {list,searchWords,categoryMap,isHasId,navList} = state.navmanages;
  if (Array.isArray(list)) {
    return { loading: state.loading.models.navmanages,searchWords:searchWords }
  }else{
    return {
      loading: state.loading.models.navmanages,
      plist : list.p.data,
      ppage:list.p.page,
      ptotal : list.p.total,
      rlist : list.r.data,
      rpage:list.r.page,
      rtotal : list.r.total,
      categoryMap,
      isHasId,
      navList
    };
  }
}

function mapDispatchToProps(dispatch) {
  return {dispatch: dispatch}
}
export default connect(mapStateToProps, mapDispatchToProps)(NavManage);
