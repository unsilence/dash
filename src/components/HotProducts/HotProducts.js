import React ,{ Component }from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input ,Radio} from 'antd';
import { routerRedux , browserHistory} from 'dva/router';
import HotProductsRadio from "./HotProductsRadio";
import HotSelectPositionModalComponent from "./hotPositionModal.js";
import styles from '../list.less';
import {timeLayoutHandler} from "../utils.js";

import moment from 'moment'

const dateFormat = 'YYYY/MM/DD  hh:mm:ss';
let PAGE_SIZE = 5;

import HotProductsModal from './HotProductsModal.js';
class HotProducts extends Component{    //({ dispatch, list: dataSource, loading, total, page: current ,categoryMap })
  constructor(props) {
    super(props);
    this.state = {
      addId : '',
      list : [],
      tempAddId : null,
      loading: props.loading,
      plist: props.plist || [],
      ptotal: props.ptotal,
      ppage: props.ppage,
      rlist:props.rlist || [],
      rtotal: props.rtotal,
      rpage: props.rpage,
      searchWords:props.searchWords,
      dispatch : props.dispatch
    }
  }

  componentWillReceiveProps(nextProps){
    const { hotList } = nextProps;
    let id = '';
    for(let v in hotList){
      id = hotList[v][0];
    }
    this.setState({
      addId : id,
      loading: nextProps.loading,
      plist: nextProps.plist,
      ptotal: nextProps.ptotal,
      ppage: nextProps.ppage,
      rlist:nextProps.rlist ,
      rtotal: nextProps.rtotal,
      rpage: nextProps.rpage,
      searchWords:nextProps.earchWords,
      dispatch : nextProps.dispatch
    })
  }
  deleteHandler = (itm) => {
    const { dispatch } = this.props;
      console.log('deleteHandler',itm)
      let categoryId ;
      this.state.tempAddId == null ? categoryId = this.state.addId : categoryId = this.state.tempAddId;
    dispatch({
      type: 'hotproducts/remove',
      payload: {id:itm._id , categoryId},
    });
  }

  /*
  资源池的分页方法
  */
   rPageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/hotproducts',
      query: { id : this.state.tempAddId ? this.state.tempAddId : this.state.addId ,page : this.state.ppage, rpage : page,searchWords : this.state.searchWords},
    }));
  }
  /*
  已发布分页的方法
  */
  pPageChangeHandler = (page) => {
   this.state.dispatch(routerRedux.push({
     pathname: '/hotproducts',
     query: { id : this.state.tempAddId ? this.state.tempAddId : this.state.addId ,page, rpage : this.state.rpage,searchWords : this.state.searchWords},
   }));
 }
 /*
   发布上线的按钮方法
 */
 upLineHandler = (value) => {
   let obj ={};
   obj.is_online = true;
   obj.pstart = true;
   this.state.plist.forEach(v => {
     if(v.rank === value.rank){
       v.rank = "";
     }
   })
   obj.rank = value.rank;
   this.editHandler(value._id,obj);
 }
   editHandler = (id, values) => {
     let categoryId ;
     this.state.tempAddId == null ? categoryId = this.state.addId : categoryId = this.state.tempAddId;
      if(id){
          this.state.dispatch({
            type: 'hotproducts/patch',
            payload: { id, values ,categoryId, ppage : this.state.ppage,rpage:this.state.rpage,searchWords: this.state.searchWords},
          });
      }else {
          this.state.dispatch({
            type: 'hotproducts/add',
            payload: { id, values , categoryId},
          });
      }

  }
  changeHandler = (id) => {

    this.state.dispatch({
      type: 'hotproducts/fetch',
      payload: { "id" : id , "page" :  1},
    });
    this.setState({
      tempAddId : id
    })
  }
  /*
  历史热品按钮的方法
  */
  goHotHistoryHandler = (e) => {
    e.preventDefault();
    browserHistory.push('/hotproducts/historyrecoms');
  }
  getImg = (images) => {
    if (images.length > 0) {
      return <img src={"/api/file/" + images} style={{ width: "30px", height: "30px" }} />
    } else {
      return '无图';
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
  /*
    下线按钮的方法
  */
  downLineHandler = (serial) => {
    let value = {};
    value.is_online = false;
    value.is_history = true;
    value.rank = "";
    value.pend = true;
    this.editHandler(serial._id,value);
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
  searchWordsHandler = () => {
    this.rPageChangeHandler();
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
      dataIndex: 'hot ',
      key: 'hot',
      render : text => text ? <span>{text}</span> : <span>0</span>
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <Button type="danger" onClick={() => this.downLineHandler(serial)}>下线</Button>
          <HotProductsModal hotproduct={serial} onOk={this.editHandler.bind(null, serial._id)}>
            <Button>编辑</Button>
          </HotProductsModal>
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
          <HotSelectPositionModalComponent plist={this.state.plist} slectItem={serial} onHandler={(value) => this.upLineHandler(value)}>
            <Button type="danger">发布</Button>
          </HotSelectPositionModalComponent>
          <HotProductsModal hotproduct={serial} onOk={() => this.editHandler(serial._id,serial)}>
            <Button type="edit">编辑</Button>
          </HotProductsModal>
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
                  onSearch={v => { this.search(v); this.searchWordsHandler() }}
                />
              </Col>
              <Col span={8}>
                <Button style={{marginRight : "16px"}} onClick={this.goHotHistoryHandler}>历史热品</Button>
                <Button style={{marginRight : "16px"}}>操作日志</Button>
                <HotProductsModal hotproduct={{}} onOk={this.editHandler.bind(null,'')} addId={this.state.tempAddId == null ? this.state.addId : this.state.tempAddId}>
                  <Button>添加热品</Button>
                </HotProductsModal>
              </Col>
          </Row>
        </div>
        <HotProductsRadio
          list={this.state.plist}
          hotList={this.props.hotList}
          categoryMap={this.props.categoryMap}
          dataSource={this.state.plist}
          infoCheck={this.state.addId}
          changeHandler={this.changeHandler}
          dispatch={this.state.dispatch}
          ppage={this.state.ppage}
          rpage={this.state.rpage}
          searchWords={this.state.searchWords}
        />
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
              total={this.props.ptotal}
              current={this.props.ppage}
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
              current={this.state.rpage}
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
  const {list,categoryMap ,hotList,searchWords} = state.hotproducts;
  if (Array.isArray(list)) {
    return { loading: state.loading.models.banners,searchWords:searchWords }
  }else{
    return {
      loading: state.loading.models.hotproducts,
      plist: list.p.data,
      ptotal: list.p.total,
      ppage: list.p.page,
      rlist: list.r.data,
      rtotal: list.r.total,
      rpage: list.r.page,
      searchWords:searchWords,
      categoryMap,
      hotList
    };
  }
}

function mapDispatchToProps (dispatch) {
    return {
      dispatch : dispatch
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(HotProducts);
