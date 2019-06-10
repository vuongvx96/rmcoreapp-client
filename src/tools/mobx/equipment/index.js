import { observable, action, runInAction, computed } from 'mobx'
import http from '../../axios'

class EquipmentStore{

  @observable equipments = new Map()
  @observable loading = false
  @observable activeCount = 0


  startAsync = () => {
    this.loading = true
  }
  
  @action fetchAll = async (roomId, keyword) => {
    this.startAsync()
    try {
      const response = await http.get('/equipments', { params: { roomId, keyword } })
      runInAction('fetch all entities', () => {
        this.equipments = new Map(response.data.map(i => [i.equipmentId, i]))
        this.activeCount = response.data.filter(item => item.status === true).length
        this.loading = false
      })
      return response
    } catch (err) {
      this.loading = false
      return err
    }
  }

  @action create = async (entity) => {
    try {
      const response = await http.post('/equipments', entity)
      runInAction('entity created', () => {
        this.equipments.set(response.data.equipmentId, response.data)
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action update = async (entity) => {
    try {
      const response = await http.put('/equipments', entity)
      runInAction('entity updated', () => {
        this.equipments.set(response.data.equipmentId, response.data)
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/equipments/${id}`)
      runInAction('entity deleted', () => {
        this.equipments.delete(id)
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action updateActiveCount(status) {
    if(status)
      this.activeCount += 1
    else this.activeCount -=1 
  }

  @computed get total() {
    return this.equipments.size
  }
}

export default new EquipmentStore()