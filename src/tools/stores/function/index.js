import { observable, action, runInAction, computed, toJS } from 'mobx'
import _ from 'lodash'
import http from '../../axios'

class FunctionStore {

  @observable functions = []
  @observable permissions = []
  @observable loading = false
  @observable updating = false
  @observable roleId = null

  @action loadAllFunctions = async () => {
    try {
      const response = await http.get('/functions')
      runInAction('fetch all functions', () => {
        if (response.status === 200) {
          this.functions = response.data
        }
      })
      return response
    } catch (err) {
      return err
    }
  }

  @action loadAllPermissions = async (roleId) => {
    this.loading = true
    try {
      const response = await http.post(`/roles/listallfunction/${roleId}`)
      runInAction('fetch all permissions', () => {
        if (response.status === 200) {
          this.permissions = response.data
        }
        this.loading = false
        this.roleId = roleId
      })
      return response
    } catch (err) {
      this.loading = false
      return err
    }
  }

  @action savePermission = async () => {
    this.updating = true
    try {
      let permissions = [...toJS(this.permissions)]
      let data = []
      permissions.forEach(item => {
        let p = {
          id: item.id,
          roleId: item.roleId,
          functionId: item.functionId,
          canRead: item.canRead,
          canCreate: item.canCreate,
          canUpdate: item.canUpdate,
          canDelete: item.canDelete,
        }
        data.push(p)
      })
      let payload = {
        roleId: this.roleId,
        listPermission: data
      }
      const response = await http.post(`/roles/savepermission`, payload)
      runInAction('save permissions', () => {
        this.updating = false
      })
      return response
    } catch (err) {
      this.updating = false
      return err
    }
  }

  @action grantRead = (functionId, value) => {
    this.permissions.forEach(item => {
      if (_.isEqual(item.functionId, functionId)) {
        item.canRead = value
      }
    })
  }

  @action grantCreate = (functionId, value) => {
    this.permissions.forEach(item => {
      if (_.isEqual(item.functionId, functionId)) {
        item.canCreate = value
      }
    })
  }

  @action grantUpdate = (functionId, value) => {
    this.permissions.forEach(item => {
      if (_.isEqual(item.functionId, functionId)) {
        item.canUpdate = value
      }
    })
  }

  @action grantDelete = (functionId, value) => {
    this.permissions.forEach(item => {
      if (_.isEqual(item.functionId, functionId)) {
        item.canDelete = value
      }
    })
  }

  @action checkAllRead(value) {
    this.permissions.forEach(item => item.canRead = value)
  }

  @action checkAllCreate(value) {
    this.permissions.forEach(item => item.canCreate = value)
  }

  @action checkAllUpdate(value) {
    this.permissions.forEach(item => item.canUpdate = value)
  }

  @action checkAllDelete(value) {
    this.permissions.forEach(item => item.canDelete = value)
  }

  @computed get treeData() {
    let data = [...toJS(this.functions)]
    let permissions = [...toJS(this.permissions)]
    data.forEach(item => {
      permissions.forEach(jitem => {
        if (_.isEqual(jitem.functionId, item.id)) {
          item.canRead = jitem.canRead
          item.canCreate = jitem.canCreate
          item.canUpdate = jitem.canUpdate
          item.canDelete = jitem.canDelete
        }
      })
    })
    var dataSource = []
    data.forEach(f => {
      if (_.isNull(f.parentId)) {
        var obj = Object.assign({}, f)
        obj.children = data.filter(x => _.isEqual(x.parentId, f.id))
        dataSource.push(obj)
      }
    })
    return dataSource
  }

  @computed get checkState() {
    const length = this.permissions.length
    const countRead = this.permissions.filter(t => t.canRead).length
    const countCreate = this.permissions.filter(t => t.canCreate).length
    const countUpdate = this.permissions.filter(t => t.canUpdate).length
    const countDelete = this.permissions.filter(t => t.canDelete).length
    let checkAll = {
      read: countRead === length,
      create: countCreate === length,
      update: countUpdate === length,
      delete: countDelete === length
    }
    let indeterminate = {
      read: !!countRead && countRead < length,
      create: !!countCreate && countCreate < length,
      update: !!countUpdate && countUpdate < length,
      delete: !!countDelete && countDelete < length
    }
    return { checkAll, indeterminate }
  }
}

export default new FunctionStore()