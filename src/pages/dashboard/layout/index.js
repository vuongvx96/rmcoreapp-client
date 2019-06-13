import React from 'react'
import { Layout, Avatar, Popover, Icon } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import jwt from 'jsonwebtoken'

import Sider from './sider'
import { PRIVATE_KEY } from '../../../config'
import logo from '../../../assets/icons/Logo-qlpm.png'
import './index.less'

const Header = ({ onLogout }) => {
	const username = localStorage.getItem('username')
	return (
		<Layout.Header className='header'>
			<div className='topHeader'>
				<img src={logo} alt='Nha Trang University' />
				<Popover
					placement='bottomRight'
					title={null}
					content={
						<div className='popMenu'>
							<div className='popItem' onClick={() => window.location.assign('/profile')}><Icon size={20} type='user' /> {username}</div>
							<div onClick={onLogout} className='popItem'><Icon size={20} type='logout' /> Đăng xuất</div>
						</div>
					}
					trigger='click'
				>
					<Avatar size={36} icon='user' />
				</Popover>
			</div>
		</Layout.Header>
	)
}


class NewLayout extends React.PureComponent {
	constructor(props) {
		super(props)
		jwt.verify(localStorage.getItem('access_token'), PRIVATE_KEY, (error) => {
			if (!!error) {
				this.props.onLogout()
			}
		})
	}
	render() {
		return (
			<div className='layoutCustom'>
				<Layout>
					<Header onLogout={this.props.onLogout} />
					<Layout style={{ marginTop: 64 }}>
						<Sider />
						<Layout.Content className='content'>
							<Scrollbars className='scrollbar' autoHide>
								<div style={{ padding: '12px' }}>
									{this.props.children}
								</div>
							</Scrollbars>
						</Layout.Content>
					</Layout>
				</Layout>
			</div>
		)
	}
}

export default NewLayout