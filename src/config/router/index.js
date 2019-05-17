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
  }
]

export { routesNotAuthen, routesAuthen, listRoutesAuthen }