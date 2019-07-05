import React from 'react'
import { Layout, Avatar, Popover, Icon, Button } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import jwt from 'jsonwebtoken'

import Sider from './sider'
import { PRIVATE_KEY } from '../../../config'
import logo from '../../../assets/icons/Logo_NTU.png'
import './index.less'

const Header = ({ onLogout, showSideBar, sideBarState }) => {
	const username = localStorage.getItem('username')
	return (
		<Layout.Header className='header'>
			<div className='topHeader'>
				<div className='left-items'>
					<img className='header-logo' src={logo} alt='Nha Trang University' onClick={() => window.location.assign('/')} />
					<Icon type={sideBarState ? 'menu-fold' : 'menu-unfold'} className='navbar-toggler-icon' onClick={showSideBar} />
				</div>
				<div className='right-items'>
					<Button href='/help' className='help-button-d' ghost type='link' style={{ marginRight: 5, color: 'unset' }}>
						<Icon type='read' />
						<span>Hướng dẫn sử dụng</span>
					</Button>
					<Popover
						placement='bottomRight'
						title={null}
						content={
							<div className='popMenu'>
								<div className='popItem' onClick={() => window.location.assign('/profile')}><Icon size={20} type='user' /> {username}</div>
								<Button className='help-button-m' href='/help' ghost type='link' style={{ marginRight: 5, color: 'unset' }}>
									<Icon type='read' />
									<span>Hướng dẫn sử dụng</span>
								</Button>
								<div onClick={onLogout} className='popItem'><Icon size={20} type='logout' /> Đăng xuất</div>
							</div>
						}
						trigger='click'
					>
						<Avatar size={36} icon='user' />
					</Popover>
				</div>
			</div>
		</Layout.Header >
	)
}


class NewLayout extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			showSideBar: true
		}

		jwt.verify(localStorage.getItem('access_token'), PRIVATE_KEY, (error) => {
			if (!!error) {
				this.props.onLogout()
			}
		})

		this.handleToggleSideBar = this.handleToggleSideBar.bind(this)
	}

	handleToggleSideBar() {
		let { showSideBar } = this.state
		this.setState({ showSideBar: !showSideBar })
	}

	render() {
		return (
			<div className='layoutCustom'>
				<Layout>
					<Header onLogout={this.props.onLogout} showSideBar={this.handleToggleSideBar} sideBarState={this.state.showSideBar} />
					<Layout style={{ marginTop: 64 }}>
						<Sider showSideBar={this.state.showSideBar} />
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
