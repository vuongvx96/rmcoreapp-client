import React from 'react'
import { Form, Input } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule, ipRule, inputCodeRule } from '../util/validation'
import IntInput from '../ui/IntInput'

@inject('commonStore')
@observer
class RoomForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            room: {
                roomId: null,
                capacity: 0,
                location: null,
                validIP: null,
                installedSoftware: null,
                note: null
            }
        }
    }

    componentDidMount() {
        this.props.getRef(this)
    }

    render() {
        let { roomId, capacity, location, validIP, note, installedSoftware } = this.props
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
                <Form.Item label='Mã phòng' hasFeedback>
                    {getFieldDecorator('roomId', {
                        rules: [
                            requiredRule('Vui lòng nhập mã'),
                            inputCodeRule('Định dạng mã không hợp lệ!'),
                            {
                                max: 6, message: 'Mã tối đa chỉ 6 ký tự!'
                            }
                        ],
                        initialValue: roomId
                    })(<Input disabled={!isCreate} placeholder='Nhập mã phòng' type='text' onChange={({ target }) => {
                        this.props.getInfo('roomId', target.value)
                    }} />)}
                </Form.Item>
                <Form.Item label='Sức chứa' hasFeedback>
                    {getFieldDecorator('capacity', {
                        rules: [
                            requiredRule('Vui lòng nhập sức chứa')
                        ],
                        initialValue: capacity
                    })(<IntInput placeholder='Nhập sức chứa' type='text' onChange={(value) => {
                        this.props.getInfo('capacity', value)
                    }} />)}
                </Form.Item>
                <Form.Item label='Vị trí' hasFeedback>
                    {getFieldDecorator('location', {
                        initialValue: location
                    })(<Input placeholder='Nhập vị trí' type='text' onChange={({ target }) => {
                        this.props.getInfo('location', target.value)
                    }} />)}
                </Form.Item>
                <Form.Item label='IP chính'>
                    {getFieldDecorator('validIP', {
                        rules: [ipRule('Địa chỉ IP không hợp lệ')],
                        initialValue: validIP
                    })(<Input placeholder='Nhập địa chỉ IP chính' type='text' onChange={({ target }) => {
                        this.props.getInfo('validIP', target.value)
                    }} />)}
                </Form.Item>
                <Form.Item label='Tiện ích, phần mềm'>
                    {getFieldDecorator('installedSoftware', {
                        initialValue: installedSoftware
                    })(<Input.TextArea placeholder='Các phần mềm đã cài đặt' rows={4} onChange={({ target }) => {
                        this.props.getInfo('installedSoftware', target.value)
                    }} />
                    )}
                </Form.Item>
                <Form.Item label='Ghi chú'>
                    {getFieldDecorator('note', {
                        initialValue: note
                    })(<Input.TextArea placeholder='Nhập ghi chú' rows={4} onChange={({ target }) => {
                        this.props.getInfo('note', target.value)
                    }} />)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({ name: 'room' })(RoomForm)
