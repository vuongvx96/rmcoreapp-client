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

function validURL(message = 'đường link không hợp lệ') {
  return {
    // eslint-disable-next-line no-useless-escape
    pattern: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    message: message
  }
}

export { requiredRule, emailRule, ipRule, inputCodeRule, inputPhoneNumberVN, validURL }
