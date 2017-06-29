import React, { Component } from 'react';
import { Modal, Button, Table, Icon } from 'antd';
import styles from '../item.less';

import { connect } from 'dva';


class HistryBannerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
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

  okHandler = () => {
    const { onOk } = this.props;

  };

  render() {
    // let {children} = this.props;
    const columns = [{
      title: '序号',
      dataIndex: 'name',
      key: 'name'
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
      dataIndex: ""
    }];
    return (
      <Table columns={columns} />
    );
  }
}

function mapStateToProps(state) {

  const { list } = state.banners;
  if (Array.isArray(list)) {
    return { loading: state.loading.models.banners, }
  }
  else {
    return {
      loading: state.loading.models.banners,
      plist: list.p.data,
      ptotal: list.p.total,
      ppage: list.p.page,
      rlist: list.r.data,
      rtotal: list.r.total,
      rpage: list.r.page,
    };
  }

}

function mapDispatchToProps(dispatch) {
  return { dispatch: dispatch }
}
export default connect(mapStateToProps, mapDispatchToProps)(HistryBannerModal);


// export default HistryBannerModal;
