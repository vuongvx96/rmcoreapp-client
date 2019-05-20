import { observable, action, runInAction } from 'mobx'
import http from '../../axios'

class ClassStore {
  @observable entities = new Map()
  @observable loading = false

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/classes')
      runInAction('fetch all entities', () => {
        this.entities = new Map(response.data.map(i => [i.classId, i]))
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
      const response = await http.post('/classes', entity)
      runInAction('entity created', () => {
        this.entities.set(entity.classId, entity)
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
      const response = await http.put('/classes', entity)
      runInAction('entity updated', () => {
        this.entities.set(entity.classId, entity)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/classes/${id}`)
      runInAction('entity deleted', () => {
        this.entities.delete(id)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }
}

export default new ClassStore()
