import { observable, action, runInAction, computed, toJS } from 'mobx'
import http from '../../axios'

class SubjectStore{

  @observable entities = new Map()
  @observable loading = false

  startAsync = () => {
    this.loading = true
  }
  
  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/subjects')
      runInAction('fetch all entities', () => {
        this.entities = new Map(response.data.map(i => [i.subjectId, i]))
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
      const response = await http.post('/subjects', entity)
      runInAction('entity created', () => {
        this.entities.set(response.data.subjectId, response.data)
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
      const response = await http.put('/subjects', entity)
      runInAction('entity updated', () => {
        this.entities.set(response.data.subjectId, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/subjects/${id}`)
      runInAction('entity deleted', () => {
        this.entities.delete(id)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @computed get listSubjects() {
    var list = Object.values(toJS(this.entities))
    return list
  }
}

export default new SubjectStore()
