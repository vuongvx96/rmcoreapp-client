import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import GroupPracticeForm from './GroupPracticeForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

@inject('groupPracticeStore', 'teacherStore', 'subjectStore', 'classStore')
@observer

class GroupPracticeManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groupPractice: {
        groupId: null,
        groupName: null,
        teacherId: null,
        subjectId: null,
        classId: null,
        classSize: null,
        semester: 1,
        schoolYear: String(getYear())
      }
    }

    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('COURSE').update,
          canRemove: this.props.permission.hasPermission('COURSE').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeGroupPractice.bind(this)
        }
      },
      { headerName: 'Nhóm TH', field: 'groupName', width: 120, sortable: true },
      { headerName: 'Môn học', field: 'subject.subjectName', sortable: true },
      { headerName: 'Lớp', field: 'class.classId', width: 100, sortable: true },
      { headerName: 'Giảng viên', field: 'teacher.firstName', sortable: true, valueFormatter: (params) => params.data.teacher.lastName + ' ' + params.value },
      { headerName: 'Sĩ số', field: 'classSize', width: 70, sortable: true },
      { headerName: 'Học kỳ', field: 'semester', width: 85, sortable: true },
      { headerName: 'Năm học', field: 'schoolYear', width: 95, sortable: true, valueFormatter: (params) => `${params.value} - ${(Number(params.value) + 1)}` }
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
    this.createGroupPractice = this.createGroupPractice.bind(this)
    this.updateGroupPractice = this.updateGroupPractice.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
    this.gridColumnApi.autoSizeColumns()
  }

  refetchData() {
    this.gridApi.setRowData(this.props.groupPracticeStore.getGroupPractices)
  }

  openEditForm(groupPractice) {
    this.setState({ groupPractice })
    this.refTemplate.openDialog()
  }

  async createGroupPractice() {
    let { groupPractice } = this.state
    const result = await this.props.groupPracticeStore.create(groupPractice)
    if (result.status === 201) {
      showNotification('Thêm lớp học phần thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm lớp học phần thất bại', 'error')
    }
  }

  async updateGroupPractice() {
    let { groupPractice } = this.state
    const result = await this.props.groupPracticeStore.update(groupPractice)
    if (result.status === 200) {
      showNotification('Cập nhật lớp học phần thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật lớp học phần thất bại', 'error')
    }
  }

  removeGroupPractice(groupPractice) {
    showConfirm(
      'Bạn có muốn xóa lớp học phần này không?',
      async () => {
        const result = await this.props.groupPracticeStore.delete(groupPractice.groupId)
        if (result.status === 200) {
          showNotification('Xóa lớp học phần thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa lớp học phần thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.groupPractice[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      groupPractice: {
        groupName: null,
        teacherId: null,
        subjectId: null,
        classId: null,
        classSize: 0,
        semester: 1,
        schoolYear: String(getYear())
      }
    })
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy - ' + this.props.route.displayName
    this.props.groupPracticeStore.fetchAll()
  }

  render() {
    let { groupName, teacherId, subjectId, classId, classSize, semester, schoolYear } = this.state.groupPractice
    let { getGroupPractices } = this.props.groupPracticeStore
    return (
      <>
        <ModalForm
          title='Lớp học phần'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createGroupPractice}
          handleUpdate={this.updateGroupPractice}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          canCreate={this.props.permission.hasPermission('COURSE').create}
          disableButtonSave={!groupName || !teacherId || !subjectId || !classId || !semester || !schoolYear}
        >
          <GroupPracticeForm
            groupName={groupName}
            teacherId={teacherId}
            subjectId={subjectId}
            classId={classId}
            classSize={classSize}
            semester={semester}
            schoolYear={schoolYear}
            getInfo={this.getInfo}
          />
        </ModalForm>
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={getGroupPractices}
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

function getYear() {
  return new Date().getFullYear()
}

export default GroupPracticeManagement
