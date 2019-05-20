import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { inject, observer } from 'mobx-react'

import RoomForm from './RoomForm'
import ModalForm from '../template/modalForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { showNotification } from '../util/notification'
import { showConfirm } from '../util/confirm'

@inject('roomStore')
@observer
class RoomManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            room: {
                roomId: null,
                capacity: 0,
                location: null,
                validIP: null,
                note: null
            }
        }

        this.columnDefs = [
            {
                cellRenderer: 'editButton',
                cellRendererParams: {
                    canEdit: true,
                    canRemove: true,
                    onEdit: this.openEditForm.bind(this),
                    onRemove: this.removeRoom.bind(this)
                }
            },
            { headerName: 'Mã phòng', field: 'roomId', width: 110, sortable: true },
            { headerName: 'Sức chứa', field: 'capacity', width: 100, sortable: true },
            { headerName: 'Vị trí', field: 'location', width: 100, sortable: true },
            { headerName: 'IP chính', field: 'validIP', width: 120, sortable: true },
            { headerName: 'SL máy tính', field: 'amountComp', colId: 'c1', hide: true },
            { headerName: 'SL máy chiếu', field: 'amountProj', colId: 'c2', hide: true },
            { headerName: 'Ghi chú', field: 'note', colId: 'note', hide: true },
            { headerName: 'Trang thiết bị', field: 'detail', width: 510 }
        ]

        this.gridOptions = {
            rowHeight: 34
        }
        this.getInfo = this.getInfo.bind(this)
        this.createRoom = this.createRoom.bind(this)
        this.updateRoom = this.updateRoom.bind(this)
        this.clearState = this.clearState.bind(this)
    }

    onGridReady = params => {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
    }

    refetchData() {
        this.gridApi.setRowData(this.props.roomStore.listRooms)
    }

    openEditForm(room) {
        this.setState({ room })
        this.refTemplate.openDialog()
    }

    async createRoom() {
        let { room } = this.state
        const result = await this.props.roomStore.create(room)
        if (result.status === 201) {
            showNotification('Thêm phòng thành công', 'success')
            this.refetchData()
        } else {
            showNotification('Thêm phòng thất bại', 'error')
        }
    }

    async updateRoom() {
        let { room } = this.state
        const result = await this.props.roomStore.update(room)
        if (result.status === 204) {
            showNotification('Cập nhật phòng thành công', 'success')
            this.refetchData()
        } else {
            showNotification('Cập nhật phòng thất bại', 'error')
        }
    }

    removeRoom(room) {
        showConfirm(
            'Bạn có muốn xóa phòng không?',
            async () => {
                const result = await this.props.roomStore.delete(room.roomId)
                if (result.status === 204) {
                    showNotification('Xóa phòng thành công', 'success')
                    this.refetchData()
                } else {
                    showNotification('Xóa phòng thất bại', 'error')
                }
            }
        )
    }


    getInfo(field, value) {
        this.setState((prevState) => {
            prevState.room[field] = value
            return prevState
        })
    }

    clearState() {
        this.setState({
            room: {
                roomId: null,
                capacity: 0,
                location: null,
                validIP: null,
                note: null
            }
        })
    }

    componentDidMount() {
        this.props.roomStore.fetchAll()
    }

    render() {
        let { roomId, capacity, location, validIP, note  } = this.state.room
        let entities = this.props.roomStore.listRooms
        return (
            <>
                <ModalForm
                    title='Phòng'
                    buttonName='Thêm mới'
                    modalWidth={600}
                    handleCreate={this.createRoom}
                    handleUpdate={this.updateRoom}
                    clearState={this.clearState}
                    getRef={ref => { this.refTemplate = ref }}
                    disableButtonSave={!roomId}
                >
                    <RoomForm
                        roomId={roomId}
                        capacity={capacity}
                        location={location}
                        validIP={validIP}
                        note={note}
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

export default RoomManagement
