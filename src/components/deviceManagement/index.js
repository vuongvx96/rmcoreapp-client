import React from 'react'
import { Tabs, Icon } from 'antd'

import ComputerManagement from './ComputerManagement'
import EquipmentManagement from './EquipmentManagement'
import './index.less'

class DeviceManagement extends React.Component {

  render() {
    return (
      <Tabs
        defaultActiveKey='1'
        tabBarGutter={0}
        tabBarStyle={{ marginBottom: 12, borderBottom: '1px solid #BDC3C7' }}
        size='small'
      >
        <Tabs.TabPane
          key='1'
          tab={<span><Icon type='desktop' />Máy tính</span>}
        >
          <ComputerManagement />
        </Tabs.TabPane>
        <Tabs.TabPane
          key='2'
          tab={<span><Icon type='video-camera' />Các thiết bị khác</span>}
        >
          <EquipmentManagement />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}

export default DeviceManagement

