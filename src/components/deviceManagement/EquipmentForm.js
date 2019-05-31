import React from 'react'
import { Form, Input, Select, Switch, Icon } from 'antd'
import { observer, inject } from 'mobx-react'
import { requiredRule, inputCodeRule } from '../util/validation'

@inject('commonStore', 'manufacturerStore', 'roomStore', 'equipmentStore')
@observer
class EquipmentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      equipment: {
        equipmentId: null,
        equipmentName: null,
        manufacturerId: null,
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
    let { equipmentId, equipmentName, manufacturerId, roomId, serial, status } = this.props
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
          {getFieldDecorator('equipmentId', {
            rules: [
              requiredRule('Vui lòng nhập mã'),
              {
                max: 6, message: 'Mã tối đa chỉ 6 ký tự!'
              },
              inputCodeRule('Định dạng mã không hợp lệ!')
            ],
            initialValue: equipmentId
          })(<Input disabled={!isCreate} placeholder='Nhập mã thiết bị' type='text' onChange={({ target }) => {
            this.props.getInfo('equipmentId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Tên thiết bị' hasFeedback>
          {getFieldDecorator('equipmentName', {
            rules: [
              requiredRule('Vui lòng nhập tên thiết bị')
            ],
            initialValue: equipmentName
          })(<Input placeholder='Nhập tên thiết bị' type='text' onChange={({ target }) => {
            this.props.getInfo('equipmentName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Hãng sản xuất' hasFeedback>
          {getFieldDecorator('manufacturerId', {
            rules: [
              requiredRule('Vui lòng chọn hãng sản xuất')
            ],
            initialValue: manufacturerId
          })(<Select onChange={(value) => {
            this.props.getInfo('manufacturerId', value)
          }}>
            {listManufacturers.map(item => (
              <Select.Option key={item.k} value={item.k}>{item.v}</Select.Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label='Phòng' hasFeedback>
          {getFieldDecorator('roomId', {
            rules: [
              requiredRule('Vui lòng chọn phòng')
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
        <Form.Item label='Số Serial' hasFeedback>
          {getFieldDecorator('serial', {
            rules: [
              requiredRule('Vui lòng nhập mã serial')
            ],
            initialValue: serial
          })(<Input placeholder='Nhập số serial' type='text' onChange={({ target }) => {
            this.props.getInfo('serial', target.value)
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
              this.props.equipmentStore.updateActiveCount(checked)
            }} />)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'equipment' })(EquipmentForm)