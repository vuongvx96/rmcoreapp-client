import { observable, action, runInAction } from 'mobx'
import http from '../../axios'

class FunctionStore {

  @observable isCreatingFunction = false
  @observable isLoadingFunctions = false
  @observable functionErrors = undefined
  @observable functions = []

  @action loadFunctions() {
    this.isLoadingFunctions = true
    this.functionErrors = undefined
    http.get('/functions')
      .then(action(res => this.functions = res.data))
      .catch(action(err => this.functionErrors = err.response && err.response.body && err.response.body.errors))
    runInAction(() => this.isLoadingFunctions = false)
  }
}

export default new FunctionStore()