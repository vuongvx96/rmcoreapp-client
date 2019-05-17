import { message } from 'antd'

function showNotification (text, type='info', duration = 1) {
    message.duration = duration
    if (type === 'info') {
        message.info(text)
    } else if (type === 'warning') {
        message.warning(text)
    } else if (type === 'error') {
        message.error(text)
    } else if (type === 'success') {
        message.success(text)
    }
}

export { showNotification }