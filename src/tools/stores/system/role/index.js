import { observable, action, runInAction, computed, toJS  } from 'mobx'
import http from '../../../axios'

class RoleStore {

  @observable roles = new Map()
  @observable loading = false

  startAsync = () => {
		this.loading = true
  }
  
  @action fetchAll = async () => {
		this.startAsync()
		try {
			const response = await http.get('/roles')
			runInAction('fetch all entities', () => {
				this.roles = new Map(response.data.map(i => [i.id, i]))
				this.loading = false
			})
			return response
		} catch (err) {
      this.loading = false
			return err
		}
	}
	
	@action saveRole = async (role) => {
		try {
			const response = await http.post('/roles/saverole', role)
			runInAction('save role', () => {
				if (response.status === 200) {
					this.roles.set(response.data.id, response.data)
				}
			})
			return response
		} catch (err) {
			return err
		}
	}

	@action deleteRole = async (id) => {
		try {
			const response = await http.delete(`/roles/${id}`)
			runInAction('delete role', () => {
				if (response.status === 200) {
					this.roles.delete(id)
				}
			})
			return response
		} catch (err) {
			return err
		}
	}
  
  @computed get listRoles() {
    return Object.values(toJS(this.roles))
	}
	
	@computed get totalCount() {
		return this.roles.size
	}
}

export default new RoleStore()