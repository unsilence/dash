import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import BuyModal from './BuyModal';

function Buys({ dispatch, list: dataSource, loading, total, page: current }) {

  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'buys/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/buys',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'buys/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'buys/add',
            payload: { id, values },
          });
      }

  }

  const columns = [
    {
      title: 'id',
      dataIndex: '_id',
      key: '_id',
      render: text => <a href="">{text}</a>,
    },
    {
      title: '编号',
      dataIndex: 'cnum',
      key: 'cnum',
      render: text => <a href="">{text}</a>,
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <BuyModal record={record} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon}/>
          </BuyModal>
          <Popconfirm title={"确定要删除客户【"+record.name+"】吗？"} onConfirm={deleteHandler.bind(null, record)}>
            <Icon type="delete" className={styles.icon}/>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
            <BuyModal record={{}} onOk={editHandler.bind(null,'')}>
                <Button  icon="plus-circle-o">添加</Button>
            </BuyModal>
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

  const { list, total, page } = state.buys;
  return {
    loading: state.loading.models.buys,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Buys);
