import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Pagination, Select, Input, Button } from 'antd'

import GroupPracticeForm from './GroupPracticeForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import { dateFormatter } from '../util/formatter'

@inject('groupPracticeStore', 'teacherStore', 'subjectStore', 'classStore')
@observer

class GroupPracticeManagement extends React.Component{
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
        semester: null,
        schoolYear: String(getYear()),
        startDate: null,
        endDate: null
      }
    }

    this.teacherMapping = this.props.teacherStore.objectMap
    this.subjectMapping = this.props.subjectStore.objectMap
    this.classMapping = this.props.classStore.objectMap
    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: true,
          canRemove: true,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeGroupPractice.bind(this)
        }
      },
      { headerName: 'Nhóm TH', field: 'groupName', sortable: true },
      { headerName: 'Môn học', field: 'subject.subjectName', sortable: true },
      { headerName: 'Lớp học', field: 'class.classId', sortable: true },
      { headerName: 'Giảng viên', field: 'teacher.firstName', sortable: true, valueFormatter: (params) => params.data.teacher.lastName + ' ' + params.value },
      { headerName: 'Sỉ số', field: 'classSize', sortable: true},
      { headerName: 'Học kỳ', field: 'semester', sortable: true},
      { headerName: 'Năm học', field: 'schoolYear', sortable: true, valueFormatter: (params) => `${params.value} - ${(Number(params.value)+1)}` },
      { headerName: 'Ngày bắt đầu', field: 'startDate', sortable: true, valueFormatter: (params) => dateFormatter(params.value) },
      { headerName: 'Ngày kết thúc', field: 'endDate', sortable: true, valueFormatter: (params) => dateFormatter(params.value) }
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
    this.createGroupPractice = this.createGroupPractice.bind(this)
    this.updateGroupPractice = this.updateGroupPractice.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.groupPracticeStore.groupPractices)
  }

  openEditForm(groupPractice) {
    this.setState({ groupPractice })
    this.refTemplate.openDialog()
  }

  async createGroupPractice() {
    let { groupPractice } = this.state
    const result = await this.props.groupPracticeStore.create(groupPractice)
    if (result.status === 201) {
      showNotification('Thêm nhóm TH thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm nhóm TH thất bại', 'error')
    }
  }

  async updateGroupPractice() {
    let { groupPractice } = this.state
    const result = await this.props.groupPracticeStore.update(groupPractice)
    if (result.status === 200) {
      showNotification('Cập nhật nhóm TH thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật nhóm TH thất bại', 'error')
    }
  }

  removeGroupPractice(groupPractice) {
    showConfirm(
      'Bạn có muốn xóa nhóm TH này không?',
      async () => {
        const result = await this.props.groupPracticeStore.delete(groupPractice.groupId)
        if (result.status === 200) {
          showNotification('Xóa nhóm TH thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa nhóm TH thất bại', 'error')
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
        classSize: null,
        semester: null,
        schoolYear: String(getYear()),
        startDate: null,
        endDate: null
      }
    })
  }

  componentDidMount() {
    this.props.groupPracticeStore.fetchAll()
  }

  render() {
    let { groupName, teacherId, subjectId, classId, classSize, semester, schoolYear, startDate, endDate } = this.state.groupPractice
    let { groupPractices } = this.props.groupPracticeStore
    return (
      <>
        <ModalForm
          title='Nhóm thực hành'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createGroupPractice}
          handleUpdate={this.updateGroupPractice}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!groupName}
        >
          <GroupPracticeForm
            groupName={groupName}
            teacherId={teacherId}
            subjectId={subjectId}
            classId={classId}
            classSize={classSize}
            semester={semester}
            schoolYear={schoolYear}
            startDate={startDate}
            endDate={endDate}
            getInfo={this.getInfo}
          />
        </ModalForm>
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={groupPractices}
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
