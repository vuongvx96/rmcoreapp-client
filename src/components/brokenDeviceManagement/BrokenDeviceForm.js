import React from 'react'
import { Form, Input, Select, Switch, Radio, Icon } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule, inputCodeRule } from '../util/validation'

const Option = Select.Option

@inject('commonStore')
@observer

class BrokenDeviceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brokenDevice: {
        deviceId: null,
        userId: null,
        description: null,
        cost: null,
        fixed: true
      }
    }
  }

  componentDidMount() {
    this.props.getRef(this)
  }

  render() {
    let { deviceId, userId, description, cost, fixed } = this.props
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
      <Form {...formItemLayout} >
        <Form.Item label='Mã thiết bị'>
          {getFieldDecorator('deviceId', {
            rules: [
              requiredRule('Vui lòng nhập mã'),
              inputCodeRule('Mã không đúng định dạng')
            ],
            initialValue: deviceId
          })(<Input placeholder='Nhập mã thiết bị' type='text' onChange={({ target }) => {
            this.props.getInfo('deviceId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Mã người dùng'>
          {getFieldDecorator('userId', {
            rules: [
              requiredRule('Vui lòng nhập mã'),
              inputCodeRule('Mã không đúng định dạng')
            ],
            initialValue: userId
          })(<Input placeholder='Nhập mã thiết bị' type='text' onChange={({ target }) => {
            this.props.getInfo('userId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Mô tả'>
          {getFieldDecorator('description', {
            initialValue: description
          })(<Input.TextArea rows={4} placeholder='Nhập mô tả' type='text' onChange={({ target }) => {
            this.props.getInfo('description', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Chi phí sửa chữa'>
          {getFieldDecorator('cost', {
            rules: [
              requiredRule('Vui lòng nhập chi phí'),
              inputCodeRule('Không đúng định dạng')
            ],
            initialValue: cost
          })(<Input placeholder='Nhập chi phí sửa chữa' type='text' onChange={({ target }) => {
            this.props.getInfo('cost', target.value)
          }} />)}
        </Form.Item>
        {/* <Form.Item label='Fixed'>
          {getFieldDecorator('fixed', {
            rules: [
              requiredRule('Vui lòng nhập chi phí'),
              inputCodeRule('Không đúng định dạng')
            ],
            initialValue: fixed
          })(<Input placeholder='Nhập chi phí sửa chữa' type='text' onChange={({ target }) => {
            this.props.getInfo('fixed', target.value)
          }} />)}
        </Form.Item> */}
        <Form.Item label='Đã sửa'>
          {getFieldDecorator('fixed', {
            valuePropName: 'checked',
            initialValue: fixed
          })(<Switch
            checkedChildren={<Icon type='check' />}
            unCheckedChildren={<Icon type='cross' />}
            onChange={(checked) => {
              this.props.getInfo('fixed', checked)
              // this.props.brokenDeviceStore.updateActiveCount(checked)
            }} />)}
        </Form.Item>
        
      </Form>
    )
  }
}

export default Form.create({ name: 'brokenDevice' })(BrokenDeviceForm)
