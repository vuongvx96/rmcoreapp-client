import React from 'react'
import { Form, Input } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule, inputCodeRule } from '../util/validation'

@inject('commonStore')
@observer
class ManufacturerForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			manufacturer: {
				manufacturerId: null,
				manufacturerName: null,
				manufacturerContact: null
			}
		}
	}

	componentDidMount() {
		this.props.getRef(this)
	}

	render() {
		let { manufacturerId, manufacturerName, manufacturerContact } = this.props
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
				<Form.Item label='Mã hãng sản xuất'>
					{getFieldDecorator('manufacturerId', {
						rules: [
							requiredRule('Vui lòng nhập mã'),
							inputCodeRule('Mã không đúng định dạng')
						],
						initialValue: manufacturerId
					})(<Input disabled={!isCreate} placeholder='Nhập mã hãng sản xuất' type='text' onChange={({ target }) => {
						this.props.getInfo('manufacturerId', target.value)
					}} />)}
				</Form.Item>
				<Form.Item label='Tên hãng sản xuất'>
					{getFieldDecorator('manufacturerName', {
						rules: [requiredRule('Vui lòng nhập tên hãng sản xuất')],
						initialValue: manufacturerName
					})(<Input placeholder='Nhập tên hãng sản xuất' type='text' onChange={({ target }) => {
						this.props.getInfo('manufacturerName', target.value)
					}} />)}
				</Form.Item>
				<Form.Item label='Thông tin liên hệ'>
					{getFieldDecorator('manufacturerContact', {
						initialValue: manufacturerContact
					})(<Input placeholder='Nhập thông tin liên hệ (ĐT, Email, ...)' type='text' onChange={({ target }) => {
						this.props.getInfo('manufacturerContact', target.value)
					}} />)}
				</Form.Item>
			</Form>
		)
	}
}

export default Form.create({ name: 'manufacturer' })(ManufacturerForm)
