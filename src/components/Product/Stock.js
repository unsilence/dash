import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon ,Input} from 'antd';
import { routerRedux } from 'dva/router';
import StockModal from './StockModal';
import moment from 'moment';
import { getCategoryName, getProductNum } from '../utils'
import styles from '../list.less';
let PAGE_SIZE = 10

class Stock extends React.Component {
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
      skusMap: this.props.skusMap,
      spusMap: this.props.spusMap,
      dispatch: this.props.dispatch,
      searchWords: this.props.searchWords || ''
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
      skusMap: nextProps.skusMap,
      spusMap: nextProps.spusMap,
      searchWords: nextProps.searchWords || '',
      dispatch: nextProps.dispatch
    }
    this.setState(temp);
  }

  deleteHandler = (itm) => {
    console.log('deleteHandler', itm)
    this.state.dispatch({
      type: 'stocks/remove',
      payload: { id: itm._id },
    });
  }

  pageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/stocks',
      query: { page, searchWords: this.state.searchWords },
    }));
  }

  editHandler = (id, values) => {
    if (id) {
      this.state.dispatch({
        type: 'stocks/patch',
        payload: { id, values },
      });
    } else {
      this.state.dispatch({
        type: 'stocks/add',
        payload: { id, values },
      });
    }

  }

  getNum = (product) => {
    let num = getProductNum(skusMap[product.sku_num]['category_num'], categoryMap) + spusMap[skusMap[product.sku_num].spu_num].unique_num + skusMap[product.sku_num].unique_num;
    return num;
  }

  search = (e) => {
    if (e.target) {
      this.setState({ "searchWords": e.target.value });
    }
    else {
      this.setState({ "searchWords": e });
    }
  }

  render() {
    const columns = [
      {
        title: '单品编号',
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
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (text, product) => <span>{this.state.skusMap[product.sku_num].price}</span>,
      },
      {
        title: '厂库',
        dataIndex: 'store',
        key: 'store',
        render: (text, product) => <span>{this.state.skusMap[product.sku_num].store}</span>
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
            <StockModal product={{ ...product, categoryList: Object.values((this.state.categoryMap || {})), serialMap: this.state.serialMap, colorMap: this.state.colorMap, countryMap: this.state.countryMap, attributeMap: this.state.attributeMap, brandMap: this.state.brandMap }} onOk={this.editHandler.bind(null, product._id)}>
              <Icon type="edit" className={styles.icon} />
            </StockModal>
          </span>
        ),
      },
    ];


    return (
      <div className={styles.normal}>
        <div>
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
            current={this.state.page}
            pageSize={PAGE_SIZE}
            onChange={this.pageChangeHandler}
          />
        </div>
      </div>
    );
  }

}




function mapStateToProps(state) {
  const { list, total, page, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap, skusMap, spusMap, searchWords } = state.stocks;
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
    attributeMap,
    skusMap,
    spusMap,
    searchWords
  };
}


function mapDispatchToProps(dispatch) {
  return { dispatch: dispatch }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stock);
