import React ,{ Component }from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input ,Radio} from 'antd';
import { routerRedux } from 'dva/router';
import HotProductsRadio from "./HotProductsRadio";
import styles from '../list.less';
let PAGE_SIZE = 10;

import HotProductsModal from './HotProductsModal.js';
class HotProducts extends Component{    //({ dispatch, list: dataSource, loading, total, page: current ,categoryMap })


  constructor(props) {
    super(props);
    this.state = {
      addId : '',
      list : [],
      tempAddId : null
    }
  }

  componentWillReceiveProps(nextProps){
    const { hotList } = nextProps;
    let id = '';
    for(let v in hotList){
      id = hotList[v][0];
    }
    this.setState({
      addId : id
    })
  }
  deleteHandler = (itm) => {
    const { dispatch } = this.props;
      console.log('deleteHandler',itm)
      let categoryId ;
      this.state.tempAddId == null ? categoryId = this.state.addId : categoryId = this.state.tempAddId;
    dispatch({
      type: 'hotproducts/remove',
      payload: {id:itm._id , categoryId},
    });
  }

   pageChangeHandler = (page) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/hotproducts',
      query: { page },
    }));
  } 

   editHandler = (id, values) => {
    console.log(id);
    const { dispatch } = this.props;
      if(id){
          dispatch({
            type: 'hotproducts/patch',
            payload: { id, values },
          });
      }else {
        let categoryId ;
        this.state.tempAddId == null ? categoryId = this.state.addId : categoryId = this.state.tempAddId;
          dispatch({
            type: 'hotproducts/add',
            payload: { id, values , categoryId},
          });
      }

  }
  changeHandler = (value) => {
    console.log(value);
    const { list , dispatch } = this.props;
    dispatch({
      type: 'hotproducts/fetch',
      payload: { "id" : value , "page" :  1},
    });
    this.setState({
      tempAddId : value
    })
    // this.setState({
    //   addId : value
    // })
  }
  render () {
  const columns = [
    {
      title: '序号',
      dataIndex: 'cnum',
      key: 'cnum',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'create_at',
      key: 'create_at',
    },
    {
      title: '发布时长',
      dataIndex: 'update_at',
      key: 'update_at',
    },
    {
      title: '点击量',
      dataIndex: 'hot ',
      key: 'hot',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <HotProductsModal hotproduct={serial} onOk={this.editHandler.bind(null, serial._id)}>
            <Icon type="edit" className={styles.icon}/>
          </HotProductsModal>
          <Popconfirm title={"确定要删除推荐吗？"} onConfirm={this.deleteHandler.bind(null, serial)}>
            <Icon type="delete" className={styles.icon}/>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="space-between" gutter={16}>
            <Col span={16}>
              <Input />
            </Col>
            <Col span={8}>
              <Button style={{marginRight : "16px"}}>历史热品</Button>
              <Button style={{marginRight : "16px"}}>操作日志</Button>
              <HotProductsModal hotproduct={{}} onOk={this.editHandler.bind(null,'')} addId={this.state.tempAddId == null ? this.state.addId : this.state.tempAddId}>
                <Button>添加热品</Button>
              </HotProductsModal>
            </Col>
        </Row>
        <HotProductsRadio list={this.props.list} hotList={this.props.hotList} categoryMap={this.props.categoryMap} dataSource={this.props.dataSource} infoCheck={this.state.addId} changeHandler={this.changeHandler} dispatch={this.props.dispatch}/>
        <Table
          columns={columns}
          dataSource={this.props.list}
          loading={this.props.loading}
          rowKey={serial => serial._id}
          pagination={false}
        />
        <Pagination
          className="ant-table-pagination"
          total={this.props.total}
          current={this.props.page}
          pageSize={PAGE_SIZE}
          onChange={this.pageChangeHandler}
        />
      </div>
    </div>
  );
  }
}

function mapStateToProps(state) {
  const {list, total, page ,categoryMap ,hotList} = state.hotproducts;
  return {
    loading: state.loading.models.hotproducts,
    list,
    total,
    page,
    categoryMap,
    hotList
  };
}

function mapDispatchToProps (dispatch) {
    return {
      dispatch : dispatch
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(HotProducts);
