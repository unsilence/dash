import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Icon, Button } from 'antd';
import styles from '../item.less';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { getFormatData } from '../utils'
const FormItem = Form.Item;
var pinyin = require("pinyin");

import EditableTable from './EditableTable';
let uuid = 0;
class ProductEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      keyAttr: [],
      sellAttr: [],
      otherAttr: [],
      tableData: {},
      tableFormatData: [],
      columnsDatas: []
    };
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.getFieldDecorator('keys', { initialValue: [] });
    this.props.form.setFieldsValue({ keys: this.state.sellAttr })
  }

  cascaderOnChange = (value) => {
    this.handleAttr(value);
  }

  /**
   * 添加一个销售组件
   */
  addSellComponent = (com) => {
    let temp = Object.assign({}, com);
    temp.sellId = temp._id + "_" + (uuid++);
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(temp);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  /**
   * 删除一个指定的销售组建
   */
  removeSellComponent = (com) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    function check() {
      return keys.filter(v => { return v._id === com._id }).length > 1 ? true : false;
    }
    if (!check()) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== com),
    });
  }

  handleAttr = (_cascader) => {
    let cas = _cascader.toString();
    let keyAttr = [];
    let sellAttr = [];
    let otherAttr = [];
    let arr = Object.values(this.props.product.attributeMap)
      .filter(v => {
        return v.categoryId.toString() === cas;
      }).forEach(v => {
        if (v.type === '1') {
          keyAttr.push(v);
        } else if (v.type === '2') {
          v.sellId = v._id + "_" + (uuid++);
          sellAttr.push(v);
        } else if (v.type === '3') {
          otherAttr.push(v);
        }
      })
    this.props.form.setFieldsValue({ keys: sellAttr })
    this.setState({
      keyAttr: keyAttr,
      sellAttr: sellAttr,
      otherAttr: otherAttr,
      tableData: this.props.form.getFieldsValue(),
      tableFormatData: [],
    })
  }


  sellChange = (e) => {
    const tableData = this.props.form.getFieldsValue();
    this.getTableFormatData(tableData);
    this.setState({
      tableData: tableData
    })
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
    this.props.form.resetFields(['name', 'note']);
  };

  okHandler = (e) => {
    const { onOk } = this.props;
    this.state.tableFormatData;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.state.tableFormatData, '--------------this.state.tableFormatData');
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  getTableData = (td) => {
    this.setState({ tableFormatData: td });
  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { _id, name, note, key, categoryId } = this.props.product;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let data = [];
    (this.props.product.categoryList || []).forEach(v => data.unshift(v));
    let cascaderOptions = getFormatData(data);
    let [keyOptions, otherOption, sellOptions] = this.createAttrOption(getFieldDecorator, getFieldValue, formItemLayout)

    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title={_id ? "修改：" : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler} key={"alkdkdkdk"}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品名字" >    {getFieldDecorator('name', { initialValue: name })(<Input size="small" />)}</FormItem>
            {/*<FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >    {getFieldDecorator('key', { initialValue: key || [] })(<TagsInput value={[]} {...{ 'onlyUnique': true }} onChange={v => { console.log(v) }} />)}</FormItem>*/}
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品分类" >
              {getFieldDecorator('categoryId', { initialValue: categoryId })(<Cascader options={cascaderOptions} onChange={this.cascaderOnChange.bind(this)} placeholder='Please select' />)}
            </FormItem>
            {keyOptions}
            {otherOption}
            {sellOptions}
            {this.createTable()}
          </Form>
        </Modal>
      </span>
    );
  }

  createTable = () => {
    return <EditableTable data={this.state.tableFormatData || []} columnsDatas={this.state.columnsDatas} getTableData={this.getTableData.bind(this)} />
  }

  getTableFormatData = (tableData) => {
    let filterData = Object.keys(tableData)
      .filter(k => { return k.indexOf('_') !== -1 })
      .map(v => { return { key: v, value: tableData[v] } });

    let keyObject = {};
    let columnsDatas = tableData.keys || [];
    columnsDatas.forEach(v => {
      v['selfValue'] = tableData[v.sellId];
      v['dataIndex'] = pinyin(v.name, {
        style: pinyin.STYLE_NORMAL, // 设置拼音风格
        heteronym: false
      }).join('');
      if (!keyObject[v._id]) {
        keyObject[v._id] = [v];
      }
      else {
        keyObject[v._id].push(v);
      }
    })
    let temps = doExchange(Object.values(keyObject));
    let data = [];
    temps && temps.forEach((v, index) => {
      let obj = { key: index };
      let uniques = [];
      //comType 0 不能输入 1数字输入框，2 文本输入框 
      if (Array.isArray(v)) {
        v.forEach(c => {
          uniques.push(c.sellId);
          obj[c.dataIndex] = { value: c.selfValue, editable: false, sellId: c.sellId, dataIndex: c.dataIndex, comType: '0' }
        });
      }
      uniques.sort();
      obj['uniqueId'] = uniques.join('');

      ['价格', '数量', '产品型号'].forEach((v, index) => {
        let dataIndex = pinyin(v, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: false
        }).join('');
        obj[dataIndex] = index < 2 ? { value: '', editable: false, comType: '1' } : { value: '', editable: false, comType: '2' }

      });
      data.push(obj);
    })
    this.setState({ tableFormatData: this.checkArray(this.state.tableFormatData, data), columnsDatas: columnsDatas })
  }

  /**数据检索拷贝 价格数量产品型号 */
  checkArray = (data, nextData) => {
    for (let next = 0; next < nextData.length; next++) {
      let outer = nextData[next];
      for (let index = 0; index < data.length; index++) {
        let inner = data[index];
        if (inner.uniqueId === outer.uniqueId) {
          for (let item in outer) {
            if (outer[item].comType === '1' || outer[item].comType === '2') {
              outer[item].value = inner[item].value;
            }
          }
        }
      }
    }
    return nextData;
  }


  createAttrOption = (getFieldDecorator, getFieldValue, formItemLayout) => {
    //属性处理
    let keyOptions = this.state.keyAttr.map(ko => { return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >    {getFieldDecorator(ko._id, {})(<Input size="small" />)}</FormItem> })
    if (keyOptions.length !== 0) keyOptions.unshift(<span key='keyword'>关键属性</span>)

    let otherOption = this.state.otherAttr.map(ko => { return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id}>    {getFieldDecorator(ko._id, {})(<Input size="small" />)}</FormItem> })
    if (otherOption.length !== 0) otherOption.unshift(<span key='otherword'>其他属性</span>)

    getFieldDecorator('keys', { initialValue: [] });
    let keys = getFieldValue('keys').sort(keysrt('_id', true));
    let sellOptions = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayout}
          label={k.name}
          required={false}
          key={k.sellId}
        >
          {getFieldDecorator(`${k.sellId}`, {
            validateTrigger: ['onChange', 'onBlur'],
            trigger: 'onChange',
            rules: [{
              required: true,
              whitespace: true,
              message: "fuck .",
            }],
          })(
            <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} onBlur={this.sellChange.bind(this)} />
            )}
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.removeSellComponent(k)}
          />
          <Icon type="plus-circle-o" onClick={this.addSellComponent.bind(this, k)} />
        </FormItem>
      );
    });

    if (sellOptions.length !== 0) {
      sellOptions.unshift(<span key='sellword'>销售属性</span>);
    }
    return [keyOptions, otherOption, sellOptions];
  }
}

function keysrt(key, desc) {
  return function (a, b) {
    return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}

export default Form.create()(ProductEditModal);

function doExchange(doubleArrays) {
  var len = doubleArrays.length
  if (len >= 2) {
    var len1 = doubleArrays[0].length
    var len2 = doubleArrays[1].length
    var newlen = len1 * len2
    var temp = new Array(newlen);
    var index = 0
    for (var i = 0; i < len1; i++) {
      for (var j = 0; j < len2; j++) {
        temp[index] ? temp[index].push(doubleArrays[0][i], doubleArrays[1][j]) : temp[index] = [doubleArrays[0][i], doubleArrays[1][j]]
        index++
      }
    }
    var newArray = new Array(len - 1)
    for (var i = 2; i < len; i++) {
      newArray[i - 1] = doubleArrays[i]
    }
    newArray[0] = temp
    return doExchange(newArray)
  } else {
    return doubleArrays[0]
  }
}