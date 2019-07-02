import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { toast } from 'react-toastify'
import { DatePicker, Select, Checkbox, Button, Icon, Tag, Spin, Modal } from 'antd'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/vi_VN'

import ScheduleForm from './ScheduleForm'
import ModifyButtonGrid from '../ui/ModifyButtonGrid'
import { dateFormatter } from '../util/formatter'
import { showConfirm } from '../util/confirm'

@inject('scheduleStore', 'teacherScheduleStore')
@observer
class ScheduleManagement extends React.Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      schedule: {
        scheduleId: null,
        groupId: null,
        roomId: null,
        numberOfGroups: 1,
        startDate: moment(),
        endDate: moment(),
        dayparting: 1,
        repeatType: 1,
        count: 1,
        confirmed: false,
        createdDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        requirement: null,
        note: null
      },
      timeType: 1,
      isOpen1: false,
      startValue: moment(),
      isOpen2: false,
      endValue: moment(),
      isOpenModal: false
    }

    this.gridOptions = {
      rowHeight: 34,
      enableBrowserTooltips: true,
      suppressMovableColumns: false,
      localeText: { noRowsToShow: 'Không có dữ liệu' }
    }

    this.getInfo = this.getInfo.bind(this)
    this.checkValid = this.checkValid.bind(this)
    this.addOrUpdateSchedule = this.addOrUpdateSchedule.bind(this)
    this.openCreateForm = this.openCreateForm.bind(this)
    this.setRef = this.setRef.bind(this)
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
    let schedule = {
      scheduleId: data.schedule.scheduleId,
      groupId: data.schedule.groupId,
      roomId: data.schedule.roomId,
      numberOfGroups: data.schedule.numberOfGroups,
      startDate: moment(data.schedule.startDate),
      endDate: moment(data.schedule.endDate),
      dayparting: data.dayparting,
      repeatType: data.schedule.repeatType,
      count: data.count,
      createdDate: data.schedule.createdDate,
      confirmed: data.schedule.confirmed,
      requirement: data.schedule.requirement,
      note: data.schedule.note
    }
    this.props.teacherScheduleStore.changeGroup(data.schedule.groupId)
    this.props.teacherScheduleStore.changeRoom(data.schedule.roomId)
    this.setState({ schedule })
    this.setState({ isOpenModal: true })
  }

  async checkValid() {
    let isValid = false
    this.formRef.validateFieldsAndScroll((err, values) => {
      if (!err) {
        isValid = true
      }
    })
    if (isValid) {
      let { schedule } = this.state
      let count = schedule.count - 1
      if (schedule.repeatType === 1) {
        schedule.endDate = moment(schedule.startDate).add(7 * count, 'd')
      } else if (schedule.repeatType === 2) {
        schedule.endDate = moment(schedule.startDate).add(count, 'M')
      } else {
        schedule.endDate = moment(schedule.startDate).add(count, 'd')
      }

      if (schedule.dayparting === 1) {
        schedule.startTime = 1
        schedule.endTime = 5
      } else if (schedule.dayparting === 2) {
        schedule.startTime = 6
        schedule.endTime = 10
      } else {
        schedule.startTime = 11
        schedule.endTime = 15
      }

      const result = await this.props.teacherScheduleStore.checkValid(schedule)
      try {
        if (result.status === 200) {
          if (result.data) {
            toast.info('Lịch này có thể đăng ký')
          } else {
            toast.warn('Bị trùng với các lịch hiện có')
          }
        }
      } catch (err) {
        if (result.response.status === 400) {
          toast.warn('Bad Request - Server không thể xử lý yêu cầu')
        } else {
          toast.warn('Không thể kiểm tra')
        }
      }
    }
  }

  addOrUpdateSchedule = async () => {
    let isValid = false
    this.formRef.validateFieldsAndScroll((err, values) => {
      if (!err) {
        isValid = true
      }
    })

    if (isValid) {
      let { schedule } = this.state
      let count = schedule.count - 1
      if (schedule.repeatType === 1) {
        schedule.endDate = moment(schedule.startDate).add(7 * count, 'd')
      } else if (schedule.repeatType === 2) {
        schedule.endDate = moment(schedule.startDate).add(count, 'M')
      } else {
        schedule.endDate = moment(schedule.startDate).add(count, 'd')
      }

      if (schedule.dayparting === 1) {
        schedule.startTime = 1
        schedule.endTime = 5
      } else if (schedule.dayparting === 2) {
        schedule.startTime = 6
        schedule.endTime = 10
      } else {
        schedule.startTime = 11
        schedule.endTime = 15
      }

      let checkST = await this.props.teacherScheduleStore.checkSameTime(schedule)
      if (checkST.status === 200 && checkST.data){
        showConfirm(
          'Đang có lịch thực hành khác cùng thời điểm, bạn có muốn tiếp tục?',
          async () => {
            await this.handleAddOrUpdateSchedule(schedule)
          }
        )
      } else {
        this.handleAddOrUpdateSchedule(schedule)
      }
    }
  }

  async handleAddOrUpdateSchedule(schedule){
    let isCreate = _.isNil(schedule.scheduleId)
    let response
    if (isCreate)
      response = await this.props.scheduleStore.createSchedule(schedule)
    else
      response = await this.props.scheduleStore.updateSchedule(schedule)
    if (isCreate) {
      try {
        if (response.status === 200) {
          toast.success('Thêm lịch thành công - vui lòng check mail của bạn')
          this.gridApi.setRowData(this.props.scheduleStore.getScheduleByUsersJS)
          this.setState({ isOpenModal: false })
        }
        else if (response.response.status === 409) {
          toast.warn('Bị trùng với các lịch hiện có')
        }
      } catch (err) {
        toast.warn('Thêm lịch thất bại')
      }
    } else {
      try {
        if (response.status === 200) {
          if (response.data.success) {
            toast.success('Cập nhật lịch thành công')
            this.gridApi.setRowData(this.props.scheduleStore.getScheduleByUsersJS)
            this.setState({ isOpenModal: false })
          } else {
            toast.warn('Bị trùng với các lịch hiện có')
          }
        } else {
          toast.warn('Cập nhật lịch thất bại')
        }
      } catch (err) {
        toast.warn('Cập nhật lịch thất bại')
      }
    }
  }

  removeSchedule(data) {
    showConfirm(
      'Bạn có muốn xóa lịch không?',
      async () => {
        const result = await this.props.scheduleStore.deleteSchedule(data.schedule.scheduleId)
        if (result.status === 200) {
          toast.success('Xóa lịch thành công')
          this.gridApi.setRowData(this.props.scheduleStore.getScheduleByUsersJS)
        } else {
          toast.warn('Xóa lịch thất bại')
        }
      }
    )
  }

  openCreateForm() {
    let schedule = {
      scheduleId: null,
      groupId: null,
      roomId: null,
      numberOfGroups: 1,
      startDate: moment(),
      endDate: moment(),
      dayparting: 1,
      repeatType: 1,
      count: 1,
      confirmed: false,
      createdDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      requirement: null,
      note: null
    }

    if (this.formRef.current === undefined) {
      this.formRef.resetFields()
    }

    this.props.teacherScheduleStore.changeGroup(null)
    this.props.teacherScheduleStore.changeRoom(null)
    this.setState({ schedule, isOpenModal: true })
  }

  getInfo(field, value) {
    this.setState((prevState) => {
      prevState.schedule[field] = value
      return prevState
    })
  }

  setRef(ref) {
    this.formRef = ref
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    const { startValue, endValue } = this.state
    this.props.scheduleStore.getAllScheduleByUser(startValue, endValue)
  }

  render() {
    const { timeType, isOpen1, startValue, isOpen2, endValue, isOpenModal } = this.state
    const { getScheduleByUsersJS, loading, updating } = this.props.scheduleStore
    let { groupId, roomId, numberOfGroups, startDate, dayparting, repeatType, count, requirement, note } = this.state.schedule
    let columnDefs = [
      {
        cellRenderer: 'editButton',
        cellRendererParams: {
          canEdit: this.props.permission.hasPermission('SCHEDULE_MANAGEMENT').update,
          canRemove: this.props.permission.hasPermission('SCHEDULE_MANAGEMENT').delete,
          onEdit: this.openEditForm.bind(this),
          onRemove: this.removeSchedule.bind(this)
        }
      },
      {
        headerName: 'Ngày bắt đầu',
        field: 'schedule.startDate',
        width: 120,
        sortable: true,
        valueFormatter: (params) => dateFormatter(params.value)
      },
      {
        headerName: 'Thời gian',
        field: 'dayparting',
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
        colId: 'GV',
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
      {
        headerName: 'Chi tiết',
        field: 'description',
        colId: 'CT',
        hide: true,
        tooltipField: 'description',
        sortable: true
      },
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
        colId: 'D1',
        sortable: true,
        hide: true,
        valueFormatter: (params) => dateFormatter(params.value)
      },
      {
        headerName: 'Ngày cập nhật',
        field: 'schedule.modifiedDate',
        width: 120,
        colId: 'D2',
        sortable: true,
        hide: true,
        valueFormatter: (params) => dateFormatter(params.value)
      },
      {
        headerName: 'User cập nhật',
        field: 'updatedBy',
        width: 130,
        colId: 'D3',
        sortable: true,
        hide: true
      }
    ]
    return (
      <>
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
                this.props.scheduleStore.getAllScheduleByUser(startValue, endValue)
              }}>
                Xem
              </Button>
            </div>
            <div className='right-items'>
              <Button
                disabled={!this.props.permission.hasPermission('SCHEDULE_MANAGEMENT').create}
                type='primary'
                onClick={this.openCreateForm}
              >
                Đăng ký mới
              </Button>
            </div>
          </div>
          <div style={{ height: 'calc(100vh - 160px)' }} className='ag-theme-balham'>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={getScheduleByUsersJS}
              gridOptions={this.gridOptions}
              onGridReady={this.onGridReady}
              frameworkComponents={{
                editButton: ModifyButtonGrid
              }}
            />
          </div>
          <Checkbox style={{ marginTop: 10 }} onChange={({ target }) => {
            this.gridColumnApi.setColumnsVisible(['D1', 'D2', 'D3'], target.checked)
          }}>
            Hiện ngày tạo</Checkbox>
          <Checkbox defaultChecked={true} style={{ marginTop: 10 }} onChange={({ target }) => {
            this.gridColumnApi.setColumnVisible('GV', target.checked)
          }}>Hiện GV</Checkbox>
          <Checkbox style={{ marginTop: 10 }} onChange={({ target }) => {
            this.gridColumnApi.setColumnVisible('CT', target.checked)
          }}>Hiện chi tiết</Checkbox>
        </Spin >
        <Modal
          title='Lịch thực hành'
          visible={isOpenModal}
          bodyStyle={{ padding: '10px 24px' }}
          okText='Lưu'
          cancelText='Hủy'
          confirmLoading={updating}
          okButtonProps={{ disabled: updating }}
          onOk={this.addOrUpdateSchedule}
          onCancel={() => this.setState({ isOpenModal: false })}
        >
          <ScheduleForm
            groupId={groupId}
            roomId={roomId}
            numberOfGroups={numberOfGroups}
            startDate={startDate}
            dayparting={dayparting}
            repeatType={repeatType}
            count={count}
            requirement={requirement}
            note={note}
            getInfo={this.getInfo}
            checkValid={this.checkValid}
            ref={this.setRef}
          />
        </Modal>
      </>
    )
  }
}

export default ScheduleManagement