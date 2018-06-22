/*!
 * 校验工具
 */
let validate

const getValue = (keys, thisObj) => {
  if (keys.indexOf('.') > 0) {
    keys = keys.split('.').reverse()

    while (keys.length) {
      thisObj = thisObj[keys.pop()]
    }

    return thisObj
  }

  return thisObj[keys]
}

const trim = s => {
  return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

const validateVal = (val) => {
  return val !== null && typeof val !== 'undefined' && val !== '' && trim(val) !== ''
}

const eachValidate = (item, key, thisObj, noMessage) => {
  let val = getValue(key, thisObj)
  let {required, pattern, message} = item

  if (typeof item === 'string') {
    required = item
  }

  if (required && !validateVal(val)) {
    if (typeof required === 'string') {
      message = required
    }
    noMessage || validate.defaults.handleError(message, key)
    return false
  }

  let valid = true
  if (pattern && typeof pattern.test === 'function') {
    valid = pattern.test(val)
  } else if (typeof pattern === 'function') {
    valid = pattern(val)
  }

  if (!valid) {
    noMessage || validate.defaults.handleError(message, key)
  }

  return valid
}

const eachPatterns = (list, key, thisObj, noMessage) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (!eachValidator(list[i], key, thisObj, noMessage)) {
      return false
    }
  }
  return true
}

const getRequired = item => {
  let {required} = item

  if (typeof item === 'string') {
    required = item
  }

  return !!required
}

validate = (rules, thisObj, noMessage = false) => {
  let keys = Object.keys(rules)

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    let item = rules[key]

    // 非必填项且没有输入时跳过本次校验
    const required = getRequired(item)
    if (!required && !validateVal(getValue(key, thisObj))) {
      continue
    }

    if (!eachValidate(item, key, thisObj, noMessage)) {
      return false
    }

    let {patterns} = item
    if (patterns && patterns.length && !eachPatterns(patterns, key, thisObj, noMessage)) {
      return false
    }
  }
  return true
}

validate.defaults = {}

// 一些内置校验规则
validate.defaults.patterns = {
  phone: /^1[3-9][0-9]{9}$/, // 11位手机号码非严格校验
  vcode: /^[0-9]{4}$/ // 4位纯数字验证码校验
}

// 默认错误提示
validate.defaults.handleError = (msg, key) => {
  window.alert(msg)
}

const install = function(Vue, options) {
  Object.assign(validate.defaults, options)

  Object.assign(validate, validate.defaults)

  Vue.validate = validate

  Vue.prototype.$validate = validate
}

if (typeof window.Vue !== 'undefined') {
  window.Vue.use({install})
}

export default {
  install
}
