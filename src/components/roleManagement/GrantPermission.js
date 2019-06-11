import React from 'react'
import { inject, observer } from 'mobx-react'
import { Modal, Table, Checkbox } from 'antd'

@inject('functionStore')
@observer
class GrantPermission extends React.Component {
  
  componentDidMount() {
    this.props.functionStore.loadAllFunctions()
  }

  render() {
    let { treeData, loading, checkState, updating } = this.props.functionStore
    const { visible, onOk, onCancel } = this.props
    const columns = [
      {
        title: 'Chức năng',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Quyền',
        children: [
          {
            title: <Checkbox
              checked={checkState.checkAll.read}
              indeterminate={checkState.indeterminate.read}
              style={{ color: '#1890ff' }}
              onChange={({ target }) => {
                this.props.functionStore.checkAllRead(target.checked)
              }}
            >
              Xem
              </Checkbox>,
            dataIndex: 'canRead',
            key: 'canRead',
            render: (value, record) =>
              <Checkbox checked={value} onChange={({ target }) => {
                this.props.functionStore.grantRead(record.id, target.checked)
              }} />
          },
          {
            title: <Checkbox
              checked={checkState.checkAll.create}
              indeterminate={checkState.indeterminate.create}
              style={{ color: '#52c41a' }}
              onChange={({ target }) => {
                this.props.functionStore.checkAllCreate(target.checked)
              }}>
              Thêm
              </Checkbox>,
            dataIndex: 'canCreate',
            key: 'canCreate',
            render: (value, record) =>
              <Checkbox checked={value} onChange={({ target }) => {
                this.props.functionStore.grantCreate(record.id, target.checked)
              }} />
          },
          {
            title: <Checkbox
              checked={checkState.checkAll.update}
              indeterminate={checkState.indeterminate.update}
              style={{ color: '#fadb14' }}
              onChange={({ target }) => {
                this.props.functionStore.checkAllUpdate(target.checked)
              }}>
              Sửa
              </Checkbox>,
            dataIndex: 'canUpdate',
            key: 'canUpdate',
            render: (value, record) =>
              <Checkbox checked={value} onChange={({ target }) => {
                this.props.functionStore.grantUpdate(record.id, target.checked)
              }} />
          },
          {
            title: <Checkbox
              checked={checkState.checkAll.delete}
              indeterminate={checkState.indeterminate.delete}
              style={{ color: '#f5222d' }}
              onChange={({ target }) => {
                this.props.functionStore.checkAllDelete(target.checked)
              }}>
              Xóa
              </Checkbox>,
            dataIndex: 'canDelete',
            key: 'canDelete',
            render: (value, record) =>
              <Checkbox checked={value} onChange={({ target }) => {
                this.props.functionStore.grantDelete(record.id, target.checked)
              }} />
          }
        ]
      }
    ]
    return (
      <Modal
        title='Phân quyền'
        width={800}
        okText='Lưu'
        cancelText='Hủy'
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okButtonProps={{ loading: updating}}
      >
        <Table
          bordered
          columns={columns}
          dataSource={treeData}
          rowKey='id'
          pagination={false}
          loading={loading}
        />
      </Modal>
    )
  }
}

export default GrantPermission