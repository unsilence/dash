import React, { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Icon, Button } from 'antd';
import styles from '../item.less';
import TagsInput from './TagsInput';
import 'react-tagsinput/react-tagsinput.css';
import { getFormatData, getColorSerialFormatData } from '../utils';
import NumericInput from './NumericInput';
import SizeInput from './SizeInput';
const FormItem = Form.Item;
var pinyin = require("pinyin");

import EditableTable from './EditableTable';
// let uuid = 0;

class StockEditModal extends Component {

  constructor(props) {
    super(props);
    this.uuid = 0;
    this.keysValue = {};
    this.state = {
      visible: false,
      keyAttr: [],
      sellAttr: [],
      otherAttr: [],
      tableData: {},
      tableFormatData: [],
      columnsDatas: [],
      key: [],
      categoryId: [],
      product: {}
    };
  }

  componentWillMount() {
    console.log(this.props.product, '-----------componentWillMount');
  }
  componentDidMount() {
    if (this.props.product.categoryId) {
      this.cascaderOnChange(this.props.product.categoryId, 1);
      this.sellChange('');
      this.forceUpdate();
    }
    console.log('-----------componentDidMount');
  }

  cascaderOnChange = (value, fromWhere) => {
    this.handleAttr(value, fromWhere);
  }

