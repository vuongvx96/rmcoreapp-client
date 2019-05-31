import React from 'react'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { Button } from 'antd'

import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import { getGender } from '../util/formatter'

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
        address: null,
        status: true
      }
    }
    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: true,
          canRemove: true,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeUser.bind(this)
        }
      },
      { headerName: 'Tên đầy đủ', field: 'fullName', width: 120, sortable: true },
      { headerName: 'Tên đăng nhập', field: 'userName', width: 120, sortable: true },
      { headerName: 'Giới tính', field: 'gender', sortable: true, valueFormatter: (params) => getGender(params.value) },
      { headerName: 'Điện thoại', field: 'phoneNumber', sortable: true },
      { headerName: 'Email', field: 'email', sortable: true },
      { headerName: 'Mã CB', field: 'officerId', sortable: true },
      { headerName: 'Ngày tạo', field: 'registrationDate', sortable: true },
      { headerName: 'Đăng nhập cuối', field: 'lastLoginTime', sortable: true },
      { headerName: 'Trạng thái', field: 'status', sortable: true },
      { headerName: 'Roles', field: 'roles', sortable: true }
    ]
    this.saveUser = this.saveUser.bind(this)
    this.removeUser = this.removeUser.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.userStore.users)
  }

  openEditForm(user) {
    this.setState({ user })
    this.refTemplate.openDialog()
  }

  async saveUser() {
    let { user } = this.state
    const result = await this.props.userStore.saveUser(user)
    if (result.status === 200) {
      showNotification('Đã lưu thông tin người dùng', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật thông tin thất bại', 'error')
    }
  }

  removeUser(user) {
    showConfirm(
      'Bạn có muốn xóa người dùng không?',
      async () => {
        const result = await this.props.userStore.delete(user.id)
        if (result.status === 200) {
          showNotification('Xóa người dùng thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa người dùng thất bại', 'error')
        }
      }
    )
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
        address: null,
        status: true
      }
    })
  }

  componentDidMount() {
    this.props.userStore.fetchAllPaging(1, 10, null)
  }

  render() {
    let { fullName, userName, gender, phoneNumber, email, officerId, roles, address, status } = this.state.user
    let { users, loading } = this.props.userStore
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
          disableButtonSave={!userName || !email || phoneNumber}
        >
        </ModalForm>
        <div style={{ height: 'calc(100vh - 220px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={users}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            frameworkComponents={{
              editButton: ModifyButtonGrid
            }}
          />
        </div>

      </>
    )
  }
}

export default UserManagement