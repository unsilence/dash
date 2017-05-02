import React, { Component } from 'react';
import { Modal ,Row ,Col  , Button } from 'antd';



export default class AuditModal extends Component{
	constructor (props) {
		super(props);
		this.state={
			visible : false
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

		pass(textValue);
		this.setState({
			visible : false
		})
	}
	hideModelHandler = (e) => {
		if (e) e.stopPropagation();
		const { noPass } = this.props;

		const textValue = this.refs.textarea.value  // 获取textarea里填写的内容
		noPass(textValue);
		this.setState({
			visible : false
		})
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
						onOk={this.okHandler}
	          			onCancel={this.hideModelHandler}
	          			okText="通过"
	          			cancelText="不通过"
					>
						<textarea ref="textarea" style={{width : "100%" , height : "100px"}} placeholder="此处填写不通过原因"></textarea>
					</Modal>
				</span>
			)
	}

}