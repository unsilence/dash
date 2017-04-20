import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input ,Radio} from 'antd';
import { routerRedux } from 'dva/router';
import HotProductsRadio from "./HotProductsRadio";
import styles from '../list.less';
let PAGE_SIZE = 10
import HotProductsModal from './HotProductsModal.js';
function HotProducts({ dispatch, list: dataSource, loading, total, page: current }) {
  console.log(dataSource);

  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'hotproducts/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/hotproducts',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    console.log(id+'========================================================================'+values);
      if(id){
          dispatch({
            type: 'hotproducts/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'hotproducts/add',
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
          <HotProductsModal hotproduct={serial} onOk={editHandler.bind(null, serial._id)}>
            <Icon type="edit" className={styles.icon}/>
          </HotProductsModal>
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
              <Button style={{marginRight : "16px"}}>历史热品</Button>
              <Button style={{marginRight : "16px"}}>操作日志</Button>
              <HotProductsModal hotproduct={{}} onOk={editHandler.bind(null,'')}>
                <Button>添加热品</Button>
              </HotProductsModal>
            </Col>
        </Row>
        <HotProductsRadio change={editHandler}/>
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
  console.log(state);
  const {list, total, page ,categoryMap} = state.hotproducts;
  console.log(state);
  return {
    loading: state.loading.models.hotproducts,
    list,
    total,
    page,
    categoryMap
  };
}

export default connect(mapStateToProps)(HotProducts);
