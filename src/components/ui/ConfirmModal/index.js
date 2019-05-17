import { Modal } from 'antd'

const confirm = Modal.confirm

export function showConfirm(title, content, logic, cancel) {
    confirm({
        title,
        content,
        onOk() {
            logic()
        },
        onCancel() {
            cancel()
        }
    })
}