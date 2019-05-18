import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Select } from 'antd'

@inject('weekStore')
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

	render() {
		const { weeks } = this.props.weekStore
		return (
			<div className='flex-container'>
				<div className='left-items'>
					<span>Năm:</span>
					<Select defaultValue={getYear()} style={{ width: 100 }} onChange={this.handleYearChange}>
						{
							_.range(getYear() - 3, getYear() + 10).map(
								i => (
									<Select.Option key={i} value={i}>{i}</Select.Option>
								))
						}
					</Select>
					<span>Chọn tuần:</span>
					<Select style={{ width: 300 }} defaultValue={new Date().getWeek()}>
						{
							[...weeks].map(([key, value]) => (
								<Select.Option key={key} value={key}>{`${key} (${value[0]} - ${value[1]})`}</Select.Option>
							))
						}
					</Select>
				</div>
			</div>
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