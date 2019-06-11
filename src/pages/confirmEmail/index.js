import React from 'react'
import { withRouter, Redirect } from 'react-router'

import SuccessIcon from '../../assets/icons/success_icon.svg'

@withRouter
class ConfirmEmail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  componentDidMount() {
    this.id = setTimeout(() => this.setState({ redirect: true }), 100000)
  }

  componentWillUnmount() {
    clearTimeout(this.id)
  }

  render() {
    const { result } = this.props.match.params
    return result === 'success'
      ? (this.state.redirect 
         ? <Redirect to='/login' />
         : <div style={{ padding: 30 }}>
              <img style={{ width: 100, display: 'block', margin: '0 auto' }} src={SuccessIcon} alt='' />
              <h2 style={{ textAlign: 'center' }}>Xác nhận email thành công</h2>
              <a style={{ display: 'block', textAlign: 'center' }} href='/dashboard'>Về trang chủ</a>
           </div>
      )
      : (<h1>Confirm Error</h1>)
  }
}

export default ConfirmEmail