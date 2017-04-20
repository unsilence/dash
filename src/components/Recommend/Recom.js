import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import RecomModal from './RecomModal';

function Recoms({ dispatch, list: dataSource, loading, total, page: current }) {
  function deleteHandler(itm) {
    dispatch({
      type: 'recoms/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/recoms',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'recoms/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'recoms/add',
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
      dataIndex: 'createAt',
      key: 'createAt',
    },
    {
      title: '发布时长',
      dataIndex: 'updateAt',
      key: 'updateAt',
    },
    {
      title: '点击量',
      dataIndex: 'clickNum',
      key: 'clickNum',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <RecomModal recommend={serial} onOk={editHandler.bind(null, serial._id)}>
            <Icon type="edit" className={styles.icon}/>
          </RecomModal>
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
              <RecomModal recommend={{}} onOk={editHandler.bind(null,'')}>
                <Button>添加推荐</Button>
              </RecomModal>
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
  const {list, total, page ,categoryMap} = state.recoms;
  return {
    loading: state.loading.models.recoms,
    list,
    total,
    page,
    categoryMap
  };
}

export default connect(mapStateToProps)(Recoms);
