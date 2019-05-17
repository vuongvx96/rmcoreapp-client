import { observable, action, runInAction } from 'mobx'
import http from '../../axios'

class TeacherStore {

  @observable isCreatingTeachers = false
  @observable isLoadingTeachers = false
  @observable teacherErrors = undefined
  @observable teachers = []

  @action loadTeachers() {
    this.isLoadingTeachers = true
    this.teacherErrors = undefined
    http.get('/teachers')
      .then(action(res => this.teachers = res.data))
      .catch(action(err => this.teacherErrors = err.response && err.response.body && err.response.body.errors))
    runInAction(() => this.isLoadingTeachers = false)
  }
}

export default new TeacherStore()