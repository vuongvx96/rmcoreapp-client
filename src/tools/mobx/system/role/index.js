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
  
  @computed get listRoles() {
    return Object.values(toJS(this.roles))
  }
}

export default new RoleStore()