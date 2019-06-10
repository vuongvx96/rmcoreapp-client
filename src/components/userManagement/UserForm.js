import React from 'react'
import { observer, inject } from 'mobx-react'
import { Form, Input, Tooltip, Radio, Checkbox, Switch, Icon } from 'antd'

import { requiredRule, emailRule, inputPhoneNumberVN } from '../util/validation'

@inject('commonStore', 'roleStore')
@observer
class UserForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        fullName: null,
        userName: null,
        gender: true,
        phoneNumber: null,
        email: null,
        officerId: null,
        roles: [],
        status: true
      }
    }
  }

  componentDidMount() {
    this.props.getRef(this)
    this.props.roleStore.fetchAll()
  }

  render() {
    let { fullName, userName, email, phoneNumber, gender, officerId, roles, status } = this.props
    let { getFieldDecorator } = this.props.form
    let { isCreate } = this.props.commonStore
    let { listRoles } = this.props.roleStore
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
        <Form.Item label='Tên đăng nhập'>
          {getFieldDecorator('userName', {
            rules: [
              requiredRule('Vui lòng nhập tên đăng nhập')
            ],
            initialValue: userName
          })(<Input disabled={!isCreate} placeholder='Nhập tên đăng nhập' type='text' onChange={({ target }) => {
            this.props.getInfo('userName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Họ tên đầy đủ'>
          {getFieldDecorator('fullName', {
            rules: [
              requiredRule('Vui lòng nhập họ tên')
            ],
            initialValue: fullName
          })(<Input placeholder='Nhập họ tên' type='text' onChange={({ target }) => {
            this.props.getInfo('fullName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Giới tính'>
          {getFieldDecorator('gender', {
            initialValue: gender
          })(<Radio.Group onChange={({ target }) => {
            this.props.getInfo('gender', target.value)
          }}>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label='Email'>
          {getFieldDecorator('email', {
            rules: [
              requiredRule('Vui lòng nhập email'),
              emailRule('Địa chỉ email không hợp lệ')
            ],
            initialValue: email
          })(<Input placeholder='Email' type='text' onChange={({ target }) => {
            this.props.getInfo('email', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Điện thoại'>
          {getFieldDecorator('phoneNumber', {
            rules: [
              requiredRule('Vui lòng nhập số điện thoại'),
              inputPhoneNumberVN('Số điện thoại không hợp lệ')
            ],
            initialValue: phoneNumber
          })(<Input placeholder='Nhập số điện thoại' type='text' onChange={({ target }) => {
            this.props.getInfo('phoneNumber', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Mã CB/VC'>
          {getFieldDecorator('officerId', {
            rules: [
              requiredRule('Vui lòng nhập mã cán bộ viên chức')
            ],
            initialValue: officerId
          })(<Input placeholder='Mã cán bộ/viên chức' type='text' onChange={({ target }) => {
            this.props.getInfo('officerId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Roles'>
          {getFieldDecorator('roles', {
            initialValue: roles
          })(
            <Checkbox.Group onChange={(checkedValue) => this.props.getInfo('roles', checkedValue)}>
              {listRoles.map(item => (
                <Tooltip key={item.id} placement='top' title={item.description}>
                  <Checkbox value={item.name}>{item.name}</Checkbox>
                </Tooltip>
              ))}
            </Checkbox.Group>
          )}
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
            }} />)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'user' })(UserForm)