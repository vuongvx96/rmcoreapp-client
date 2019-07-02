import { observable, action, runInAction, computed, toJS } from 'mobx'
import _ from 'lodash'
import http from '../../axios'

class TeacherScheduleStore {

  @observable rooms = new Map()
  @observable groups = new Map()
  @observable groupId = null
  @observable room = null
  @observable roomId = null
  @observable checking = false
  @observable year = new Date().getFullYear()
  @observable semester = 1

  @action fetchAllRoom = async () => {
		try {
			const response = await http.get('/rooms')
			runInAction('fetch all entities', () => {
				this.rooms = new Map(response.data.map(i => [i.roomId, i]))
			})
			return response
		} catch (err) {
			return err
		}
  }
  
  @action fetchAllGroup = async() => {
    try {
      let params = {
        semester: this.semester,
        year: this.year
      }
      
      const response = await http.get('/courses/byteacher', { params })
      if (response.status === 200) {
        this.groups = new Map(response.data.map(i => [i.groupId, i]))
      }
      return response
    } catch (err) {
      return err
    }
  }

  @action checkValid = async (schedule) => {
    this.checking = true
    try {
      let obj = Object.assign({}, schedule)
      obj.startDate = schedule.startDate.format('YYYY-MM-DD HH:mm:ss')
      obj.endDate = schedule.endDate.format('YYYY-MM-DD HH:mm:ss')
      if (_.isNil(obj.scheduleId))
        delete obj.scheduleId
      const response = await http.post('/schedule/checkvalid', obj)
      runInAction('check schedule is valid', () => {
        this.checking = false
      })
      return response
    } catch (err) {
      this.checking = false
      return err
    }
  }

  @action checkSameTime = async (schedule) => {
    this.processing = true
    try {
      let obj = Object.assign({}, schedule)
      obj.startDate = schedule.startDate.format('YYYY-MM-DD HH:mm:ss')
      obj.endDate = schedule.endDate.format('YYYY-MM-DD HH:mm:ss')
      if (_.isNil(obj.scheduleId))
        delete obj.scheduleId
      const response = await http.post('/schedule/checksametime', obj)
      runInAction('check schedule is same time', () => {
        this.processing = false
      })
      return response
    } catch (err) {
      this.processing = false
      return err.response
    }
  }

  @action changeGroup = (id) => {
    this.groupId = id
  }

  @action changeRoom = async (id) => {
    this.roomId = id
    try {
      const response = await http.get(`/rooms/detail/${id}`)
      if (response.status === 200) {
        this.room = response.data
      }
      else {
        this.room = null
      }
    } catch (err) {
      this.room = null
    }
  }

  @action changeYear = (year) => {
    this.year = year
  }

  @action changeSemester = (semester) => {
    this.semester = semester
  }

  @computed get listRoomIds() {
		let keys = []
		for (const k of this.rooms.keys()) {
			keys.push(k)
		}
		return keys
  }
  
  @computed get listGroups() {
    return Object.values(toJS(this.groups))
  }

  @computed get currentGroup() {
    return toJS(this.groups.get(this.groupId))
  }

  @computed get currentRoom() {
    return toJS(this.room)
  }
}

export default new TeacherScheduleStore()