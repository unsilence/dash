import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon ,Input} from 'antd';
import { routerRedux ,browserHistory } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import AddBannerModal from './AddBannerModal.js';
import BannerConsoleModal from './BannerConsoleModal.js';
import HistryBannerModal from './HistryBannerModal.js';

function Banners({ dispatch, list: dataSource, loading, total, page: current ,categoryMap}) {

  function deleteHandler(itm) {
      // console.log('deleteHandler',itm)
    dispatch({
      type: 'banners/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/banners',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'banners/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'banners/add',
            payload: { id, values },
          });
      }

  }
  let historyHandler = (e) => {
      e.preventDefault();
      (async function() {
          browserHistory.push('/banners/histrybanner')
      })();
    }
  const columns = [
    {
      title: '序号',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: text => <span>{text}</span>
    },
    {
      title: '发布时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: text => <span>{text}</span>
    },
    {
      title: '点击量',
      dataIndex: 'clickNum',
      key: 'clickNum',
      render: text => <span>{text}</span>
    },
    {
      title : "排序"
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <AddBannerModal banner={record } onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon} />
          </AddBannerModal>
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
        <Row type="flex" justify="space-between">
          <Col span={15}>
            <Input
              type = "text"
              placeholder="搜索"
              size = "default"
            />
          </Col>
          <Col span={9} push={1} style={{marginBottom:"15px"}}>
            <Button onClick={historyHandler}>历史banner</Button>
            <BannerConsoleModal>
                <Button style={{marginLeft:"15px"}}>操作日志</Button>
            </BannerConsoleModal>
            
            <AddBannerModal banner={{}} onOk={editHandler.bind(null,'')}>
                <Button style={{marginLeft:"15px"}}>添加banner</Button>
            </AddBannerModal>
          </Col>
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

  const { list, total, page ,categoryMap} = state.banners;
  return {
    loading: state.loading.models.banners,
    list,
    total,
    page,
    categoryMap,
  };
}

export default connect(mapStateToProps)(Banners);
