import React from 'react';
import { Input } from 'antd';
import NumericInput from './NumericInput';

export default class SizeInput extends React.Component {
    constructor(props) {
        super(props);
        const value = this.props.value || {};
        this.state = {
            chang: value.chang,
            kuan: value.kuan,
            gao: value.gao,
            banjing: value.banjing,
        };
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            if (value) {
                this.setState(value);
            }
        }
    }
    handleNumberChange = (e, key) => {
        const number = parseInt(e.target.value || 0, 10);
        if (isNaN(number)) {
            return;
        }
        if (!key) (key = 'chang');
        let state = {};
        if (!(`'${key}'` in this.props)) {

            state[key] = number;
            this.setState(state);
        }
        this.triggerChange(state);
    }
    handleKuanChange = (e) => {

        this.handleNumberChange(e, 'kuan');
    }
    handleGaoChange = (e) => {
        this.handleNumberChange(e, 'gao');
    }
    handleBanjingChange = (e) => {
        this.handleNumberChange(e, 'banjing');
    }
    handleCurrencyChange = (currency) => {
        if (!('value' in this.props)) {
            this.setState({ currency });
        }
        this.triggerChange({ currency });
    }
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }
    render() {
        const { size } = this.props;
        const state = this.state;
        return (
            <span>
                <Input
                    type="text"
                    size={size}
                    value={state.chang}
                    placeholder='长'
                    onChange={this.handleNumberChange}
                    onBlur={this.props.onBlur}
                    style={{ width: '50px', marginRight: '3%' }}
                />
                <Input
                    type="text"
                    size={size}
                    value={state.kuan}
                    placeholder='宽'
                    onBlur={this.props.onBlur}
                    onChange={this.handleKuanChange}
                    style={{ width: '50px', marginRight: '3%' }}
                />
                <Input
                    type="text"
                    size={size}
                    value={state.gao}
                    placeholder='高'
                    onBlur={this.props.onBlur}
                    onChange={this.handleGaoChange}
                    style={{ width: '50px', marginRight: '3%' }}
                />
                <Input
                    type="text"
                    size={size}
                    value={state.banjing}
                    onBlur={this.props.onBlur}
                    placeholder='半径'
                    onChange={this.handleBanjingChange}
                    style={{ width: '50px', marginRight: '3%' }}
                />
            </span>
        );
    }
}