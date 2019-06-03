import { observable, action, runInAction } from 'mobx'
import http from '../../axios'

class GroupPracticeStore{
  @observable groupPractices = new Map()
  @observable loading = false

  startAsync = () => {
    this.loading = true
  }

  @action fetchAll = async () => {
    this.startAsync()
    try {
      const response = await http.get('/courses')
      runInAction('fetch all entities', () => {
        this.groupPractices = new Map(response.data.map(i => [i.groupId, i]))
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
      const response = await http.post('/courses', entity)
      runInAction('entity created', () => {
        // if (response.status === 201) {
        //   this.rowCount += 1
        // }
        this.groupPractices.set(entity.groupId, response.data)
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
      const response = await http.put('/courses', entity)
      runInAction('entity updated', () => {
        this.groupPractices.set(entity.groupId, response.data)
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action delete = async (id) => {
    try {
      const response = await http.delete(`/courses/${id}`)
      runInAction('entity deleted', () => {
        if (response.status === 200) {
          // this.rowCount -= 1
          this.groupPractices.delete(id)
        }
        this.loading = false
      })
      return response
    } catch (err) {
      return err
    }
  }
}

export default new GroupPracticeStore()
