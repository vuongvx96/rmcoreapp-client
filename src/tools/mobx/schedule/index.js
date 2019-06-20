import { observable, action, runInAction, computed, toJS } from 'mobx'
import moment from 'moment'
import http from '../../axios'

class ScheduleStore {
    @observable scheduleByWeek = {
        morning: {
            0: null,
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null
        },
        afternoon: {
            0: null,
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null
        },
        evening: {
            0: null,
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null
        }
    }

    @observable scheduleWithDetails = []

    @observable loading = false
    @observable year = new Date().getFullYear()
    @observable week = new Date().getWeek()
    @observable roomId = 'G8-103'
    @observable days = new Array(7)
    @observable currentWeek = new Date().getWeek()
    @observable keyword = null

    @action getScheduleByWeek = async (fromDate, toDate, roomId) => {
        this.loading = true
        try {
            let params = {
                fromDate: fromDate,
                toDate: toDate,
                roomId: roomId
            }
            const response = await http.get('/schedule/week', { params })
            runInAction('fetch schedule by week', () => {
                if (response.status === 200) {
                    this.scheduleByWeek = response.data
                    this.year = response.data.year
                    this.week = response.data.week
                    this.roomId = response.data.roomId
                    let day = moment(response.data.fromDate, 'DD/MM/YYYY')
                    this.days = createDaysOfWeek(new Date(day))
                }
                this.loading = false
            })
        } catch (err) {
            this.loading = false
        }
    }

    @action getAllScheduleWithDetail = async (month, year) => {
        this.loading = true
        try {
            let params = {
                month: month,
                year: year
            }
            const response = await http.get('/schedule/viewlist', { params })
            runInAction('fetch schedule with detail', () => {
                if (response.status === 200) {
                    this.scheduleWithDetails = response.data
                    this.loading = false
                }
            })
        } catch (err) {
            this.loading = false
        }
    }

    @action changeWeek = (week) => {
        this.currentWeek = week
    }

    @action changeKeyword = (value) => {
        this.keyword = value
    }

    @computed get getScheduleByWeekJS() {
        return toJS(this.scheduleByWeek)
    }

    @computed get getScheduleWithDetailsJS() {
        let data = toJS(this.scheduleWithDetails)
        if (!!this.keyword) {
            let keyword = this.keyword.toLowerCase()
            data = data.filter(item => (item.groupPractice.teacher.lastName + ' ' + item.groupPractice.teacher.firstName).toLowerCase().indexOf(keyword) >= 0 ||
                item.groupPractice.classId.toLowerCase().indexOf(keyword) >= 0 ||
                item.description.toLowerCase().indexOf(keyword) >= 0 ||
                item.groupPractice.subject.subjectName.toLowerCase().indexOf(keyword) >= 0
            )
        }
        return data
    }

    @computed get daysOfWeek() {
        return toJS(this.days)
    }

}

// eslint-disable-next-line no-extend-native
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

function createDaysOfWeek(startDate) {
    let data = []
    for (let i = 1; i <= 7; i++) {
        let dd = startDate.getDate()
        let mm = startDate.getMonth() + 1
        if (dd < 10) {
            dd = `0${dd}`
        }
        if (mm < 10) {
            mm = `0${mm}`
        }
        data.push(`${dd}/${mm}`)
        startDate.setDate(startDate.getDate() + 1)
    }
    return data
}

export default new ScheduleStore()