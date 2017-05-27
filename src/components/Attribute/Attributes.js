import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import AttributeModal from './AttributeModal';
import moment from 'moment';

const extendsObject = {"0":'不继承','1':'尺寸','2':'颜色','3':'原产地','4':'品牌'};
const stypeObject = {'1':'运营输入','2':'使用SKU配图','3':'下拉选项'};
const typeObject = {'1':'关键属性','2':'销售属性','3':'其他属性'};


function Attributes({ dispatch, list: dataSource, loading, total, page: current, categoryMap }) {

  function deleteHandler(itm) {
    console.log('deleteHandler', itm)
    dispatch({
      type: 'attributes/remove',
      payload: { id: itm._id },
    });
  }
  console.log(dataSource);
  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/attributes',
      query: { page },
    }));
  }

  function editHandler(id, values) {
    if (id) {
      dispatch({
        type: 'attributes/patch',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'attributes/add',
        payload: { id, values },
      });
    }

  }

  function getCategoryName(_id) {
    let cids = _id || []

    let cstr = cids.map(v => loop(v)).join('/');
    function loop(_id) {
      if (_id === '' || !_id) {
        return '';
      }
      return categoryMap[_id] ?categoryMap[_id].name :'';
    }
    return cstr;
    // let name_ = "";
    // if(!_id || !categoryMap[_id]){
    //   return ;
    // }else{
    //   categoryMap[_id].name ? name_ = categoryMap[_id].name : name_ = "";
    // }
    // return name_;
  }

  const columns = [
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属分类',
      dataIndex: 'category_num',
      key: 'category_num',//分类类型
      render: text => <span>{getCategoryName(text)}</span>,
    },
    {
      title: '属性类别',
      dataIndex: 'vital_type',
      key: 'vital_type',//关键分类、销售属性、其他属性
      render: text => <span>{typeObject[text]?typeObject[text]:''}</span>,
    },
    {
      title: '继承公共属性',
      dataIndex: 'extends_type',
      key: 'extends_type',//继承公共属性
      render: text => <span>{extendsObject[text]?extendsObject[text]:''}</span>,
    },
    {
      title: '属性选项',
      dataIndex: 'select_type',
      key: 'select_type',//属性选项属性
      render: text => <span>{stypeObject[text]?stypeObject[text]:''}</span>,
    },
    {
      title: '可以为空',
      dataIndex: 'is_null',
      key: 'is_null',//继承公共属性
      render: text => <span>{text ? "是" : "否"}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',//继承公共属性
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: '修改时间',
      dataIndex: 'update_at',
      key: 'update_at',//继承公共属性
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation2}>
          <AttributeModal record={{ ...record, categoryList: Object.values((categoryMap||{})) }} onOk={editHandler.bind(null, record._id)}>
            <Icon type="edit" className={styles.icon} />
          </AttributeModal>
          <Popconfirm title={"确定要删除属性【" + record.name + "】吗？"} onConfirm={deleteHandler.bind(null, record)}>
            <Icon type="delete" className={styles.icon} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
          <AttributeModal record={{ categoryList: Object.values((categoryMap||{})) }} onOk={editHandler.bind(null, '')}>
            <Button icon="plus-circle-o">添加</Button>
          </AttributeModal>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record._id}
          pagination={false}
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

  const { list, total, page, categoryMap } = state.attributes;
  return {
    loading: state.loading.models.attributes,
    list,
    total,
    page,
    categoryMap
  };
}

export default connect(mapStateToProps)(Attributes);
