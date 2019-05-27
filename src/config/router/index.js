const routesNotAuthen = [
	{
		displayName: 'Đăng nhập',
		path: '/login',
		component: 'login',
		exact: true
  }
]

const routesAuthen = [
  {
		displayName: 'Trang chủ',
		path: '/',
		component: 'app',
		exact: false
  }
]

const listRoutesAuthen = [
	{
		displayName: 'Quản lý giảng viên',
		path: '/teacher-management',
		component: 'teacherManagement'
  },
  {
    displayName: 'Quản lý lịch thực hành',
		path: '/schedule-management',
		component: 'scheduleManagement'
  },
  {
    displayName: 'Quản lý hãng sản xuất',
    path: '/manufacturer-management',
    component: 'manufacturerManagement'
	},
	{
		displayName: 'Quản lý khoa',
		path: '/department-management',
		component: 'departmentManagement'
	},
	{
		displayName: 'Quản lý chuyên ngành',
		path: '/major-management',
		component: 'majorManagement'
	},
	{
		displayName: 'Quản lý phòng',
		path: '/room-management',
		component: 'roomManagement'
	},
	{
		displayName: 'Quản lý lớp học',
		path: '/class-management',
		component: 'classManagement'
	},
	{
		displayName: 'Quản lý môn học',
		path: '/subject-management',
		component: 'subjectManagement'
	},
	{
		displayName: 'Quản lý thiết bị',
		path: '/device-management',
		component: 'deviceManagement'
	}
]

export { routesNotAuthen, routesAuthen, listRoutesAuthen }
