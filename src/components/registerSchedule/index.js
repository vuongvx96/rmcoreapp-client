import React from 'react'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'

import ModalForm from '../template/modalForm'

class RegisterSchedule extends React.Component {
  constructor(props){
    super(props)

    this.columnDefs = [
      { headerName: 'Ngày bắt đầu', field: 'startDate', sortable: true },
      { headerName: 'Thời gian', field: 'dayparting', sortable: true },
      { headerName: 'Phòng máy', field: 'roomId', sortable: true },
      { headerName: 'Loại lặp', field: 'repeatType', sortable: true },
      { headerName: 'Mô tả', field: 'description', sortable: true }
    ]

    this.gridOptions = {
      rowHeight: 34,
      suppressMovableColumns: false,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  render() {
    return (
      <>
        <ModalForm
          title='Đăng ký lịch mới'
          buttonName='Thêm mới'
          modalWidth={600}
          clearState={this.clearState}
          getRef={ref => { this.refTemplate = ref }}
        >
        </ModalForm>
        <div style={{ height: 'calc(100vh - 132px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={[]}
            animateRows={true}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
          />
        </div>
      </>
    )
  }
}

export default RegisterSchedule