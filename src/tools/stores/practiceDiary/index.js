import { observable, action, runInAction, computed, toJS } from 'mobx'

import http from '../../axios'

class PracticeDiaryStore {
  
  @observable practiceDiaries = new Map()
  @observable schedules = new Map()
  @observable loading = false
  @observable loadingSchedule = false
  @observable scheduleId = null
  @observable clientIP = null

  constructor(){
    let this_1 = this
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection   //compatibility for firefox and chrome
    let pc = new RTCPeerConnection({iceServers:[]}), noop = function(){}    
    pc.createDataChannel("")    //create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop)    // create offer and set local description
    pc.onicecandidate = function(ice){  //listen for candidate events
        if(!ice || !ice.candidate || !ice.candidate.candidate)  return
        let ip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1]
        this_1.clientIP = String(ip)
        pc.onicecandidate = noop
    }
  }

  @action fetchAll = async(startDate, endDate) => {
    this.loading = true
    try {
      let params = {
        startDate: startDate.format('YYYY-MM-DD HH:mm:ss'),
        endDate: endDate.format('YYYY-MM-DD HH:mm:ss')
      }
      const response = await http.get('/practicediary', { params })
      runInAction('fetch all diaries', () => {
        if (response.status === 200) {
          this.practiceDiaries = new Map(response.data.map(i => [i.id, i]))
        }
        this.loading = false
      })
      return response
    } catch (err) {
      this.loading = false
      return err
    }
  }

  @action fetchAllScheduleToday = async () => {
    this.loadingSchedule = true
    try {
      const response = await http.get('/practicediary/scheduletoday')
      runInAction('fetch schedules today', () => {
        if (response.status === 200)
          this.schedules = new Map(response.data.map(i => [i.scheduleId, i]))
          this.loadingSchedule = false
      })
    } catch (err) {
      this.loadingSchedule = false
      return err
    }
  }

  @action createDiary = async (diary) => {
    try {
      let obj = Object.assign({}, diary)
      delete obj.id
      obj.createdDate = diary.createdDate.format('YYYY-MM-DD HH:mm:ss')
      
      http.defaults.headers.common['X-Forwarded-For'] = this.clientIP
      const response = await http.post('/practicediary', obj)
      runInAction('entity created', () => {
        if (response.status === 201)
          this.practiceDiaries.set(response.data.id, response.data)
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action updateDiary = async (diary) => {
    try {
      let obj = Object.assign({}, diary)
      obj.createdDate = diary.createdDate.format('YYYY-MM-DD HH:mm:ss')
      const response = await http.put('/practicediary', obj)
      runInAction('entity updated', () => {
        if (response.status === 200)
          this.practiceDiaries.set(response.data.id, response.data)
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action deleteDiary = async (id) => {
    try {
      const response = await http.delete(`/practicediary/${id}`)
      runInAction('entity deleted', () => {
        if (response.status === 200)
          this.practiceDiaries.delete(id)
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action changeSchedule = (id) => {
    this.scheduleId = id
  }

  @computed get practiceDiariesJS() {
    return Object.values(toJS(this.practiceDiaries))
  }

  @computed get scheduleTodayJS() {
    return Object.values(toJS(this.schedules))
  }

  @computed get currentSchedule() {
    return toJS(this.schedules.get(this.scheduleId))
  }
}

export default new PracticeDiaryStore()