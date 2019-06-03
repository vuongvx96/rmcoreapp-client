import React from 'react'
import { Form, Input, Select, Switch, Icon } from 'antd'
import { observer, inject } from 'mobx-react'
import { inputCodeRule } from '../util/validation'

@inject('commonStore', 'manufacturerStore', 'roomStore', 'computerStore')
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
    this.props.manufacturerStore.fetchAll()
    this.props.roomStore.fetchAll()
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
          })(<Input disabled={!isCreate} placeholder='Nhập mã máy' type='text' onChange={({ target }) => {
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
            rules: [
              {
                required: true,
                message: 'Vui lòng chọn hãng sản xuất',
              }
            ],
            initialValue: manufacturerId
          })(<Select onChange={(value) => {
            this.props.getInfo('manufacturerId', value)
          }}>
            {listManufacturers.map(item => (
              <Select.Option key={item.manufacturerId} value={item.manufacturerId}>{item.manufacturerName}</Select.Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label='Phòng' hasFeedback>
          {getFieldDecorator('roomId', {
            rules: [
              {
                required: true,
                message: 'Vui lòng chọn phòng',
              }
            ],
            initialValue: roomId
          })(<Select onChange={(value) => {
            this.props.getInfo('roomId', value)
          }}>
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
          {getFieldDecorator('description', {
            initialValue: description
          })(<Input.TextArea rows={4} placeholder='Nhập cấu hình' type='text' onChange={({ target }) => {
            this.props.getInfo('description', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Trạng thái'>
          {getFieldDecorator('status', {
            valuePropName: 'checked',
            initialValue: status
          })(<Switch
            checkedChildren={<Icon type='check' />}
            unCheckedChildren={<Icon type='cross' />}
            onChange={(checked) => {
              this.props.getInfo('status', checked)
              this.props.computerStore.updateActiveCount(checked)
            }} />)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'computer' })(ComputerForm)
