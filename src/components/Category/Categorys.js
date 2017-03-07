import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import CategoryModal from './CategoryModal';

function Categorys({ dispatch, list: dataSource, loading, total, page: current }) {

  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'categorys/remove',
      payload: { id: itm._id },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/categorys',
      query: { page },
    }));
  }

  function getCategoryName(_id) {
    if (_id === '' || !_id) {
      return '';
    }

    let cate = (dataSource||[]).filter(s => s._id === _id);
    if (cate) {
      return cate[0].name;
    }
    else {
      return ''
    }

  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'categorys/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'categorys/add',
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
      title: '父分类',
      dataIndex: 'parentId',
      key: 'parentId',
      render: text => <span>{getCategoryName(text)}</span>
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <CategoryModal record={{ ...record, categories: dataSource }}  onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon} />
          </CategoryModal>
          <Popconfirm title={"确定要删除分类【" + record.name + "】吗？"} onConfirm={deleteHandler.bind(null, record)}>
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
          <CategoryModal record={{categories:dataSource}} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </CategoryModal>
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

  const { list, total, page } = state.categorys;
  return {
    loading: state.loading.models.categorys,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Categorys);
