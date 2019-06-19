import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer} from 'mobx-react'

import ManuFacturerForm from './ManufacturerForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

@inject('manufacturerStore')
@observer
class ManufacturerManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      manufacturer: {
        manufacturerId: null,
        manufacturerName: null,
        manufacturerContact: null
      }
    }
    this.columnDefs= [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('MANUFACTURER').update,
          canRemove: this.props.permission.hasPermission('MANUFACTURER').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeManufacturer.bind(this)
        }
      },
      { headerName: 'Mã hãng', field: 'manufacturerId', sortable: true },
      { headerName: 'Tên hãng', field: 'manufacturerName', sortable: true },
      { headerName: 'Thông tin liên hệ', field: 'manufacturerContact' }
    ]
    this.gridOptions = {
      rowHeight: 34,
      suppressMovableColumns: false,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }
    this.getInfo = this.getInfo.bind(this)
    this.createManufacturer = this.createManufacturer.bind(this)
    this.updateManufacturer = this.updateManufacturer.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.manufacturerStore.entities)
  }

  openEditForm(manufacturer) {
    this.setState({ manufacturer })
    this.refTemplate.openDialog()
  }

  async createManufacturer() {
    let { manufacturer } = this.state
    const result = await this.props.manufacturerStore.create(manufacturer)
    if (result.status === 201) {
      showNotification('Thêm hãng sản xuất thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Thêm hãng sản xuất thất bại', 'error')
    }
  }

  async updateManufacturer() {
    let { manufacturer } = this.state
    const result = await this.props.manufacturerStore.update(manufacturer)
    if (result.status === 200) {
      showNotification('Cập nhật hãng sản xuất thành công', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật hãng sản xuất thất bại', 'error')
    }
  }

  removeManufacturer(manufacturer) {
    showConfirm(
      'Bạn có muốn xóa hãng sản xuất',
      async () => {
        const result = await this.props.manufacturerStore.delete(manufacturer.manufacturerId)
        if (result.status === 200) {
          showNotification('Xóa hãng sản xuất thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa hãng sản xuất thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.manufacturer[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      manufacturer: {
        manufacturerId: null,
        manufacturerName: null,
        manufacturerContact: null
      }
    })
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy - ' + this.props.route.displayName
    this.props.manufacturerStore.fetchAll()
  }

  render() {
    let { manufacturerId, manufacturerName, manufacturerContact } = this.state.manufacturer
    let { entities } = this.props.manufacturerStore
    return (
      <>
        <ModalForm
          title='Hãng sản xuất'
          buttonName='Thêm mới'
          modalWidth={600}
          handleCreate={this.createManufacturer}
          handleUpdate={this.updateManufacturer}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!manufacturerId || !manufacturerName}
          canCreate={this.props.permission.hasPermission('MANUFACTURER').create}
        >
          <ManuFacturerForm
            manufacturerId={manufacturerId}
            manufacturerName={manufacturerName}
            manufacturerContact={manufacturerContact}
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

export default ManufacturerManagement
