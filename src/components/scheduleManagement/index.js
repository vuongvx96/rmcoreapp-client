import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Card, Select, Button, Divider, Row, Col } from 'antd'

import './index.less'

@inject('weekStore', 'roomStore')
@observer
class ScheduleManagement extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentYear: getYear()
		}
	}

	handleYearChange = value => {
		this.props.weekStore.onChangeYear(value)
	}

	handleWeekChange = value => {
		this.props.weekStore.onChangeWeek(value)
	}

	componentDidMount() {
		this.props.roomStore.fetchAll()
		this.props.weekStore.onChangeWeek(new Date().getWeek())
	}

	render() {
		const { weeks, daysOfWeek } = this.props.weekStore
		const rooms = this.props.roomStore.entities
		return (
			<>
				<div className='flex-container'>
					<div className='left-items'>
						<span>Năm</span>
						<Select defaultValue={getYear()} style={{ width: 85 }} onChange={this.handleYearChange}>
							{
								_.range(getYear() - 3, getYear() + 10).map(
									i => (
										<Select.Option key={i} value={i}>{i}</Select.Option>
									))
							}
						</Select>
						<span>Chọn tuần</span>
						<Select style={{ width: 270 }} defaultValue={new Date().getWeek()} onChange={this.handleWeekChange}>
							{
								[...weeks].map(([key, value]) => (
									<Select.Option key={key} value={key}>{`${key} (${value[0]} - ${value[1]})`}</Select.Option>
								))
							}
						</Select>
						<span>Phòng máy</span>
						<Select style={{ width: 100 }} defaultValue='G8-101'>
							{
								[...rooms].map(([key, value]) => (
									<Select.Option key={key} value={key}>{key}</Select.Option>
								))
							}
						</Select>
						<Divider type='vertical' style={{ border: '1px solid #828282', height: '1.9em', margin: '0px 15px 0px 7px' }} />
						<Button icon='search'>Xem</Button>
						<Button>Tuần trước</Button>
						<Button>Tuần sau</Button>
					</div>
				</div>
				<div className='table-schedule'>
					<Row className='title'>
						<Col span={2}><span>Giờ</span></Col>
						<Col span={3}><span>Thứ 2 - {daysOfWeek[0]}</span></Col>
						<Col span={3}><span>Thứ 3 - {daysOfWeek[1]}</span></Col>
						<Col span={3}><span>Thứ 4 - {daysOfWeek[2]}</span></Col>
						<Col span={3}><span>Thứ 5 - {daysOfWeek[3]}</span></Col>
						<Col span={3}><span>Thứ 6 - {daysOfWeek[4]}</span></Col>
						<Col span={3}><span>Thứ 7 - {daysOfWeek[5]}</span></Col>
						<Col span={4}><span>Chủ nhật - {daysOfWeek[6]}</span></Col>
					</Row>
					<Row type='flex' align='middle' className='data'>
						<Col span={2}><span>Sáng</span></Col>
						<Col span={3}>
							<Card title='Tin học cơ sở và thực hành'>
								<div>GV: Thành</div>
								<div>Lớp: 57TH1</div>
							</Card>
						</Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={4}><Card title='Tin học cơ sở'></Card></Col>
					</Row>
					<Row type='flex' align='middle' className='data'>
						<Col span={2}><span>Chiều</span></Col>
						<Col span={3}>
							<Card title='Tin học cơ sở'>
								<div>GV: Thành</div>
								<div>Lớp: 57TH1</div>
							</Card>
						</Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={4}><Card title='Tin học cơ sở'></Card></Col>
					</Row>
					<Row type='flex' align='middle' className='data'>
						<Col span={2}><span>Tối</span></Col>
						<Col span={3}>
							<Card title='Tin học cơ sở'>
								<div>GV: Thành</div>
								<div>Lớp: 57TH1</div>
							</Card>
						</Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={3}><Card title='Tin học cơ sở'></Card></Col>
						<Col span={4}><Card title='Tin học cơ sở'></Card></Col>
					</Row>
				</div>
			</>
		)
	}
}

function getYear() {
	return new Date().getFullYear()
}

Date.prototype.getWeek = function () {
	var target = new Date(this.valueOf())
	var dayNr = (this.getDay() + 6) % 7
	target.setDate(target.getDate() - dayNr + 3)
	var firstThursday = target.valueOf()
	target.setMonth(0, 1)
	if (target.getDay() !== 4) {
		target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
	}
	return 1 + Math.ceil((firstThursday - target) / 604800000)
}

export default ScheduleManagement