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
  console.log(dataSource);
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

  function getImg(images) {
    if (Array.isArray(images) && images.length > 0) {
      return <img src={"/api/file/"+images[0].md5} style={{width:"30px",height:"30px"}}/>
    } else {
      return '无图';
    }


  }

  const columns = [
    {
      title: 'SKU编号',
      dataIndex: 'unique_num',
      key: 'unique_num',
      render: (text, product) => <span>{getProductNum(product.category_num, categoryMap) + product.unique_num + text}</span>,
    },
    {
      title: '图片',
      dataIndex: 'images',
      key: 'images',
      render: text => <span>{getImg(text)}</span>
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
      dataIndex: 'create_at',
      key: 'create_at',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm')}</span>
    },

    {
      title: '推荐系数',
      dataIndex: 'hot',
      key: 'hot',
      render: text => <span>{text}</span>,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, product) => (
        <span className={styles.operation2} >
          <Popconfirm title={"推荐"} key='asdf'>
            <Icon type="export" style={{ marginRight: "10px" }}>推荐</Icon>
          </Popconfirm>

          <Popconfirm title={"推荐至"} key='asdf111'>
            <Icon type="export" style={{ marginRight: "10px" }}>推荐至</Icon>
          </Popconfirm>

          <SkuModal onDeleteHandler={deleteHandler} product={{ ...product, categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap, brandMap: brandMap }} onOk={editHandler}>
            <Icon type="edit" style={{ marginRight: "10px" }}>编辑</Icon>
          </SkuModal>
          {
            product.is_online ? <Icon type="arrow-down" key="arrow-down" onClick={() => { product.is_online = false; editHandler(product._id, product) }} style={{ marginRight: "10px" }}>下线</Icon> : <Icon type="arrow-up" key="arrow-up" onClick={() => { product.is_online = true; editHandler(product._id, product) }} style={{ marginRight: "10px" }}>上线</Icon>
          }

        </span>
      )
    }
  ];

  return (
    <div className={styles.normal}>
      <div>
        {/*<Row type="flex" justify="end">
          <SkuModal product={{ categoryList: Object.values((categoryMap || {})), serialMap: serialMap, colorMap: colorMap, countryMap: countryMap, attributeMap: attributeMap, brandMap: brandMap }} onOk={editHandler}>
            <Button icon="plus-circle-o">添加</Button>
          </SkuModal>
        </Row>*/}
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={sku => sku._id}
          pagination={false}
          scroll={{ y: 500 }}
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
