import React from 'react'
import { Form, Input, Button, Alert } from 'antd'

import http from '../../tools/axios'
import { requiredRule, emailRule } from '../../components/util/validation'

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSuccess: false,
      message: null,
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let payload = {
          email: values.email
        }
        const response = await http.post('/auth/forgotpassword', payload)
        if (response.status === 200) {
          this.setState({ isSuccess: true, message: 'Hệ thống đã gửi mail, vui lòng kiểm tra thư của bạn!'})
        } else {
          this.setState({ isSuccess: false, message: 'Có lỗi xảy ra, vui lòng thử lại!'})
        }
      }
    })
  }

  render() {
    let { getFieldDecorator } = this.props.form
    const { isSuccess, message } = this.state
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }
    return (
      <div style={{ overflow: 'hidden' }}>
        <h1 style={{ margin: '20px 0 30px', textAlign: 'center', color: '#000' }}>Bạn quên mật khẩu?</h1>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#606060' }}>
          Để đặt lại mật khẩu, vui lòng nhập email của bạn đã đăng ký cho tài khoản trên hệ thống này.<br />
          Website sẽ gửi cho bạn 1 email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn.<br /><br />
          Nếu bạn gặp khó khăn, hãy <a style={{ color: '#007cdc', textDecoration: 'none' }} href='mailto:phongmayg8ntu@gmail.com'>liên hệ</a> quản trị viên hoặc hỗ trợ kỹ thuật của trang web này.
        </p>
        <div style={{ width: '60vw', margin: '0 auto' }}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label='Email' style={{ marginBottom: 0 }}>
              {getFieldDecorator('email', {
                rules: [
                  requiredRule('Vui lòng nhập email'),
                  emailRule('Địa chỉ email không hợp lệ')
                ],
              })(<Input type='text' onChange={({ target }) => {
                this.setState({ email: target.value })
              }} />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {message ? <Alert message={message} type={isSuccess ? 'info' : 'error'} closeText='Đóng' showIcon onClose={() => {
                this.setState({ message: null })
              }}/> : <></>}
              <Button type='primary' htmlType='submit'>
                Tiếp tục
          </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create({ name: 'forgotPassword' })(ForgotPassword)