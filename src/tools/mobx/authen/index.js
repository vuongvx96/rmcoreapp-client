import { observable, action } from 'mobx'

class AuthStore {

  @observable isLogin = localStorage.getItem('access_token') || false
  @action onLogin = () => this.isLogin = true
  @action onLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    this.isLogin = false
  }
}

export default new AuthStore()
