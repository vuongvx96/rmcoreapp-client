import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Form, Select, Input, DatePicker, Button, Popover, Empty } from 'antd'

import locale from 'antd/lib/date-picker/locale/vi_VN'
import IntInput from '../ui/IntInput'
import { requiredRule } from '../util/validation'

const { Option } = Select

@inject('teacherScheduleStore')
@observer
class ScheduleForm extends React.Component {

  handleCheckValid = () => {
    this.props.checkValid()
  }

  componentDidMount() {
    this.props.teacherScheduleStore.fetchAllRoom()
    this.props.teacherScheduleStore.fetchAllGroup(new Date().getFullYear())
  }

  render() {
    const { listRoomIds, listGroups, currentGroup, currentRoom, checking } = this.props.teacherScheduleStore
    let { groupId, roomId, numberOfGroups, startDate, dayparting, repeatType, count, requirement, note } = this.props
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
      <>
        <Form {...formItemLayout}>
          <Form.Item label='Lớp thực hành'>
            {getFieldDecorator('groupId', {
              rules: [requiredRule('Vui lòng chọn lớp thực hành')],
              initialValue: groupId
            })(<Select
                allowClear
                showSearch
                placeholder='Chọn lớp thực hành'
                style={{ width: '80%' }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={(value) => {
                  this.props.getInfo('groupId', value)
                  this.props.teacherScheduleStore.changeGroup(value)
              }}>
                {listGroups.map(item => (
                  <Option key={item.groupId} value={item.groupId}>{`${item.classId} - ${item.subjectId} - ${item.semester}`}</Option>
                ))
                }
              </Select>
            )}
            <Popover
              placement='left'
              title={<b style={{ color: '#00008B' }}>Thông tin lớp thực hành</b>}
              content={
                _.isNil(currentGroup)
                  ? <Empty />
                  : (<ul style={{ color: '#00008B' }}>
                    <li>{`Lớp: ${currentGroup.classId}`}</li>
                    <li>{`Môn học: ${currentGroup.subject.subjectName}`}</li>
                    <li>{`GV: ${currentGroup.teacher.lastName} ${currentGroup.teacher.firstName}`}</li>
                    <li>{`Sĩ số: ${currentGroup.classSize}`}</li>
                    <li>{`Học kỳ: ${currentGroup.semester}`}</li>
                    <li>{`Năm học: ${currentGroup.schoolYear} - ${(Number(currentGroup.schoolYear) + 1)}`}</li>
                  </ul>)
              }
            >
              <Button icon='info-circle' style={{ width: 'calc(20% - 5px)', marginLeft: 5 }} />
            </Popover>
          </Form.Item>
          <Form.Item label='Số nhóm'>
            {getFieldDecorator('numberOfGroups', {
              type: 'number',
              rules: [requiredRule('Vui lòng nhập số nhóm')],
              initialValue: numberOfGroups
            })(<IntInput placeholder='Nhập số nhóm' onChange={(value) => {
              this.props.getInfo('numberOfGroups', value)
            }} />)}
          </Form.Item>
          <Form.Item label='Ngày bắt đầu'>
            {getFieldDecorator('startDate', {
              rules: [requiredRule('Vui lòng chọn ngày')],
              initialValue: startDate
            })(
              <DatePicker
                style={{ width: '100%' }}
                allowClear={false}
                locale={locale}
                format='DD/MM/YYYY'
                placeholder='Chọn ngày'
                onChange={(date) => {
                  this.props.getInfo('startDate', date)
                }}
              />
            )}
          </Form.Item>
          <Form.Item label='Giờ'>
            {getFieldDecorator('dayParting', {
              type: 'number',
              rules: [requiredRule('Vui lòng chọn giờ')],
              initialValue: dayparting
            })(<Select placeholder='Chọn giờ' onChange={(value) => {
              this.props.getInfo('dayparting', value)
            }}>
              <Option value={1}>Sáng</Option>
              <Option value={2}>Chiều</Option>
              <Option value={3}>Tối</Option>
            </Select>
            )}
          </Form.Item>
          <Form.Item label='Phòng máy'>
            {getFieldDecorator('roomId', {
              rules: [requiredRule('Vui lòng chọn phòng')],
              initialValue: roomId
            })(<Select style={{ width: '80%' }} placeholder='Chọn phòng' onChange={(value) => {
              this.props.teacherScheduleStore.changeRoom(value)
              this.props.getInfo('roomId', value)
            }}>
              {listRoomIds.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
            )}
            <Popover
              placement='left'
              title={<b style={{ color: '#00008B' }}>Thông tin phòng máy</b>}
              content={
                _.isNil(currentRoom)
                  ? <Empty />
                  : (<ul style={{ color: '#00008B' }}>
                    <li>{`Mã phòng: ${currentRoom.roomId}`}</li>
                    <li>{`Sức chứa: ${currentRoom.capacity}`}</li>
                    <li>{`Số máy hoạt động: ${currentRoom.computerQty}`}</li>
                    <li>{`Trang bị: ${currentRoom.note}`}</li>
                    <li>Cấu hình máy:
                      <ul style={{ paddingLeft: 15, color: 'red' }}>
                        {currentRoom.computerConfiguration.split(', ').map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      Các phần mềm đã cài:
                        <ol style={{ paddingLeft: 15, color: '#d4380d' }}>
                        {currentRoom.installedSoftware.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    </li>
                  </ul>)
              }
            >
              <Button icon='info-circle' style={{ width: 'calc(20% - 5px)', marginLeft: 5 }} />
            </Popover>
          </Form.Item>
          <Form.Item label='Loại lặp'>
            {getFieldDecorator('repeatType', {
              type: 'number',
              rules: [requiredRule('Vui lòng chọn loại lặp')],
              initialValue: repeatType
            })(<Select placeholder='Chọn loại lặp' onChange={(value) => {
              this.props.getInfo('repeatType', value)
            }}>
              <Option value={1}>Theo tuần</Option>
              <Option value={2}>Theo tháng</Option>
              <Option value={3}>Theo ngày</Option>
            </Select>)}
          </Form.Item>
          <Form.Item label='Số lần lặp'>
            {getFieldDecorator('count', {
              type: 'number',
              rules: [requiredRule('Số lần lặp là bắt buộc')],
              initialValue: count
            })(<IntInput placeholder='Nhập số lần lặp' onChange={(value) => {
              this.props.getInfo('count', value)
            }}/>)}
          </Form.Item>
          <Form.Item label='Yêu cầu phần mềm'>
            {getFieldDecorator('requirement', {
              initialValue: requirement
            })(<Input.TextArea rows={4} type='text' placeholder='Nhập yêu cầu phần mềm' onChange={({ target }) => {
              this.props.getInfo('requirement', target.value)
            }} />)
            }
          </Form.Item>
          <Form.Item label='Ghi chú'>
            {getFieldDecorator('note', {
              initialValue: note
            })(<Input.TextArea rows={4} placeholder='Nhập ghi chú' onChange={({ target }) => {
              this.props.getInfo('note', target.value)
            }} />)
            }
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 }
            }}
          >
            <Button loading={checking} onClick={this.handleCheckValid}>Kiểm tra hợp lệ</Button>
          </Form.Item>
        </Form>
      </>
    )
  }
}

export default Form.create({ name: 'schedule' })(ScheduleForm)