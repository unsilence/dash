import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import SpuModal from './SpuModal';
import SpuToSkuModal from './SpuToSkuModal'
import moment from 'moment';
import {getCategoryName,getProductNum} from '../utils'

function Spu({ dispatch, list: dataSource, loading, total, page: current, serialMap, categoryMap, brandMap, colorMap, countryMap,attributeMap }) {

  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'spus/remove',
      payload: { id: itm._id },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/spus',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'spus/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'spus/add',
        payload: { id, values },
      });
    }
  }

   function spuToSkuHandler(product, values,message) {
      dispatch({
        type: 'skus/add',
        payload: { product, values ,message},
      });
  }


  
  const columns = [
    {
      title: 'SPU编号',
      dataIndex: 'unique_num',
      key: 'unique_num',
      render: (text,product) => <span>{getProductNum(product.categoryId,categoryMap)+product.productNum}</span>,
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: text => <span>{getCategoryName(text,categoryMap)}</span>,
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
          <SpuModal product={{ ...product, categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap,brandMap:brandMap }} onOk={editHandler.bind(null, product._id)}>
            <Icon type='edit' style={{marginRight:"10px"}}>spu</Icon>
          </SpuModal>
          <SpuToSkuModal product={{ ...product, categoryMap: categoryMap, serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap,brandMap:brandMap }} onOk={spuToSkuHandler.bind(this)}>
            <Icon type='edit' style={{marginRight:"10px"}}>sku</Icon>
          </SpuToSkuModal>
          <Popconfirm title={"确定要删除Spu【" + product.name + "】吗？"} onConfirm={deleteHandler.bind(null, product)}>
            <Icon type='delete' style={{marginRight:"10px"}}>删除</Icon>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
          <SpuModal product={{ categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap ,brandMap:brandMap}} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </SpuModal>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={product => product._id}
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
  const { list, total, page, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap } = state.spus;
  return {
    loading: state.loading.models.spus,
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

export default connect(mapStateToProps)(Spu);
