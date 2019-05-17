import React from 'react'

import { Modal } from 'antd'

function CustomDialog(props) {
  let { title, open, onClose, onOK, confirmLoading, footer, width } = props
  if (footer) {
    return (
      <Modal
        title={title}
        visible={open}
        onOk={onOK}
        onCancel={onClose}
        confirmLoading={confirmLoading || false}
        footer={footer}
        width={width || 500}
      >
        {props.children}
      </Modal>
    )
  } else {
    return (
      <Modal
        title={title}
        visible={open}
        onOk={onOK}
        onCancel={onClose}
        confirmLoading={confirmLoading}
        width={width || 500}
      >
        {props.children}
      </Modal>
    )
  }
}

export default CustomDialog