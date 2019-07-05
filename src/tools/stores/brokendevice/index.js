import { observable, action, runInAction } from 'mobx'
import http from '../../axios'

class BrokenDeviceStore{
  
  @observable brokenDevices = new Map()
  @observable loading = false

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/brokendevices')
      runInAction('fetch all brokenDevices', () => {
        this.brokenDevices = new Map(response.data.map(i => [i.id, i]))
        console.log(this.response)
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
      const response = await http.post('/brokendevices', entity)
      runInAction('entity created', () => {
        this.brokenDevices.set(response.data.id, response.data)
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
      const response = await http.put('/brokendevices', entity)
      runInAction('entity updated', () => {
        this.brokenDevices.set(response.data.id, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/brokendevices/${id}`)
      runInAction('entity deleted', () => {
        this.brokenDevices.delete(id)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }
}

export default new BrokenDeviceStore()
