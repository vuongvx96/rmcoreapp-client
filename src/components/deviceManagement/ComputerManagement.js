import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Pagination, Spin, Divider, Select, Input, Button } from 'antd'
import { inject, observer } from 'mobx-react'

import ComputerForm from './ComputerForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import { dateFormatter, statusStyle, getStatus } from '../util/formatter'

@inject('computerStore', 'roomStore')
@observer
class ComputerManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      computer: {
        computerId: null,
        computerName: null,
        manufacturerId: null,
        description: null,
        roomId: null,
        serial: null,
        status: true
      },
      page: 1,
      pageSize: 10,
      keyword: null,
      roomId: null
    }

    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('DEVICE').update,
          canRemove: this.props.permission.hasPermission('DEVICE').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeComputer.bind(this)
        }
      },
      { headerName: 'Mã máy', field: 'computerId', sortable: true, width: 90 },
      { headerName: 'Tên máy', field: 'computerName', sortable: true, width: 120 },
      { headerName: 'Mã hãng sản xuất', field: 'manufacturerId', hide: true },
      { headerName: 'Hãng', field: 'manufacturer.manufacturerName', sortable: true, width: 100 },
      { headerName: 'Phòng', field: 'roomId', sortable: true, width: 80 },
      { headerName: 'Serial', field: 'serial', sortable: true, width: 100 },
      { headerName: 'Cấu hình', field: 'description', sortable: true },
      { headerName: 'Ngày tạo', field: 'createdDate', sortable: true, width: 120, valueFormatter: (params) => dateFormatter(params.value) },
      { headerName: 'Ngày cập nhật', field: 'modifiedDate', sortable: true, width: 120, valueFormatter: (params) => dateFormatter(params.value) },
      { headerName: 'Trạng thái', field: 'status', sortable: true, width: 80, cellStyle: statusStyle, cellRendererFramework: (params) => getStatus(params.value) }
    ]

    this.gridOptions = {
      rowHeight: 34,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }

    this.getInfo = this.getInfo.bind(this)
    this.createComputer = this.createComputer.bind(this)
    this.updateComputer = this.updateComputer.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.computerStore.computers)
  }

  openEditForm(computer) {
    this.setState({ computer })
    this.refTemplate.openDialog()
  }

  async createComputer() {
    let { computer } = this.state
    const result = await this.props.computerStore.create(computer)
    if (result.status === 201) {
      showNotification('Thêm máy tính thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm máy tính sản xuất thất bại', 'error')
    }
  }

  async updateComputer() {
    let { computer } = this.state
    delete computer.manufacturer
    const result = await this.props.computerStore.update(computer)
    if (result.status === 200) {
      showNotification('Cập nhật máy tính thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật máy tính thất bại', 'error')
    }
  }

  removeComputer(computer) {
    showConfirm(
      'Bạn có muốn xóa máy tính',
      async () => {
        const result = await this.props.computerStore.delete(computer.computerId)
        if (result.status === 200) {
          showNotification('Xóa máy tính thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa máy tính thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.computer[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      computer: {
        computerId: null,
        computerName: null,
        manufacturerId: null,
        description: null,
        roomId: null,
        serial: null,
        status: true
      }
    })
  }

  handleChangePage = async (page, pageSize) => {
    this.setState({ page, pageSize })
    await this.props.computerStore.fetchAllPaging(page, pageSize, this.state.roomId, this.state.keyword)
    this.refetchData()
  }

  handleChangePageSize = async (current, size) => {
    this.setState({ pageSize: size })
    await this.props.computerStore.fetchAllPaging(current, size, this.state.roomId, this.state.keyword)
    this.refetchData()
  }

  componentDidMount() {
    this.props.computerStore.fetchAllPaging(1, 10, this.state.roomId, this.state.keyword)
    this.props.roomStore.fetchAll()
  }

  render() {
    const { pageSize, rowCount, activeCount, loading, computers } = this.props.computerStore
    let { computerId, computerName, manufacturerId, description, roomId, serial, status } = this.state.computer
    const { listRoomIds } = this.props.roomStore
    return (
      <Spin spinning={loading} tip='Đang load dữ liệu...'>
        <ModalForm
          title='Máy tính'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createComputer}
          handleUpdate={this.updateComputer}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!computerId || !computerName || !serial}
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
                await this.props.computerStore.fetchAllPaging(1, this.state.pageSize, this.state.roomId, this.state.keyword)
                this.refetchData()
              }} />
            </>
          }
        >
          <ComputerForm
            computerId={computerId}
            computerName={computerName}
            manufacturerId={manufacturerId}
            description={description}
            roomId={roomId}
            serial={serial}
            status={status}
            getInfo={this.getInfo}
          />
        </ModalForm>
        <div style={{ height: 'calc(100vh - 220px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={computers}
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
            <Divider type="vertical" />
            <span style={{ color: '#092b00' }}>Số máy hoạt động: {activeCount}</span>
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
      </Spin>
    )
  }
}

export default ComputerManagement