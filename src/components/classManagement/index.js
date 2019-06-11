import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import ClassForm from './ClassForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

@inject('classStore', 'majorStore')
@observer
class ClassManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Class: {
        classId: null,
        majorId: null
      }
    }

    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('CLASS').update,
          canRemove: this.props.permission.hasPermission('CLASS').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeClass.bind(this)
        }
      },
      { headerName: 'Mã lớp', field: 'classId', sortable: true },
      { headerName: 'Mã chuyên ngành', field: 'majorId', hide: true },
      { headerName: 'Chuyên ngành', field: 'major.majorName', sortable: true },
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
    this.createClass = this.createClass.bind(this)
    this.updateClass = this.updateClass.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.classStore.entities)
  }

  openEditForm(Class) {
    this.setState({ Class })
    this.refTemplate.openDialog()
  }

  async createClass() {
    let { Class } = this.state
    const result = await this.props.classStore.create(Class)
    if (result.status === 201) {
      showNotification('Thêm lớp thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm lớp thất bại', 'error')
    }
  }

  async updateClass() {
    let { Class } = this.state
    const result = await this.props.classStore.update(Class)
    if (result.status === 200) {
      showNotification('Cập nhật lớp thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật lớp thất bại', 'error')
    }
  }

  removeClass(Class) {
    showConfirm(
      'Bạn có muốn xóa lớp không?',
      async () => {
        const result = await this.props.classStore.delete(Class.classId)
        if (result.status === 200) {
          showNotification('Xóa lớp thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa lớp thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.Class[field] = value
      return prevState
    })
  }
  
  clearState() {
    this.setState({
      Class: {
        classId: null,
        majorId: null
      }
    })
  }

  componentDidMount() {
    this.props.classStore.fetchAll()
  }

  render() {
    let { classId, majorId } = this.state.Class
    let { entities } = this.props.classStore
    return (
      <>
        <ModalForm
          title='Lớp'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createClass}
          handleUpdate={this.updateClass}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!classId}
          canCreate={this.props.permission.hasPermission('CLASS').create}
        >
          <ClassForm
            classId={classId}
            majorId={majorId}
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

export default ClassManagement
