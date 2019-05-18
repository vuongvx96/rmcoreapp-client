import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import MajorForm from './MajorForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

@inject('majorStore', 'departmentStore')
@observer
class MajorManagement extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            major: {
                majorId: null,
                majorName: null,
                departmentId: null
            }
        }

        const { departmentStore } = this.props

        this.columnDefs = [
            {
                cellRenderer: 'editButton',
                cellRendererParams: {
                    canEdit: true,
                    canRemove: true,
                    onEdit: this.openEditForm.bind(this),
                    onRemove: this.removeMajor.bind(this)
                }
            },
            { headerName: 'Mã chuyên ngành', field: 'majorId', sortable: true },
            { headerName: 'Tên chuyên ngành', field: 'majorName', sortable: true },
            {
                headerName: 'Mã khoa', field: 'departmentId', sortable: true
            }
        ]

        this.gridOptions = {
            rowHeight: 34
        }
        this.getInfo = this.getInfo.bind(this)
        this.createMajor = this.createMajor.bind(this)
        this.updateMajor = this.updateMajor.bind(this)
        this.clearState = this.clearState.bind(this)
    }

    onGridReady = params => {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
    }

    refetchData() {
        this.gridApi.setRowData(this.props.majorStore.entities)
    }

    openEditForm(major) {
        this.setState({ major })
        this.refTemplate.openDialog()
    }

    async createMajor() {
        let { major } = this.state
        const result = await this.props.majorStore.create(major)
        if (result.status === 201) {
            showNotification('Thêm chuyên ngành thành công', 'success')
            this.refetchData()
        } else {
            showNotification('Thêm chuyên ngành thất bại', 'error')
        }
    }

    async updateMajor() {
        let { major } = this.state
        const result = await this.props.majorStore.update(major)
        if (result.status === 204) {
            showNotification('Cập nhật chuyên ngành thành công', 'success')
            this.refetchData()
        } else {
            showNotification('Cập nhật chuyên ngành thất bại', 'error')
        }
    }

    removeMajor(major) {
        showConfirm(
            'Bạn có muốn xóa chuyên ngành không?',
            async () => {
                const result = await this.props.majorStore.delete(major.majorId)
                if (result.status === 204) {
                    showNotification('Xóa chuyên ngành thành công', 'success')
                    this.refetchData()
                } else {
                    showNotification('Xóa chuyên ngành thất bại', 'error')
                }
            }
        )
    }

    getInfo(field, value) {
        this.setState((prevState) => {
            prevState.major[field] = value
            return prevState
        })
    }

    clearState() {
        this.setState({
            major: {
                majorId: null,
                majorName: null,
                departmentId: null
            }
        })
    }

    componentDidMount() {
        this.props.departmentStore.fetchAll()
        this.props.majorStore.fetchAll()
    }

    render() {
        let { majorId, majorName, departmentId } = this.state.major
        let { entities } = this.props.majorStore
        return (
            <>
                <ModalForm
                    title='Chuyên ngành'
                    buttonName='Thêm mới'
                    modalWidth={600}
                    handleCreate={this.createMajor}
                    handleUpdate={this.updateMajor}
                    clearState={this.clearState}
                    getRef={ref => { this.refTemplate = ref }}
                    disableButtonSave={!majorId || !majorName}
                >
                    <MajorForm
                        majorId={majorId}
                        majorName={majorName}
                        departmentId={departmentId}
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

export default MajorManagement
