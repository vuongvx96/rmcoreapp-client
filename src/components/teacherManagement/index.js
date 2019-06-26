import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'
import { Pagination, Select, Input, Button } from 'antd'

import TeacherForm from './TeacherForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import { getGender } from '../util/formatter'

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
      },
      page: 1,
      pageSize: 10,
      keyword: null,
      departmentId: null
    }

    this.departmentMapping = this.props.departmentStore.objectMap

    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('TEACHER').update,
          canRemove: this.props.permission.hasPermission('TEACHER').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeTeacher.bind(this)
        }
      },
      { headerName: 'Mã GV', field: 'teacherId', sortable: true, width: 100 },
      { headerName: 'Họ', field: 'lastName', sortable: true, width: 150 },
      { headerName: 'Tên', field: 'firstName', sortable: true, width: 70 },
      { headerName: 'Giới tính', field: 'gender', sortable: true, width: 80, valueFormatter: (params) => getGender(params.value) },
      { headerName: 'Điện thoại', field: 'phone', sortable: true, width: 100 },
      { headerName: 'Email', field: 'email', sortable: true, width: 200 },
      { headerName: 'Địa chỉ', field: 'address', sortable: true, width: 250 },
      { headerName: 'Mã khoa', field: 'departmentId', sortable: true, hide: true },
      { headerName: 'Khoa', field: 'department.departmentName', sortable: true }
    ]

    this.gridOptions = {
      rowHeight: 34,
      suppressMovableColumns: false,
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
    this.gridApi.setRowData(this.props.teacherStore.teachers)
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

  handleChangePage = async (page, pageSize) => {
    this.setState({ page, pageSize })
    await this.props.teacherStore.fetchAllPaging(page, pageSize, this.state.departmentId, this.state.keyword)
    this.refetchData()
  }

  handleChangePageSize = async (current, size) => {
    this.setState({ pageSize: size })
    await this.props.teacherStore.fetchAllPaging(current, size, this.state.departmentId, this.state.keyword)
    this.refetchData()
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    this.props.teacherStore.fetchAllPaging(1, 10, this.state.departmentId, this.state.keyword)
    this.props.departmentStore.fetchAll()
  }

  render() {
    let { teacherId, firstName, lastName, gender, phone, email, address, departmentId } = this.state.teacher
    let { pageSize, rowCount, teachers } = this.props.teacherStore
    let { listDepartments } = this.props.departmentStore
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
          canCreate={this.props.permission.hasPermission('TEACHER').create}
          leftItems={
            <>
              <Select
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                showSearch
                allowClear
                placeholder='Khoa'
                style={{ width: 300, color: 'rgba(0,0,0,.65)', marginRight: 5 }}
                onChange={(value) => this.setState({ departmentId: value })}
              >
                {
                  listDepartments.map(item => (
                    <Select.Option key={item.departmentId} value={item.departmentId}>{item.departmentName}</Select.Option>
                  ))
                }
              </Select>
              <Input placeholder='Từ khóa (mã, tên, ...)' allowClear style={{ width: 300, marginRight: 10 }} onChange={({ target }) => {
                this.setState({ keyword: target.value.trim() })
              }} />
              <Button type='primary' shape='round' icon='search' onClick={async () => {
                await this.props.teacherStore.fetchAllPaging(1, this.state.pageSize, this.state.departmentId, this.state.keyword)
                this.refetchData()
              }} />
            </>
          }
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
        <div style={{ height: 'calc(100vh - 220px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={teachers}
            animateRows={true}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            frameworkComponents={{
              editButton: ModifyButtonGrid
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

export default TeacherManagement
