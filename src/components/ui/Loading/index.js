import React from 'react'
import { Icon } from 'antd'

export const Loading = (props) => {
    return (
        <div>
            <Icon type='loading' />
            <p>Đang lấy dữ liệu...</p>
        </div>
    )
}