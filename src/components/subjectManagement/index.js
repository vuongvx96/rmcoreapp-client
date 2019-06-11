import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import SubjectForm from './SubjectForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

@inject('subjectStore')
@observer

class SubjectManagement extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      subject: {
        subjectId: null,
        dsubjectName: null,
        credits: null
      }
    }

    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('SUBJECT').update,
          canRemove: this.props.permission.hasPermission('SUBJECT').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeSubject.bind(this)
        }
      },
      { headerName: 'Mã môn', field: 'subjectId', sortable: true },
      { headerName: 'Tên môn', field: 'subjectName', sortable: true, width: 500 },
      { headerName: 'Số tín chỉ', field: 'credits', sortable: true}
    ]

    this.gridOptions = {
      rowHeight: 34,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }
    this.getInfo = this.getInfo.bind(this)
    this.createSubject = this.createSubject.bind(this)
    this.updateSubject = this.updateSubject.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.subjectStore.entities)
  }

  openEditForm(subject) {
    this.setState({ subject })
    this.refTemplate.openDialog()
  }

  async createSubject() {
    let { subject } = this.state
    const result = await this.props.subjectStore.create(subject)
    if (result.status === 201) {
      showNotification('Thêm môn thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm môn thất bại', 'error')
    }
  }

  async updateSubject() {
    let { subject } = this.state
    const result = await this.props.subjectStore.update(subject)
    if (result.status === 200) {
      showNotification('Cập nhật môn thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật môn thất bại', 'error')
    }
  }

  removeSubject(subject) {
    showConfirm(
      'Bạn có muốn xóa môn không?',
      async () => {
        const result = await this.props.subjectStore.delete(subject.subjectId)
        if (result.status === 200) {
          showNotification('Xóa môn thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa môn thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.subject[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      subject: {
        subjectId: null,
        subjectName: null,
        credits: null
      }
    })
  }

  componentDidMount() {
    this.props.subjectStore.fetchAll()
  }

  render() {
    let { subjectId, subjectName, credits } = this.state.subject
    let { entities } = this.props.subjectStore
    return (
      <>
        <ModalForm
          title='Môn'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createSubject}
          handleUpdate={this.updateSubject}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!subjectId || !subjectName}
          canCreate={this.props.permission.hasPermission('SUBJECT').create}
        >
          <SubjectForm
            subjectId={subjectId}
            subjectName={subjectName}
            credits={credits}
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
            frameworkComponents={{
              editButton: ModifyButtonGrid
            }}
          />
        </div>
      </>
    )
  }
}

export default SubjectManagement
