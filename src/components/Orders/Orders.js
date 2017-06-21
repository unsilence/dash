import React from 'react';
import { connect } from 'dva';
import { Table, Pagination ,Popconfirm ,Row ,Col ,Button ,Icon ,Input ,message} from 'antd';
import TestDiv from "./TestDiv.js";
import { routerRedux } from 'dva/router';
import styles from '../list.less';
import { browserHistory } from 'dva/router';
let PAGE_SIZE = 10
import OrderEditModal from './OrderModal.js';

function Orders({ dispatch, list: dataSource, loading, total, page: current ,skuPropsList , categoryMap,skuattributeIDs,_list}) {
   // _list  这个属性要留着  

  function deleteHandler(itm) {
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

  function editHandler(e) {    // 添加doder 数据的方法
    
    console.log(this);
    // let id;
    // let values = {
    //   skus : [{ sku_num: "58f1860cbdc83d64e9288c0b", quantity : 1, price: 1000,stocks: "" }],
    //   total_price: "666666",
    //   customer_num : "7758521",
    //   status : "待审核",
    //   cnum : "1314521",
    //   address_num : "5916b8b7e55e23359b0a7a37",
    //   refuse_info : "拒绝理由"
    // };
    // dispatch({
    //   type : "orders/add",
    //   payload : { id , values }
    // })
    message.warn('未完成！');
  }

  function addProject () {    // 添加address 表数据的方法
    let id;
    let values = {
          name: "工程名称",
          designer_name: "设计师名称",
          designer_phone: "18911337833",
          designer_department: "设计部门",
          door_at:"上门时间2017-5-5",
          days:"天数",
          area:"面积",
          location: "北京市中南海1号门",
          customer_num:"管理员ID"  // 来验证是否有审核资格
      };
      dispatch({
        type : "orders/addPerject",
        payload  : { id , values}
      })
  }
  const columns = [{
    title : "ID",
    dataIndex : "cnum",
    key : "cnum"
  },{
    title : "预约地址",
    dataIndex : "addressProps.location",
    key : "addressProps.location"
  },{
    title : "设计师",
    dataIndex : "addressProps.designer_name",
    key : "addressProps.designer_name"
  },{
    title: '上门时间',
    dataIndex: 'addressProps.door_at',
    key : "addressProps.door_at"
}, {
  title: '订单状态',
  dataIndex: 'status',
  key : "status",
},{
    title : "备注",
    dataIndex : "location",
    key : "location"
  },
 {
  title: '操作',
  key : "_id",
  dataIndex : "_id",
  render : (text,data) => (
      <span>
        <OrderEditModal text={text} 
                        projectData={data} 
                        skuPropsList={skuPropsList} 
                        categoryMap={categoryMap}
                        skuattributeIDs={skuattributeIDs}
                        dataSource={data}
                        dispatch={dispatch}
                        itemId={data._id}
                        _list={_list}>
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
                <Button style={{marginLeft:"15px"}} onClick={editHandler}>操作日志</Button>
          </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={dataSource}
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
  console.log(state);
  const { list, total, page ,skuPropsList, categoryMap ,skuattributeIDs ,_list} = state.orders;
  return {
    loading: state.loading.models.orders,
    list,
    total,
    page,
    skuPropsList,
    categoryMap,
    skuattributeIDs,
    _list
  };
}

export default connect(mapStateToProps)(Orders);
