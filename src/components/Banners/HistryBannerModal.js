import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Row, Pagination, Popconfirm,Col,Input} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../item.less';

import { connect } from 'dva';


class HistryBannerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchWords:''
    };
  }

   deleteHandler = (itm) => {
    console.log('deleteHandler', itm)
    this.props.dispatch({
      type: 'historybanners/remove',
      payload: { id: itm._id,searchWords:this.state.searchWords },
    });
  }


  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });

  };

  pageChangeHandler = (page) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/historybanners',
      query: { page, searchWords: this.state.searchWords  },
    }));
  }
  okHandler = () => {
    const { onOk } = this.props;

  };

  componentWillReceiveProps = (nextProps) => {
    let temp = {
      searchWords: nextProps.searchWords || ''
    }
    this.setState(temp);
  }



  search = (e) => {
    if(e.target){
      this.setState({ "searchWords": e.target.value });
    }
    else{
      this.setState({ "searchWords": e });
    }
    
  }

  render() {
    // let {children} = this.props;
    const columns = [{
      title: '序号',
      dataIndex: 'cnum',
      key: 'cnum',
      render: (text, record) => <span>{(this.props.list.indexOf(record) + 1) + 10 * (this.props.page ? this.props.page - 1 : 0)}</span>
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '发布时间',
      dataIndex: '',
      key: '',
    }, {
      title: '结束时间',
      key: '',
    }, {
      title: "发布时长",
      dataIndex: ""
    }, {
      title: "操作账户",
      dataIndex: ""
    }, {
      title: "点击量",
      dataIndex: ""
    }, {
      title: "操作",
      dataIndex: "",
      render: (text, record) => (
        <span className={styles.operation2}>
          <Popconfirm title={"确定要删除【" + record.title + "】吗？"} onConfirm={this.deleteHandler.bind(null, record)}>
            <Icon type="delete" className={styles.icon} />
          </Popconfirm>
        </span>
      ),
    }];
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
            dataSource={this.props.list}
            loading={this.props.loading}
            rowKey={record => record._id}
            pagination={false}
          />
          <Pagination
            className="ant-table-pagination"
            total={this.props.total}
            current={this.props.page}
            pageSize={10}
            onChange={this.pageChangeHandler}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {

  const { list, total, page ,searchWords} = state.historybanners;
  return {
    loading: state.loading.models.historybanners,
    list,
    total,
    page,
    searchWords
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch: dispatch }
}
export default connect(mapStateToProps, mapDispatchToProps)(HistryBannerModal);


// export default HistryBannerModal;
