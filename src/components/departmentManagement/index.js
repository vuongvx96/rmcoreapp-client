import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import DepartmentForm from './DepartmentForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

@inject('departmentStore')
@observer
class DepartmentManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            department: {
                departmentId: null,
                departmentName: null,
            }
        }

        this.columnDefs = [
            {
                cellRenderer: 'editButton',
                cellRendererParams: {
                    canEdit: true,
                    canRemove: true,
                    onEdit: this.openEditForm.bind(this),
                    onRemove: this.removeDepartment.bind(this)
                }
            },
            { headerName: 'Mã khoa', field: 'departmentId', sortable: true },
            { headerName: 'Tên khoa', field: 'departmentName', sortable: true, width: 500 }
        ]

        this.gridOptions = {
            rowHeight: 34
        }
        this.getInfo = this.getInfo.bind(this)
        this.createDepartment = this.createDepartment.bind(this)
        this.updateDepartment = this.updateDepartment.bind(this)
        this.clearState = this.clearState.bind(this)
    }

    onGridReady = params => {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
    }

    refetchData() {
        this.gridApi.setRowData(this.props.departmentStore.entities)
    }

    openEditForm(department) {
        this.setState({ department })
        this.refTemplate.openDialog()
    }

    async createDepartment() {
        let { department } = this.state
        const result = await this.props.departmentStore.create(department)
        if (result.status === 201) {
            showNotification('Thêm khoa thành công', 'success')
            this.refetchData()
        } else {
            showNotification('Thêm khoa thất bại', 'error')
        }
    }

    async updateDepartment() {
        let { department } = this.state
        const result = await this.props.departmentStore.update(department)
        if (result.status === 204) {
            showNotification('Cập nhật khoa thành công', 'success')
            this.refetchData()
        } else {
            showNotification('Cập nhật khoa thất bại', 'error')
        }
    }

    removeDepartment(department) {
        showConfirm(
            'Bạn có muốn xóa khoa không?',
            async () => {
                const result = await this.props.departmentStore.delete(department.departmentId)
                if (result.status === 204) {
                    showNotification('Xóa khoa thành công', 'success')
                    this.refetchData()
                } else {
                    showNotification('Xóa khoa thất bại', 'error')
                }
            }
        )
    }


    getInfo(field, value) {
        this.setState((prevState) => {
            prevState.department[field] = value
            return prevState
        })
    }

    clearState() {
        this.setState({
            department: {
                departmentId: null,
                departmentName: null
            }
        })
    }

    componentDidMount() {
        this.props.departmentStore.fetchAll()
    }

    render() {
        let { departmentId, departmentName } = this.state.department
        let { entities } = this.props.departmentStore
        return (
            <>
                <ModalForm
                    title='Khoa'
                    buttonName='Thêm mới'
                    modalWidth={600}
                    handleCreate={this.createDepartment}
                    handleUpdate={this.updateDepartment}
                    clearState={this.clearState}
                    getRef={ref => { this.refTemplate = ref }}
                    disableButtonSave={!departmentId || !departmentName}
                >
                    <DepartmentForm
                        departmentId={departmentId}
                        departmentName={departmentName}
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

export default DepartmentManagement
