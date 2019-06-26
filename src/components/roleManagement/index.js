import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { toast } from 'react-toastify'
import { inject, observer } from 'mobx-react'
import { Button } from 'antd'

import GrantPermission from './GrantPermission'
import RoleForm from './RoleForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'
import './index.less'

const GrantPermissionButton = (params) => {
  return <Button className='btnGrant' icon='eye' onClick={() => params.onClick(params.data.id)}></Button>
}

@inject('roleStore', 'functionStore')
@observer
class RoleManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role: {
        name: null,
        description: null
      },
      visible: false
    }
    this.gridOptions = {
      rowHeight: 34,
      suppressMovableColumns: false,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }
    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('ROLE').update,
          canRemove: this.props.permission.hasPermission('ROLE').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeRole.bind(this)
        }
      },
      { headerName: 'Tên', field: 'name', sortable: true },
      { headerName: 'Mô tả', field: 'description', sortable: true },
      {
        cellRenderer: 'grantButton',
        cellRendererParams: {
          onClick: this.showGrantPermission.bind(this)
        },
        headerName: 'Phân quyền'
      }
    ]
    this.getInfo = this.getInfo.bind(this)
    this.saveRole = this.saveRole.bind(this)
    this.removeRole = this.removeRole.bind(this)
    this.clearState = this.clearState.bind(this)
    this.hideGrantPermission = this.hideGrantPermission.bind(this)
    this.savePermission = this.savePermission.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  refetchData() {
    this.gridApi.setRowData(this.props.roleStore.listRoles)
  }

  openEditForm(role) {
    this.setState({ role })
    this.refTemplate.openDialog()
  }

  async saveRole() {
    let { role } = this.state
    const result = await this.props.roleStore.saveRole(role)
    if (result.status === 200) {
      showNotification('Đã lưu thông tin', 'success')
      this.refetchData()
    } else {
      showNotification('Cập nhật thông tin thất bại', 'error')
    }
  }

  removeRole(role) {
    showConfirm(
      'Bạn có muốn xóa role không?',
      async () => {
        const result = await this.props.roleStore.deleteRole(role.id)
        if (result.status === 200) {
          showNotification('Xóa role thành công', 'success')
          this.refetchData()
        } else {
          showNotification('Xóa role thất bại', 'error')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.role[field] = value
      return prevState
    })
  }

  clearState() {
    this.setState({
      role: {
        name: null,
        description: null
      }
    })
  }

  showGrantPermission(roleId) {
    this.props.functionStore.loadAllPermissions(roleId)
    this.setState({ visible: true })
  }

  hideGrantPermission() {
    this.setState({ visible: false })
  }

  async savePermission() {
    const result = await this.props.functionStore.savePermission()
    if (result.status === 200) {
      this.setState({ visible: false })
      toast.success('Cập nhật quyền thành công')
    } else {
      toast.warn('Cập nhật quyền thất bại!')
    }
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    this.props.roleStore.fetchAll()
  }

  render() {
    const { listRoles, totalCount } = this.props.roleStore
    let { name, description } = this.state.role
    return (
      <>
        <ModalForm
          title='Role'
          buttonName='Tạo mới'
          modalWidth={600}
          handleCreate={this.saveRole}
          handleUpdate={this.saveRole}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          disableButtonSave={!name || !description}
          canCreate={this.props.permission.hasPermission('ROLE').create}
        >
          <RoleForm
            name={name}
            description={description}
            getInfo={this.getInfo}
          />
        </ModalForm>
        <div style={{ height: 'calc(100vh - 175px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={listRoles}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            frameworkComponents={{
              editButton: ModifyButtonGrid,
              grantButton: GrantPermissionButton
            }}
          />
        </div>
        <div className='flex-container' style={{ padding: '10px 0' }}>
          <div className='left-items'>
            <span style={{ color: '#092b00' }}>Tổng số: {totalCount}</span>
          </div>
        </div>
        <GrantPermission visible={this.state.visible} onOk={this.savePermission} onCancel={this.hideGrantPermission} />
      </>
    )
  }
}

export default RoleManagement
