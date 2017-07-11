import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Row, Pagination, Popconfirm,Col,Input} from 'antd';
import { routerRedux } from 'dva/router';

import { connect } from 'dva';

class RecommendHistory extends Component {
  constructor(props) {
    super(props);
    this.state={}
  }

  render () {
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
      <div>
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
    )
  }
}

export default RecommendHistory;
