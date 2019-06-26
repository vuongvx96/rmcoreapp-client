import React from 'react'
import { Form, Input } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule, inputCodeRule } from '../util/validation'

@inject('commonStore')
@observer
class DepartmentForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            department: {
                departmentId: null,
                departmentName: null,
            }
        }
    }

    componentDidMount() {
        this.props.getRef(this)
    }

    render() {
        let { departmentId, departmentName } = this.props
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
                <Form.Item label='Mã khoa'>
                    {getFieldDecorator('departmentId', {
                        rules: [
                            requiredRule('Vui lòng nhập mã'),
                            inputCodeRule('Mã không đúng định dạng')
                        ],
                        initialValue: departmentId
                    })(<Input disabled={!isCreate} placeholder='Nhập mã khoa' type='text' onChange={({ target }) => {
                        this.props.getInfo('departmentId', target.value)
                    }} />)}
                </Form.Item>
                <Form.Item label='Tên khoa'>
                    {getFieldDecorator('departmentName', {
                        rules: [requiredRule('Vui lòng nhập tên khoa')],
                        initialValue: departmentName
                    })(<Input placeholder='Nhập tên khoa' type='text' onChange={({ target }) => {
                        this.props.getInfo('departmentName', target.value)
                    }} />)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({ name: 'department' })(DepartmentForm)
