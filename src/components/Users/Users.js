import React from 'react';
import {connect} from 'dva';
import {
  Table,
  Pagination,
  Popconfirm,
  Row,
  Col,
  Button,
  message,
  Icon
} from 'antd';
import {routerRedux} from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import UserModal from './UserModal';

function Users2({dispatch, list: dataSource, loading, total, page: current}) {
  console.log('components render ')
  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    if (itm.role === 'super') {
      message.warn('超级用户不能删除')
      return;
    } else {
      dispatch({
        type: 'users/remove',
        payload: {
          id: itm._id
        }
      });
    }

  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({pathname: '/users', query: {
        page
      }}));
  }

  function getRole(_role) {
    if (_role === 'substance') {
      return "内容运营";
    } else if (_role === 'super') {
      return "超级用户";
    } else if (_role === 'onlines') {
      return "线上运营";
    } else if (_role === 'offlines') {
      return "线下运营";
    }
  }
  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'users/patch',
        payload: {
          id,
          values
        }
      });
    } else {
      dispatch({
        type: 'users/add',
        payload: {
          id,
          values
        }
      });
    }

  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'cnum',
      key: 'cnum',
      render: text => <span >{text}</span>
    }, {
      title: '名字',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: text => <span >{getRole(text)}</span>
    }, {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <UserModal record={record} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon}/>
          </UserModal>
          {record.role !== "super"
            ? <Popconfirm
                title={"确定要删除客户【" + record.name + "】吗？"}
                onConfirm={deleteHandler.bind(null, record)}>
                <Icon type="delete" className={styles.icon}/>
              </Popconfirm>
            : ''}

        </span>
      )
    }
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
          <UserModal record={{}} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </UserModal>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record._id}
          pagination={false}/>
        <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}/>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  console.log('components mapStateToProps ')
  const {list, total, page} = state.users;
  return {loading: state.loading.models.users, list, total, page};
}

export default connect(mapStateToProps)(Users2);
