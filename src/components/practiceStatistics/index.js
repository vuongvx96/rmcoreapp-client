import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { DatePicker, Button, Icon } from 'antd'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/vi_VN'

import http from '../../tools/axios'

class PracticeStatistics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fromDate: moment().add(-10, 'days'),
      toDate: moment(),
      rowData: null
    }
    this.columnDefs = [
      {
        headerName: 'Giảng viên',
        field: 'teacherInfo',
        rowGroup: true,
        hide: true,
        chartDataType: 'category'
      },
      {
        headerName: 'Lớp',
        field: 'groupInfo',
        rowGroup: true,
        hide: true,
        chartDataType: 'category'
      },
      {
        headerName: 'Số tiết',
        field: 'total',
        width: 135,
        aggFunc: 'sum',
        chartDataType: 'series'
      },
      {
        headerName: 'Môn học',
        field: 'schedule.groupPractice.subject.subjectName'
      },
      {
        headerName: 'Tiết BĐ',
        field: 'startTime',
        width: 100
      },
      {
        headerName: 'Tiết KT',
        field: 'endTime',
        width: 100
      },
      {
        headerName: 'Ngày',
        field: 'createdDate',
        width: 90
      },
      {
        headerName: 'Sĩ số',
        field: 'schedule.groupPractice.classSize',
        width: 90
      },
      {
        headerName: 'Số nhóm',
        field: 'schedule.numberOfGroups',
        width: 90,
        tooltipField: 'schedule.groupPractice'
      }
    ]

    this.defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true
    }

    this.gridOptions = {
      rowHeight: 34,
      enableBrowserTooltips: true,
      suppressMovableColumns: false,
      enableCharts: true,
      enableRangeSelection: true,
      localeText: {
        noRowsToShow: 'Không có dữ liệu',
        sum: 'Tổng'
      }
    }
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi

    this.fetchData()

    this.gridColumnApi.autoSizeColumns()
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

  fetchData = () => {
    const { fromDate, toDate } = this.state
    let params = {
      fromDate: fromDate.format('YYYY-MM-DD HH:mm:ss'),
      toDate: toDate.format('YYYY-MM-DD HH:mm:ss')
    }
    http.get('/statistics/practicetime', { params })
      .then(res => {
        if (res.status === 200) {
          this.setState({ rowData: res.data })
        }
      })
      .catch(err => console.log(err))
  }

  onBtnExport() {
    let { fromDate, toDate } = this.state
    var params = {
      skipHeader: false,
      columnGroups: true,
      skipFooters: false,
      skipGroups: false,
      skipPinnedTop: false,
      skipPinnedBottom: false,
      allColumns: true,
      onlySelected: false,
      fileName: 'Thong_Ke_Thuc_Hanh',
      sheetName: `${fromDate.format('DD-MM-YYYY')}_${toDate.format('DD-MM-YYYY')}`,
      exportMode: 'xlsx'
    }
    this.gridApi.exportDataAsExcel(params)
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <>
        <div className='flex-container' style={{ paddingBottom: 10, width: '100%' }}>
          <div className='left-items'>
            <span>Mốc thời gian: </span>
            <DatePicker
              disabledDate={this.disabledStartDate}
              allowClear={false}
              placeholder='Chọn ngày'
              format='DD/MM/YYYY'
              defaultValue={moment().add(-10, 'days')}
              style={{ width: 140 }}
              locale={locale}
              onChange={(date) => {
                this.setState({ fromDate: date })
              }}
            />
            <Icon type='minus' style={{ marginRight: 10 }} />
            <DatePicker
              disabledDate={this.disabledEndDate}
              allowClear={false}
              placeholder='Chọn ngày'
              format='DD/MM/YYYY'
              defaultValue={moment()}
              style={{ width: 140 }}
              locale={locale}
              onChange={(date) => {
                this.setState({ toDate: date })
              }}
            />
            <Button type='primary' onClick={this.fetchData}>
              Xem
            </Button>
          </div>
          <div className='right-items'>
            <Button icon='file-excel' onClick={this.onBtnExport.bind(this)}>
              Xuất Excel
            </Button>
          </div>
        </div>
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            defaultColDef={this.defaultColDef}
            rowData={this.state.rowData}
            enableRangeSelection={true}
            gridOptions={this.gridOptions}
            onGridReady={this.onGridReady}
          />
        </div>
      </>
    )
  }
}

export default PracticeStatistics