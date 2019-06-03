import React from 'react'
import _ from 'lodash'
import { Form, Input, Select } from 'antd'
import { observer, inject } from 'mobx-react'

const Option = Select.Option

@inject('commonStore', 'groupPracticeStore', 'teacherStore', 'classStore', 'subjectStore', 'weekStore')
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
        schoolYear: null,
        startDate: null,
        endDate: null
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
    let { groupName, teacherId, subjectId, classId, classSize, semester, schoolYear, startDate, endDate} = this.props
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
        <Form.Item label='Tên nhóm TH'>
          {getFieldDecorator('groupName', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập tên nhóm TH',
              },
            ],
            initialValue: groupName
          })(<Input placeholder='Nhập tên nhóm thực hành' type='text' onChange={({ target }) => {
            this.props.getInfo('groupName', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Giảng viên'>
          {getFieldDecorator('teacherId', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập giảng viên',
              },
            ],
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
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập môn học',
              },
            ],
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
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập môn học',
              },
            ],
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
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập sỉ số',
              },
            ],
            initialValue: classSize
          })(<Input placeholder='Nhập sỉ số' type='text' onChange={({ target }) => {
            this.props.getInfo('classSize', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Năm học'>
          {getFieldDecorator('schoolYear', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập năm học',
              },
            ],
            initialValue: schoolYear
          })(<Select style={{ width: 185 }}
            onChange={(value) => {
              this.props.getInfo('schoolYear', value)
            }}
          >
            {
              _.range(getYear() - 3, getYear() + 10).map(
                i => (
                  <Select.Option key={String(i)} value={String(i)}>{`${i} - ${i+1}`}</Select.Option>
                ))
            }
          </Select>)}
        </Form.Item>
        {/* <Form.Item label='Năm học'>
          {getFieldDecorator('schoolYear', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập năm học',
              },
            ],
            initialValue: schoolYear
          })(<Input placeholder='Nhập năm học' type='text' onChange={({ target }) => {
            this.props.getInfo('schoolYear', target.value)
          }} />)}
        </Form.Item> */}
        <Form.Item label='Học kỳ'>
          {getFieldDecorator('semester', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập học kỳ',
              },
            ],
            initialValue: semester
          })(<Input placeholder='Nhập học kỳ' type='text' onChange={({ target }) => {
            this.props.getInfo('semester', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Ngày bắt đầu'>
          {getFieldDecorator('startDate', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập ngày bắt đầu',
              },
            ],
            initialValue: startDate
          })(<Input placeholder='Nhập ngày bắt đầu' type='text' onChange={({ target }) => {
            this.props.getInfo('startDate', target.value)
          }} />)}
        </Form.Item>
        <Form.Item label='Ngày kết thúc'>
          {getFieldDecorator('endDate', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập ngày kết thúc',
              },
            ],
            initialValue: endDate
          })(<Input placeholder='Nhập ngày kết thúc' type='text' onChange={({ target }) => {
            this.props.getInfo('endDate', target.value)
          }} />)}
        </Form.Item>
      </Form>
    )
  }
}

function getYear() {
  return new Date().getFullYear()
}

export default Form.create({ name: 'groupPractice' })(GroupPracticeForm)
