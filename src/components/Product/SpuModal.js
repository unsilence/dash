import React, { Component } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Cascader,
  Icon,
  Button,
  Checkbox
} from 'antd';
const CheckboxGroup = Checkbox.Group;
import styles from '../item.less';
import TagsInput from './TagsInput';
import 'react-tagsinput/react-tagsinput.css';
import { getFormatData, getColorSerialFormatData } from '../utils';
import NumericInput from './NumericInput';
import SizeInput from './SizeInput';
import {doExchange,keysrt} from '../utils'
import Editor from 'react-umeditor';
const FormItem = Form.Item;
var pinyin = require("pinyin");
import EditableTable from './EditableTable';

class SpuEditModal extends Component {

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
      category_num: [],
      product: {},
      content :'',
      checkOpts:this.getCheckOpts(this.props.product),
      tags:this.props.product.qtext||[]

    };
  }


  componentDidMount() {
    if (this.props.product.category_num) {
      // let nums = typeof(this.props.product.category_num) != "string" ? this.props.product.category_num : [this.props.product.category_num];
      this.cascaderOnChange(this.props.product.category_num, 1);
      this.sellChange('');
      this.forceUpdate();
    }
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
    temp.id = com._id;
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
    console.log(fromWhere);
    let cas = _cascader.toString();
    let keyAttr = [];
    let sellAttr = [];
    let otherAttr = [];
    let arr = Object.values(this.props.product.attributeMap)
      .filter(v => {
        return v.category_num.toString() === cas;
      }).forEach(v => {
        if (v.vital_type === '1') {
          keyAttr.push(v);
        } else if (v.vital_type === '2') {
          v.sellId = v._id + "_" + (this.uuid++);
          sellAttr.push(v);
        } else if (v.vital_type === '3') {
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
        if (item.attribute_num === sell._id) {
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
              sellObj.id = sell._id;
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
            console.log(sellObj);
            sellObj.sellId = sell._id + '_' + (this.uuid++);
            sellObj.id = sell._id;
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
      tableFormatData: data,
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
          if (item.attribute_num === _id) {
            // if(item.select_type === '4'){
            //   console.log('item----',item);
            // }
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

  onDeleteHandler = (e) =>{
    const {onDeleteHandler} = this.props;

    if(onDeleteHandler){
      onDeleteHandler(this.props.product);
    }
  }

  okHandler = (e) => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.state.tableFormatData, '--------------this.state.tableFormatData');



        for(let key in this.state.checkOpts){
            values[key] = this.state.checkOpts[key];
        }

        values.skus = [];//this.formatSkusData(this.state.tableFormatData);
        this.formatAttributesData(values);
        console.log(values);
        values.qtext = this.state.tags;
        if( this.props.product.category_num && this.props.product.category_num.toString() === values.category_num.toString())
        {
          onOk(this.props.product._id,values);
        }
        else{
          onOk(values);
        }

        this.hideModelHandler();
      }
    });
  };

  formatSkusData = (datas) => {
    let skus = [];
    datas.forEach(v => {
      let sku = {};
      for (let [key, entry] of Object.entries(v)) {
        if (entry.sellId) {
          let id = entry.sellId.split('_')[0];
          let dtype;
          if (Array.isArray(entry.value)) {
            dtype = 'array';
          } else if (typeof entry.value === 'object') {
            dtype = 'object';
          }
          sku.attributes ? sku.attributes.push({ 'attribute_num': id, 'dtype': dtype, 'value': JSON.stringify(entry.value) }) : sku.attributes = [{ 'attribute_num': id, 'dtype': 'array', 'value': JSON.stringify(entry.value) }];
        } else {
          if (key === 'jiage') {
            sku.price = parseInt(entry.value);
          } else if (key === 'chanpinxinghao') {
            sku.imodel = entry.value;
          } else if (key === 'shuliang') {
            sku.count = parseInt(entry.value);
          }
        }
      }
      skus.push(sku);
    });
    return skus;
  }

  getIcons = () => {
    var icons = [
      "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
      "paragraph fontfamily fontsize | superscript subscript | ",
      "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
      "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
      "horizontal date time  | image emotion spechars | inserttable"
    ];
    return icons;
  }

  getQiniuUploader = () => {
    return {
      url: 'http://upload.qiniu.com',
      type: 'qiniu',
      name: "file",
      request: "image_src",
      qiniu: {
        app: {
          Bucket: "liuhong1happy",
          AK: "l9vEBNTqrz7H03S-SC0qxNWmf0K8amqP6MeYHNni",
          SK: "eizTTxuA0Kq1YSe2SRdOexJ-tjwGpRnzztsSrLKj"
        },
        domain: "http://o9sa2vijj.bkt.clouddn.com",
        genKey: function (options) {
          return options.file.type + "-" + options.file.size + "-" + options.file.lastModifiedDate.valueOf() + "-" + new Date().valueOf() + "-" + options.file.name;
        }
      }
    }
  }
  handleAlter = (content) => {
    this.setState({"content": content})
  }
  formatAttributesData = (values) => {
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
          values.attributes ? values.attributes.push({ 'attribute_num': key, 'value': value, 'dtype': dtype }) : values.attributes = [{ 'attribute_num': key, 'value': value, 'dtype': dtype }]
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
            values.attributes ? values.attributes.push({ 'attribute_num': tempId, 'value': value, 'dtype': dtype }) : values.attributes = [{ 'attribute_num': tempId, 'value': value, 'dtype': dtype }]
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
      if (_id.indexOf(item.attribute_num) !== -1) {
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
    const { _id, name, note, qtext, category_num ,description } = this.props.product;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let data = [];
    (this.props.product.categoryList || []).forEach(v => data.unshift(v));
    let cascaderOptions = getFormatData(data);
    console.log(cascaderOptions);
    let [keyOptions, otherOption, sellOptions] = this.createAttrOption(getFieldDecorator, getFieldValue, formItemLayout)
    let icons = this.getIcons();
    var uploader = this.getQiniuUploader();
    var plugins = {
      image: {
        uploader: uploader
      }
    }

let foot = _id
? ([ <Button key = "delete" size = "large" onClick = {
this.onDeleteHandler
    } > 删除 </Button>, < Button key = "submit" type = "primary" size = "large" loading = {
      this.state.loading
    }
    onClick = {
      this.okHandler
    } > 保存 </Button > ])
: ([ <Button key="offline" size="large" loading={this.state.loading} onClick={this.hideModelHandler}> 取消 </Button >, <Button key = "submit" type = "primary" size = "large" loading = {
    this.state.loading
  }
  onClick = {
    this.okHandler
  } > 保存 </Button > ])
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
          footer = {foot}>

          <Form horizontal onSubmit={this.okHandler} key={"alkdkdkdk"}>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品名字" >    {getFieldDecorator('name', { initialValue: name })(<Input size="small" />)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字" >    <TagsInput  value={this.state.tags} {...{ 'onlyUnique': true }} onChange={v => { this.setState({tags:v}) }} /></FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="商品分类" >
              {getFieldDecorator('category_num', { initialValue: typeof(category_num) !== "string" ? category_num : [category_num] })(<Cascader options={cascaderOptions} onChange={this.cascaderOnChange.bind(this)} expandTrigger="hover" placeholder='Please select' />)}
            </FormItem>
            {keyOptions}
            {otherOption}
            {sellOptions}
            {/*{sellOptions.length > 0 ? this.createTable() : ''}*/}
          </Form>
          <FormItem className={styles.FormItem} {...formItemLayout} label="产品介绍" >
              {getFieldDecorator('description', { rules: [{ required: true, message: '请输入产品介绍内容!' }], initialValue: description })
              (<Editor icons={icons} onChange={this.handleAlter.bind(this)} plugins={plugins} />)}
          </FormItem>
          <FormItem className={styles.FormItem} {...formItemLayout} label="产品备注" >
              {getFieldDecorator('note', { initialValue: note })
              (<textarea style={{width : "100%",height : "100px" , outline : "none"}}>{note}</textarea>)}
          </FormItem>
        </Modal>
      </span>
    );
  }

  createTable = () => {

    console.log(this.state.tableFormatData, '-----table Data----', this.state.columnsDatas)
    return <EditableTable key='editableTalbe' {...this.props} data={this.state.tableFormatData} columnsDatas={this.state.columnsDatas} getTableData={this.getTableData.bind(this)} />
  }

  /**获得格式化好的表数据 */
  getTableFormatData = (tableData) => {
    // let filterData = Object.keys(tableData)
    //   .filter(k => { return k.indexOf('_') !== -1 })
    //   .map(v => { return { key: v, value: tableData[v] } });
    let replace = true;
    if ( Array.isArray(this.keysValue)) {
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
        if (inner.unique_num === outer.unique_num) {
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
    return (ko.vital_type === "2" ?
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
componentWiiReceiveProps(nextProps){
  console.log('----====nextProps=======-----', nextProps);
  this.setState({checkOpts:this.getCheckOpts(nextProps)})
}

getCheckOpts(product){
  let ret = {};
  product.attributes && product.attributes.forEach(v => {
    if(product.attributeMap[v.attribute_num] && product.attributeMap[v.attribute_num].select_type === '4'){
      ret[v.attribute_num] = JSON.parse(v.value);
    }
  });
  return ret;
}
checkChangeHandler(_id,v){
  let checkOpts = this.state.checkOpts;
  checkOpts[_id] = v;
  this.setState({checkOpts})
}
  // const extendsObject = {"0":'不继承','1':'尺寸','2':'颜色','3':'原产地','4':'品牌'};
  //const stypeObject = {'1':'运营输入','2':'使用SKU配图','3':'下拉选项'};
  getComponentByType(ko, formItemLayout, getFieldDecorator, keys) {
    let options;
    let coms;
    if (ko.extends_type === '0') {
      if (ko.select_type === '3') {//下拉选项
        let temp_values = typeof ko.select_value === 'string' ?ko.select_value.split(",") :ko.select_value;
        options = temp_values.map(v => { return <Select.Option key={v} value={v}>{v}</Select.Option> });
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >
          {getFieldDecorator(ko._id, { initialValue: this.getInitialValue(ko) })(ko.vital_type === '2' ? <Select size="small" onChange={this.sellChange.bind(this)} {...{ defaultActiveFirstOption: true }} >{options}</Select> : <Select size="small" {...{ defaultActiveFirstOption: true }} >{options}</Select>)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.select_type === '1') {//运营输入
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >
          {getFieldDecorator(ko._id, { initialValue: this.getInitialValue(ko) })(ko.vital_type === '2' ? <Input size="small" onChange={this.sellChange.bind(this)} /> : <Input size="small" />)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.select_type === '2') {
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >
          {getFieldDecorator(ko._id, { initialValue: this.getInitialValue(ko) })(<span>使用SKU配图</span>)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.select_type === '4') {
        console.log(ko._id,'--------------------------------------');
        const temp = typeof ko.select_value === 'string' ? ko.select_value.split(','):ko.select_value;
        let value = this.state.checkOpts[ko._id] ? this.state.checkOpts[ko._id] : [];
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko._id} >
            <CheckboxGroup key={ko._id} options={temp} value={this.state.checkOpts[ko._id]} onChange={this.checkChangeHandler.bind(this,ko._id)}/>
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
    } else {
      if (ko.name === '尺寸') {//这个比较麻烦）
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
          {getFieldDecorator(ko.sellId || ko._id, { initialValue: this.getInitialValue(ko, 'sell') })(ko.vital_type === '2' ? <Cascader options={options} expandTrigger="hover" onChange={this.sellChange.bind(this)} placeholder='选择颜色' /> : <Cascader options={options} placeholder='Please select' />)}
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
          })(ko.vital_type === '2' ? <Select size="small" onBlur={this.sellChange.bind(this)}  {...{ defaultActiveFirstOption: true }} >{options}</Select> : <Select size="small" {...{ defaultActiveFirstOption: true }} >{options}</Select>)}
          {
            this.getSellHandle(ko, keys)
          }
        </FormItem>
      }
      else if (ko.name === '品牌') { //取值范围，在品牌当前分类对应的品牌中获取
        options = Object.values(this.props.product.brandMap).map(v => { return <Select.Option key={v._id} value={v._id}>{v.name_cn}</Select.Option> });
        return <FormItem className={styles.FormItem} {...formItemLayout} label={ko.name} key={ko.sellId || ko._id} >
          {getFieldDecorator(ko.sellId || ko._id, { initialValue: this.getInitialValue(ko, 'sell') })(ko.vital_type === '2' ? <Select size="small" onBlur={this.sellChange.bind(this)} {...{ defaultActiveFirstOption: true }} >{options}</Select> : <Select size="small" {...{ defaultActiveFirstOption: true }} >{options}</Select>)}
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

export default Form.create()(SpuEditModal);
