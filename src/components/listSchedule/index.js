import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { Select, Input, Button, Spin } from 'antd'

import './index.less'

const { Option } = Select

@inject('scheduleStore')
@observer
class ListSchedule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        }

        this.columnDefs = [
            { headerName: 'Ngày bắt đầu', field: 'startDate', width: 120, sortable: true },
            { headerName: 'Môn học', field: 'groupPractice.subject.subjectName', sortable: true },
            { headerName: 'Lớp', field: 'groupPractice.classId', width: 90, sortable: true },
            { headerName: 'Giáo viên', field: 'groupPractice.teacher.firstName', sortable: true, valueFormatter: (params) => params.data.groupPractice.teacher.lastName + ' ' + params.value },
            { headerName: 'Khung giờ', field: 'description', tooltipField: 'description', sortable: true },
            { headerName: 'Ngày tạo', field: 'createdDate', width: 120, sortable: true },
            { headerName: 'Ngày cập nhật', field: 'modifiedDate', width: 120, sortable: true },
            { headerName: 'User cập nhật', field: 'modifiedBy', sortable: true }
        ]

        this.gridOptions = {
            rowHeight: 34,
            enableBrowserTooltips: true,
            suppressMovableColumns: false,
            localeText: { noRowsToShow: 'Không có dữ liệu' }
        }
    }

    onGridReady = params => {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
    }

    componentDidMount() {
        document.title = 'Lịch phòng máy | ' + this.props.route.displayName
        const { month, year } = this.state
        this.props.scheduleStore.getAllScheduleWithDetail(month, year)
    }

    render() {
        let { getScheduleWithDetailsJS, loading } = this.props.scheduleStore
        return (
            <div className='list-schedule'>
                <Spin spinning={loading}>
                <div className='flex-container' style={{ paddingBottom: 10, width: '100%' }}>
                    <div className='left-items'>
                        <span>Chọn tháng:</span>
                        <Select style={{ width: 70 }} defaultValue={new Date().getMonth() + 1} onChange={(value) => 
                            this.setState({ month: value })
                        }>
                            {
                                _.range(1, 13).map(x => (
                                    <Option key={x} value={x}>{x}</Option>
                                ))
                            }
                        </Select>
                        <span>Chọn năm:</span>
                        <Select style={{ width: 90 }} defaultValue={new Date().getFullYear()} onChange={(value) => {
                            this.setState({ year: value })
                        }}>
                            {
                                _.range(new Date().getFullYear() - 10, new Date().getFullYear() + 10).map(x => (
                                    <Option key={x} value={x}>{x}</Option>
                                ))
                            }
                        </Select>
                        <Button type='primary' onClick={() => {
                            const { month, year } = this.state
                            this.props.scheduleStore.getAllScheduleWithDetail(month, year)
                        }}>
                            Xem
                        </Button>
                        <Input style={{ width: 180, marginLeft: 15 }} allowClear placeholder='Tìm...' onChange={({ target }) => {
                            this.props.scheduleStore.changeKeyword(target.value)
                            this.gridApi.setRowData(getScheduleWithDetailsJS)
                        }}/>
                    </div>
                </div>
                <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={this.columnDefs}
                        rowData={getScheduleWithDetailsJS}
                        animateRows={true}
                        onGridReady={this.onGridReady}
                        gridOptions={this.gridOptions}
                    />
                    </div>
                </Spin>
            </div>
        )
    }
}

export default ListSchedule