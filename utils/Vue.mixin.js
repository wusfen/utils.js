import Vue from 'vue'

Vue.config.productionTip = false

/**
 * 自动设置 document.title
 * @example
 * export default{
 *  title: 'document.title',
 *  data(){}
 * }
 */
var documentTitle = document.title
function setVueTitle(vue) {
  try {
    if (vue.$options.title) {
      document.title = vue.$options.title
    }
    var routeVue = [...vue.$router.currentRoute.matched].pop().instances.default
    if (vue === routeVue) {
      document.title = vue.$options.title || documentTitle
    }
  } catch (_) {}
}
Vue.mixin({
  created() {
    setVueTitle(this)
  },
  activated() {
    setVueTitle(this)
  },
})

/**
 * console
 * vue
 */
Vue.mixin({
  mounted() {
    setTimeout(() => {
      try {
        if (this.$el.className.match('page') || this.$options.title) {
          window.vue = this
        }
        window.vue = [
          ...this.$router.currentRoute.matched,
        ].pop().instances.default
      } catch (_) {}
    }, 500)
  },
  activated() {
    setTimeout(() => {
      try {
        if (this.$el.className.match('page') || this.$options.title) {
          window.vue = this
        }
        window.vue = [
          ...this.$router.currentRoute.matched,
        ].pop().instances.default
      } catch (_) {}
    }, 500)
  },
})

/**
 * log data
 */
Vue.prototype.log = function() {
  return JSON.parse(
    JSON.stringify(
      this,
      function(k, v) {
        if (k.match(/^[_$]/)) return
        return v
      },
      '  '
    )
  )
}

/**
 * lazy
 * todo
 */
Vue.mixin({
  beforeMount() {
    // var vue = this
    // var _c = this._c
    // this._c = function() {
    //   var tag = arguments[0]
    //   var options = arguments[1] || {}
    //   if (tag === 'img' && options) {
    //     var attrs = options.attrs || {}
    //     attrs.lazy = attrs.src
    //     attrs.src = ''
    //   }
    //   setTimeout(() => {
    //     vue._c = _c
    //   }, 1000)
    //   return _c.apply(this, arguments)
    // }
  },
})

// console
window.Vue = Vue
