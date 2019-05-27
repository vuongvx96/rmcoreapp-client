import React from 'react'
import { Icon } from 'antd'
import moment from 'moment'

function dateFormatter(str) {
  if (str == false) return str
  let date = moment(str)
  return date.format('DD/MM/YYYY')
}

const statusStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

function getStatus(value) {
  const style = {
    fontSize: 20,
    color: value ? '#52c41a' : '#f5222d'
  }
  return <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {
      <Icon style={style} type={value ? 'check-circle' : 'close-circle' } />
    }
  </div>
}

function getGender(value) {
  return <div>
    {
      <span>{value ? 'Nam' : 'Nữ'}</span>
    }
  </div>
}
export { dateFormatter, getStatus, statusStyle, getGender }
