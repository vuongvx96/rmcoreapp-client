import { observable, action } from 'mobx'
import CryptoJS from 'crypto-js'
import http from '../../axios'

class AccountStore {
  @observable inProgress = false

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
        UserName: this.values.username,
        Password: this.values.password
      }
      let { data } = await http.post('/accounts/login', payload)
      return data
    } catch (err) {
      this.inProgress = false
      return err
    }
  }
}

export default new AccountStore()