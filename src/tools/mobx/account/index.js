import { observable, action, runInAction, computed, toJS } from 'mobx'
import { createTransformer } from 'mobx-utils'
import _ from 'lodash'
import CryptoJS from 'crypto-js'
import http from '../../axios'

class AccountStore {
  @observable inProgress = false
  @observable functions = []
  @observable permissions = []

  @observable values = {
    username: '',
    email: '',
    password: '',
  }

  @action setUsername(username) {
    this.values.username = username
  }

  @action setEmail(email) {
    this.values.email = email
  }

  @action setPassword(password) {
    var key = CryptoJS.enc.Utf8.parse('7061737323313233')
    var iv = CryptoJS.enc.Utf8.parse('7061737323313233')
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
    this.values.password = encrypted.toString()
  }

  @action reset() {
    this.values.username = ''
    this.values.email = ''
    this.values.password = ''
  }

  @action async login() {
    this.inProgress = true
    try {
      let payload = {
        username: this.values.username,
        password: this.values.password
      }
      let result = await http.post('/auth/login', payload)
      return result
    } catch (err) {
      this.inProgress = false
      return err
    }
  }

  @action loadFunctions() {
    this.isLoadingFunctions = true
    this.functionErrors = undefined
    http.get('/auth/getfunctions')
      .then(action(res => this.functions = res.data))
      .catch(action(err => this.functionErrors = err.response && err.response.body && err.response.body.errors))
    runInAction(() => this.isLoadingFunctions = false)
  }

  @action loadPermissions() {
    http.get('/auth/getpermissions')
    .then(action(res => this.permissions = res.data))
    .catch(action(err => this.permissionErrors = err.response && err.response.body && err.response.body.errors))
  }

  @computed get getPermissions() {
    return toJS(this.permissions)
  }

  @computed get hasPermission() {
    return createTransformer(functionId => {
      const permissions = toJS(this.permissions)
      let p = permissions.find(item => _.isEqual(item.functionId, functionId))
      let result = {
        create: _.isNil(p) ? false : p.canCreate,
        update: _.isNil(p) ? false : p.canUpdate,
        delete: _.isNil(p) ? false : p.canDelete
      }
      return result
    })
 }
}

export default new AccountStore()