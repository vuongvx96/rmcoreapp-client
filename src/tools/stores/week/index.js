import { observable, action, computed, toJS } from 'mobx'
import { createTransformer } from 'mobx-utils'

class WeekStore {

	@observable weeks = createWeeks(new Date().getFullYear())

	@action onChangeYear = (year) => {
		this.weeks = createWeeks(year)
	}

	@computed get getWeeks() {
		return toJS(this.weeks)
	}

	@computed get getWeekDate() {
    return createTransformer(week => toJS(this.weeks.get(week)))
	}

	@computed get getMaxWeek() {
		return Math.max(...toJS(this.weeks.keys()))
	}
}

// ISO 8601 - week numbers

function findFirstMonday(year) {
	let startDate = new Date(year, 0, 1)
	if (startDate.getDay() === 1)
		return startDate
	else if (startDate.getDay() >= 1) {
		while (startDate.getDay() !== 1) {
			startDate.setDate(startDate.getDate() - 1)
		}
		return startDate
	} else {
		while (startDate.getDay() !== 1) {
			startDate.setDate(startDate.getDate() + 1)
		}
		return startDate
	}
}

function isLeapYear(year)
{
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}

function formatDDMMYYYY(dt) {
	let dd = dt.getDate()
	let mm = dt.getMonth() + 1
	const yyyy = dt.getFullYear()
	if (dd < 10) {
		dd = `0${dd}`
	}
	if (mm < 10) {
		mm = `0${mm}`
	}
	return `${dd}/${mm}/${yyyy}`
}

function createWeeks(year) {
	let data = new Map()
	let i = 1;
	let monday = findFirstMonday(year)
	let firstDate = new Date(year, 0, 1)
	let max = (firstDate.getDay() === 4 || (isLeapYear(firstDate.getFullYear()) && firstDate.getDay() === 3)) ? 53 : 52
	for (i = 1; i <= max; i++) {
		let m = formatDDMMYYYY(monday)
		monday.setDate(monday.getDate() + 6)
		data.set(i, [m, formatDDMMYYYY(monday)])
		monday.setDate(monday.getDate() + 1)
	}
	return data
}

export default new WeekStore()