import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import _ from 'lodash'

@inject('functionStore')
@observer
class Sider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
    this.onCollapse = this.onCollapse.bind(this)
  }

  componentDidMount() {
    this.props.functionStore.loadFunctions()
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed })
  }

  render() {
    const { functions } = this.props.functionStore
    return (
      <Layout.Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        className='sider'
        theme='light'
      >

        <Menu
          theme='light'
          mode='inline'
          inlineCollapsed={this.state.collapsed}
          style={{ height: '100%' }}
        >
          {
            functions.filter(lv1 => _.isNull(lv1.parentId))
              .map(v1 => (
                functions.some(child => _.isEqual(child.parentId, v1.id)) ?
                  <Menu.SubMenu key={v1.id} title={<span><Icon type={v1.iconAntd} /><span>{v1.name}</span></span>}>
                    {
                      functions.filter(lv2 => _.isEqual(lv2.parentId, v1.id))
                        .map(v2 => (
                          <Menu.Item key={v2.id}>
                            <span>{v2.name}</span>
                            <Link to={v2.url} />
                          </Menu.Item>
                        ))
                    }
                  </Menu.SubMenu>
                  : <Menu.Item key={v1.id}>
                    <Icon type={v1.iconAntd} />
                    <span>{v1.name}</span>
                    <Link to={v1.url} />
                  </Menu.Item>
              ))}
        </Menu>
      </Layout.Sider>
    )
  }
}

export default Sider
