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
function Cases({ dispatch, list: dataSource, loading, total, page: current ,skuList}) {
  console.log(dataSource);
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
  function callback(index) {
    return index++
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'cnum',
      key: 'cnum',
      render: text => <a href="">{text}</a>
    },
    {
      title: '名称',
      dataIndex: 'project_name',
      key: 'project_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: '户型',
      dataIndex: 'layout',
      key: 'layout',
    },
    {
      title: '空间',
      dataIndex: 'space_node',
      key: 'space_node',
    },
    {
      title: '阅读量',
      dataIndex: 'hot',
      key: 'hot',
    },
    {
      title: '推荐系数',
      dataIndex: 'recommend_num',
      key: 'recommend_num',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, cases) => (
        <span className={styles.operation2}>
          <Row>
            <RecommendNum dispatch={dispatch} />
            <Propelling dispatch={dispatch} />
            <CaseEditModal cases={cases} onOk={editHandler} dispatch={dispatch} skuList={skuList}>
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
  const { list, total, page ,skuList} = state.cases;
  return {
    loading: state.loading.models.cases,
    list,
    total,
    page,
    skuList
  };
}

export default connect(mapStateToProps)(Cases);
