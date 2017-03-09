import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import AttributeModal from './AttributeModal';

function Attributes({ dispatch, list: dataSource, loading, total, page: current ,categoryList}) {

  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'customers/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/customers',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'customers/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'customers/add',
            payload: { id, values },
          });
      }

  }

  const columns = [
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属分类',
      dataIndex: 'categoryId',
      key: 'categoryId',//分类类型
      render: text => <a href="">{text}</a>,
    },
    {
      title: '属性类别',
      dataIndex: 'type',
      key: 'type',//关键分类、销售属性、其他属性
    },
    {
      title: '继承公共属性',
      dataIndex: 'etype',
      key: 'etype',//继承公共属性
    },
    {
      title: '属性选项',
      dataIndex: 'stype',
      key: 'stype',//继承公共属性
    },
    {
      title: '可以为空',
      dataIndex: 'isNull',
      key: 'isNull',//继承公共属性
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',//继承公共属性
    },
    {
      title: '修改时间',
      dataIndex: 'updateAt',
      key: 'updateAt',//继承公共属性
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <AttributeModal record={{ ...record, categoryList: categoryList }} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon}/>
          </AttributeModal>
          <Popconfirm title={"确定要删除属性【"+record.name+"】吗？"} onConfirm={deleteHandler.bind(null, record)}>
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
            <AttributeModal record={{categoryList: categoryList}} onOk={editHandler.bind(null,'')}>
                <Button  icon="plus-circle-o">添加</Button>
            </AttributeModal>
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

  const { list, total, page ,categoryList} = state.attributes;
  return {
    loading: state.loading.models.attributes,
    list,
    total,
    page,
    categoryList
  };
}

export default connect(mapStateToProps)(Attributes);
