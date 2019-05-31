import { observable, action, runInAction } from 'mobx'
import http from '../../axios'

class MajorStore {

  @observable entities = new Map()
  @observable loading = false

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/majors')
      runInAction('fetch all entities', () => {
        this.entities = new Map(response.data.map(i => [i.majorId, i]))
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
      const response = await http.post('/majors', entity)
      console.log(response)
      runInAction('entity created', () => {
        this.entities.set(response.data.majorId, response.data)
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
      const response = await http.put('/majors', entity)
      runInAction('entity updated', () => {
        this.entities.set(response.data.majorId, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/majors/${id}`)
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

export default new MajorStore()
