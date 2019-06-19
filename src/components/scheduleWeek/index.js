import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import {
	Card,
	Select,
	Button,
	Divider,
	Row,
	Col,
	Spin,
	Popover,
	Icon,
	Menu,
	Dropdown
} from 'antd'

import './index.less'

const menu = (
	<Menu>
		<Menu.Item key='0'>
			<Link>Đăng ký lịch</Link>
		</Menu.Item>
	</Menu>
)

@inject('weekStore', 'roomStore', 'scheduleStore')
@observer
class ScheduleWeek extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentYear: getYear(),
			currentRoom: 'G8-103'
		}
	}

	handleYearChange = value => {
		this.setState({ currentYear: value })
		this.props.weekStore.onChangeYear(value)
	}

	handleWeekChange = value => {
		this.props.scheduleStore.changeWeek(value)
	}

	handleViewSchedule = () => {
		const { currentRoom } = this.state
		const { currentWeek } = this.props.scheduleStore
		const week = this.props.weekStore.getWeekDate(currentWeek)
		this.props.scheduleStore.getScheduleByWeek(week[0], week[1], currentRoom)
	}

	componentDidMount() {
		document.title = 'Lịch phòng máy - ' + this.props.route.displayName
		this.props.roomStore.fetchAll()
		const { currentWeek } = this.props.scheduleStore
		const week = this.props.weekStore.getWeekDate(currentWeek)
		this.props.scheduleStore.getScheduleByWeek(week[0], week[1], this.state.currentRoom)
	}

	render() {
		const { getWeeks, getMaxWeek } = this.props.weekStore
		const { listRoomIds } = this.props.roomStore
		const { getScheduleByWeekJS, daysOfWeek, week, year, roomId, currentWeek, loading } = this.props.scheduleStore
		return (
			<>
				<h3 style={{ color: '#008080', fontWeight: 'bold' }}>
					{`TUẦN THỨ ${week} - NĂM ${year} - PHÒNG MÁY: ${roomId}`}
				</h3>
				<div className='flex-container'>
					<div className='left-items'>
						<span>Năm</span>
						<Select defaultValue={year} style={{ width: 85 }} onChange={this.handleYearChange}>
							{
								_.range(getYear() - 3, getYear() + 10).map(
									i => (
										<Select.Option key={i} value={i}>{i}</Select.Option>
									))
							}
						</Select>
						<span>Chọn tuần</span>
						<Select style={{ width: 270 }} value={currentWeek} defaultValue={week} onChange={this.handleWeekChange}>
							{
								Object.keys(getWeeks).map(item => (
									<Select.Option key={Number(item)} value={Number(item)}>{`${item} (${getWeeks[item][0]} - ${getWeeks[item][1]})`}</Select.Option>
								))
							}
						</Select>
						<span>Phòng máy</span>
						<Select style={{ width: 100 }} defaultValue={roomId} onChange={(value) => this.setState({ currentRoom: value })}>
							{
								listRoomIds.map(item => (
									<Select.Option key={item} value={item}>{item}</Select.Option>
								))
							}
						</Select>
						<Divider type='vertical' style={{ border: '1px solid #828282', height: '1.9em', margin: '0px 15px 0px 7px' }} />
						<Button icon='search' onClick={this.handleViewSchedule}>
							Xem
						</Button>
						<Button disabled={currentWeek <= 1} onClick={() => {
							this.props.scheduleStore.changeWeek(currentWeek - 1)
							this.handleViewSchedule()
						}}>
							Tuần trước
						</Button>
						<Button disabled={currentWeek >= getMaxWeek} onClick={() => {
							this.props.scheduleStore.changeWeek(currentWeek + 1)
							this.handleViewSchedule()
						}}>
							Tuần sau
						</Button>
					</div>
				</div>
				<Spin tip='Loading...' spinning={loading}>
					<div className='table-schedule'>
						<Row className='title'>
							<Col span={3}><span>Giờ</span></Col>
							<Col span={3}><span>Thứ 2 - {daysOfWeek[0]}</span></Col>
							<Col span={3}><span>Thứ 3 - {daysOfWeek[1]}</span></Col>
							<Col span={3}><span>Thứ 4 - {daysOfWeek[2]}</span></Col>
							<Col span={3}><span>Thứ 5 - {daysOfWeek[3]}</span></Col>
							<Col span={3}><span>Thứ 6 - {daysOfWeek[4]}</span></Col>
							<Col span={3}><span>Thứ 7 - {daysOfWeek[5]}</span></Col>
							<Col span={3}><span>Chủ nhật - {daysOfWeek[6]}</span></Col>
						</Row>
						<Row type='flex' align='middle' className='data'>
							<Col span={3} className='timeblock'><span>Sáng</span></Col>
							{
								[1, 2, 3, 4, 5, 6, 0].map(x => {

									const schedule = _.isNil(getScheduleByWeekJS.morning) ? null : getScheduleByWeekJS.morning[x]
									return (
										<Col span={3} key={x}>
											{
												_.isNil(schedule)
													? (
														<Card extra={
															<Dropdown overlay={menu} trigger={['click']}>
																<Icon type='more' />
															</Dropdown>
														} />
													)
													: (
														<Popover
															placement='leftTop'
															title='Thông tin'
															content={
																<ul style={{ listStyleType: 'square' }}>
																	<li>GV: <b>{`${schedule.groupPractice.teacher.lastName} ${schedule.groupPractice.teacher.firstName}`}</b></li>
																	<li>Mã MH: <b>{schedule.groupPractice.subject.subjectId}</b></li>
																	<li>Tên MH: <b>{schedule.groupPractice.subject.subjectName}</b></li>
																	<li>Lớp: <b>{schedule.groupPractice.classId}</b></li>
																	<li>Sĩ số: <b>{schedule.groupPractice.classSize}</b></li>
																</ul>
															}
														>
															<Card>
																{
																	schedule.groupPractice.subject.subjectName.concat(' - ')
																		.concat(schedule.groupPractice.classId).concat(' - ')
																		.concat(schedule.groupPractice.teacher.gender ? 'T. ' : 'C. ')
																		.concat(schedule.groupPractice.teacher.firstName)
																}
															</Card>
														</Popover>
													)
											}
										</Col>
									)
								})
							}
						</Row>
						<Row type='flex' align='middle' className='data'>
							<Col span={3} className='timeblock'><span>Chiều</span></Col>
							{
								[1, 2, 3, 4, 5, 6, 0].map(x => {
									const schedule = _.isNil(getScheduleByWeekJS.morning) ? null : getScheduleByWeekJS.afternoon[x]
									return (
										<Col span={3} key={x}>
											{
												_.isNil(schedule)
													? (
														<Card extra={
															<Dropdown overlay={menu} trigger={['click']}>
																<Icon type='more' />
															</Dropdown>
														} />
													)
													: (
														<Popover
															placement='leftTop'
															title='Thông tin'
															content={
																<ul style={{ listStyleType: 'square' }}>
																	<li>GV: <b>{`${schedule.groupPractice.teacher.lastName} ${schedule.groupPractice.teacher.firstName}`}</b></li>
																	<li>Mã MH: <b>{schedule.groupPractice.subject.subjectId}</b></li>
																	<li>Tên MH: <b>{schedule.groupPractice.subject.subjectName}</b></li>
																	<li>Lớp: <b>{schedule.groupPractice.classId}</b></li>
																	<li>Sĩ số: <b>{schedule.groupPractice.classSize}</b></li>
																</ul>
															}
														>
															<Card>
																{
																	schedule.groupPractice.subject.subjectName.concat(' - ')
																		.concat(schedule.groupPractice.classId).concat(' - ')
																		.concat(schedule.groupPractice.teacher.gender ? 'T. ' : 'C. ')
																		.concat(schedule.groupPractice.teacher.firstName)
																}
															</Card>
														</Popover>
													)
											}
										</Col>
									)
								})
							}
						</Row>
						<Row type='flex' align='middle' className='data'>
							<Col span={3} className='timeblock'><span>Tối</span></Col>
							{
								[1, 2, 3, 4, 5, 6, 0].map(x => {
									const schedule = _.isNil(getScheduleByWeekJS.morning) ? null : getScheduleByWeekJS.evening[x]
									return (
										<Col span={3} key={x}>
											{
												_.isNil(schedule)
													? (
														<Card extra={
															<Dropdown overlay={menu} trigger={['click']}>
																<Icon type='more' data-day={x} />
															</Dropdown>
														} />
													)
													: (
														<Popover
															placement='leftTop'
															title='Thông tin'
															content={
																<ul style={{ listStyleType: 'square' }}>
																	<li>GV: <b>{`${schedule.groupPractice.teacher.lastName} ${schedule.groupPractice.teacher.firstName}`}</b></li>
																	<li>Mã MH: <b>{schedule.groupPractice.subject.subjectId}</b></li>
																	<li>Tên MH: <b>{schedule.groupPractice.subject.subjectName}</b></li>
																	<li>Lớp: <b>{schedule.groupPractice.classId}</b></li>
																	<li>Sĩ số: <b>{schedule.groupPractice.classSize}</b></li>
																</ul>
															}
														>
															<Card>
																{
																	schedule.groupPractice.subject.subjectName.concat(' - ')
																		.concat(schedule.groupPractice.classId).concat(' - ')
																		.concat(schedule.groupPractice.teacher.gender ? 'T. ' : 'C. ')
																		.concat(schedule.groupPractice.teacher.firstName)
																}
															</Card>
														</Popover>
													)
											}
										</Col>
									)
								})
							}
						</Row>
					</div>
				</Spin>
			</>
		)
	}
}

function getYear() {
	return new Date().getFullYear()
}

export default ScheduleWeek
