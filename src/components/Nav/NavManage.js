import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Table,
  Pagination,
  Popconfirm,
  Row,
  Col,
  Button,
  Icon,
  Input,
  Radio
} from 'antd';
import {routerRedux} from 'dva/router';
import NavManageRadio from "./NavManageRadio";
import styles from '../list.less';
import * as models from "../../models.js";
let PAGE_SIZE = 10;
let tempId;
import NavManageModal from './NavManageModal.js';
class NavManage extends Component { //{ dispatch, list: dataSource, loading, total, page: current ,categoryMap ,navList ,isHasId}
  constructor(props) {
    super(props);
    this.state = {
      fetchId: '',
      recommeneds: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const {navList} = nextProps;
    if (navList) {
      if (navList.length > 0) {
        this.setState({fetchId: navList[0].categoryId})
      }
    }
  }
  deleteHandler = (itm) => {
    // console.log('deleteHandler',itm) const { dispatch } = this.props; dispatch({
    //  type: 'navmanages/remove',   payload: {id:itm._id}, });
    let num = tempId
      ? tempId
      : this.state.fetchId;
    models
      .removeNavList(itm._id, num)
      .then((value) => {
        this.setState({recommeneds: value.data.data.list})
      })
  }

  pageChangeHandler = (page) => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({pathname: '/navmanages', query: {
        page
      }}));
  }

  editHandler = (id, values) => {
    const {dispatch} = this.props;
    // console.log(id+'=============================================================
    // ==========='+values); if(id){   dispatch({     type: 'navmanages/patch',
    // payload: { id, values },   }); }else {   dispatch({     type:
    // 'navmanages/add',     payload: { id, values },   }); }
    if (id) {
      models
        .upDataList(id, values)
        .then((value) => {
          this.setState({recommeneds: value.data.data.list})
        })
    } else {
      models
        .addNavList(id, values)
        .then(v => {
          let recommeneds = v.data.data.list;
          this.setState({recommeneds})
        })
    }

  }
  fetchNav = (id) => {
    // const { dispatch } = this.props; tempId = id; if(id){   dispatch({     type :
    // 'navmanages/fetchRecommened',     payload : { id }   }) }
    console.log(id);
    tempId = id;
    models
      .getCategory({page: 1, id})
      .then((value) => {
        this.setState({recommeneds: value.data.data.list})
      });
  }
  okHandler = (id, value) => {
    const {dispatch} = this.props;
    console.log(value);
    let values = {
      "key": "nav",
      "value": value
    };
    if (value) {
      if (id) {
        dispatch({
          type: 'navmanages/patchNav',
          payload: {
            id,
            values
          }
        });
      } else {
        dispatch({
          type: 'navmanages/addNav',
          payload: {
            id,
            values
          }
        });
      }
    }
  }
  render() {
    console.log(this.props.list);
    const columns = [
      {
        title: '序号',
        dataIndex: 'cnum',
        key: 'cnum'
      }, {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      }, {
        title: '发布时间',
        dataIndex: 'create_at',
        key: 'create_at'
      }, {
        title: '发布时长',
        dataIndex: 'update_at',
        key: 'update_at'
      }, {
        title: '点击量',
        dataIndex: 'hot',
        key: 'hot'
      }, {
        title: '操作',
        key: 'operation',
        render: (text, serial) => (
          <span className={styles.operation2}>
            <NavManageModal
              navmanage={serial}
              onOk={this
              .editHandler
              .bind(null, serial._id)}>
              <Icon type="edit" className={styles.icon}/>
            </NavManageModal>
            <Popconfirm
              title={"确定要删除推荐吗？"}
              onConfirm={this
              .deleteHandler
              .bind(null, serial)}>
              <Icon type="delete" className={styles.icon}/>
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <div className={styles.normal}>
        <div>
          <Row type="flex" justify="space-between" gutter={16}>
            <Col span={16}>
              <Input/>
            </Col>
            <Col span={8}>
              <Button style={{
                marginRight: "16px"
              }}>历史热品</Button>
              <Button style={{
                marginRight: "16px"
              }}>操作日志</Button>
              <NavManageModal
                navmanage={{}}
                onOk={this
                .editHandler
                .bind(null, "")}
                fetchId={tempId
                ? tempId
                : this.state.fetchId}>
                <Button>添加资源</Button>
              </NavManageModal>
            </Col>
          </Row>
          <NavManageRadio
            change={this.fetchNav}
            categoryMap={this.props.categoryMap}
            navList={this.props.navList}
            tablist={this.props.dataSource}
            okHandler={this.okHandler}
            isHasId={this.props.isHasId}/>
          <Table
            columns={columns}
            dataSource={this.state.recommeneds
            ? this.state.recommeneds
            : this.props.list}
            loading={this.props.loading}
            rowKey={serial => serial._id}
            pagination={false}/>
          <Pagination
            className="ant-table-pagination"
            total={this.props.total}
            current={this.props.current}
            pageSize={PAGE_SIZE}
            onChange={this.pageChangeHandler}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log(state);
  const {
    list,
    total,
    page,
    categoryMap,
    isHasId,
    navList
  } = state.navmanages;
  return {
    loading: state.loading.models.navmanages,
    list,
    total,
    page,
    categoryMap,
    isHasId,
    navList
  };
}

function mapDispatchToProps(dispatch) {
  return {dispatch: dispatch}
}
export default connect(mapStateToProps, mapDispatchToProps)(NavManage);
