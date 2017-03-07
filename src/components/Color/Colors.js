import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import ColorModal from './ColorModal';

function Colors({ dispatch, list: dataSource, loading, total, page: current, serialList }) {

  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'colors/remove',
      payload: { id: itm._id },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/colors',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'colors/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'colors/add',
        payload: { id, values },
      });
    }

  }

  function getSerialName(_serId) {
    let seria = serialList.filter(s => s._id === _serId);
    if (seria) {
      return seria[0].name;
    }
    else{
      return ''
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
      title: '色系',
      dataIndex: 'seriesId',
      key: 'seriesId',
      render: text => <span>{getSerialName(text)}</span>
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <ColorModal record={{ ...record, serialList: serialList }} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon} />
          </ColorModal>
          <Popconfirm title={"确定要删除颜色【" + record.name + "】吗？"} onConfirm={deleteHandler.bind(null, record)}>
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
          <ColorModal record={{ serialList: serialList }} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </ColorModal>
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

  const { list, total, page, serialList } = state.colors;

  return {
    loading: state.loading.models.colors,
    list,
    total,
    page,
    serialList,
  };
}

export default connect(mapStateToProps)(Colors);
