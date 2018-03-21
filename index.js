/*!
 * 校验工具
 */

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

const eachValidator = (item, key, thisObj, noMessage) => {
  let val = getValue(key, thisObj)
  let {required, pattern, message} = item

  if (typeof item === 'string') {
    required = item
  }

  if (required && !validateVal(val)) {
    if (typeof required === 'string') {
      message = required
    }
    noMessage || validator.defaults.handleError(message, key)
    return false
  }

  if (typeof pattern !== 'undefined' && pattern.test) {
    if (!pattern.test(val)) {
      noMessage || validator.defaults.handleError(message, key)
      return false
    }
  }

  return true
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

const validate = (rules, thisObj, noMessage = false) => {
  let keys = Object.keys(rules)

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    let item = rules[key]

    // 非必填项且没有输入时跳过本次校验
    const required = getRequired(item)
    if (!required && !validateVal(getValue(key, thisObj))) {
      continue
    }

    if (!eachValidator(item, key, thisObj, noMessage)) {
      return false
    }

    let {patterns} = item
    if (patterns && patterns.length && !eachPatterns(patterns, key, thisObj, noMessage)) {
      return false
    }
  }
  return true
}

validator.defaults = {}

// 一些内置校验规则
validator.defaults.patterns = {
  phone: /^1[3-9][0-9]{9}$/, // 11位手机号码非严格校验
  vcode: /^[0-9]{4}$/ // 4位纯数字验证码校验
}

// 默认错误提示
validator.defaults.handleError = (msg, key) => {
  window.alert(msg)
}

export default function (Vue, options) {
  Object.assign(validator.defaults, options)

  Object.assign(validator, validator.defaults)

  Vue.validate = validator

  Vue.prototype.$validate = validator
}
