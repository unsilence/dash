import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import CaseManageModal from './CaseManageModal';

function Recommends({ dispatch, list: dataSource, loading, total, page: current }) {
  console.log(dataSource);

  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'casemanages/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/casemanages',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'casemanages/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'casemanages/add',
            payload: { id, values },
          });
      }

  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'cnum',
      key: 'cnum',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'create_at',
      key: 'create_at',
    },
    {
      title: '发布时长',
      dataIndex: 'update_at',
      key: 'update_at',
    },
    {
      title: '点击量',
      dataIndex: 'hot',
      key: 'hot',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <CaseManageModal casemanage={serial} onOk={editHandler.bind(null, serial._id)}>
            <Icon type="edit" className={styles.icon}/>
          </CaseManageModal>
          <Popconfirm title={"确定要删除推荐吗？"} onConfirm={deleteHandler.bind(null, serial)}>
            <Icon type="delete" className={styles.icon}/>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="space-between" gutter={16}>
            <Col span={16}>
              <Input />
            </Col>
            <Col span={8}>
              <Button style={{marginRight : "16px"}}>历史推荐</Button>
              <Button style={{marginRight : "16px"}}>操作日志</Button>
              <CaseManageModal casemanage={{}} onOk={editHandler.bind(null,'')}>
                <Button>添加推荐</Button>
              </CaseManageModal>
            </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={serial => serial._id}
          pagination={false}
        />
        <Pagination
          className="ant-table-pagination"
          total={total}s
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const {list, total, page ,categoryMap} = state.casemanages;
  console.log(state);
  return {
    loading: state.loading.models.casemanages,
    list,
    total,
    page,
    categoryMap
  };
}

export default connect(mapStateToProps)(Recommends);
