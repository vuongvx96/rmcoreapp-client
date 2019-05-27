import React from 'react'
import { Form, Input, Select, Switch } from 'antd'
import { observer, inject } from 'mobx-react'
import { inputCodeRule } from '../util/validation'

@inject('commonStore', 'manufacturerStore', 'roomStore')
@observer
class ComputerForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      computer: {
        computerId: null,
        computerName: null,
        manufacturerId: null,
        description: null,
        roomId: null,
        serial: null,
        status: true
      }
    }
  }

  componentDidMount() {
    this.props.getRef(this)
  }

  render() {
    let { computerId, computerName, manufacturerId, description, roomId, serial, status } = this.props
    let { getFieldDecorator } = this.props.form
    let { isCreate } = this.props.commonStore
    let { listManufacturers } = this.props.manufacturerStore
    let { listRoomIds } = this.props.roomStore
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
      <Form {...formItemLayout} >
        <Form.Item label='Mã máy' hasFeedback>
          {getFieldDecorator('computerId', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mã',
              },
              {
                max: 6, message: 'Mã tối đa chỉ 6 ký tự!'
              },
              inputCodeRule('Định dạng mã không hợp lệ!')
            ],
            initialValue: computerId
          })(<Input disable={!isCreate} placeholder='Nhập mã phòng' type='text' onChange={({ target }) => {
            this.props.getInfo('computerId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Tên máy' hasFeedback>
          {getFieldDecorator('computerName', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập tên máy',
              }
            ],
            initialValue: computerName
          })(<Input placeholder='Nhập tên máy' type='text' onChange={({ target }) => {
            this.props.getInfo('computerName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Hãng sản xuất' hasFeedback>
          {getFieldDecorator('manufacturerId', {
            initialValue: manufacturerId
          })(<Select>
            {listManufacturers.map(item => (
              <Select.Option key={item.k} value={item.k}>{item.v}</Select.Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label='Phòng' hasFeedback>
          {getFieldDecorator('roomId', {
            initialValue: roomId
          })(<Select>
            {listRoomIds.map(item => (
              <Select.Option key={item} value={item}>{item}</Select.Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label='Số Serial/ServiceTag' hasFeedback>
          {getFieldDecorator('serial', {
            rules: [
              {
                required: true,
                message: 'Trường này là bắt buộc',
              }
            ],
            initialValue: serial
          })(<Input placeholder='Nhập số serial' type='text' onChange={({ target }) => {
            this.props.getInfo('serial', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Cấu hình'>
          {getFieldDecorator('serial', {
            initialValue: description
          })(<Input.TextArea rows={4} placeholder='Nhập cấu hình' type='text' onChange={({ target }) => {
            this.props.getInfo('description', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Trạng thái'>
          {getFieldDecorator('status', {
            initialValue: status
          })(<Switch onChange={(checked) => {
            this.props.getInfo('status', checked)
          }}/>)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'computer' })(ComputerForm)