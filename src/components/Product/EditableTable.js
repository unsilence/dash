import { Table, Input, Popconfirm, Form } from 'antd';
import React from 'react';
import NumericInput from './NumericInput';
var pinyin = require("pinyin");
const FormItem = Form.Item;

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
        comType: this.props.comType,
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            editable: nextProps.editable || false,
            comType: nextProps.comType,
        });
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextProps.value !== this.state.value;
    }
    handleChange(v) {
        let value = v.target ? v.target.value :v;
        this.setState({ value });
    }
    render() {
        const {  editable, comType } = this.state;
        let getFieldDecorator = this.props.getFieldDecorator
        let option;
        let value =this.state.value;
        if(!value)
        {
            value = ''
        }
        else{
            if(Array.isArray(value))
            {
                value = value.toString();
            }else if(typeof value === 'object'){
                value = JSON.stringify(value)
            }
        }
        if (comType === '0') {
            option = <div className="editable-row-text">
                {value}
            </div>
        }
        else if (comType === '1') {
            option = editable ?
                (<div>
                    <NumericInput
                        value={value}
                        onChange={e => this.handleChange(e)}
                    />
                </div>)
                :
                (<div className="editable-row-text">
                    {value}
                </div>)
        }
        else if (comType === '2') {
            option = editable ?
                (<div>
                    <Input
                        value={value}
                        onChange={e => this.handleChange(e)}
                    />
                </div>)
                :
                (<div className="editable-row-text">
                    {value}
                </div>)
        }

        return (
            <div>
                {option}
            </div>
        );


    }
}

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            data: []
        };
    }

    componentWillReceiveProps(nextProps) {
        let columnsDatas = nextProps.columnsDatas;
        let columns = this.createColumns(columnsDatas);
        this.setState({
            data: nextProps.data,
            columns: columns
        })

    }
    createColumns(columnsDatas) {
        let columnObject = {};
        columnsDatas.forEach(v => {
            columnObject[v.name] = v;
        });
        let columns = []
        let temp = Object.keys(columnObject);
        for (let key in temp) {
            let dataIndex = pinyin(temp[key], {
                style: pinyin.STYLE_NORMAL, // 设置拼音风格
                heteronym: false
            }).join('');
            columns.push({
                title: temp[key],
                dataIndex: dataIndex,
                sellId: temp[key].sellId,
                render: (text, record, index) => this.renderColumns(this.state.data, index, dataIndex, text),
            })
        }
        ['价格', '数量', '产品型号'].forEach(v => {
            let dataIndex = pinyin(v, {
                style: pinyin.STYLE_NORMAL, // 设置拼音风格
                heteronym: false
            }).join('');
            columns.push({
                title: v,
                dataIndex: dataIndex,
                render: (text, record, index) => this.renderColumns(this.state.data, index, dataIndex, text),
            })
        });
        columns.push({
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => {
                const { editable } = this.state.data[index].jiage;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    <a onClick={() => this.editDone(index, 'save')}>Save</a>
                                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                                        <a>Cancel</a>
                                    </Popconfirm>
                                </span>
                                :
                                <span>
                                    <a onClick={() => this.edit(index)}>Edit</a>
                                </span>
                        }
                    </div>
                );
            },
        });

        return columns;
    }

    renderColumns(data, index, key, text) {
        const { editable, status, comType } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (<EditableCell {...this.props}
            editable={editable}
            value={text}
            key={index}
            comType={comType}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
        />);
    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
        this.props.getTableData(data);
    }
    edit(index) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    editDone(index, type) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
                data[index][item].status = type;
            }
        });
        this.setState({ data }, () => {
            Object.keys(data[index]).forEach((item) => {
                if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                    delete data[index][item].status;
                }
            });
        });
    }
    render() {
        const { data } = this.state;

        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.state.columns;
        return <Table bordered dataSource={dataSource} columns={columns} />;
    }
}
