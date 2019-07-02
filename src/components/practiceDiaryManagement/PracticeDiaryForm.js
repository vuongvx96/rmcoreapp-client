import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Form, Input, Select, Button, Popover, Empty } from 'antd'

import IntInput from '../ui/IntInput'
import { requiredRule } from '../util/validation'

const { Option } = Select

@inject('practiceDiaryStore')
@observer
class PracticeDiaryForm extends React.Component {

  compareToStartTime = (rule, value, callback) => {
    const form = this.props.form
    if (value && Number(value) < Number(form.getFieldValue('startTime'))) {
      callback('Tiết KT không được nhỏ hơn tiết BĐ!')
    } else {
      callback()
    }
  }

  validateToEndTime = (rule, value, callback) => {
    const form = this.props.form
    if (value && Number(value) > Number(form.getFieldValue('endTime'))) {
      callback('Tiết KT không được lớn hơn tiết BĐ!')
    } else {
      callback()
    }
  }

  validateMaxMin = (rule, value, callback) => {
    if (value && (Number(value) <= 0 || Number(value) > 15)) {
      callback('Tiết phải nằm trong khoảng 1-> 15 !')
    } else {
      callback()
    }
  }

  componentDidMount() {
    this.props.practiceDiaryStore.fetchAllScheduleToday()
  }
  render() {
    let { startTime, endTime, scheduleId, note, isCreating } = this.props
    const { scheduleTodayJS, currentSchedule, loadingSchedule } = this.props.practiceDiaryStore
    let { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return (
      <Form {...formItemLayout}>
        <Form.Item label='Chọn lớp thực hành'>
          {getFieldDecorator('scheduleId', {
            rules: [requiredRule('Vui lòng chọn lớp')],
            initialValue: scheduleId
          })(<Select
            allowClear
            showSearch
            placeholder='Chọn lớp thực hành'
            disabled={!isCreating}
            loading={loadingSchedule}
            style={{ width: '80%' }}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={(value) => {
              this.props.practiceDiaryStore.changeSchedule(value)
              this.props.getInfo('scheduleId', value)
            }}
          >
            {scheduleTodayJS.map(item => (
              <Option key={item.scheduleId} value={item.scheduleId}>
                {`${item.groupPractice.classId} - ${item.groupPractice.subjectId} - ${item.groupPractice.semester}`}
              </Option>
            ))
            }
          </Select>)}
          <Popover
            placement='left'
            title={<b style={{ color: '#00008B' }}>Thông tin lớp thực hành</b>}
            content={
              _.isNil(currentSchedule)
                ? <Empty />
                : (<ul style={{ color: '#00008B' }}>
                  <li>{`Lớp: ${currentSchedule.groupPractice.classId}`}</li>
                  <li>{`Môn học: ${currentSchedule.groupPractice.subject.subjectName}`}</li>
                  <li>{`GV: ${currentSchedule.groupPractice.teacher.lastName} ${currentSchedule.groupPractice.teacher.firstName}`}</li>
                  <li>{`Sĩ số: ${currentSchedule.groupPractice.classSize}`}</li>
                  <li>{`Phòng: ${currentSchedule.roomId}`}</li>
                  <li>{`Buổi: ${dayParting(currentSchedule.endTime)}`}</li>
                  <li>{`Học kỳ: ${currentSchedule.groupPractice.semester}`}</li>
                  <li>{`Năm học: ${currentSchedule.groupPractice.schoolYear} - ${(Number(currentSchedule.groupPractice.schoolYear) + 1)}`}</li>
                </ul>)
            }
          >
            <Button icon='info-circle' style={{ width: 'calc(20% - 5px)', marginLeft: 5 }} />
          </Popover>
        </Form.Item>
        <Form.Item label='Tiết bắt đầu'>
          {getFieldDecorator('startTime', {
            rules: [
              requiredRule('Vui lòng nhập tiết bắt đầu'),
              { validator: this.validateToEndTime },
              { validator: this.validateMaxMin }
            ],
            initialValue: startTime
          })(<IntInput placeholder='Nhập tiết bắt đầu' onChange={(value) => {
            this.props.getInfo('startTime', value)
          }} />)}
        </Form.Item>
        <Form.Item label='Tiết kết thúc'>
          {getFieldDecorator('endTime', {
            rules: [
              requiredRule('Vui lòng nhập tiết kết thúc'),
              { validator: this.compareToStartTime },
              { validator: this.validateMaxMin }
            ],
            initialValue: endTime
          })(<IntInput placeholder='Nhập tiết kết thúc' onChange={(value) => {
            this.props.getInfo('endTime', value)
          }} />)}
        </Form.Item>
        <Form.Item label='Ghi chú'>
          {getFieldDecorator('note', {
            initialValue: note
          })(<Input.TextArea rows={4} placeholder='Ghi chú (nhóm,...)' onChange={({ target }) => {
            this.props.getInfo('note', target.value)
          }} />)}
        </Form.Item>
      </Form>
    )
  }
}

function dayParting(endTime) {
  if (endTime <= 5)
    return 'Sáng'
  else if (endTime <= 10)
    return 'Chiều'
  else
    return 'Tối'
}

export default Form.create({ name: 'practiceDiary' })(PracticeDiaryForm)