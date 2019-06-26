import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Form, Input, Button, Icon } from 'antd'
import './index.less'


@withRouter
@inject('accountStore')
@observer
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginFailed: 0
    }
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy - ' + this.props.route.displayName
  }
  
  componentWillUnmount() {
    this.props.accountStore.reset()
  }

  handleUsernameChange = e => this.props.accountStore.setUsername(e.target.value)
  handlePasswordChange = e => this.props.accountStore.setPassword(e.target.value)
  handleSubmitForm = async (e) => {
    e.preventDefault()
    let result = await this.props.accountStore.login()
    if (result.status === 200 && result.data.token) {
      localStorage.setItem('access_token', result.data.token)
      localStorage.setItem('username', this.props.accountStore.values.username)
      localStorage.setItem('refresh_token', result.data.refreshToken)
      toast.success('Đăng nhập thành công.')
      window.location.assign('/dashboard')
    } else {
      if (result.response.status === 403)
        toast.warn(result.response.data)
      else {
        toast.warn('Tên đăng nhập hoặc mật khẩu không đúng!')
        const { loginFailed } = this.state
        this.setState({ loginFailed: loginFailed + 1 })
      }
    }
  }

  render() {
    const { values, inProgress } = this.props.accountStore
    const { getFieldDecorator } = this.props.form
    const { loginFailed } = this.state
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingTop: 100 }}>
        <div className='login_sub_container'>
          <div className='login_side' style={{ borderRight: '1px solid #EDEDEE' }}>
            <h3 style={{ color: '#377fb7' }}>Trang quản lý phòng máy</h3>
            <Form onSubmit={this.handleSubmitForm} className='login-form'>
              <Form.Item disabled={inProgress}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Tên đăng nhập không được để trống!' }],
                })(
                  <Input prefix={<Icon type='user' />} placeholder='Tên đăng nhập' onChange={this.handleUsernameChange} />
                )}
              </Form.Item>
              <Form.Item disabled={inProgress}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Mật khẩu không được để trống' }],
                })(
                  <Input prefix={<Icon type='lock' />} type='password' placeholder='Mật khẩu' onChange={this.handlePasswordChange} />
                )}
              </Form.Item>
              {loginFailed > 1
                ? <a className='login-form-forgot' href='/forgot-password'>
                  Quên mật khẩu
                  </a>
                : <></>
              }
              <Button
                disabled={!values.password || !values.username || inProgress}
                loading={inProgress}
                type='primary'
                htmlType='submit'
                className='login-form-button'
                style={{ backgroundColor: 'rgb(92, 184, 92)', color: 'white', borderColor: '#4cae4c' }}
              >
                Đăng nhập
				      </Button>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create({ name: 'login' })(Login)