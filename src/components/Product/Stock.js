import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import StockModal from './StockModal';
import moment from 'moment';
import {getCategoryName,getProductNum} from '../utils'
import styles from '../list.less';
let PAGE_SIZE = 10


function Stock({ dispatch, list: dataSource, loading, total, page: current, serialMap, categoryMap, brandMap, colorMap, countryMap,attributeMap }) {

  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'stocks/remove',
      payload: { id: itm._id },
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/stocks',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'stocks/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'stocks/add',
        payload: { id, values },
      });
    }

  }
  const columns = [
    {
      title: '单品编号',
      dataIndex: 'unique_num',
      key: 'unique_num',
      render: (text,product) => <span>{text}</span>,
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
      title: '厂库',
      dataIndex: 'store',
      key: 'store',
      render: text => <span>{text}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => <span>{text}</span>
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, product) => (
        <span className={styles.operation2}>
          <StockModal product={{ ...product, categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap,brandMap:brandMap }} onOk={editHandler.bind(null, product._id)}>
            <Icon type="edit" className={styles.icon} />
          </StockModal>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
          {/*<StockModal product={{ categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap ,brandMap:brandMap}} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </StockModal>*/}
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
  const { list, total, page, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap } = state.stocks;
  return {
    loading: state.loading.models.stocks,
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

export default connect(mapStateToProps)(Stock);
