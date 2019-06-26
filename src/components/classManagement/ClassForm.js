import React from 'react'
import { Form, Input, Select } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule, inputCodeRule } from '../util/validation'

const Option = Select.Option

@inject('commonStore', 'majorStore')
@observer

class ClassForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Class: {
        classId: null,
        majorId: null
      }
    }
  }

  componentDidMount() {
    this.props.getRef(this)
    this.props.majorStore.fetchAll()
  }

  render() {
    let { classId, majorId } = this.props
    let { getFieldDecorator } = this.props.form
    let { isCreate } = this.props.commonStore
    let { entities } = this.props.majorStore

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
        <Form.Item label='Mã Lớp'>
          {getFieldDecorator('classId', {
            rules: [
              requiredRule('Vui lòng nhập mã'),
              inputCodeRule('Mã không đúng định dạng')
            ],
            initialValue: classId
          })(<Input disabled={!isCreate} placeholder='Nhập mã lớp' type='text' onChange={({ target }) => {
            this.props.getInfo('classId', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Chuyên ngành'>
          {getFieldDecorator('majorId', {
            rules: [requiredRule('Vui lòng chọn chuyên ngành')],
            initialValue: majorId
          })(<Select onChange={(value) => {
            this.props.getInfo('majorId', value)
          }}>
            {
              [...entities].map(([key, value]) => (
                <Option key={key} value={key}>{value.majorName}</Option>
              ))
            }
          </Select>)}
        </Form.Item>
      </Form>
    )
  }

}

export default Form.create({ name: 'Class' })(ClassForm)
