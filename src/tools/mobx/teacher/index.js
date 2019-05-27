import { observable, action, runInAction } from 'mobx'
import http from '../../axios'

class TeacherStore {

  @observable entities = new Map()
  @observable loading = false

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/teachers')
      runInAction('fetch all entities', () => {
        this.entities = new Map(response.data.map(i => [i.teacherId, i]))
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
      const response = await http.post('/teachers', entity)
      runInAction('entity created', () => {
        this.entities.set(entity.teacherId, response.data)
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
        this.entities.set(entity.teacherId, response.data)
        this.loading = false
      })
      console.log(response)
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/teachers/${id}`)
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

export default new TeacherStore()
