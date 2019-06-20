import React from 'react'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { DatePicker, Select, Button, Icon, Tag } from 'antd'
import moment from 'moment'

import locale from 'antd/lib/date-picker/locale/vi_VN'
import { dateFormatter } from '../util/formatter'
import ModalForm from '../template/modalForm'
import './index.less'

@inject('scheduleStore')
@observer
class ScheduleManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timeType: 1,
      isOpen1: false,
      startValue: moment(),
      isOpen2: false,
      endValue: moment()
    }

    this.columnDefs = [
      {
        headerName: 'Ngày bắt đầu',
        field: 'schedule.startDate',
        width: 120,
        sortable: true,
        valueFormatter: (params) => dateFormatter(params.value) },
      {
        headerName: 'Thời gian',
        field: 'dayParting',
        sortable: true,
        width: 95,
        valueFormatter: (params) => params.value === 1 ? 'Sáng' : params.value === 2 ? 'Chiều' : 'Tối'
      },
      {
        headerName: 'Phòng máy',
        field: 'schedule.roomId',
        width: 110,
        sortable: true
      },
      {
        headerName: 'Môn học',
        field: 'schedule.groupPractice.subject.subjectName',
        width: 170,
        tooltipField: 'schedule.groupPractice.subject.subjectName',
        sortable: true
      },
      {
        headerName: 'Giảng viên',
        field: 'schedule.groupPractice.teacher.firstName',
        width: 130,
        tooltipField: 'schedule.groupPractice.teacherId',
        sortable: true,
        valueFormatter: (params) => params.data.schedule.groupPractice.teacher.lastName + ' ' + params.value
      },
      { 
        headerName: 'Loại lặp',
        field: 'schedule.repeatType',
        width: 90,
        sortable: true,
        valueFormatter: (params) => params.value === 1 ? 'Theo tuần' : params.value === 2 ? 'Theo tháng' : 'Theo ngày'
      },
      {
        headerName: 'Số lần lặp',
        field: 'count',
        width: 100,
        sortable: true
      },
      { headerName: 'Chi tiết', field: 'description', tooltipField: 'description', sortable: true },
      {
        headerName: 'Xác nhận',
        field: 'schedule.confirmed',
        width: 120,
        sortable: true,
        cellRendererFramework: (params) => params.value
          ? <Tag color='#108EE9'>Đã xác nhận</Tag>
          : <Tag color='#f50'>Chưa xác nhận</Tag>
      },
      {
        headerName: 'Ngày đăng ký',
        field: 'schedule.createdDate',
        width: 120,
        sortable: true,
        valueFormatter: (params) => dateFormatter(params.value)
      },
      {
        headerName: 'Ngày cập nhật',
        field: 'schedule.modifiedDate',
        width: 120,
        sortable: true,
        valueFormatter: (params) => dateFormatter(params.value)
      },
      {
        headerName: 'User cập nhật',
        field: 'updatedBy',
        width: 130,
        sortable: true
      }
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

  onChangeTimeType = value => {
    this.setState({ timeType: value })
  }

  disabledStartDate = startValue => {
    const { endValue } = this.state
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = endValue => {
    const { startValue } = this.state
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  componentDidMount(){
    const { startValue, endValue } = this.state
    this.props.scheduleStore.getAllScheduleByUser(startValue, endValue)
  }

  render() {
    const { timeType, isOpen1, startValue, isOpen2, endValue } = this.state
    const { getScheduleByUsersJS } = this.props.scheduleStore
    return (
      <div className='schedule-management'>
        <ModalForm
          title='Lịch thực hành'
          buttonName='Đăng ký mới'
          modalWidth={600}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
          leftItems={
            <>
              <span>Mốc thời gian: </span>
              <Select style={{ width: 130 }} defaultValue={1} onChange={this.onChangeTimeType}>
                <Select.Option key={1} value={1}>Theo ngày</Select.Option>
                <Select.Option key={2} value={2}>Theo tháng</Select.Option>
                <Select.Option key={3} value={3}>Theo năm</Select.Option>
              </Select>
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  allowClear={false}
                  placeholder='Chọn ngày'
                  style={{ width: 140 }}
                  locale={locale}
                  value={startValue}
                  open={isOpen1}
                  format={timeType === 1 ? 'DD/MM/YYYY' : timeType === 2 ? 'MM/YYYY' : 'YYYY' }
                  mode={timeType === 1 ? 'date' : timeType === 2 ? 'month' : 'year'}
                  onOpenChange={(status) => {
                    if (status) {
                      this.setState({ isOpen1: true })
                    } else {
                      this.setState({ isOpen1: false })
                    }
                  }}
                  onPanelChange={(v) => {
                    if (timeType === 2) {
                      v.set('date', 1)
                    } else if (timeType === 3) {
                      v.set('date', 1)
                      v.set('month', 0)
                    }
                    this.setState({
                      startValue: v,
                      isOpen1: false
                    })
                  }}
                  onChange={(date) => {
                    if (timeType === 2) {
                      date.set('date', 1)
                    } else if (timeType === 3) {
                      date.set('date', 1)
                      date.set('month', 0)
                    }
                    this.setState({ startValue: date })
                  }}
                />
                <Icon type='minus' style={{ marginRight: 10 }}/>
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  allowClear={false}
                  placeholder='Chọn ngày'
                  style={{ width: 140 }}
                  locale={locale}
                  value={endValue}
                  open={isOpen2}
                  format={timeType === 1 ? 'DD/MM/YYYY' : timeType === 2 ? 'MM/YYYY' : 'YYYY' }
                  mode={timeType === 1 ? 'date' : timeType === 2 ? 'month' : 'year'}
                  onOpenChange={(status) => {
                    if (status) {
                      this.setState({ isOpen2: true })
                    } else {
                      this.setState({ isOpen2: false })
                    }
                  }}
                  onPanelChange={(v) => {
                    if (timeType === 2) {
                      v.set('date', 1)
                    } else if (timeType === 3) {
                      v.set('date', 1)
                      v.set('month', 0)
                    }
                    this.setState({
                      endValue: v,
                      isOpen2: false
                    })
                  }}
                  onChange={(date) => {
                    if (timeType === 2) {
                      date.set('date', 1)
                    } else if (timeType === 3) {
                      date.set('date', 1)
                      date.set('month', 0)
                    }
                    this.setState({ endValue: date })
                  }}
                />
                <Button disabled={startValue > endValue} onClick={() => {
                  this.props.scheduleStore.getAllScheduleByUser(startValue, endValue)
                }}>
                  Xem
                </Button>
            </>
          }
        >
        </ModalForm>
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={getScheduleByUsersJS}
            gridOptions={this.gridOptions}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    )
  }
}

export default ScheduleManagement