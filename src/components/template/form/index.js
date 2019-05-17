import React from 'react'
import __ from 'lodash'

import { Form, Input } from 'antd'

class CustomForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }

    componentDidMount() {
        if (this.props.getRef) {
            this.props.getRef(this)
        }
        if (this.props.info) {
            this.setState({ info: this.props.info })
        }
    }

    componentWillReceiveProps(props) {
        if (props.info && props.info._id !== this.props.info._id) {
            this.setState({ info: props.info })
            this.props.form.resetFields()
        }
    }

    renderInput(getFieldDecorator, field) {
        let { info } = this.state
        if (field.component) {
            return getFieldDecorator(field.field, {
                rules: field.rules,
                initialValue: info[field.field]
            })(
                <field.component onChange={(value) => {
                }} />
            )
        } else {
            return getFieldDecorator(field.field, {
                rules: field.rules,
                initialValue: info[field.field]
            })(
                <Input type={field.type} onChange={({ target }) => {
                    let newInfo = __.cloneDeep(this.state.info)
                    newInfo[field.field] = target.value
                    this.setState({ info: newInfo })
                }} />
            )
        }
    }

    render() {
        let { form, fields } = this.props
        let { getFieldDecorator } = form
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
            <div>
                {
                    __.map(fields, field => (
                        <Form.Item key={field.field}
                            {...formItemLayout}
                            label={field.label}
                        >
                            {
                                this.renderInput(getFieldDecorator, field)
                            }
                        </Form.Item>
                    ))
                }
            </div>
        )
    }
}

// export default CustomForm
export default Form.create({ name: 'create' })(CustomForm)