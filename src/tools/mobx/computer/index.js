import { observable, action, runInAction, toJS } from 'mobx'
import http from '../../axios'

class ComputerStore{

  @observable computers = new Map()
  @observable loading = false
  @observable currentPage = 1
  @observable pageSize = 10
  @observable rowCount = 10
  @observable activeCount = 0


  startAsync = () => {
    this.loading = true
  }
  
  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/computers')
      runInAction('fetch all entities', () => {
        this.computers = new Map(response.data.map(i => [i.computerId, i]))
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action fetchAllPaging = async (page, pageSize, roomId, keyword) => {
    this.startAsync()
    try {
      const response = await http.get('/computers/getallpaging', {
        params: {
          page: page,
          pageSize: pageSize,
          roomId: roomId,
          keyword: keyword
        }
      })
      runInAction('fetch all entities paging', () => {
        this.computers = new Map(response.data.results.map(i => [i.computerId, i]))
        this.currentPage = response.data.currentPage
        this.pageSize = response.data.pageSize
        this.rowCount = response.data.rowCount
        this.activeCount = response.data.metaData.activeCount
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
      const response = await http.post('/computers', entity)
      runInAction('entity created', () => {
        this.computers.set(entity.computerId, response.data)
        this.rowCount += 1
        if (response.data.status) this.activeCount += 1
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action update = async (entity) => {
    try {
      const response = await http.put('/computers', entity)
      runInAction('entity updated', () => {
        this.computers.set(entity.computerId, response.data)
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/computers/${id}`)
      runInAction('entity deleted', () => {
        var old = toJS(this.computers.get(id))
        if (old.status) this.activeCount -= 1
        this.computers.delete(id)
        this.rowCount -= 1
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
}

export default new ComputerStore()