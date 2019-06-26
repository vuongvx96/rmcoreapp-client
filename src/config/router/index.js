const routesNotAuthen = [
	{
		displayName: 'Đăng nhập',
		path: '/login',
		component: 'login',
		exact: true
	},
	{
		displayName: 'Trang chủ',
		path: '/',
		component: 'home',
		exact: true
	},
	{
		displayName: 'Xác nhận email',
		path: '/confirm-email/:result',
		component: 'confirmEmail',
		exact: true
	},
	{
		displayName: 'Quên mật khẩu',
		path: '/forgot-password',
		component: 'forgotPassword',
		exact: true
	},
	{
		displayName: 'Đặt lại mật khẩu',
		path: '/reset-password/:resettoken',
		component: 'resetPassword',
		exact: false
	}
]

const routesAuthen = [
	{
		displayName: 'Quản lý',
		path: '/dashboard',
		component: 'dashboard',
		exact: false
	},
	{
		displayName: 'Trang cá nhân',
		path: '/profile',
		component: 'profile',
		exact: true
	}
]

const listRoutesAuthen = [
	{
		displayName: 'Quản lý giảng viên',
		path: '/dashboard/teacher-management',
		component: 'teacherManagement'
	},
	{
		displayName: 'Xem lịch thực hành tuần',
		path: '/dashboard/schedule-week',
		component: 'scheduleWeek'
	},
	{
		displayName: 'Xem danh sách lịch thực hành',
		path: '/dashboard/list-schedule',
		component: 'listSchedule'
	},
	{
		displayName: 'Quản lý lịch thực hành',
		path: '/dashboard/schedule-management',
		component: 'scheduleManagement'
	},
	{
		displayName: 'Quản lý hãng sản xuất',
		path: '/dashboard/manufacturer-management',
		component: 'manufacturerManagement'
	},
	{
		displayName: 'Quản lý khoa',
		path: '/dashboard/department-management',
		component: 'departmentManagement'
	},
	{
		displayName: 'Quản lý chuyên ngành',
		path: '/dashboard/major-management',
		component: 'majorManagement'
	},
	{
		displayName: 'Quản lý phòng',
		path: '/dashboard/room-management',
		component: 'roomManagement'
	},
	{
		displayName: 'Quản lý lớp học',
		path: '/dashboard/class-management',
		component: 'classManagement'
	},
	{
		displayName: 'Quản lý môn học',
		path: '/dashboard/subject-management',
		component: 'subjectManagement'
	},
	{
		displayName: 'Quản lý thiết bị',
		path: '/dashboard/device-management',
		component: 'deviceManagement'
	},
	{
		displayName: 'Quản lý user',
		path: '/dashboard/user-management',
		component: 'userManagement'
	},
	{
		displayName: 'Quản lý lớp học phần',
		path: '/dashboard/course-management',
		component: 'groupPracticeManagement'
	},
	{
		displayName: 'Quản lý role',
		path: '/dashboard/role-management',
		component: 'roleManagement'
	}
]

export { routesNotAuthen, routesAuthen, listRoutesAuthen }
