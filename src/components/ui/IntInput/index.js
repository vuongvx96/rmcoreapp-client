import React from 'react'
import { Input } from 'antd'

class IntInput extends React.Component {
    onChange = e => {
      const { value } = e.target
      const reg = /^\d+$/
      if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.props.onChange(value)
      }
    }
  
    render() {
      return (
          <Input
            {...this.props}
            onChange={this.onChange}
            maxLength={25}
          />
      )
    }
  }

export default IntInput