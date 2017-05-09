import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import CaseEditModal from './CaseModal';
import CaseEditModalAdd from './CaseModalAdd.js'
import moment from 'moment';

import RecommendNum from "./recommendNumComponent.js";
import Propelling from "./propelling.js";
function Cases({ dispatch, list: dataSource, loading, total, page: current }) {
  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'cases/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/cases',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'cases/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'cases/add',
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
      title: '名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '户型',
      dataIndex: 'caseDoormodel',
      key: 'caseDoormodel',
    },
    {
      title: '空间',
      dataIndex: 'caseSpace',
      key: 'caseSpace',
    },
    {
      title: '阅读量',
      dataIndex: 'readNum',
      key: 'readNum',
    },
    {
      title: '推荐系数',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, cases) => (
        <span className={styles.operation2}>
          <Row>
            <RecommendNum dispatch={dispatch} />
            <Propelling dispatch={dispatch} />
            <CaseEditModal cases={cases} onOk={editHandler}>
              <Button>编辑</Button>
            </CaseEditModal>
          </Row>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
            <CaseEditModalAdd case={{}} onOk={editHandler.bind(null,'')}>
                <Button  icon="plus-circle-o">添加</Button>
            </CaseEditModalAdd>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={cases => cases._id}
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
  const { list, total, page } = state.cases;
  return {
    loading: state.loading.models.cases,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Cases);
