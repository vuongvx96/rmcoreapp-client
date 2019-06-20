import React from 'react'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { DatePicker, Select } from 'antd'
import moment from 'moment'

import locale from 'antd/lib/date-picker/locale/vi_VN'
import ModalForm from '../template/modalForm'

@inject('scheduleStore')
@observer
class ScheduleManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timeType: 1,
      isOpen: false,
      time: moment()
    }

    this.columnDefs = [
      { headerName: 'Ngày bắt đầu', field: 'startDate', sortable: true },
      { headerName: 'Thời gian', field: 'dayParting', sortable: true },
      { headerName: 'Phòng máy', field: 'roomId', sortable: true },
      { headerName: 'Môn học', field: 'groupPractice.subject.subjectName', sortable: true },
      {
        headerName: 'Giảng viên',
        field: 'groupPractice.teacher.firstName',
        sortable: true,
        valueFormatter: (params) => params.data.groupPractice.teacher.lastName + ' ' + params.value
      },
      { headerName: 'Loại lặp', field: 'repeatType', sortable: true },
      { headerName: 'Số lần lặp', field: 'count', sortable: true },
      { headerName: 'Mô tả', field: 'description', tooltipField: 'description', sortable: true },
      { headerName: 'Đã xác nhận', field: 'confirmed', sortable: true },
      { headerName: 'Ngày đăng ký', field: 'createdDate', sortable: true },
      { headerName: 'Ngày cập nhật', field: 'modifiedDate', sortable: true },
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

  onChangeTimeType = value => {
    this.setState({ timeType: value })
  }

  render() {
    const { timeType, isOpen, time } = this.state
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
                  placeholder='Chọn ngày'
                  style={{ width: 140 }}
                  locale={locale}
                  value={time}
                  open={isOpen}
                  format={timeType === 1 ? 'DD/MM/YYYY' : timeType === 2 ? 'MM/YYYY' : 'YYYY' }
                  mode={timeType === 1 ? 'date' : timeType === 2 ? 'month' : 'year'}
                  onOpenChange={(status) => {
                    if (status) {
                      this.setState({ isOpen: true })
                    } else {
                      this.setState({ isOpen: false })
                    }
                  }}
                  onPanelChange={(v) => {
                    this.setState({
                      time: v,
                      isOpen: false
                    })
                  }}
                  onChange={(date) => {
                    this.setState({ time: date })
                  }}
                />
            </>
          }
        >
        </ModalForm>
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={[]}
            gridOptions={this.gridOptions}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    )
  }
}

export default ScheduleManagement