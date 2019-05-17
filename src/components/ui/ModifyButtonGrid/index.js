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
  renderEditButton() {
    if (this.props.canEdit)
      return <Button name='btnEdit' style={{ margin: '5px 10px', padding: '0px 10px', height: 24, fontSize: 10 }} onClick={this.onEdit}><Icon type='edit' />Edit</Button>
    return <></>
  }
  renderDeleteButton() {
    if (this.props.canRemove)
      return <Button name='btnDelete' style={{ margin: '5px 10px', padding: '0px 10px', height: 24, fontSize: 10 }} type='danger' onClick={this.onRemove}><Icon type='delete' />Delete</Button>
    return <></>
  }

  render() {
    if (this.props.canEdit || this.props.canRemove) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {this.renderEditButton()}
          {this.renderDeleteButton()}
        </div>
      )
    } else return null
  }
}
