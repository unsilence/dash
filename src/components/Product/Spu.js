import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon, Input } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import SpuModal from './SpuModal';
import SpuToSkuModal from './SpuToSkuModal'
import moment from 'moment';
import { getCategoryName, getProductNum } from '../utils'
class Spu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.loading,
      list: this.props.list,
      total: this.props.total,
      page: this.props.page,
      serialMap: this.props.serialMap,
      categoryMap: this.props.categoryMap,
      brandMap: this.props.brandMap,
      colorMap: this.props.colorMap,
      countryMap: this.props.countryMap,
      attributeMap: this.props.attributeMap,
      searchWords: this.props.searchWords || '',
      dispatch: this.props.dispatch,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let temp = {
      loading: nextProps.loading,
      list: nextProps.list,
      total: nextProps.total,
      page: nextProps.page,
      serialMap: nextProps.serialMap,
      categoryMap: nextProps.categoryMap,
      brandMap: nextProps.brandMap,
      colorMap: nextProps.colorMap,
      countryMap: nextProps.countryMap,
      attributeMap: nextProps.attributeMap,
      searchWords: nextProps.searchWords || '',
      dispatch: this.props.dispatch,
    }
    this.setState(temp);
  }
  search = (e) => {
    if (e.target) {
      this.setState({ "searchWords": e.target.value });
    }
    else {
      this.setState({ "searchWords": e });
    }

  }
  deleteHandler = (itm) => {
    console.log('deleteHandler', itm)
    this.state.dispatch({
      type: 'spus/remove',
      payload: { id: itm._id },
    });
  }

  pageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/spus',
      query: { page , searchWords: this.state.searchWords},
    }));
  }

  editHandler = (id, values) => {
    if (id) {
      this.state.dispatch({
        type: 'spus/patch',
        payload: { id, values },
      });
    } else {
      this.state.dispatch({
        type: 'spus/add',
        payload: { id, values },
      });
    }
  }

  spuToSkuHandler = (product, values, message) => {
    this.state.dispatch({
      type: 'skus/add',
      payload: { product, values, message },
    });
  }


  render() {
    const columns = [
      {
        title: 'SPU编号',
        dataIndex: 'unique_num',
        key: 'unique_num',
        render: (text, product) => <span>{text}</span>,
      },
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '分类',
        dataIndex: 'category_num',
        key: 'category_num',
        render: text => <span>{getCategoryName(text, this.state.categoryMap)}</span>,
      },
      {
        title: '创建日期',
        dataIndex: 'create_at',
        key: 'create_at',
        render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm')}</span>
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, product) => (
          <span className={styles.operation2}>
            < SpuModal product={{ ...product, categoryList: Object.values((this.state.categoryMap || {})), serialMap: this.state.serialMap, colorMap: this.state.colorMap, countryMap: this.state.countryMap, attributeMap: this.state.attributeMap, brandMap: this.state.brandMap }} onDeleteHandler={
              this.deleteHandler.bind(null, product)
            }
              onOk={
                this.editHandler
              } >
              <Icon type='edit' style={{ marginRight: "10px" }}>spu</Icon>
            </SpuModal>
            <SpuToSkuModal product={{ ...product, categoryMap: this.state.categoryMap, serialMap: this.state.serialMap, colorMap: this.state.colorMap, countryMap: this.state.countryMap, attributeMap: this.state.attributeMap, brandMap: this.state.brandMap }} onOk={this.spuToSkuHandler.bind(this)}>
              <Icon type='edit' style={{ marginRight: "10px" }}>sku</Icon>
            </SpuToSkuModal>
            <Popconfirm title={"确定要删除Spu【" + product.name + "】吗？"} onConfirm={this.deleteHandler.bind(null, product)}>
              <Icon type='delete' style={{ marginRight: "10px" }}>删除</Icon>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div className={styles.normal}>
        <Row type="flex" justify="space-between" gutter={16}>
          <Col span={12}>
            <Input.Search
              type="text"
              placeholder="搜索"
              size="default"
              value={this.state.searchWords}
              onChange={v => this.search(v)}
              onSearch={v => { this.search(v); this.pageChangeHandler() }}
            />
          </Col>
        </Row>
        <div>
          <Row type="flex" justify="end">
            <SpuModal product={{ categoryList: Object.values((this.state.categoryMap || {})), serialMap: this.state.serialMap, colorMap: this.state.colorMap, countryMap: this.state.countryMap, attributeMap: this.state.attributeMap, brandMap: this.state.brandMap }} onOk={this.editHandler.bind(null, '')}>
              <Button icon="plus-circle-o">添加</Button>
            </SpuModal>
          </Row>
          <Table
            columns={columns}
            dataSource={this.state.list}
            loading={this.state.loading}
            rowKey={product => product._id}
            pagination={false}
          />
          <Pagination
            className="ant-table-pagination"
            total={this.state.total}
            current={this.state.current}
            pageSize={PAGE_SIZE}
            onChange={this.pageChangeHandler}
          />
        </div>
      </div>
    );
  }

}//({ dispatch, list: dataSource, loading, total, page: current, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap }) {


function mapStateToProps(state) {
  const { list, total, page, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap,searchWords } = state.spus;
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
    attributeMap,
    searchWords
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch: dispatch }
}
export default connect(mapStateToProps, mapDispatchToProps)(Spu);
