import React from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'antd'
import Modal from '../../ui/Modal'
import Form from '../form'

@inject('commonStore')
@observer
class ModalForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = { open: false }
	}

	openDialog() {
		this.setState({ open: true })
	}

	closeDialog(callback) {
		this.props.commonStore.onUpdate()
		if (callback) {
			this.setState({ open: false })
			callback()
		} else {
			this.setState({ open: false })
		}
	}

	componentDidMount() {
		if (this.props.getRef) {
			this.props.getRef(this)
		}
	}

	render() {
		let { title, buttonName, handleCreate, handleUpdate, clearState, disableButtonSave, info, formFields, modalWidth, leftItems } = this.props
		let { open } = this.state
		let { isCreate } = this.props.commonStore
		return (
			<>
				<div className='flex-container' style={{ paddingBottom: 10 , width: '100%' }}>
					{
						leftItems ?
							<div className='left-items'>
								{leftItems}
							</div>
							: <></>
					}
					<div className='right-items'>
						<Button name='btnCreate' type='primary'
							onClick={() => {
								clearState()
								this.props.commonStore.onCreate()
								if (this.form) {
									this.form.props.form.resetFields()
								}
								this.openDialog()
							}}
						>
							{buttonName}
						</Button>
					</div>
				</div>
				<Modal
					title={title}
					open={open}
					width={modalWidth}
					footer={[
						<Button name='btnCancel' key='cancel' type={'default'} className='btnCancel' onClick={() => {
							this.form.props.form.resetFields()
							this.closeDialog()
						}}>
							Thoát
					</Button>,
						<Button name='btnSave' disabled={disableButtonSave} key='save' type={'primary'} className='btnSave' onClick={() => {
							this.closeDialog(() => {
								this.form.props.form.resetFields()
								if (this.props.children) {
									if (isCreate)
										handleCreate()
									else
										handleUpdate()
								} else {
									if (isCreate)
										handleCreate(this.form.state.info)
									else
										handleUpdate(this.form.state.info)
								}
							})
						}}>
							Lưu
					</Button>
					]}
				>
					<div style={{ paddingTop: 20 }}>
						{
							this.props.children
								? React.cloneElement(this.props.children, {
									getRef: (ref) => {
										this.form = ref
									}
								})
								: <Form getRef={ref => {
									this.form = ref
								}} fields={formFields} info={info} />
						}
					</div>
				</Modal>
			</>
		)
	}
}

export default ModalForm