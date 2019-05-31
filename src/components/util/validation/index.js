function requiredRule(message = 'trường này là bắt buộc!', value) {
  return { required: true, message }
}

function emailRule(message = 'địa chỉ email không đúng!') {
  return {
    pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: message
  }
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
    pattern: /^(0|\+?84)(\d{9})$/,
    message: message
  }
}

export { requiredRule, emailRule, ipRule, inputCodeRule, inputPhoneNumberVN }
