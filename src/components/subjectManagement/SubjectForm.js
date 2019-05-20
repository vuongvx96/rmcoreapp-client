import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import { observer, inject } from 'mobx-react'

@inject('commonStore')
@observer

class SubjectForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subject: {
        subjectId: null,
        subjectName: null,
        credits: null
      }
    }
  }

  componentDidMount() {
    this.props.getRef(this)
  }

  render() {
    let { subjectId, subjectName, credits } = this.props
    let { getFieldDecorator } = this.props.form
    let { isCreate } = this.props.commonStore



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
        <Form.Item label='Mã môn'>
          {getFieldDecorator('subjectId', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mã môn',
              },
            ],
            initialValue: subjectId
          })(<Input disabled={!isCreate} placeholder='Nhập mã môn' type='text' onChange={({ target }) => {
            this.props.getInfo('subjectId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Tên môn'>
          {getFieldDecorator('subjectName', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập tên môn',
              },
            ],
            initialValue: subjectName
          })(<Input placeholder='Nhập số tín chỉ' type='text' onChange={({ target }) => {
            this.props.getInfo('subjectName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Số tín chỉ'>
          {getFieldDecorator('credits', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập số tín chỉ',
              },
            ],
            initialValue: credits
          })(<InputNumber
            min={1}
            max={10}
            defaultValue={1}
            onChange={(value) => {
              this.props.getInfo('credits', value)
            }}
          />)}
        </Form.Item>
        {/* <Form.Item label='Số tín chỉ'>
          {getFieldDecorator('credits', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập số tín chỉ',
              },
            ],
            initialValue: credits
          })(<Input placeholder='Nhập số tín chỉ' type='text' onChange={({ target }) => {
            this.props.getInfo('credits', target.value)
          }} />)}
        </Form.Item> */}
      </Form>
    )
  }
}

export default Form.create({ name: 'subject' })(SubjectForm)
