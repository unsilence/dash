import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon, Input } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import SkuModal from './SkuModal';
import moment from 'moment';
import { getCategoryName, getProductNum } from '../utils'

class Sku extends React.Component {
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
      dispatch: this.props.dispatch,
      searchWords: this.props.searchWords || ''
    };
  }
  deleteHandler = (itm) => {
    console.log('deleteHandler', itm)
    this.state.dispatch({
      type: 'skus/remove',
      payload: { id: itm._id },
    });
  }


  pageChangeHandler = (page) => {

    this.state.dispatch(routerRedux.push({
      pathname: '/skus',
      query: { page ,searchWords:this.state.searchWords},
    }));
  }

  editHandler = (id, values) => {

    if (id) {
      this.state.dispatch({
        type: 'skus/patch',
        payload: { id, values },
      });
    } else {
      this.state.dispatch({
        type: 'skus/add',
        payload: { id, values },
      });
    }
  }

  search = (e) => {
    this.setState({ "searchWords": e.target.value });
  }

  getImg = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      return <img src={"/api/file/" + images[0].md5} style={{ width: "30px", height: "30px" }} />
    } else {
      return '无图';
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
      searchWords:nextProps.searchWords||''
    }
    this.setState(temp);
  }

  getFilters = () => {
    let ret = [];

    (this.state.list || []).forEach(v => {
      ret.push({ text: v.name, value: v.name });
    })

    return ret;
  }
  render = () => {
    const columns = [
      {
        title: '图片',
        dataIndex: 'images',
        key: 'images',
        render: text => <span>{this.getImg(text)}</span>
      },
      {
        title: 'SKU编号',
        dataIndex: 'unique_num',
        key: 'unique_num',
        render: (text, product) => <span>{getProductNum(product.category_num, this.state.categoryMap) + product.unique_num + text}</span>,
      },

      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        filters: this.getFilters(),
        onFilter: (value, product) => product.name.includes(value),
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: text => <span>{text}</span>,
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: '库存',
        dataIndex: 'count',
        key: 'count',
        render: text => <span>{text}</span>,
        sorter: (a, b) => a.count - b.count,
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
        render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm')}</span>,
        sorter: (a, b) => moment(new Date(a.create_at)).format('X') - moment(new Date(b.create_at)).format('X'),
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

            <SkuModal onDeleteHandler={this.deleteHandler} product={{ ...product, categoryList: Object.values((this.state.categoryMap || {})), serialMap: this.state.serialMap, colorMap: this.state.colorMap, countryMap: this.state.countryMap, attributeMap: this.state.attributeMap, brandMap: this.state.brandMap }} onOk={this.editHandler}>
              <Icon type="edit" style={{ marginRight: "10px" }}>编辑</Icon>
            </SkuModal>
            {
              product.is_online ? <Icon type="arrow-down" key="arrow-down" onClick={() => { product.is_online = false; this.editHandler(product._id, product) }} style={{ marginRight: "10px" }}>下线</Icon> : <Icon type="arrow-up" key="arrow-up" onClick={() => { product.is_online = true; this.editHandler(product._id, product) }} style={{ marginRight: "10px" }}>上线</Icon>
            }
          </span>
        )
      }
    ];

    return (
      <div className={styles.normal}>
        <Row type="flex" justify="space-between" gutter={16}>
          <Col span={16}>
            <Input.Search
              type="text"
              placeholder="搜索"
              size="default"
              value={this.state.searchWords}
              onChange={v => this.search(v)}
            />
          </Col>
          <Col span={8}>
            <Button style={{
              marginRight: "16px"
            }} onClick={this.pageChangeHandler }>查询</Button>
          </Col>
        </Row>
        <div>
          <Table
            columns={columns}
            dataSource={this.state.list}
            loading={this.state.loading}
            rowKey={sku => sku._id}
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
}

function mapStateToProps(state) {
  const { list, total, page, serialMap, categoryMap, brandMap, colorMap, countryMap, attributeMap ,searchWords} = state.skus;
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
    attributeMap,
    searchWords
  };
}
function mapDispatchToProps(dispatch) {
  return { dispatch: dispatch }
}
export default connect(mapStateToProps, mapDispatchToProps)(Sku);
