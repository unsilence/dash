import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm ,Row,Col,Button,Icon} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../list.less';
let PAGE_SIZE = 10
import CaseModal from './CaseModal';
import moment from 'moment';
function Cases({ dispatch, list: dataSource, loading, total, page: current }) {

  function deleteHandler(itm) {
      console.log('deleteHandler',itm)
    dispatch({
      type: 'cases/remove',
      payload: {id:itm._id},
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/cases',
      query: { page },
    }));
  }

  function editHandler(id, values) {
      if(id){
          dispatch({
            type: 'cases/patch',
            payload: { id, values },
          });
      }else {
          dispatch({
            type: 'cases/add',
            payload: { id, values },
          });
      }

  }

  const columns = [
    {
      title: 'id',
      dataIndex: '_id',
      key: '_id',
      render: text => <a href="">{text}</a>,
    },
    {
      title: '名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '户型',
      dataIndex: 'caseDoormodel',
      key: 'caseDoormodel',
    },
    {
      title: '空间',
      dataIndex: 'caseSpace',
      key: 'caseSpace',
    },
    {
      title: '阅读量',
      dataIndex: 'readNum',
      key: 'readNum',
    },
    {
      title: '推荐系数',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: text => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '配图',
      dataIndex: 'collocatImg',
      key: 'collocatImg',
      render: text =><img style={{width:"50px",heigth:"50px"}} src={'/api/file/'+text}/>,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, cases) => (
        <span className={styles.operation2}>
          <CaseModal case={cases} onOk={editHandler.bind(null, cases._id)}>
            <Icon type="edit" className={styles.icon}/>
          </CaseModal>
          <Popconfirm title={"确定要删除案例【"+cases.headline+"】吗？"} onConfirm={deleteHandler.bind(null, cases)}>
            <Icon type="delete" className={styles.icon}/>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <Row type="flex" justify="end">
            <CaseModal case={{}} onOk={editHandler.bind(null,'')}>
                <Button  icon="plus-circle-o">添加</Button>
            </CaseModal>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={cases => cases._id}
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
  const { list, total, page } = state.cases;
  return {
    loading: state.loading.models.cases,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Cases);
