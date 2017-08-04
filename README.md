# mvalidate
Mobile validation plugin by Vue.js

## usage

### Vue plugin

``` js
import Vue from 'vue'
import mvalidate from 'mvalidate'

Vue.use(mvalidate, {
  // handleError(msg) {
  //   alert(msg)
  // }
})
```

### Vue component
``` js
export default {
  data () {
    return {
      fields: {
        name: '',
        phone: '',
        vcode: '',
        password: ''
      }
    }
  },
  methods: {
    validate() {
      return this.$validate({
        name: 'Please enter name',
        phone: {
          required: 'Please enter phone number',
          // pattern: /^1[3-8][0-9]{9}$/,
          pattern: this.$validate.defaults.patterns.phone,
          message: 'Invalid phone number'
        },
        vcode: {
          required: 'Please enter vcode',
          // pattern: /^[0-9]{4}$/,
          pattern: this.$validate.defaults.patterns.vcode,
          message: 'Invalid vcode'
        },
        password: {
          required: 'Please enter password'
          patterns: [{
            pattern: /^[a-zA-Z\d_]{6,16}$/,
            message: 'Please enter 6-16 characters'
          }, {
            pattern: /[^`-=[];,.\/~!@#$%^*()_+}{:?]/,
            message: 'Invalid password'
          }]
        }
      }, this.fields)
    }
  }
}
```
