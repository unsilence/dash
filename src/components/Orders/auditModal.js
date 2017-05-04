import React, { Component } from 'react';
import { Modal ,Row ,Col  , Button , Alert} from 'antd';

import * as utils from "../utils.js";



export default class AuditModal extends Component{
	constructor (props) {
		super(props);
		this.state={
			visible : false,
			alert : ""
		}
	}
	showHandler = (e) => {
		if (e) e.stopPropagation();
		this.setState({
			visible : true
		})
	}
	okHandler = (e) => {
		if (e) e.stopPropagation();
		const { pass } = this.props;

		const textValue = this.refs.textarea.value  // 获取textarea里填写的内容

		pass(utils.trim(textValue));
		this.setState({
			visible : false,
			alert : ""
		})
	}
	hideModelHandler = (e) => {
		if (e) e.stopPropagation();
		this.setState({
			visible : false,
			alert : ""
		})
	}
	_noPassHandler = (e) => {
		if (e) e.stopPropagation();
		const { noPass } = this.props;

		const textValue = this.refs.textarea.value  // 获取textarea里填写的内容
		if(utils.trim(textValue).length > 0) {
			noPass(textValue);
			this.setState({
				visible : false,
				alert : ""
			})
		}else{
			this.setState({
				alert : <Alert
						    message="警告"
						    description="请填写不通过原因！"
						    type="warning"
						    showIcon
						    closable
						 />
			})
		}
	}
	render () {
		const { children } = this.props;
		return (
				<span>
					<span onClick={this.showHandler}>
						{children}
					</span>
					<Modal
						title="审核订单结果"
						visible={this.state.visible}
	          			onCancel={this.hideModelHandler}
	          			okText="通过"
	          			cancelText="不通过"
	          			maskClosable={false}
	          			footer={
	          				<Row type="flex" justify="center" gutter={50}>
								<Col><Button onClick={this._noPassHandler}>不通过</Button></Col>
								<Col><Button onClick={this.okHandler}>通过</Button></Col>
	          				</Row>
	          			}
					>
						<textarea ref="textarea" style={{width : "100%" , height : "100px"}} placeholder="此处填写不通过原因"></textarea>
						{this.state.alert}
					</Modal>
				</span>
			)
	}

}