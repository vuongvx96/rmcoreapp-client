import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import BrokenDeviceForm from './BrokenDeviceForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

import { statusStyle, getStatus } from '../util/formatter'

@inject('brokenDeviceStore')
@observer

class BrokenDeviceManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brokenDevice: {
        deviceId: null,
        userId: null,
        description: null,
        cost: null,
        fixed: true
      }
    }

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
    this.createBrokenDevice = this.createBrokenDevice.bind(this)
    this.updateBrokenDevice = this.updateBrokenDevice.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.brokenDeviceStore.brokenDevices)
  }

  openEditForm(brokenDevice) {
    this.setState({ brokenDevice })
    this.refTemplate.openDialog()
  }

  async createBrokenDevice() {
    let { brokenDevice } = this.state
    const result = await this.props.brokenDeviceStore.create(brokenDevice)
    if (result.status === 201) {
      showNotification('Báo hỏng thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Báo hỏng thất bại', 'error')
    }
  }

  async updateBrokenDevice() {
    let { brokenDevice } = this.state
    const result = await this.props.brokenDeviceStore.update(brokenDevice)
    if (result.status === 200) {
      showNotification('Cập nhật báo hỏng thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật báo hỏng thất bại', 'error')
    }
  }
  
  removeBrokenDevice(brokenDevice) {
    showConfirm(
      'Bạn có muốn xóa thông tin báo hỏng không?',
      async () => {
        const result = await this.props.brokenDeviceStore.delete(brokenDevice.id)
        
        if (result.status === 200) {
          showNotification('Xóa báo hỏng thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa báo hỏng thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.brokenDevice[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      brokenDevice: {
        deviceId: null,
        userId: null,
        description: null,
        cost: null,
        fixed: true
      }
    })
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    this.props.brokenDeviceStore.fetchAll()
  }

  render() {
    let { deviceId, userId, description, cost, fixed } = this.state.brokenDevice

    let { brokenDevices } = this.props.brokenDeviceStore

    let columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('BROKEN_DEVICE').update,
          canRemove: this.props.permission.hasPermission('BROKEN_DEVICE').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeBrokenDevice.bind(this)
        }
      },
      { headerName: 'Mã thiết bị', field: 'deviceId', sortable: true },
      { headerName: 'Mã người dùng', field: 'userId'},
      { headerName: 'Mô tả', field: 'description', sortable: true },
      { headerName: 'Chi phí', field: 'cost', sortable: true },
      { headerName: 'Đã sửa', field: 'fixed', sortable: true, width: 80, cellStyle: statusStyle, cellRendererFramework: (params) => getStatus(params.value)  },
    ]
    return (
      <>
        <ModalForm
          title='Báo hỏng'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createBrokenDevice}
          handleUpdate={this.updateBrokenDevice}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          canCreate={this.props.permission.hasPermission('BROKEN_DEVICE').create}
        >
          <BrokenDeviceForm
            deviceId={deviceId}
            userId={userId}
            description={description}
            cost={cost}
            fixed={fixed}
            getInfo={this.getInfo}
          />
        </ModalForm>
        
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={brokenDevices}
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

export default BrokenDeviceManagement
