import React from 'react';
import { connect } from 'dva';
import { Table, Pagination ,Popconfirm ,Row ,Col ,Button ,Icon ,Input } from 'antd';
import TestDiv from "./TestDiv.js";
import { routerRedux } from 'dva/router';
import styles from '../list.less';
import { browserHistory } from 'dva/router';
let PAGE_SIZE = 10
import OrderEditModal from './OrderModal.js';

function Orders({ dispatch, list: dataSource, loading, total, page: current }) {

  function deleteHandler(itm) {
    console.log('deleteHandler',itm)
    dispatch({
      type: 'orders/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/orders',
      query: { page },
    }));
  }

  function editHandler(e,id, values) {
    if(id){
      dispatch({
        type: 'orders/patch',
        payload: { id, values },
      });
    }else {
      dispatch({
        type: 'orders/add',
        payload: { id, values },
      });
    }

  }

  const newData = [
  {
    "_id": 1,
    "name": '胡彦斌',
    "date": "2017/3/12",
    "address": '西湖区湖底公园1号',
    "_state" : "待审核",
    "remarks" : "业主要求只能设计师进场"
  },{
    "_id": 2,
    "name": '刘德华',
    "date": "2017/3/12",
    "address": '西湖区湖底公园1号',
    "_state" : "待上门",
    "remarks" : "业主要求只能设计师进场"
  },{
    "_id": 3,
    "name": '郭富城',
    "date": "2017/3/12",
    "address": '西湖区湖底公园1号',
    "_state" : "结算完成",
    "remarks" : "只拍照，不售卖"
  }
  ]

  const columns = [{
    title : "ID",
    dataIndex : "_id",
    key : "_id"
  },{
    title : "预约地址",
    dataIndex : "address",
    key : "1"
  },{
    title : "设计师",
    dataIndex : "name",
    key : "name"
  },{
    title: '上门时间',
    dataIndex: 'date',
    key : "date"
  // specify the condition of filtering result
  // here is that finding the name started with `value`
  // onFilter: (value, record) => record.name.indexOf(value) === 0,
    // filterDropdown : <TestDiv />,
    // filterIcon : <Icon type="search" />
}, {
  title: '订单状态',
  dataIndex: '_state',
  key : "_state",

},{
    title : "备注",
    dataIndex : "remarks",
    key : "remarks"
  },
 {
  title: '操作',
  dataIndex: 'toDo',
  key : "toDo",
  render : (text,data) => (
      <span>
        <OrderEditModal text={text} data={data}>
          <Button>编辑</Button>
        </OrderEditModal>
      </span>
    )
}];

return (
  <div className={styles.normal}>
    <div>
      <Row type="flex" justify="space-between">
          <Col span={15}>
            <Input
              type = "text"
              placeholder="搜索"
              size = "default"
            />
          </Col>
          <Col span={1} pull={1} style={{marginBottom:"15px"}}>
                <Button style={{marginLeft:"15px"}}>操作日志</Button>
          </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={newData}
        loading={loading}
        rowKey={record => record._id}
        pagination={false}
      />
      <Pagination
        className="ant-table-pagination"
        total={total}
        current={current}
        pageSize={PAGE_SIZE}
        onChange={pageChangeHandler}
      />
    </div>
  </div>
  );
}

function mapStateToProps(state) {

  const { list, total, page } = state.orders;
  return {
    loading: state.loading.models.orders,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Orders);
