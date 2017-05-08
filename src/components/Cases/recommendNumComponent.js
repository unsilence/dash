import React, { Component } from 'react';
import { Input , Button , Row , Col , Popover} from "antd";

export default class RecommendNum extends Component {
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
                    title={this.state.PopoverText} 
                    content={<div>
								<Input placeholder="请输入整数" type="number" onChange={this.changeHandler} value={this.state.recommendNum}/>
								<p>注：日期越接近当前日期，排名越靠前；相同日期，系数越大排名与靠前</p>
								<Row>
								    <Col span={2} offset={11}><Button onClick={this.okHandler}>确定</Button></Col>
								</Row>
							</div>} 
                    trigger="click"
                    visible={this.state.visible} 
                    onVisibleChange={this.visibleHandler}>
                    	<Button>推荐</Button>
                    </Popover>
		    </span>
			)
	}
}