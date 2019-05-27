import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import TeacherForm from './TeacherForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import { statusStyle, getGender } from '../util/formatter'

@inject('teacherStore', 'departmentStore')
@observer

class TeacherManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teacher: {
        teacherId: null,
        firstName: null,
        lastName: null,
        gender: true,
        phone: null,
        email: null,
        address: null,
        departmentId: null
      }
    }

    this.departmentMapping = this.props.departmentStore.objectMap

    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: true,
          canRemove: true,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeTeacher.bind(this)
        }
      },
      { headerName: 'Mã giảng viên', field: 'teacherId', sortable: true },
      { headerName: 'Họ', field: 'lastName', sortable: true },
      { headerName: 'Tên', field: 'firstName', sortable: true },
      { headerName: 'Giới tính', field: 'gender', sortable: true, width: 80, cellRendererFramework: (params) => getGender(params.value) },
      { headerName: 'Điện thoại', field: 'phone', sortable: true },
      { headerName: 'Email', field: 'email', sortable: true },
      { headerName: 'Địa chỉ', field: 'address', sortable: true },
      { headerName: 'Mã khoa', field: 'departmentId', sortable: true, hide: true },
      { headerName: 'Khoa', field: 'department.departmentName', sortable: true }
    ]

    this.gridOptions = {
      rowHeight: 34,
      localeText: {
        page: 'Trang',
        to: 'đến',
        of: 'tổng số',
        previous: 'Trước',
        next: 'Kế tiếp',
        last: 'Cuối',
        first: 'Đầu',
        noRowsToShow: 'Không có dữ liệu'
      }
    }
    this.getInfo = this.getInfo.bind(this)
    this.createTeacher = this.createTeacher.bind(this)
    this.updateTeacher = this.updateTeacher.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.teacherStore.entities)
  }

  openEditForm(teacher) {
    this.setState({ teacher })
    this.refTemplate.openDialog()
  }

  async createTeacher() {
    let { teacher } = this.state
    const result = await this.props.teacherStore.create(teacher)
    if (result.status === 201) {
      showNotification('Thêm giảng viên thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm giảng viên thất bại', 'error')
    }
  }

  async updateTeacher() {
    let { teacher } = this.state
    const result = await this.props.teacherStore.update(teacher)
    if (result.status === 200) {
      showNotification('Cập nhật giảng viên thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật giảng viên thất bại', 'error')
    }
  }

  removeTeacher(teacher) {
    showConfirm(
      'Bạn có muốn xóa giảng viên không?',
      async () => {
        const result = await this.props.teacherStore.delete(teacher.teacherId)
        if (result.status === 200) {
          showNotification('Xóa giảng viên thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa giảng viên thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.teacher[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      teacher: {
        teacherId: null,
        firstName: null,
        lastName: null,
        gender: true,
        phone: null,
        email: null,
        address: null,
        departmentId: null
      }
    })
  }

  componentDidMount() {
    this.props.teacherStore.fetchAll()
  }

  render() {
    let { teacherId, firstName, lastName, gender, phone, email, address, departmentId } = this.state.teacher
    let { entities } = this.props.teacherStore
    return (
      <>
        <ModalForm
          title='Giảng viên'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createTeacher}
          handleUpdate={this.updateTeacher}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!teacherId || !firstName || !lastName}
        >
          <TeacherForm
            teacherId={teacherId}
            firstName={firstName}
            lastName={lastName}
            gender={gender}
            phone={phone}
            email={email}
            address={address}
            departmentId={departmentId}
            getInfo={this.getInfo}
          />
        </ModalForm>
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={entities}
            animateRows={true}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            pagination={true}
            paginationAutoPageSize={true}
            frameworkComponents={{
              editButton: ModifyButtonGrid
            }}
          />
        </div>
      </>
    )
  }
}

export default TeacherManagement
