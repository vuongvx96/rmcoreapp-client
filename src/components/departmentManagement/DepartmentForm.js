import React from 'react'
import { Form, Input } from 'antd'
import { observer, inject } from 'mobx-react'

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
                <Form.Item label='Mã phòng'>
                    {getFieldDecorator('roomId', {
                        rules: [
                            {
                                required: true,
                                message: 'Vui lòng nhập mã',
                            },
                        ],
                        initialValue: departmentId
                    })(<Input disabled={!isCreate} placeholder='Nhập mã phòng' type='text' onChange={({ target }) => {
                        this.props.getInfo('roomId', target.value)
                    }} />)}
                </Form.Item>
                <Form.Item label='Sức chứa'>
                    {getFieldDecorator('capacity', {
                        rules: [
                            {
                                required: true,
                                message: 'Vui lòng nhập sức chứa',
                            },
                        ],
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
