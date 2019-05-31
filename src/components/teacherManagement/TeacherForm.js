import React from 'react'
import { Form, Input, Select, Radio } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule, emailRule, inputCodeRule, inputPhoneNumberVN } from '../util/validation'

const Option = Select.Option
const RadioGroup = Radio.Group;

@inject('commonStore', 'departmentStore')
@observer

class TeacherForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teacher: {
        teacherId: null,
        firstName: null,
        lastName: null,
        gender: true,
        phone: null,
        email: null,
        address: null,
        departmentId: null
      }
    }
  }

  componentDidMount() {
    this.props.getRef(this)
    this.props.departmentStore.fetchAll()
  }

  render() {
    let { teacherId, firstName, lastName, gender, phone, email, address, departmentId } = this.props
    let { getFieldDecorator } = this.props.form
    let { isCreate } = this.props.commonStore
    let { entities } = this.props.departmentStore

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
        <Form.Item label='Mã giảng viên'>
          {getFieldDecorator('teacherId', {
            rules: [
              inputCodeRule('Định dạng mã không hợp lệ!'),
              requiredRule('Vui lòng nhập mã')
            ],
            initialValue: teacherId
          })(<Input disabled={!isCreate} placeholder='Nhập mã giảng viên' type='text' onChange={({ target }) => {
            this.props.getInfo('teacherId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Họ giảng viên'>
          {getFieldDecorator('lastName', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập họ giảng viên',
              },
            ],
            initialValue: lastName
          })(<Input placeholder='Nhập họ giảng viên' type='text' onChange={({ target }) => {
            this.props.getInfo('lastName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Tên giảng viên'>
          {getFieldDecorator('firstName', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập tên giảng viên',
              },
            ],
            initialValue: firstName
          })(<Input placeholder='Nhập tên giảng viên' type='text' onChange={({ target }) => {
            this.props.getInfo('firstName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Giới tính'>
          {getFieldDecorator('gender', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập giới tính',
              },
            ],
            initialValue: gender
          })(<RadioGroup onChange={({ target }) => {
            this.props.getInfo('gender', target.value)
          }}
          >
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </RadioGroup>)}
        </Form.Item>
        <Form.Item label='Số điện thoại'>
          {getFieldDecorator('phone', {
            rules: [
              requiredRule('Vui lòng nhập số điện thoại'),
              inputPhoneNumberVN('Số điện thoại không hợp lệ')
            ],
            initialValue: phone
          })(<Input placeholder='Nhập số điện thoại' type='text' onChange={({ target }) => {
            this.props.getInfo('phone', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Email'>
          {getFieldDecorator('email', {
            rules: [
              requiredRule('Vui lòng nhập email'),
              emailRule('Email không hợp lệ')
            ],
            initialValue: email
          })(<Input placeholder='Nhập email' type='text' onChange={({ target }) => {
            this.props.getInfo('email', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Khoa'>
          {getFieldDecorator('departmentId', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mã khoa',
              },
            ],
            initialValue: departmentId
          })(<Select
            allowClear
            showSearch
            onChange={(value) => {
            this.props.getInfo('departmentId', value)
          }}>
            {
              [...entities].map(([key, value]) => (
                <Option key={key} value={key}>{value.departmentName}</Option>
              ))
            }
          </Select>)}
        </Form.Item>
        <Form.Item label='Địa chỉ'>
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ',
              },
            ],
            initialValue: address
          })(<Input.TextArea rows={4} placeholder='Nhập địa chỉ' type='text' onChange={({ target }) => {
            this.props.getInfo('address', target.value)
          }} />)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'teacher' })(TeacherForm)
