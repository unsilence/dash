import React, { Component } from 'react';
import { Input , Button , Row , Col , Popover} from "antd";

export default class Propelling extends Component {
	constructor (props) {
		super(props);

		this.state={
			recommendNum : "",
			visible : false,
			PopoverText : "设置推荐系数"
		}
	}
	changeHandler = (e) => {
		this.setState({
			recommendNum : e.target.value
		})
	}
	okHandler = () => {
		const { dispatch } = this.props;
		this.setState({
	      visible: false,
	    });
	}
	visibleHandler = (visible ) => {
		this.setState({
			visible 
		})
	}
	render () {
		return (
			<span>
				<Popover  placement="left" 
                    content={<div>
								<Row>
								    <Button style={{width : "100%"}}>首页banner</Button>
								</Row>
								<Row>
								    <Button style={{width : "100%"}}>首页场景推荐</Button>
								</Row>
								<Row>
								    <Button style={{width : "100%"}}>复制URL</Button>
								</Row>
							</div>} 
                    trigger="click"
                    visible={this.state.visible} 
                    onVisibleChange={this.visibleHandler}>
                    	<Button>推送至</Button>
                    </Popover>
		    </span>
			)
	}
}