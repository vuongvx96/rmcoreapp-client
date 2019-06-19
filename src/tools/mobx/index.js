import authStore from './authen'
import commonStore from './common'
import functionStore from './function'
import accountStore from './account'
import teacherStore from './teacher'
import manufacturerStore from './manufacturer'
import weekStore from './week'
import departmentStore from './department'
import majorStore from './major'
import roomStore from './room'
import classStore from './class'
import subjectStore from './subject'
import computerStore from './computer'
import equipmentStore from './equipment'
import userStore from './system/user'
import roleStore from './system/role'
import groupPracticeStore from './grouppractice'
import scheduleStore from './schedule'

const stores = {
  authStore,
  commonStore,
  functionStore,
  accountStore,
  teacherStore,
  manufacturerStore,
  weekStore,
  departmentStore,
  majorStore,
  roomStore,
  classStore,
  subjectStore,
  computerStore,
  equipmentStore,
  userStore,
  groupPracticeStore,
  roleStore,
  scheduleStore
}

export { stores }
