import { Modal } from 'antd'

const confirm = Modal.confirm

function showConfirm (title = 'Bạn có muốn xóa trường này?', onOK = () => {}, onCancel = () => {}, content, okType = 'primary') {
    confirm({
        title,
        content,
        okType,
        onOk () {
            onOK()
        },
        onCancel () {
            onCancel()
        }
    })
}

export { showConfirm }