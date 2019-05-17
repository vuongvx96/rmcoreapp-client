import React from 'react'
import { notification, Icon } from 'antd'
import * as uuid from 'uuid/v4'

export class Notify {
  constructor (type, content, description = ' ') {
    this.key = uuid()
    this.duration = 1.4
    notification.config({
      placement: 'bottomLeft'
    })
    if (type === 'loading') {
      notification.info({
        message: <span>{content}</span>,
        description: description,
        key: this.key,
        duration: 0,
        icon: <Icon type='loading' />
      })
    } else if (type === 'error') {
      notification.error({
        message: content,
        description: description
      })
    } else if (type === 'success') {
      notification.success({
        message: content,
        description: description
      })
    }
  }

  close () {
    notification.close(this.key)
  }

  success (content) {
    notification.success({
      key: this.key,
      message: <span>{content}</span>,
      duration: this.duration
    })
  }

  fail (content) {
    notification.error({
      key: this.key,
      message: <span>{content}</span>,
      duration: this.duration
    })
  }
}