import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon,Input} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import RecomModal from './RecomModal';
/*
  ({ dispatch, list: dataSource, loading, total, page: current })
*/
class Recoms extends React.Component{
  constructor(props){
    super(props);
    this.state={
      dataSource : props.props,
      loading : props.loading,
      total : props.total,
      current : props.page,
      dispatch:props.dispatch
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      dataSource : nextProps.dataSource,
      loading : nextProps.loading,
      total : nextProps.total,
      current : nextProps.page,
      dispatch:nextProps.dispatch
    })
  }
  deleteHandler = (itm) => {
    this.state.dispatch({
      type: 'recoms/remove',
      payload: {id:itm._id},
    });
  }

  pageChangeHandler = (page) => {
    this.state.dispatch(routerRedux.push({
      pathname: '/recoms',
      query: { page },
    }));
  }

  editHandler = (id, values) => {
      if(id){
          this.state.dispatch({
            type: 'recoms/patch',
            payload: { id, values },
          });
      }else {
          this.state.dispatch({
            type: 'recoms/add',
            payload: { id, values },
          });
      }

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
      dataIndex: 'hot',
      key: 'hot',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, serial) => (
        <span className={styles.operation2}>
          <RecomModal recommend={serial} onOk={this.editHandler(serial._id)}>
            <Icon type="edit" className={styles.icon}/>
          </RecomModal>
          <Popconfirm title={"确定要删除推荐吗？"} onConfirm={() => this.deleteHandler(serial)}>
            <Icon type="delete" className={styles.icon}/>
          </Popconfirm>
        </span>
      ),
    },
  ];
  console.log(this.props.dataSource);
  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="space-between" gutter={16}>
            <Col span={16}>
              <Input />
            </Col>
            <Col span={8}>
              <Button style={{marginRight : "16px"}}>历史推荐</Button>
              <Button style={{marginRight : "16px"}}>操作日志</Button>
              <RecomModal recommend={{}} onOk={this.editHandler}>
                <Button>添加推荐</Button>
              </RecomModal>
            </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={this.state.dataSource}
          loading={this.state.loading}
          rowKey={serial => serial._id}
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
  const {list, total, page ,categoryMap} = state.recoms;
  return {
    loading: state.loading.models.recoms,
    dataSource:list,
    total,
    page,
    categoryMap
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch: dispatch }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recoms);
