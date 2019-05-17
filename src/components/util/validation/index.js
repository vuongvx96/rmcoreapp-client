function requiredRule (message = 'trường này là bắt buộc!', value) {
    return { required: true, message}
}

function emailRule (message = 'địa chỉ email không đúng!', value) {
    if (value) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(value).toLocaleLowerCase())
    }
    return { required: true, message }
}

export { requiredRule, emailRule }