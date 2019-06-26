import React from 'react'
import { observer, inject } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { toast } from 'react-toastify'
import { Select, DatePicker, Icon, Button, Spin, Modal, Checkbox } from 'antd'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/vi_VN'

import PracticeDiaryForm from './PracticeDiaryForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { dateFormatter } from '../util/formatter'
import { showConfirm } from '../util/confirm'

@inject('practiceDiaryStore')
@observer
class PracticeDiary extends React.Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      practiceDiary: {
        id: null,
        startTime: 1,
        endTime: 1,
        scheduleId: null,
        note: null,
        createdDate: moment()
      },
      isCreating: false,
      timeType: 1,
      isOpen1: false,
      startValue: moment(),
      isOpen2: false,
      endValue: moment(),
      isOpenModal: false
    }
    this.columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: true,
          canRemove: true,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeDiary.bind(this)
        }
      },
      {
        headerName: 'Ngày',
        field: 'createdDate',
        width: 120,
        sortable: true,
        valueFormatter: (params) => dateFormatter(params.value)
      },
      {
        headerName: 'Tiết',
        field: 'startTime',
        width: 70,
        sortable: true,
        valueFormatter: (params) => `${params.value} - ${params.data.endTime}`
      },
      {
        headerName: 'Lớp',
        width: 90,
        field: 'schedule.groupPractice.classId',
        sortable: true
      },
      {
        headerName: 'Nội dung thực hành',
        field: 'schedule.groupPractice.subject.subjectName',
        width: 200,
        tooltipField: 'schedule.groupPractice.subject.subjectName',
        sortable: true
      },
      {
        headerName: 'Giảng viên',
        field: 'schedule.groupPractice.teacher.firstName',
        width: 150,
        sortable: true,
        valueFormatter: (params) => params.data.schedule.groupPractice.teacher.lastName + ' ' + params.value
      },
      {
        headerName: 'Ghi chú',
        field: 'note',
        width: 200,
        colId: 'GC',
        tooltipField: 'note',
        sortable: true
      },
      {
        headerName: 'Ngày cập nhật',
        field: 'modifiedDate',
        width: 120,
        colId: 'D1',
        hide: true,
        sortable: true,
        valueFormatter: (params) => dateFormatter(params.value)
      },
      {
        headerName: 'User cập nhật',
        field: 'modifiedBy',
        width: 130,
        colId: 'D2',
        hide: true,
        sortable: true
      }
    ]

    this.gridOptions = {
      rowHeight: 34,
      enableBrowserTooltips: true,
      suppressMovableColumns: false,
      localeText: {
        noRowsToShow: 'Không có dữ liệu'
      }
    }

    this.getInfo = this.getInfo.bind(this)
    this.setRef = this.setRef.bind(this)
    this.openCreateForm = this.openCreateForm.bind(this)
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  onChangeTimeType = value => {
    this.setState({ timeType: value })
    let { startValue, endValue } = this.state
    if (value === 2) {
      startValue = moment(startValue).startOf('month')
      endValue = moment(endValue).endOf('month')
      this.setState({ startValue, endValue })
    } else if (value === 3) {
      startValue.set('month', 0)
      startValue = moment(startValue).startOf('month')
      endValue.set('month', 11)
      endValue = moment(endValue).endOf('month')
      this.setState({ startValue, endValue })
    }
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

  openEditForm(data) {
    let diary = {
      id: data.id,
      startTime: data.startTime,
      endTime: data.endTime,
      scheduleId: data.schedule.scheduleId,
      note: data.note,
      createdDate: moment(data.createdDate)
    }
    this.setState({ practiceDiary: diary, isCreating: false })
    this.props.practiceDiaryStore.changeSchedule(diary.scheduleId)
    this.setState({ isOpenModal: true })
  }

  openCreateForm() {
    let diary = {
      id: null,
      startTime: 1,
      endTime: 2,
      scheduleId: null,
      note: null,
      createdDate: moment()
    }

    if (this.formRef.current === undefined) {
      this.formRef.resetFields()
    }

    this.setState({ practiceDiary: diary, isCreating: true })
    this.props.practiceDiaryStore.changeSchedule(diary.scheduleId)
    this.setState({ isOpenModal: true })
  }

  addOrUpdateDiary = async () => {
    let isValid = false
    this.formRef.validateFieldsAndScroll((err, values) => {
      if (!err) {
        isValid = true
      }
    })

    if (isValid) {
      let { practiceDiary, isCreating } = this.state
      let result
      if (isCreating)
        result = await this.props.practiceDiaryStore.createDiary(practiceDiary)
      else
      result = await this.props.practiceDiaryStore.updateDiary(practiceDiary)
      if (isCreating) {
        try {
          if (result.status === 201) {
            toast.success('Thêm nhật ký thành công - vui lòng check mail của bạn')
            this.gridApi.setRowData(this.props.practiceDiaryStore.practiceDiariesJS)
            this.setState({ isOpenModal: false })
          }
          else if (result.response.status === 403) {
            toast.warn('Thiết bị đăng nhập không hợp lệ')
          } else if (result.response.status === 409) {
            toast.warn('Không thể tạo nhiều hơn 1 nhật ký/1 buổi thực hành')
          }
        } catch (err) {
          toast.warn('Thêm nhật ký thất bại')
        }
      } else {
        try {
          if (result.status === 200) {
            toast.success('Cập nhật thông tin thành công')
            this.gridApi.setRowData(this.props.practiceDiaryStore.practiceDiariesJS)
            this.setState({ isOpenModal: false })
          } else {
            toast.warn('Cập nhật thông tin thất bại')
          }
        } catch (err) {
          toast.warn('Cập nhật thông tin thất bại')
        }
      }
    }
  }

  removeDiary(data) {
    showConfirm(
      'Bạn có muốn xóa nhật ký thực hành không?',
      async () => {
        const result = await this.props.practiceDiaryStore.deleteDiary(data.id)
        if (result.status === 200) {
          toast.success('Xóa nhật ký thực hành thành công')
          this.gridApi.setRowData(this.props.practiceDiaryStore.practiceDiariesJS)
        } else {
          toast.warn('Xóa nhật ký thực hành thất bại')
        }
      }
    )
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.practiceDiary[field] = value
      return prevState
    })
  }

  setRef(ref) {
    this.formRef = ref
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    let { startValue, endValue } = this.state
    this.props.practiceDiaryStore.fetchAll(startValue, endValue)
  }

  render() {
    const { timeType, isOpen1, startValue, isOpen2, endValue, isOpenModal, isCreating } = this.state
    let { practiceDiariesJS, loading } = this.props.practiceDiaryStore
    let { startTime, endTime, scheduleId, note } = this.state.practiceDiary
    return (
      <Spin spinning={loading}>
        <div className='flex-container' style={{ paddingBottom: 10, width: '100%' }}>
          <div className='left-items'>
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
              format={timeType === 1 ? 'DD/MM/YYYY' : timeType === 2 ? 'MM/YYYY' : 'YYYY'}
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
                  v = moment(v).startOf('month')
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
                  date = moment(date).startOf('month')
                } else if (timeType === 3) {
                  date.set('date', 1)
                  date.set('month', 0)
                }
                this.setState({ startValue: date })
              }}
            />
            <Icon type='minus' style={{ marginRight: 10 }} />
            <DatePicker
              disabledDate={this.disabledEndDate}
              allowClear={false}
              placeholder='Chọn ngày'
              style={{ width: 140 }}
              locale={locale}
              value={endValue}
              open={isOpen2}
              format={timeType === 1 ? 'DD/MM/YYYY' : timeType === 2 ? 'MM/YYYY' : 'YYYY'}
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
                  v = moment(v).endOf('month')
                } else if (timeType === 3) {
                  v.set('month', 11)
                  v = moment(v).endOf('month')
                }
                this.setState({
                  endValue: v,
                  isOpen2: false
                })
              }}
              onChange={(date) => {
                if (timeType === 2) {
                  date = moment(date).endOf('month')
                } else if (timeType === 3) {
                  date.set('month', 11)
                  date = moment(date).endOf('month')
                }
                this.setState({ endValue: date })
              }}
            />
            <Button type='primary' disabled={startValue > endValue} onClick={() => {
              this.props.practiceDiaryStore.fetchAll(startValue, endValue)
            }}>
              Xem
            </Button>
          </div>
          <div className='right-items'>
            <Button onClick={this.openCreateForm}>
              Tạo nhật ký
            </Button>
          </div>
        </div>
        <div style={{ height: 'calc(100vh - 160px)' }} className='ag-theme-balham'>
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={practiceDiariesJS}
            onGridReady={this.onGridReady}
            gridOptions={this.gridOptions}
            frameworkComponents={{
              editButton: ModifyButtonGrid
            }}
          />
        </div>
        <Checkbox defaultChecked={true} style={{ marginTop: 10 }} onChange={({ target }) => {
          this.gridColumnApi.setColumnVisible('GC', target.checked)
        }}>Hiện ghi chú</Checkbox>
        <Checkbox style={{ marginTop: 10 }} onChange={({ target }) => {
          this.gridColumnApi.setColumnsVisible(['D1', 'D2'], target.checked)
        }}>Hiện tracking thời gian</Checkbox>
        <Modal
          title='Nhật ký thực hành'
          visible={isOpenModal}
          width={600}
          bodyStyle={{ padding: '10px 24px' }}
          okText='Lưu'
          cancelText='Hủy'
          onOk={this.addOrUpdateDiary}
          onCancel={() => this.setState({ isOpenModal: false })}
        >
          <PracticeDiaryForm
            startTime={startTime}
            endTime={endTime}
            scheduleId={scheduleId}
            note={note}
            isCreating={isCreating}
            getInfo={this.getInfo}
            ref={this.setRef}
          />
        </Modal>
      </Spin>
    )
  }
}

export default PracticeDiary