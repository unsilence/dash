import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import CountryModal from './CountryModal';

function Countrys({ dispatch, list: dataSource, loading, total, page: current }) {
  console.log("ta laizi nali!", dataSource)
  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'countrys/remove',
      payload: { id: itm._id },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/countrys',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'countrys/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'countrys/add',
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
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <CountryModal record={record} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon} />
          </CountryModal>
          <Popconfirm title={"确定要删除国家【" + record.name + "】吗？"} onConfirm={deleteHandler.bind(null, record)}>
            <Icon type="delete" className={styles.icon} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
          <CountryModal record={{}} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </CountryModal>
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

  const { list, total, page } = state.countrys;
  return {
    loading: state.loading.models.countrys,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Countrys);
