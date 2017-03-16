import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import ProductModal from './ProductModal';
import moment from 'moment';

function Products({ dispatch, list: dataSource, loading, total, page: current, serialMap, categoryMap, brandMap, colorMap, countryMap,attributeMap }) {

  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'products/remove',
      payload: { id: itm._id },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/products',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'products/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'products/add',
        payload: { id, values },
      });
    }

  }

  const columns = [
    {
      title: 'SPU编号',
      dataIndex: '_id',
      key: '_id',
      render: text => <a href="">{text}</a>,
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '创建日期',
      dataIndex: 'createAt',
      key: 'createAt',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm')}</span>
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, product) => (
        <span className={styles.operation2}>
          <ProductModal product={{ ...product, categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap }} onOk={editHandler.bind(null, serial._id)}>
            <Icon type="edit" className={styles.icon} />
          </ProductModal>
          <Popconfirm title={"确定要删除色系【" + product.name + "】吗？"} onConfirm={deleteHandler.bind(null, serial)}>
            <Icon type="delete" className={styles.icon} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
          <ProductModal product={{ categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap }} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </ProductModal>
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
  const { list, total, page, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap } = state.products;
  return {
    loading: state.loading.models.products,
    list,
    total,
    page,
    serialMap,
    categoryMap,
    brandMap,
    colorMap,
    countryMap,
    attributeMap
  };
}

export default connect(mapStateToProps)(Products);
