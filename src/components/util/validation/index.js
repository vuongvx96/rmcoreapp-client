function requiredRule(message = 'trường này là bắt buộc!', value) {
  return { required: true, message }
}

function emailRule(message = 'địa chỉ email không đúng!', value) {
  if (value) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(value).toLocaleLowerCase())
  }
  return { required: true, message }
}

function ipRule(message = 'địa chỉ ip không hợp lệ!' ) {
  return {
    pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: message
  }
}

function inputCodeRule(message = 'định dạng mã không hợp lệ!') {
  return {
    pattern: /^[\w-]+$/,
    message: message
  }
}

function inputPhoneNumberVN(message = 'số điện thoại không hợp lệ!') {
  return {
    pattern: /^0(1\d{9}|9\d{8})$/,
    message: message
  }
}


export { requiredRule, emailRule, ipRule, inputCodeRule, inputPhoneNumberVN }