import { observable, action, runInAction, computed } from 'mobx'
import http from '../../axios'

class ManufacturerStore {

  @observable entities = new Map()
  @observable loading = false

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/manufacturers')
      runInAction('entity created', () => {
        this.entities = new Map(response.data.map(i => [i.manufacturerId, i]))
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
      const response = await http.post('/manufacturers', entity)
      runInAction('entity created', () => {
        this.entities.set(response.data.manufacturerId, response.data)
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
      const response = await http.put('/manufacturers', entity)
      runInAction('entity updated', () => {
        this.entities.set(response.data.manufacturerId, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/manufacturers/${id}`)
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

export default new ManufacturerStore()