  /**
   * 添加一个销售组件
   */
  addSellComponent = (com) => {
    let temp = Object.assign({}, com);
    temp.sellId = temp._id + "_" + (this.uuid++);
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

  handleAttr = (_cascader, fromWhere) => {
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
          v.sellId = v._id + "_" + (this.uuid++);
          sellAttr.push(v);
        } else if (v.type === '3') {
          otherAttr.push(v);
        }
      })
    if (fromWhere === 1)//从修改过来的
    {
      sellAttr = this.getSellKeys(sellAttr, this.props.product.attributes);
    }
    this.props.form.setFieldsValue({ keys: sellAttr })
    this.setState({
      keyAttr: keyAttr,
      sellAttr: sellAttr,
      otherAttr: otherAttr,
      tableData: this.props.form.getFieldsValue(),
      tableFormatData: [],
    })
  }

  //获取多少个keys
  getSellKeys = (sellAttr, attributes) => {
    let ret = [];
    this.keysValue = [];
    for (let item of attributes) {
      for (let sell of sellAttr) {
        if (item.attributeID === sell._id) {
          let tempValue;
          let sellObj;
          if (item.value.indexOf('@......@') !== -1) {
            let values = item.value.split('@......@')
            values.forEach(v => {
              tempValue = v;
              if (item.dtype !== 'string') {
                tempValue = JSON.parse(v);
              }

              sellObj = Object.assign({ dtype: item.dtype }, sell);
              sellObj.sellId = sell._id + '_' + (this.uuid++);
              sellObj['selfValue'] = tempValue;
              ret.push(sellObj);
              this.keysValue.push(sellObj);
            })
          } else {
            tempValue = item.value;
            if (item.dtype !== 'string') {
              tempValue = JSON.parse(item.value);
            }
            let sellObj = Object.assign({ dtype: item.dtype }, sell);
            sellObj.sellId = sell._id + '_' + (this.uuid++)
            sellObj['selfValue'] = tempValue;
            ret.push(sellObj);
            this.keysValue.push(sellObj);
          }
        }
      }
    }
    return ret;
  }

  sellChange = (e) => {
    const tableData = this.props.form.getFieldsValue();
    let data = this.getTableFormatData(tableData);
    this.setState({
      tableFormatData:data,
      tableData: tableData
    })
  }

  getInitialValue = (ko, type) => {
    let value = '';
    if (this.props.product && this.props.product.attributes && this.props.product.attributes.length !== 0) {
      let fromWhere;
      let _id = ko.sellId ? ko.sellId : ko._id;
      if (type === 'sell' && ko.sellId) {
        fromWhere = this.keysValue;
        for (let item of fromWhere) {
          if (item.sellId === _id) {
            value = item.selfValue === 'undefined' ? '' : item.selfValue;
            break;
          }
        }
      }
      else {
        fromWhere = this.props.product.attributes;
        for (let item of fromWhere) {
          if (item.attributeID === _id) {
            value = item.value === 'undefined' ? '' : item.value;
            break;
          }
        }
      }
    }
    return value;
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.state.tableFormatData, '--------------this.state.tableFormatData');
        values.skuData = this.state.tableFormatData;
        this.formatData(values);
        onOk(values);
        this.hideModelHandler();
      }
    });
  };
  formatData = (values) => {
    for (let [key, value] of Object.entries(values)) {
      if (key.length > 23) {
        if (key.indexOf("_") === -1) {
          let dtype = 'string';
          if (Array.isArray(value)) {
            dtype = 'array';
            value = JSON.stringify(value);
          } else if (typeof value === 'object') {
            dtype = 'object';
            value = JSON.stringify(value);
          }
          values.attributes ? values.attributes.push({ 'attributeID': key, 'value': value, 'dtype': dtype }) : values.attributes = [{ 'attributeID': key, 'value': value, 'dtype': dtype }]
        }
        else {
          let tempId = key.split('_')[0];
          let attObj = this.selectAttribute(tempId, values);
          if (attObj) {
            let tempValue = attObj.dtype === 'string' ? value : JSON.stringify(value);
            attObj.value += '@......@' + tempValue;
          } else {
            let dtype = 'string';
            if (Array.isArray(value)) {
              dtype = 'array';
              value = JSON.stringify(value);
            } else if (typeof value === 'object') {
              dtype = 'object';
              value = JSON.stringify(value);
            }
            values.attributes ? values.attributes.push({ 'attributeID': tempId, 'value': value, 'dtype': dtype }) : values.attributes = [{ 'attributeID': tempId, 'value': value, 'dtype': dtype }]
          }
        }
      }
    }
    return values;
  }

  selectAttribute = (_id, values) => {
    let atts = values.attributes;
    let ret = null;
    for (let item of atts) {
      if (_id.indexOf(item.attributeID) !== -1) {
        ret = item;
      }
    }

    return ret;
  }

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
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >    {getFieldDecorator('key', { initialValue: key })(<TagsInput  {...{ 'onlyUnique': true }} onChange={v => { console.log(v); this.props.form.setFieldsValue({ key: v }) }} />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品分类" >
              {getFieldDecorator('categoryId', { initialValue: categoryId })(<Cascader options={cascaderOptions} onChange={this.cascaderOnChange.bind(this)} expandTrigger="hover" placeholder='Please select' />)}
            </FormItem>
            {keyOptions}
            {otherOption}
            {sellOptions}
            {sellOptions.length > 0 ? this.createTable() : ''}
          </Form>
        </Modal>
      </span>
    );
  }

  createTable = () => {
    return <EditableTable key='editableTalbe' data={this.state.tableFormatData} columnsDatas={this.state.columnsDatas} getTableData={this.getTableData.bind(this)} />
  }

  /**获得格式化好的表数据 */
  getTableFormatData = (tableData) => {
    let filterData = Object.keys(tableData)
      .filter(k => { return k.indexOf('_') !== -1 })
      .map(v => { return { key: v, value: tableData[v] } });
      let replace = true;
    if (filterData.length === 0 && Array.isArray(this.keysValue))
    {
      replace = false;
    }
    let keyObject = {};
    let columnsDatas = tableData.keys || [];
    columnsDatas.forEach(v => {
      replace && (v['selfValue'] = tableData[v.sellId]);
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
      } else {
        uniques.push(v.sellId);
        obj[v.dataIndex] = { value: v.selfValue ? JSON.stringify(v.selfValue) : '', editable: false, sellId: v.sellId, dataIndex: v.dataIndex, comType: '0' }
      }
      //保持uniqueId 排序一致
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
    return data;
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

  getSellHandle = (ko, keys) => {
    return (ko.type === "2" ?
      <div>
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          disabled={keys.length === 1}
          onClick={() => this.removeSellComponent(ko)}
          key='1'
        />
        <Icon type="plus-circle-o" onClick={this.addSellComponent.bind(this, ko)} key='2' />
      </div>
      : '')
  }
  // const extendsObject = {"0":'不继承','1':'尺寸','2':'颜色','3':'原产地','4':'品牌'};
  //const stypeObject = {'1':'运营输入','2':'使用SKU配图','3':'下拉选项'};
  getComponentByType(ko, formItemLayout, getFieldDecorator, keys) {
    let options;
    let coms;
    if (ko.etype === '0') {
      if (ko.stype === '3') {//下拉选项
        options = ko.svalue.map(v => { return <Select.Option key={v} value={v}>{v}</Select.Option> });
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >
          {getFieldDecorator(ko._id, { initialValue: this.getInitialValue(ko) })(ko.type === '2' ? <Select size="small" onChange={this.sellChange.bind(this)} {...{ defaultActiveFirstOption: true }} >{options}</Select> : <Select size="small" {...{ defaultActiveFirstOption: true }} >{options}</Select>)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.stype === '1') {//运营输入
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >
          {getFieldDecorator(ko._id, { initialValue: this.getInitialValue(ko) })(ko.type === '2' ? <Input size="small" onChange={this.sellChange.bind(this)} /> : <Input size="small" />)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.stype === '2') {
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >
          {getFieldDecorator(ko._id, { initialValue: this.getInitialValue(ko) })(<span>使用SKU配图</span>)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
    } else {
      if (ko.name === '尺寸') {//这个比较麻烦
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko.sellId || ko._id} >
          {getFieldDecorator(ko.sellId || ko._id, {
            initialValue: this.getInitialValue(ko, 'sell'),
            validateTrigger: ['onChange'],
            rules: [{ validator: this.checkSize }]
          })(<SizeInput key='sizecom' onBlur={this.sellChange.bind(this)} />)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.name === '颜色') {//从颜色表中获取
        options = getColorSerialFormatData(Object.values(this.props.product.serialMap), Object.values(this.props.product.colorMap));
        // coms = ko.type === '2' ? <Cascader options={options} onChange={this.sellChange.bind(this)} placeholder='选择颜色' /> : <Cascader options={options} placeholder='Please select' />
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko.sellId || ko._id} >
          {getFieldDecorator(ko.sellId || ko._id, { initialValue: this.getInitialValue(ko, 'sell') })(ko.type === '2' ? <Cascader options={options} expandTrigger="hover" onChange={this.sellChange.bind(this)} placeholder='选择颜色' /> : <Cascader options={options} placeholder='Please select' />)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.name === '原产地') { //从国家表中读取
        options = Object.values(this.props.product.countryMap).map(v => { return <Select.Option key={v._id} value={v._id}>{v.name}</Select.Option> });

        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko.sellId || ko._id} >
          {getFieldDecorator(ko.sellId || ko._id, {
            initialValue: this.getInitialValue(ko, 'sell'),
            validateTrigger: ['onChange', 'onBlur'],
            trigger: 'onChange',
          })(ko.type === '2' ? <Select size="small" onBlur={this.sellChange.bind(this)}  {...{ defaultActiveFirstOption: true }} >{options}</Select> : <Select size="small" {...{ defaultActiveFirstOption: true }} >{options}</Select>)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.name === '品牌') { //取值范围，在品牌当前分类对应的品牌中获取
        options = Object.values(this.props.product.brandMap).map(v => { return <Select.Option key={v._id} value={v._id}>{v.name}</Select.Option> });
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko.sellId || ko._id} >
          {getFieldDecorator(ko.sellId || ko._id, { initialValue: this.getInitialValue(ko, 'sell') })(ko.type === '2' ? <Select size="small" onBlur={this.sellChange.bind(this)} {...{ defaultActiveFirstOption: true }} >{options}</Select> : <Select size="small" {...{ defaultActiveFirstOption: true }} >{options}</Select>)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
    }
  }

  checkSize = (rule, value, callback) => {
    if (value && ((value.chang && value.chang > 0) || (value.kuan && value.kuan > 0) || (value.gao && value.gao > 0) || (value.banjing && value.banjing > 0))) {
      callback();
      return;
    }
    callback('长、宽、高、半径最少填写一个!');
  }
  /**
   * 颜色级联显示
   */
  cascaderColorOnChange = (v) => {
    console.log(v, '---------------cascaderColorOnChange---------');
  }

  handleSizeChange = (v) => {
    console.log(v, '--------------------handleSizeChange------------------')
  }

  createAttrOption = (getFieldDecorator, getFieldValue, formItemLayout) => {
    //属性处理
    let keyOptions = this.state.keyAttr.map(ko => {
      return this.getComponentByType(ko, formItemLayout, getFieldDecorator);
    })
    if (keyOptions.length !== 0) keyOptions.unshift(<span key='keyword'>关键属性</span>);

    let otherOption = this.state.otherAttr.map(ko => {
      return this.getComponentByType(ko, formItemLayout, getFieldDecorator);
    })
    if (otherOption.length !== 0) otherOption.unshift(<span key='otherword'>其他属性</span>)

    getFieldDecorator('keys', { initialValue: [] });
    let keys = getFieldValue('keys') ? getFieldValue('keys').sort(keysrt('_id', true)) : [];
    let sellOptions = keys.map((k, index) => {
      return this.getComponentByType(k, formItemLayout, getFieldDecorator, keys);
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

export default Form.create()(StockEditModal);

/**
 * 获取组合数据
 * @param {} doubleArrays
 */
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