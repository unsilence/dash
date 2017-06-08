import React, {Component} from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  TreeSelect,
  Icon,
  Upload
} from 'antd';
import styles from '../item.less';
import {getFormatData} from '../utils';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const brandLetter = [
  {
    key: "1",
    value: "A"
  }, {
    key: "2",
    value: "B"
  }, {
    key: "3",
    value: "C"
  }, {
    key: "4",
    value: "D"
  }, {
    key: "5",
    value: "E"
  }, {
    key: "6",
    value: "F"
  }, {
    key: "7",
    value: "G"
  }, {
    key: "8",
    value: "H"
  }, {
    key: "9",
    value: "I"
  }, {
    key: "10",
    value: "J"
  }, {
    key: "11",
    value: "K"
  }, {
    key: "12",
    value: "L"
  }, {
    key: "13",
    value: "M"
  }, {
    key: "14",
    value: "N"
  }, {
    key: "15",
    value: "O"
  }, {
    key: "16",
    value: "P"
  }, {
    key: "17",
    value: "Q"
  }, {
    key: "18",
    value: "R"
  }, {
    key: "19",
    value: "S"
  }, {
    key: "20",
    value: "T"
  }, {
    key: "21",
    value: "U"
  }, {
    key: "22",
    value: "V"
  }, {
    key: "23",
    value: "W"
  }, {
    key: "24",
    value: "X"
  }, {
    key: "25",
    value: "Y"
  }, {
    key: "26",
    value: "Z"
  }
];
const brandcounty = [
  {
    key: "1",
    value: "中国"
  }, {
    key: "2",
    value: "美国"
  }, {
    key: "3",
    value: "日本"
  }, {
    key: "4",
    value: "德国"
  }, {
    key: "5",
    value: "法国"
  }, {
    key: "6",
    value: "英国"
  }
];
class BrandEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      disabled: false,
      tags: [],
      value: "58c8f5cf1c74a5278ad3e404",
      imageUrl: this.props.banner
        ? this.props.banner.image
        : null
    };
  }

  showModelHandler = (e) => {
    if (e) 
      e.stopPropagation();
    this.setState({visible: true});
  };

  hideModelHandler = () => {
    this.setState({visible: false});
    this
      .props
      .form
      .resetFields([
        'name_cn',
        'name_en',
        'shortcut',
        'initial',
        'category_num',
        'description',
        'logo',
        'country_num',
        'key',
        'brand_info'
      ])
  };
  onChange = (value) => {
    console.log('onChange ', value, arguments);
    this.setState({value: value});
  }
  okHandler = () => {
    const {onOk} = this.props;
    this
      .props
      .form
      .validateFields((err, values) => {
        if (!err) {
          console.log(values);
          values.logo = this.state.imageUrl;
          onOk(values);
          this.hideModelHandler();
        }
      });
  };
  handleChange = (info) => {
    if (info.file.status === 'done') {
      this.setState({imageUrl: info.file.response.md5list[0]});
    } else if (info.file.status === 'removed') {
      this.setState({imageUrl: null});
    }
  }

  render() {
    const {children} = this.props;
    const brandCountry = brandcounty.map(t =><Option value = {
      t.value
    } > {
      t.value
    } </Option>);
    const brandFirstletter = brandLetter.map(a=><Option value={a.value}>{a.value}</Option >);
    const {getFieldDecorator} = this.props.form;
    const {record} = this.props;
    console.log(record);
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl || this.props.record.logo;
    let data = [];
    (this.props.record.categoryList || []).forEach(v => data.unshift(v));
    let treeData = getFormatData(data);
    const tProps = {
      treeData,
      onChange: this
        .onChange
        .bind(this),
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select'
    };
    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title={record._id
          ? "修改："
          : '新建'}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}>
          <Form horizontal onSubmit={this.okHandler} ref='brandfrom'>
            <FormItem className={styles.FormItem} {...formItemLayout} label="中文品牌名称">
              {getFieldDecorator('name_cn', {
                rules: [
                  {
                    required: true,
                    message: '请输入中文品牌名称!'
                  }
                ],
                initialValue: record.name_cn
              })(<Input size="small"/>)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="英文品牌名称">
              {getFieldDecorator('name_en', {
                rules: [
                  {
                    required: true,
                    message: '请输入英文品牌名称!'
                  }
                ],
                initialValue: record.name_en
              })(<Input size="small"/>)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌缩写">
              {getFieldDecorator('shortcut', {
                rules: [
                  {
                    required: true,
                    message: '请输入品牌缩写!'
                  }
                ],
                initialValue: record.shortcut
              })(<Input size="small"/>)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌首字母">
              {getFieldDecorator('initial', {
                rules: [
                  {
                    required: true,
                    message: '请选择品牌首字母!'
                  }
                ],
                initialValue: record.initial
              })(
                <Select size="large">
                  {brandFirstletter}
                </Select>
              )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌所属分类">
              {getFieldDecorator('category_num', {
                rules: [
                  {
                    required: true,
                    message: '请选择品牌所属分类!'
                  }
                ],
                initialValue: record.category_num
              })(<TreeSelect {...tProps}/>)}
            </FormItem>

            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌介绍">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: '请输入品牌介绍!'
                  }
                ],
                initialValue: record.description
              })(<Input size="small"/>)}</FormItem>

            < FormItem className={styles.FormItem} { ...formItemLayout } label="品牌LOGO">
              <Upload
                multiple={true}
                action='/api/file/upload'
                showUploadList={false}
                listType="picture-card"
                onChange={this.handleChange}>
                {imageUrl
                  ? <img
                      style={{
                      width: "50px",
                      heigth: "50px"
                    }}
                      src={'/api/file/' + imageUrl}/>
                  : uploadButton
}
              </Upload>
            </FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌定义">
              {getFieldDecorator('brand_info', {
                rules: [
                  {
                    required: true,
                    message: '请输入品牌定义!'
                  }
                ],
                initialValue: record.brand_info
              })(<Input size="small"/>)}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="品牌国家">
              {getFieldDecorator('country_num', {
                rules: [
                  {
                    required: true,
                    message: '请选择品牌国家!'
                  }
                ],
                initialValue: record.country_num
              })(
                <Select size="large" defaultValue="中国">
                  {brandCountry}
                </Select>
              )}</FormItem>
            <FormItem className={styles.FormItem} {...formItemLayout} label="搜索关键字">
              {getFieldDecorator('qtext', {
                rules: [
                  {
                    required: true,
                    message: '请输入搜索关键字!'
                  }
                ],
                initialValue: record.qtext||[]
              })(<TagsInput
                value={[]}
                {...{ 'onlyUnique': true }}
                onChange={v => {
                console.log(v)
              }}/>)}</FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(BrandEditModal);
