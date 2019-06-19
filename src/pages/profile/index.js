import React from 'react'
import { inject, observer } from 'mobx-react'
import { toast } from 'react-toastify'
import {
  Row,
  Col,
  Avatar,
  Skeleton,
  Button,
  Alert,
  Icon,
  Form,
  Input,
  Tag,
  Typography,
  Radio,
  Popconfirm,
  Modal
} from 'antd'

import { requiredRule, emailRule, inputPhoneNumberVN, validURL } from '../../components/util/validation'
import { dateFormatter, dateTimeFormatter } from '../../components/util/formatter'
import runPassword from '../../components/util/passwordStrengthMeter'
import './index.less'

@inject('accountStore')
@observer
class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      strText: 'Yếu',
      strColor: '#e71a1a'
    }
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this)
  }

  handleUpdateProfile() {
    this.props.accountStore.updateProfile()
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('Mật khẩu không khớp!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['newPasswordConfirm'], { force: true })
    }
    callback()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let payload = {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          newPasswordConfirm: values.newPasswordConfirm
        }
        const result = await this.props.accountStore.changePassword(payload)
        if (result.status === 200) {
          this.setState({ visible: false })
          this.setState({ errors: false })
          toast.success('Thay đổi mật khẩu thành công!')
        } else {
          let errors = result.response.data.map(err => err.description).join(',')
          this.setState({ errors })
          toast.warn('Thay đổi mật khẩu thất bại!')
        }
      }
    })
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy - ' + this.props.route.displayName
    this.props.accountStore.loadCurrentUser()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { inProgress, updating, getCurrentUser } = this.props.accountStore
    let { visible, errors, strText, strColor } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }
    return (
      <Skeleton loading={inProgress}>
        <div className='profile'>
          <Row gutter={16}>
            <Col span={6} className='overview'>
              <Avatar size={200} shape='square' src={getCurrentUser.avatar} />
              <span className='title'>Ngày đăng ký</span>
              <span className='text' style={{ marginTop: 5, color: '#00474f' }}>{dateFormatter(getCurrentUser.registrationDate)}</span>
              <span className='title'>Đăng nhập gần đây</span>
              <span className='text' style={{ marginTop: 5, color: '#00474f' }}>{dateTimeFormatter(getCurrentUser.lastLoginTime)}</span>
              <div className='title' style={{ marginBottom: 15 }}>
                <Icon type='mail' style={{ marginRight: 5 }} />
                <span>Email: <Tag color={getCurrentUser.emailConfirmed ? '#87d068' : '#F50'}>{getCurrentUser.emailConfirmed ? 'Đã xác thực' : 'Chưa xác thực'}</Tag></span>
              </div>
              <Button
                icon='home'
                href='/dashboard'>
                Dashboard
            </Button>
              <Button
                icon='sync'
                onClick={() => this.setState({ visible: true })}
              >
                Đổi mật khẩu
            </Button>
              <Popconfirm
                placement='right'
                title='Thiết bị sẽ đăng xuất sau phiên truy cập này?'
                okText='Đồng ý'
                cancelText='Hủy'
                onConfirm={this.props.accountStore.revokeToken}
              >
                <Button
                  icon='logout'
                >
                  Đăng xuất tự động
              </Button>
              </Popconfirm>
            </Col>
            <Col span={18} className='user-info'>
              <Typography.Title level={2} style={{ marginBottom: 0 }}>{getCurrentUser.fullName}</Typography.Title>
              <Typography.Title level={4} style={{ marginTop: 0 }}>({getCurrentUser.userName})</Typography.Title>
              <h4 style={{ marginTop: 50, color: '#bfbfbf', fontWeight: 'bold' }}>THÔNG TIN LIÊN HỆ</h4>
              <Form {...formItemLayout}>
                <Form.Item label='Họ tên'>
                  {getFieldDecorator('fullName', {
                    rules: [requiredRule('Vui lòng nhập họ tên')],
                    initialValue: getCurrentUser.fullName
                  })(<Input onChange={({ target }) => {
                    this.props.accountStore.updateCurrentUser('fullName', target.value)
                  }} />)}
                </Form.Item>
                <Form.Item label='Điện thoại'>
                  {getFieldDecorator('phoneNumber', {
                    rules: [
                      requiredRule('Vui lòng nhập số điện thoại'),
                      inputPhoneNumberVN('Số điện thoại không hợp lệ!')
                    ],
                    initialValue: getCurrentUser.phoneNumber
                  })(<Input onChange={({ target }) => {
                    this.props.accountStore.updateCurrentUser('phoneNumber', target.value)
                  }} />)}
                </Form.Item>
                <Form.Item label='Email'>
                  {getFieldDecorator('email', {
                    rules: [
                      requiredRule('Vui lòng nhập email'),
                      emailRule('Địa chỉ email không hợp lệ!')
                    ],
                    initialValue: getCurrentUser.email
                  })(<Input onChange={({ target }) => {
                    this.props.accountStore.updateCurrentUser('email', target.value)
                  }} />)}
                </Form.Item>
                <h4 style={{ marginTop: 50, color: '#bfbfbf', fontWeight: 'bold' }}>THÔNG TIN CƠ BẢN</h4>
                <Form.Item label='Mã GV/VC'>
                  {getFieldDecorator('officerId', {
                    initialValue: getCurrentUser.officerId
                  })(<Input disabled />)}
                </Form.Item>
                <Form.Item label='Link ảnh đại diện'>
                  {getFieldDecorator('avatar', {
                    rules: [validURL('URL không hợp lệ')],
                    initialValue: getCurrentUser.avatar
                  })(<Input onChange={({ target }) => {
                    this.props.accountStore.updateCurrentUser('avatar', target.value)
                  }} />)}
                </Form.Item>
                <Form.Item label='Giới tính'>
                  {getFieldDecorator('gender', {
                    initialValue: getCurrentUser.gender
                  })(
                    <Radio.Group onChange={({ target }) => {
                      this.props.accountStore.updateCurrentUser('gender', target.value)
                    }}>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label='Role'>
                  {
                    getCurrentUser.roles.map(item => (
                      <Tag key={item} color='#87d068'>{item}</Tag>
                    ))
                  }
                </Form.Item>
              </Form>
              <Button
                type='primary'
                className='btnSave'
                loading={updating}
                onClick={this.handleUpdateProfile}
              >
                Lưu thay đổi
              </Button>
            </Col>
          </Row>
        </div>
        <Modal
          title='Đổi mật khẩu'
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          okText='Đổi'
          cancelText='Hủy'
          onOk={this.handleSubmit}
        >
          <Form
            labelCol={{ xs: { span: 24 }, sm: { span: 10 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 14 } }}
            onSubmit={this.handleSubmit}
          >
            <Form.Item label='Mật khẩu hiện tại'>
              {getFieldDecorator('currentPassword', {
                rules: [requiredRule('Mật khẩu không được để trống!')],
              })(
                <Input.Password prefix={<Icon type='lock' />} placeholder='Mật khẩu cũ' onChange={({ target }) => {
                  this.setState({ currentPassword: target.value })
                }} />
              )}
            </Form.Item>
            <Form.Item label='Mật khẩu mới' style={{ marginBottom: 0 }}>
              {getFieldDecorator('newPassword', {
                rules: [
                  requiredRule('Mật khẩu mới không được để trống!'),
                  {
                    validator: this.validateToNextPassword,
                  }
                ],
              })(
                <Input.Password prefix={<Icon type='lock' />} placeholder='Mật khẩu mới' onChange={({ target }) => {
                  this.setState({ newPassword: target.value })
                  let pwdCheck = runPassword(target.value)
                  this.setState({ strText: pwdCheck.strText, strColor: pwdCheck.strColor })
                }} />
              )}
            </Form.Item>
            <Form.Item wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 14, offset: 10 }
            }}>
              <span>Độ mạnh của mật khẩu: <b style={{ color: strColor }}>{strText}</b></span>
            </Form.Item>
            <Form.Item label='Xác nhận mật khẩu mới'>
              {getFieldDecorator('newPasswordConfirm', {
                rules: [
                  requiredRule('Mật khẩu mới không được để trống!'),
                  {
                    validator: this.compareToFirstPassword,
                  }
                ],
              })(
                <Input.Password prefix={<Icon type='lock' />} placeholder='Nhập lại mật khẩu mới' onChange={({ target }) => {
                  this.setState({ newPasswordConfirm: target.value })
                }} />
              )}
            </Form.Item>
            {errors ? <Alert message={errors} type='error' showIcon /> : <></>}
          </Form>
        </Modal>
      </Skeleton>
    )
  }
}

export default Form.create({ name: 'profile' })(Profile)