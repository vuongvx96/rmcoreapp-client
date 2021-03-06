import { observable, action, runInAction, computed, toJS } from 'mobx'
import http from '../../axios'

class DepartmentStore {

    @observable entities = new Map()
    @observable loading = false

    startAsync = () => {
        this.loading = true
    }

    @action fetchAll = async () => {
        this.startAsync()
        try {
            const response = await http.get('/departments')
            runInAction('fetch all entities', () => {
                this.entities = new Map(response.data.map(i => [i.departmentId, i]))
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
            const response = await http.post('/departments', entity)
            runInAction('entity created', () => {
                this.entities.set(response.data.departmentId, response.data)
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
            const response = await http.put('/departments', entity)
            runInAction('entity updated', () => {
                this.entities.set(response.data.departmentId, response.data)
                this.loading = false
            })
            return response
        } catch (err) {
            return err
        }
    }

    @action delete = async (id) => {
        try {
            const response = await http.delete(`/departments/${id}`)
            runInAction('entity deleted', () => {
                this.entities.delete(id)
                this.loading = false
            })
            return response
        } catch (err) {
            return err
        }
    }

    @computed get listDepartments() {
        var list = Object.values(toJS(this.entities))
        return list
    }
}

export default new DepartmentStore()
