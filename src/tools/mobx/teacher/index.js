import { observable, action, runInAction, computed, toJS } from 'mobx'
import http from '../../axios'

class TeacherStore {

  @observable teachers = new Map()
  @observable loading = false

  @observable currentPage = 1
  @observable pageSize = 10
  @observable rowCount = 10

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/teachers')
      runInAction('fetch all entities', () => {
        this.teachers = new Map(response.data.map(i => [i.teacherId, i]))
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action fetchAllPaging = async (page, pageSize, departmentId, keyword) => {
    this.startAsync()
    try {
      const response = await http.get('/teachers/getallpaging', {
        params: {
          page: page,
          pageSize: pageSize,
          departmentId: departmentId,
          keyword: keyword
        }
      })
      runInAction('fetch all entities paging', () => {
        this.teachers = new Map(response.data.results.map(i => [i.teacherId, i]))
        this.currentPage = response.data.currentPage
        this.pageSize = response.data.pageSize
        this.rowCount = response.data.rowCount
        this.loading = false
      })

      return response
    } catch (err) {
      this.loading = false
      return err
    }
  }

  @action create = async (entity) => {
    this.startAsync()
    try {
      const response = await http.post('/teachers', entity)
      runInAction('entity created', () => {
        if (response.status === 201) {
          this.rowCount+=1
        }
        this.teachers.set(response.data.teacherId, response.data)
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
      const response = await http.put('/teachers', entity)
      runInAction('entity updated', () => {
        this.teachers.set(response.data.teacherId, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/teachers/${id}`)
      runInAction('entity deleted', () => {
        if (response.status === 200) {
          this.rowCount-=1
        }
        this.teachers.delete(id)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @computed get listTeachers() {
    var list = Object.values(toJS(this.teachers))
    return list
  }
}

export default new TeacherStore()
