import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import BrandModal from './BrandModal';

function Brands({ dispatch, list: dataSource, loading, total, page: current,categoryMap }) {
console.log("ta laizi nali!",dataSource)
  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'brands/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/brands',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'brands/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'brands/add',
            payload: { id, values },
          });
      }

  }

  const columns = [
    {
      title: '品牌Id',
      dataIndex: '_id',
      key: '_id',
      render: text => <a href=''>{text}</a>,
    },
    {
      title: '中文名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="">{text}</a>,
    },
    {
      title: '英文名',
      dataIndex: 'name_en',
      key: 'name_en',
    },
    {
      title: '缩写',
      dataIndex: 'shortcut',
      key: 'shortcut',
    },
    {
      title: '首字母',
      dataIndex: 'firstletter',
      key: 'firstletter',
    },
    {
      title: '介绍',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <BrandModal record={{ ...record, categoryList: Object.values((categoryMap||{})) }} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon}/>
          </BrandModal>
          <Popconfirm title={"确定要删除品牌【"+record.name+"】吗？"} onConfirm={deleteHandler.bind(null, record)}>
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
            <BrandModal record={{ categoryList: Object.values((categoryMap||{})) }} onOk={editHandler.bind(null,'')}>
                <Button  icon="plus-circle-o">添加</Button>
            </BrandModal>
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

  const { list, total, page } = state.brands;
  return {
    loading: state.loading.models.brands,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Brands);
