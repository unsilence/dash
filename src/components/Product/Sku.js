import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import SkuModal from './SkuModal';
import moment from 'moment';
import { getCategoryName, getProductNum } from '../utils'

function Sku({ dispatch, list: dataSource, loading, total, page: current, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap }) {

  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'skus/remove',
      payload: { id: itm._id },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/skus',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'skus/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'skus/add',
        payload: { id, values },
      });
    }

  }
  const columns = [
    {
      title: 'SKU编号',
      dataIndex: 'skuNum',
      key: 'skuNum',
      render: (text,product) => <span>{getProductNum(product.spu.categoryId,categoryMap)+product.spu.productNum+text}</span>,
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: text => <span>{text}</span>,
    },
    {
      title: '库存',
      dataIndex: 'count',
      key: 'count',
      render: text => <span>{text}</span>,
    },
    {
      title: '销量',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: text => <span>{0}</span>,
    },
    {
      title: '创建日期',
      dataIndex: 'createAt',
      key: 'createAt',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm')}</span>
    },
    {
      title: '推荐系数',
      dataIndex: 'xishu',
      key: 'xishu',
      render: text => <span>{text}</span>,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, product) => (
        <span className={styles.operation2} >
          <Popconfirm title={"推荐"} key='asdf'>
            <Icon type="export" style={{marginRight:"10px"}}>推荐</Icon>
          </Popconfirm>

          <Popconfirm title={"推荐至"} key='asdf111'>
            <Icon type="export" style={{marginRight:"10px"}}>推荐至</Icon>
          </Popconfirm>

          <SkuModal product={{ ...product, categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap, brandMap: brandMap }} onOk={editHandler.bind(null, product._id)}>
            <Icon type="edit">编辑</Icon>
          </SkuModal>
          
        </span>
      )
    }
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
          <SkuModal product={{ categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap, brandMap: brandMap }} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </SkuModal>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={sku => sku._id}
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
  const { list, total, page, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap } = state.skus;
  return {
    loading: state.loading.models.skus,
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

export default connect(mapStateToProps)(Sku);
