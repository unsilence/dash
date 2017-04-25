import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input ,Radio} from 'antd';
import { routerRedux } from 'dva/router';
import NavManageRadio from "./NavManageRadio";
import styles from '../list.less';
let PAGE_SIZE = 10
import NavManageModal from './NavManageModal.js';
function NavManage({ dispatch, list: dataSource, loading, total, page: current ,categoryMap ,navMap,data}) {
  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'navmanages/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/navmanages',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    console.log(id+'========================================================================'+values);
      if(id){
          dispatch({
            type: 'navmanages/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'navmanages/add',
            payload: { id, values },
          });
      }

  }
  function okHandler(values) {
    console.log(values);
    if(values){
      dispatch({
          type: 'navmanages/addNav',
          payload: { id : values.parentId ,  values},
      })
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
          <NavManageModal navmanage={serial} onOk={editHandler.bind(null, serial._id)}>
            <Icon type="edit" className={styles.icon}/>
          </NavManageModal>
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
              <NavManageModal navmanage={{}} onOk={editHandler.bind(null,'')}>
                <Button>添加资源</Button>
              </NavManageModal>
            </Col>
        </Row>
        <NavManageRadio change={editHandler} categoryMap={categoryMap} navMap={navMap} tablist={dataSource} okHandler={okHandler.bind(null)}/>
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
  const {list, total, page ,categoryMap ,navMap,data} = state.navmanages;
  return {
    loading: state.loading.models.navmanages,
    list,
    total,
    page,
    categoryMap,
    navMap,
  };
}

export default connect(mapStateToProps)(NavManage);
