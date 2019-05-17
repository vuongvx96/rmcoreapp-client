import { observable, action } from 'mobx'

class CommonStore {

  @observable isCreate = false
  @action onCreate = () => this.isCreate = true
  @action onUpdate = () => this.isCreate = false
}

export default new CommonStore()
