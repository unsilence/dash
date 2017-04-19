import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import RecommendModal from './RecommendModal';

function Recommends({ dispatch, list: dataSource, loading, total, page: current }) {

  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'recommends/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/recommends',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'recommends/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'recommends/add',
            payload: { id, values },
          });
      }

  }

  const columns = [
    {
      title: '序号',
      dataIndex: '',
      key: '',
    },
    {
      title: '标题',
      dataIndex: '',
      key: '',
    },
    {
      title: '发布时间',
      dataIndex: '',
      key: '',
    },
    {
      title: '发布时长',
      dataIndex: '',
      key: '',
    },
    {
      title: '点击量',
      dataIndex: '',
      key: '',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <RecommendModal serial={serial} onOk={editHandler.bind(null, serial._id)}>
            <Icon type="edit" className={styles.icon}/>
          </RecommendModal>
          <Popconfirm title={"确定要删除色系【"+serial.name+"】吗？"} onConfirm={deleteHandler.bind(null, serial)}>
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
              <Button>添加推荐</Button>
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
  const { list, total, page } = state.recommends;
  return {
    loading: state.loading.models.recommends,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Recommends);
