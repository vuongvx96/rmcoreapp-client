import React from 'react'
import { Form, Input, Select } from 'antd'
import { observer, inject } from 'mobx-react'

import { requiredRule, inputCodeRule } from '../util/validation'

const Option = Select.Option

@inject('commonStore', 'departmentStore')
@observer

class MajorForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			major: {
				majorId: null,
				majorName: null,
				departmentId: null
			}
		}
	}

	componentDidMount() {
		this.props.getRef(this)
		this.props.departmentStore.fetchAll()
	}

	render() {
		let { majorId, majorName, departmentId } = this.props
		let { getFieldDecorator } = this.props.form
		let { isCreate } = this.props.commonStore
		let { entities } = this.props.departmentStore

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
				<Form.Item label='Mã chuyên ngành'>
					{getFieldDecorator('majorId', {
						rules: [
							requiredRule('Vui lòng nhập mã'),
							inputCodeRule('Mã không đúng định dạng')
						],
						initialValue: majorId
					})(<Input disabled={!isCreate} placeholder='Nhập mã chuyên ngành' type='text' onChange={({ target }) => {
						this.props.getInfo('majorId', target.value)
					}} />)}
				</Form.Item>
				<Form.Item label='Tên chuyên ngành'>
					{getFieldDecorator('majorName', {
						rules: [requiredRule('Vui lòng nhập tên chuyên ngành')],
						initialValue: majorName
					})(<Input placeholder='Nhập tên chuyên ngành' type='text' onChange={({ target }) => {
						this.props.getInfo('majorName', target.value)
					}} />)}
				</Form.Item>
				<Form.Item label='Tên khoa'>
					{getFieldDecorator('departmentId', {
						rules: [requiredRule('Vui lòng chọn khoa')],
						initialValue: departmentId
					})(<Select onChange={(value) => {
						this.props.getInfo('departmentId', value)
					}}>
						{
							[...entities].map(([key, value]) => (
								<Option key={key} value={key}>{value.departmentName}</Option>
							))
						}
					</Select>)}
				</Form.Item>
			</Form>
		)
	}
}

export default Form.create({ name: 'major' })(MajorForm)
