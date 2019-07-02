import { observable, action, runInAction, computed, toJS } from 'mobx'
import { createTransformer } from 'mobx-utils'
import _ from 'lodash'
import CryptoJS from 'crypto-js'
import http from '../../axios'

class AccountStore {
  @observable inProgress = false
  @observable updating = false
  @observable functions = []
  @observable permissions = []
  @observable errors = null
  @observable currentUser = {
    id: null,
    avatar: null,
    email: null,
    emailConfirmed: false,
    fullName: null,
    gender: true,
    lastLoginTime: new Date(),
    officerId: null,
    phoneNumber: null,
    registrationDate: null,
    status: false,
    userName: null,
    roles: []
  }

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
      return err.response
    }
  }

  @action async revokeToken() {
    try {
      let result = await http.post('/token/revoke')
      return result
    } catch (err) {
      return err
    }
  }

  @action loadCurrentUser = async () => {
    this.inProgress = true
    try {
      const response = await http.get('/auth/currentuser')
      runInAction('fetch current user', () => {
        if (response.status === 200) {
          this.currentUser = response.data
        }
        this.inProgress = false
      })
    } catch (err) {
      this.inProgress = false
      this.errors = err.response && err.response.body && err.response.body.errors
    }
  }

  @action updateProfile = async () => {
    this.updating = true
    let userVm = toJS(this.currentUser)
    try {
      const response = await http.post('/auth/updateprofile', userVm)
      runInAction('update profile', () => {
        if (response.status === 200) {
          const { data } = response
          this.currentUser.fullName = data.fullName
          this.currentUser.email = data.email
          this.currentUser.phoneNumber = data.phoneNumber
          this.currentUser.gender = data.gender
          this.currentUser.avatar = data.avatar
        }
        this.updating = false
      })
      return response
    } catch (err) {
      this.updating = false
      return err
    }
  }

  @action updateCurrentUser = (field, value) => {
    this.currentUser[field] = value
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

  @action changePassword = async (payload) => {
    try {
      const response = await http.post('/auth/updateuserpassword', payload)
      return response
    } catch (err) {
      return err
    }
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

  @computed get getCurrentUser() {
    return toJS(this.currentUser)
  }
}

export default new AccountStore()