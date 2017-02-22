import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import ReportModal from './ReportModal';

function Reports({ dispatch, list: dataSource, loading, total, page: current }) {

  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'reports/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/reports',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'reports/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'reports/add',
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
          <ReportModal record={record} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon}/>
          </ReportModal>
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
            <ReportModal record={{}} onOk={editHandler.bind(null,'')}>
                <Button  icon="plus-circle-o">添加</Button>
            </ReportModal>
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

  const { list, total, page } = state.reports;
  return {
    loading: state.loading.models.reports,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Reports);
