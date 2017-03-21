import { Table, Input, Popconfirm } from 'antd';
import React from 'react';
var pinyin = require("pinyin");

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    }
    componentWillReceiveProps(nextProps) {
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
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                            />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
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
        let filterData = Object.keys(this.props.data).filter(k => { return k.indexOf('_') !== -1 }).map(v => { return this.props.data[v] });
        let columnsDatas = this.props.data.keys;
        let columnObject = {};
        columnsDatas.forEach(v => {
            columnObject[v.name] = v;
        });
        let columns = []
        let temp = Object.keys(columnObject);
        for (let key in temp) {
            columns.push({
                title: temp[key],
                dataIndex: pinyin(temp[key], {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格
                    heteronym: true
                }).join(''),
                width: '25%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, column.sellId, text),
            })
        }

        ['价格', '数量', '产品型号', 'Operation'].forEach(v => columns.push({
            title: v,
            dataIndex: pinyin(v, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格
                    heteronym: true
                }).join(''),
            width: '25%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, column.sellId, text),
        }));
        ['价格', '数量', '产品型号', 'Operation'].forEach(v => 
           console.log(pinyin(v, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格
                    heteronym: true
                }).join('')
        ))
        console.log(columns, '-------------columns---------')
        // columnsDatas.map(column => {
        //     return {
        //         title: column.name,
        //         dataIndex: column.sellId,
        //         width: '25%',
        //         render: (text, record, index) => this.renderColumns(this.state.data, index, column.sellId, text),
        //     }
        // });
        // return ;
        this.setState({
            columns: columns
        })

    }

    shouldComponentUpdate(nextProps, nextState) {
        // if(this.state.columns.length === nextState.columns.length)
        // {
        //     return false;
        // }
        // else{
        //     return true;
        // }
        return true;

    }

    componentWillMount() {
    }


    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (<EditableCell
            editable={editable}
            value={text}
            key={index}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
        />);
    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
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

function doExchange(doubleArrays) {
	var len = doubleArrays.length
		if (len >= 2) {
			var len1 = doubleArrays[0].length
				var len2 = doubleArrays[1].length
				var newlen = len1 * len2
				var temp = new Array(newlen)
				var index = 0
				for (var i = 0; i < len1; i++) {
					for (var j = 0; j < len2; j++) {
						temp[index] = doubleArrays[0][i] + "$" + doubleArrays[1][j]
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