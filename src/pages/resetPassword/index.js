import React from 'react'
import { toast } from 'react-toastify'
import { withRouter, Redirect } from 'react-router'
import { Form, Input, Button, Icon, Alert } from 'antd'

import { requiredRule, emailRule } from '../../components/util/validation'
import runPassword from '../../components/util/passwordStrengthMeter'
import http from '../../tools/axios'
import './index.less'

@withRouter
class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSuccess: false,
      messages: null,
      strText: 'Yếu',
      strColor: '#e71a1a'
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let payload = {
          code: this.props.match.params.resettoken,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword
        }
        try {
          const result = await http.post('/auth/resetpassword', payload)
          if (result && result.status === 200) {
            toast.info('Đặt lại mật khẩu thành công!')
            this.setState({ messages: 'Đổi mật khẩu thành công' })
            setTimeout(() => { this.props.history.push('/login') }, 5000)
          } else {
            toast.warn('Đặt lại mật khẩu thất bại')
            this.setState({ messages:  result.response.data.map(err => err.description).join(',')})
          }
        } catch (err) {
          toast.warn('Đặt lại mật khẩu thất bại')
            this.setState({ messages:  err.response.data.map(err => err.description).join(',')})
        }
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu không khớp!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true })
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { isSuccess, messages, strText, strColor } = this.state
    return (
      <div style={{ padding: 40 }}>
      <Form onSubmit={this.handleSubmit} className='reset-password-form'>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              requiredRule('Vui lòng nhập email!'),
              emailRule('Địa chỉ email không hợp lệ')
            ]
          })(
            <Input
              prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Địa chỉ email'
            />
          )}
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          {getFieldDecorator('password', {
            rules: [
              requiredRule('Vui lòng nhập mật khẩu!'),
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Mật khẩu'
              onChange={({ target }) => {
                let pwdCheck = runPassword(target.value)
                this.setState({ strText: pwdCheck.strText, strColor: pwdCheck.strColor })
              }}
            />
          )}
        </Form.Item>
        <Form.Item>
          <span>Độ mạnh của mật khẩu: <b style={{ color: strColor }}>{strText}</b></span>
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirmPassword', {
            rules: [
              requiredRule('Vui lòng nhập mật khẩu xác nhận!'),
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Xác nhận mật khẩu'
            />
          )}
          {messages
            ? <Alert message={messages} type={isSuccess ? 'success' : 'error'} closeText='Đóng' onClose={() => this.setState({ messages: null })} />
            : <></>
          }
          <Button type='primary' htmlType='submit' className='reset-password-button'>
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
      </div>
    )
  }
}

export default Form.create({ name: 'resetPassword' })(ResetPassword)