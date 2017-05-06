import React from 'react';
import { connect } from 'dva';
import { Table, Pagination ,Popconfirm ,Row ,Col ,Button ,Icon ,Input } from 'antd';
import TestDiv from "./TestDiv.js";
import { routerRedux } from 'dva/router';
import styles from '../list.less';
import { browserHistory } from 'dva/router';
let PAGE_SIZE = 10
import OrderEditModal from './OrderModal.js';

function Orders({ dispatch, list: dataSource, loading, total, page: current ,skuProjectList ,skuPropsList , categoryMap,skuattributeIDs ,_list}) {
  console.log(dataSource);
  console.log(skuProjectList);
  console.log(skuPropsList);
  console.log(skuattributeIDs);
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

  function editHandler(e) {
    let id = "545656546548321832";
    let values = {
      skuNumList : [{ skuNum: "58eef3004c6fc72a6f2c53d5", count: 1, price: 1000,stocks: "" }],
      totalPrice: "666666",
      userId : "7758521",
      state : "待审核",
      note : "业主要求只能设计师进场",
      orderNum : "1314521",
      projectInfoId : "59098cf239e76c12c8b87b95",
      refuseInfo : "拒绝理由"
    };
    // if(id){
    //   dispatch({
    //     type: 'orders/patch',
    //     payload: { id, values },
    //   });
    // }else {
    //   dispatch({
    //     type: 'orders/add',
    //     payload: { id, values },
    //   });
    // }
    dispatch({
      type : "orders/add",
      payload : { id , values }
    })
  }

  function addProject () {
    let id = "123";
    let values = {
          name: "工程名称",
          designerName: "设计师名称",
          designerPhone: "18911337833",
          designerDepartment: "设计部门",
          address:"地址",
          doorTime:"上门时间2017-5-5",
          days:"天数",
          area:"面积",
          schedule:"0", // 订单进度
          note: "业主只许可4个人以下进入房间",
          userId:"管理员ID"  // 来验证是否有审核资格
      };

      dispatch({
        type : "orders/addPerject",
        payload  : { id , values}
      })
  }

  const columns = [{
    title : "ID",
    dataIndex : "orderNum",
    key : "orderNum"
  },{
    title : "预约地址",
    dataIndex : "address",
    key : "address"
  },{
    title : "设计师",
    dataIndex : "designerName",
    key : "designerName"
  },{
    title: '上门时间',
    dataIndex: 'doorTime',
    key : "doorTime"
  // specify the condition of filtering result
  // here is that finding the name started with `value`
  // onFilter: (value, record) => record.name.indexOf(value) === 0,
    // filterDropdown : <TestDiv />,
    // filterIcon : <Icon type="search" />
}, {
  title: '订单状态',
  dataIndex: 'state',
  key : "state",
   // render : (text,data) => (<span>{projectMap[data.projectInfoId].state}</span>)

},{
    title : "备注",
    dataIndex : "note",
    key : "note"
  },
 {
  title: '操作',
  key : "_id",
  render : (text,data) => (
      <span>
        <OrderEditModal text={text} 
                        projectData={data} 
                        skuProjectList={skuProjectList} 
                        skuPropsList={skuPropsList} 
                        categoryMap={categoryMap}
                        skuattributeIDs={skuattributeIDs}
                        dataSource={dataSource}
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
  const { list, total, page ,skuPropsList ,skuProjectList , categoryMap ,skuattributeIDs ,_list} = state.orders;
  return {
    loading: state.loading.models.orders,
    list,
    _list,
    total,
    page,
    skuPropsList,
    skuProjectList,
    categoryMap,
    skuattributeIDs,
  };
}

export default connect(mapStateToProps)(Orders);
