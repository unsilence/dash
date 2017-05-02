import React , { Component }from 'react';
import { DatePicker , Button ,Row ,Col} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
export default class TestDiv extends Component {

	onChange = (date, dateString) => {
		console.log(date, dateString);
	}

	render () {
		return (
			<div style={{background : "#fff" , border : "1px solid #eee" , width : "300px"}}>
				<Row style={{marginTop : "20px"}}>
					<Col span={20} offset={2}>
						<RangePicker onChange={this.onChange} style={{width : "250px"}}/>
					</Col>
				</Row>
				<Row style={{marginTop : "20px" , marginBottom : "20px"}}>
					<Col span={12} offset={10}><Button>确认搜索</Button></Col>
				</Row>
			</div>
			)
		}
	}