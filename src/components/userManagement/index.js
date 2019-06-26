import React from 'react'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { Input, Button, Pagination } from 'antd'

import UserForm from './UserForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import { dateFormatter, dateTimeFormatter, getGender } from '../util/formatter'

const EnableButton = (params) => {
  const style = {
    margin: '5px 0px',
    padding: '0px 10px',
    width: 88,
    height: 24,
    fontSize: 10,
    color: params.value ? '#52c41a' : '#f5222d'
  }
  return <Button icon={params.value ? 'check' : 'lock'} style={style} onClick={() => params.onClick(params.data.id)}>
    {params.value ? 'Hoạt động' : 'Khóa'}
  </Button>
}

@inject('userStore')
@observer
class UserManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        fullName: null,
        userName: null,
        gender: true,
        phoneNumber: null,
        email: null,
        officerId: null,
        roles: [],
        status: true
      },
      page: 1,
      pageSize: 10,
      keyword: null
    }
    this.gridOptions = {
      rowHeight: 34,
      suppressMovableColumns: false,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }
    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('USER').update,
          canRemove: this.props.permission.hasPermission('USER').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeUser.bind(this)
        }
      },
      { headerName: 'Tên đầy đủ', field: 'fullName', width: 120, sortable: true },
      { headerName: 'Tên đăng nhập', field: 'userName', width: 120, sortable: true },
      { headerName: 'Giới tính', field: 'gender', width: 95, sortable: true, valueFormatter: (params) => getGender(params.value) },
      { headerName: 'Điện thoại', field: 'phoneNumber', width: 105, sortable: true },
      { headerName: 'Email', field: 'email', width: 140, sortable: true },
      { headerName: 'Mã cán bộ', field: 'officerId', width: 110, sortable: true },
      { headerName: 'Roles', field: 'roles', width: 150, sortable: true, valueFormatter: (params) => params.value.join(', ') },
      { headerName: 'Ngày tạo', field: 'registrationDate', width: 100, sortable: true, valueFormatter: (params) => dateFormatter(params.value) },
      { headerName: 'Lần đăng nhập cuối', field: 'lastLoginTime', width: 155, sortable: true, valueFormatter: (params) => dateTimeFormatter(params.value) },
      {
        cellRenderer: 'enableButton',
        cellRendererParams: {
          onClick: this.changeStatus.bind(this)
        },
        headerName: 'Trạng thái',
        field: 'status',
        width: 115,
        sortable: true
      }
    ]
    this.getInfo = this.getInfo.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.clearState = this.clearState.bind(this)
    this.createTeacherAccount = this.createTeacherAccount.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.userStore.listUsers)
  }

  openEditForm(user) {
    this.setState({ user })
    this.refTemplate.openDialog()
  }

  async saveUser() {
    let { user } = this.state
    const result = await this.props.userStore.saveUser(user)
    try {
      if (result.status === 200) {
        showNotification('Đã lưu thông tin người dùng', 'success')
        this.refetchData()
      } else if (result.response.status === 409) {
        showNotification('Tên đăng nhập hoặc email đã được sử dụng', 'error')
      } else if (result.response.status === 401) {
        showNotification('Chỉ admin mới có thể tạo tài khoản', 'error')
      } else {
        showNotification('Cập nhật thông tin thất bại', 'error')
      }
    } catch (err) {
      showNotification('Cập nhật thông tin thất bại', 'error')
    }
  }

  removeUser(user) {
    showConfirm(
      'Bạn có muốn xóa người dùng không?',
      async () => {
        const result = await this.props.userStore.deleteUser(user.id)
        if (result.status === 200) {
          showNotification('Xóa người dùng thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa người dùng thất bại', 'error')
        }
      }
    )
  }

  async changeStatus(id) {
    await this.props.userStore.changeStatus(id)
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.user[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      user: {
        fullName: null,
        userName: null,
        gender: true,
        phoneNumber: null,
        email: null,
        officerId: null,
        roles: [],
        status: true
      }
    })
  }

  createTeacherAccount(teacher) {
    this.setState({
      user: {
        fullName: `${teacher.lastName} ${teacher.firstName}`,
        userName: teacher.teacherId,
        gender: teacher.gender,
        phoneNumber: teacher.phone,
        email: teacher.email,
        officerId: teacher.teacherId,
        roles: [],
        status: true
      }
    })
  }

  handleChangePage = async (page, pageSize) => {
    this.setState({ page, pageSize })
    await this.props.userStore.fetchAllPaging(page, pageSize, this.state.keyword)
    this.refetchData()
  }

  handleChangePageSize = async (current, size) => {
    this.setState({ pageSize: size })
    await this.props.userStore.fetchAllPaging(current, size, this.state.keyword)
    this.refetchData()
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    this.props.userStore.fetchAllPaging(1, 10, null)
  }

  render() {
    let { fullName, userName, gender, phoneNumber, email, officerId, roles, status } = this.state.user
    let { listUsers, rowCount, pageSize } = this.props.userStore
    return (
      <>
        <ModalForm
          title='User'
          buttonName='Tạo mới'
          modalWidth={600}
          handleCreate={this.saveUser}
          handleUpdate={this.saveUser}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!userName || !email || !phoneNumber}
          canCreate={this.props.permission.hasPermission('USER').create}
          leftItems={
            <>
              <Input placeholder='tên đăng nhập, email,...' allowClear style={{ width: 250, marginRight: 10 }} onChange={({ target }) => {
                this.setState({ keyword: target.value })
              }} />
              <Button shape='round' icon='search' onClick={async () => {
                await this.props.userStore.fetchAllPaging(1, this.state.pageSize, this.state.keyword)
                this.refetchData()
              }} />
            </>
          }
        >
          <UserForm
            fullName={fullName}
            userName={userName}
            gender={gender}
            phoneNumber={phoneNumber}
            email={email}
            officerId={officerId}
            roles={roles}
            status={status}
            createTeacherAccount={this.createTeacherAccount}
            getInfo={this.getInfo}
          />
        </ModalForm>
        <div style={{ height: 'calc(100vh - 175px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={listUsers}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            frameworkComponents={{
              editButton: ModifyButtonGrid,
              enableButton: EnableButton
            }}
          />
        </div>
        <div className='flex-container' style={{ padding: '10px 0' }}>
          <div className='left-items'>
            <span style={{ color: '#092b00' }}>Tổng số: {rowCount}</span>
          </div>
          <div className='right-items'>
            <Pagination
              pageSize={pageSize}
              total={rowCount}
              onChange={this.handleChangePage}
              onShowSizeChange={this.handleChangePageSize}
              showSizeChanger
            />
          </div>
        </div>
      </>
    )
  }
}

export default UserManagement