import { observable, action, runInAction, computed, toJS } from 'mobx'
import http from '../../axios'

class GroupPracticeStore{
  @observable groupPractices = new Map()
  @observable loading = false
  @observable keyword = null

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async (semester, year) => {
    this.startAsync()
    try {
      let params = {
        semester: semester,
        year: year
      }
      const response = await http.get('/courses', { params })
      runInAction('fetch all entities', () => {
        this.groupPractices = new Map(response.data.map(i => [i.groupId, i]))
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action create = async (entity) => {
    this.startAsync()
    try {
      const response = await http.post('/courses', entity)
      runInAction('entity created', () => {
        if (response.status === 201)
          this.groupPractices.set(response.data.groupId, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action update = async (entity) => {
    this.startAsync()
    try {
      const response = await http.put('/courses', entity)
      runInAction('entity updated', () => {
        this.groupPractices.set(entity.groupId, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/courses/${id}`)
      runInAction('entity deleted', () => {
        if (response.status === 200) {
          this.groupPractices.delete(id)
        }
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action changeKeyword = (value) => {
    this.keyword = value
  }

  @computed get getGroupPractices() {
    let data = Object.values(toJS(this.groupPractices))
    if (!!this.keyword) {
      let keyword = this.keyword.toLowerCase()
      data = data.filter(x => x.subject.subjectName.toLowerCase().indexOf(keyword) >= 0 ||
        (x.teacher.lastName + ' ' + x.teacher.firstName).toLowerCase().indexOf(keyword) >= 0 ||
        x.classId.toLowerCase().indexOf(keyword) >= 0
      )
    }
    return data
  }
}

export default new GroupPracticeStore()
