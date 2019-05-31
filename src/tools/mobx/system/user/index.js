import { action, observable, runInAction } from 'mobx'
import http from '../../../axios'

class UserStore {
  @observable users = new Map()
  @observable loading = false
  @observable currentPage = 1
  @observable pageSize = 10
  @observable rowCount = 10

  startAsync = () => {
    this.loading = true
  }

  @action fetchAllPaging = async (page, pageSize, keyword) => {
    this.startAsync()
    try {
      const response = await http.get('/users/getallpaging', {
        params: {
          page: page,
          pageSize: pageSize,
          keyword: keyword
        }
      })
      console.log(response)
      runInAction('fetch all entities paging', () => {
        this.users = new Map(response.data.results.map(i => [i.id, i]))
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

  @action saveUser = async (entity) => {
    try {
      const response = await http.post('/users', entity)
      runInAction('entity created', () => {
        this.users.set(entity.id, response.data)
        this.rowCount += 1
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action deleteUser = async (id) => {
    try {
      const response = await http.delete(`/users/${id}`)
      runInAction('entity deleted', () => {
        if (response.status === 200) {
          this.users.delete(id)
          this.rowCount = -1
        }
      })
      return response
    } catch (err) {
      return err
    }
  }
}

export default new UserStore()