import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Spin, Divider, Select, Input, Button } from 'antd'
import { inject, observer } from 'mobx-react'

import EquipmentForm from './EquipmentForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import { dateFormatter, statusStyle, getStatus } from '../util/formatter'

@inject('equipmentStore', 'roomStore')
@observer
class EquipmentManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      equipment: {
        equipmentId: null,
        equipmentName: null,
        manufacturerId: null,
        roomId: null,
        serial: null,
        status: true
      },
      roomId: null,
      keyword: null
    }

    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('DEVICE').update,
          canRemove: this.props.permission.hasPermission('DEVICE').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeEquipment.bind(this)
        }
      },
      { headerName: 'Mã thiết bị', field: 'equipmentId', sortable: true, width: 110 },
      { headerName: 'Tên thiết bị', field: 'equipmentName', sortable: true, width: 220 },
      { headerName: 'Mã hãng sản xuất', field: 'manufacturerId', hide: true },
      { headerName: 'Hãng', field: 'manufacturer.manufacturerName', sortable: true, width: 100 },
      { headerName: 'Phòng', field: 'roomId', sortable: true, width: 80 },
      { headerName: 'Serial', field: 'serial', sortable: true, width: 100 },
      { headerName: 'Ngày tạo', field: 'createdDate', sortable: true, width: 120, valueFormatter: (params) => dateFormatter(params.value) },
      { headerName: 'Ngày cập nhật', field: 'modifiedDate', sortable: true, width: 120, valueFormatter: (params) => dateFormatter(params.value) },
      { headerName: 'Trạng thái', field: 'status', sortable: true, width: 80, cellStyle: statusStyle, cellRendererFramework: (params) => getStatus(params.value) }
    ]

    this.gridOptions = {
      rowHeight: 34,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }

    this.getInfo = this.getInfo.bind(this)
    this.createEquipment = this.createEquipment.bind(this)
    this.updateEquipment = this.updateEquipment.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.equipmentStore.equipments)
  }

  openEditForm(equipment) {
    this.setState({ equipment })
    this.refTemplate.openDialog()
  }

  async createEquipment() {
    let { equipment } = this.state
    const result = await this.props.equipmentStore.create(equipment)
    if (result.status === 201) {
      showNotification('Thêm thiết bị thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm thiết bị sản xuất thất bại', 'error')
    }
  }

  async updateEquipment() {
    let { equipment } = this.state
    delete equipment.manufacturer
    const result = await this.props.equipmentStore.update(equipment)
    if (result.status === 200) {
      showNotification('Cập nhật thiết bị thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật thiết bị thất bại', 'error')
    }
  }

  removeEquipment(equipment) {
    showConfirm(
      'Bạn có muốn xóa thiết bị',
      async () => {
        const result = await this.props.equipmentStore.delete(equipment.equipmentId)
        if (result.status === 200) {
          showNotification('Xóa thiết bị thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa thiết bị thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.equipment[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      equipment: {
        equipmentId: null,
        equipmentName: null,
        manufacturerId: null,
        roomId: null,
        serial: null,
        status: true
      }
    })
  }

  componentDidMount() {
    this.props.equipmentStore.fetchAll(this.state.roomId, this.state.keyword)
    this.props.roomStore.fetchAll()
  }

  render() {
    const { equipments, total, activeCount, loading } = this.props.equipmentStore
    let { equipmentId, equipmentName, manufacturerId, roomId, serial, status } = this.state.equipment
    const { listRoomIds } = this.props.roomStore
    return (
      <Spin spinning={loading} tip='Đang load dữ liệu...'>
        <ModalForm
          title='Máy tính'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createEquipment}
          handleUpdate={this.updateEquipment}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!equipmentId || !equipmentName || !serial}
          canCreate={this.props.permission.hasPermission('DEVICE').create}
          leftItems={
            <>
              <Select
                showSearch
                allowClear
                placeholder='Phòng'
                style={{ width: 150, color: 'rgba(0,0,0,.65)', marginRight: 5 }}
                onChange={(value) => this.setState({ roomId: value })}
              >
                {
                  listRoomIds.map(roomId => (
                    <Select.Option key={roomId} value={roomId}>{roomId}</Select.Option>
                  ))
                }
              </Select>
              <Input placeholder='Từ khóa (mã, tên, ...)' allowClear style={{ marginRight: 10 }} onChange={({ target }) => {
                this.setState({ keyword: target.value.trim() })
              }} />
              <Button shape='round' icon='search' onClick={async () => {
                await this.props.equipmentStore.fetchAll(this.state.roomId, this.state.keyword)
                this.refetchData()
              }} />
            </>
          }
        >
          <EquipmentForm
            equipmentId={equipmentId}
            equipmentName={equipmentName}
            manufacturerId={manufacturerId}
            roomId={roomId}
            serial={serial}
            status={status}
            getInfo={this.getInfo}
          />
        </ModalForm>
        <div style={{ height: 'calc(100vh - 220px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={equipments}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            frameworkComponents={{
              editButton: ModifyButtonGrid
            }}
          />
        </div>
        <div className='flex-container' style={{ padding: '10px 0' }}>
          <div className='left-items'>
            <span style={{ color: '#092b00' }}>Tổng số: {total}</span>
            <Divider type="vertical" />
            <span style={{ color: '#092b00' }}>Hoạt động: {activeCount}</span>
          </div>
        </div>
      </Spin>
    )
  }
}

export default EquipmentManagement