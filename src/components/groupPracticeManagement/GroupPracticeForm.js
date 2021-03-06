import React from 'react'
import _ from 'lodash'
import { Form, Input, Select } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule } from '../util/validation'
import IntInput from '../../components/ui/IntInput'

const Option = Select.Option

@inject('commonStore', 'groupPracticeStore', 'teacherStore', 'classStore', 'subjectStore')
@observer

class GroupPracticeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groupPractice: {
        groupName: null,
        teacherId: null,
        subjectId: null,
        classId: null,
        classSize: null,
        semester: null,
        schoolYear: null
      }
    }
  }

  componentDidMount() {
    this.props.getRef(this)
    this.props.teacherStore.fetchAll()
    this.props.classStore.fetchAll()
    this.props.subjectStore.fetchAll()
  }

  render() {
    let { groupName, teacherId, subjectId, classId, classSize, semester, schoolYear } = this.props
    let { getFieldDecorator } = this.props.form
    let { listTeachers } = this.props.teacherStore
    let { listSubjects } = this.props.subjectStore
    let { listClasses } = this.props.classStore
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
        <Form.Item label='Tên nhóm (viết tắt)'>
          {getFieldDecorator('groupName', {
            initialValue: groupName
          })(<Input placeholder='Nhập tên nhóm thực hành' type='text' onChange={({ target }) => {
            this.props.getInfo('groupName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Giảng viên'>
          {getFieldDecorator('teacherId', {
            rules: [requiredRule('Vui lòng chọn giảng viên')],
            initialValue: teacherId
          })(<Select
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            allowClear
            showSearch
            onChange={(value) => {
              this.props.getInfo('teacherId', value)
            }}>
            {
              listTeachers.map(item => (
                <Option key={item.teacherId} value={item.teacherId}>{item.lastName + ' ' + item.firstName}</Option>
              ))
            }
          </Select>)}
        </Form.Item>
        <Form.Item label='Môn học'>
          {getFieldDecorator('subjectId', {
            rules: [requiredRule('Vui lòng chọn môn học')],
            initialValue: subjectId
          })(<Select
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            allowClear
            showSearch
            onChange={(value) => {
              this.props.getInfo('subjectId', value)
            }}>
            {
              listSubjects.map(item => (
                <Option key={item.subjectId} value={item.subjectId}>{item.subjectName}</Option>
              ))
            }
          </Select>)}
        </Form.Item>
        <Form.Item label='Lớp học'>
          {getFieldDecorator('classId', {
            rules: [requiredRule('Vui lòng chọn môn học')],
            initialValue: classId
          })(<Select
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            allowClear
            showSearch
            onChange={(value) => {
              this.props.getInfo('classId', value)
            }}>
            {
              listClasses.map(item => (
                <Option key={item.classId} value={item.classId}>{item.classId}</Option>
              ))
            }
          </Select>)}
        </Form.Item>
        <Form.Item label='Sỉ số'>
          {getFieldDecorator('classSize', {
            rules: [requiredRule('Vui lòng nhập sĩ số')],
            initialValue: classSize
          })(<IntInput placeholder='Nhập sỉ số' type='text' onChange={(value) => {
            this.props.getInfo('classSize', value)
          }} />)}
        </Form.Item>
        <Form.Item label='Năm học'>
          {getFieldDecorator('schoolYear', {
            rules: [requiredRule('Vui lòng chọn năm học')],
            initialValue: schoolYear
          })(<Select style={{ width: 185 }}
            onChange={(value) => {
              this.props.getInfo('schoolYear', value)
            }}
          >
            {
              _.range(new Date().getFullYear() - 10, new Date().getFullYear() + 10).map(
                i => (
                  <Select.Option key={String(i)} value={String(i)}>{`${i} - ${i + 1}`}</Select.Option>
                ))
            }
          </Select>)}
        </Form.Item>
        <Form.Item label='Học kỳ'>
          {getFieldDecorator('semester', {
            rules: [requiredRule('Vui lòng chọn học kỳ')],
            initialValue: semester
          })(<Select style={{ width: 150 }} onChange={(value) => {
            this.props.getInfo('semester', value)
          }}>
            <Select.Option key={1} value={1}>Học kỳ 1</Select.Option>
            <Select.Option key={2} value={2}>Học kỳ 2</Select.Option>
            <Select.Option key={3} value={3}>Học kỳ hè</Select.Option>
          </Select>)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'groupPractice' })(GroupPracticeForm)
