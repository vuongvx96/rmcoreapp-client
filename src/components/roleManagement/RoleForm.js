import React from 'react'
import { Form, Input } from 'antd'
import { inject } from 'mobx-react'

@inject('commonStore')
class RoleForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			role: {
				name: null,
				description: null
			}
		}
	}

	componentDidMount() {
		this.props.getRef(this)
	}

	render() {
		let { name, description } = this.props
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
				<Form.Item label='Tên role'>
					{getFieldDecorator('name', {
						rules: [
							{
								required: true,
								message: 'Vui lòng nhập tên role',
							},
						],
						initialValue: name
					})(<Input disabled={!isCreate} placeholder='Nhập tên role' type='text' onChange={({ target }) => {
						this.props.getInfo('name', target.value)
					}} />)}
				</Form.Item>
				<Form.Item label='Mô tả'>
					{getFieldDecorator('description', {
						rules: [
							{
								required: true,
								message: 'Vui lòng nhập mô tả',
							},
						],
						initialValue: description
					})(<Input.TextArea row={5} placeholder='Nhập mô tả' onChange={({ target }) => {
            this.props.getInfo('description', target.value)
          }}/>)}
				</Form.Item>
			</Form>
		)
	}
}

export default Form.create({ name: 'role' })(RoleForm)