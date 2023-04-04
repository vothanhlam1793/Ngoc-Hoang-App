import Vue from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

if (process.client) {
  const jQuery = require('jquery')
  const Popper = require('popper.js')
  window.$ = window.jQuery = jQuery
  window.Popper = Popper
}
