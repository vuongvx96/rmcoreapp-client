import React from 'react'
import { Button, Icon } from 'antd'

export default class ModifyButtonGrid extends React.Component {
  constructor(props) {
    super(props)
    this.onEdit = this.onEdit.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }
  onEdit() {
    this.props.onEdit(this.props.data)
  }
  onRemove() {
    this.props.onRemove(this.props.data)
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button disabled={!this.props.canEdit} name='btnEdit' style={{ margin: '5px 10px', padding: '0px 10px', height: 24, fontSize: 10 }} onClick={this.onEdit}><Icon type='edit' />Edit</Button>
        <Button disabled={!this.props.canRemove} name='btnDelete' style={{ margin: '5px 10px', padding: '0px 10px', height: 24, fontSize: 10 }} type='danger' onClick={this.onRemove}><Icon type='delete' />Delete</Button>
      </div>
    )
  }
}
