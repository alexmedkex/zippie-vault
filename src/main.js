import Vue from 'vue'
import App from './App'
import Web3 from 'web3'
import router from './router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify, {
  theme: {
    primary: colors.shades.white,
    secondary: colors.grey.darken1,
    accent: colors.green.darken1,
    error: colors.red.accent3
  }
})


var zippieprovider = require('vault-web3-provider')
var vault = require('vault-api')
var vaultSecp256k1 = require('vault-api/src/secp256k1.js')


var vault_opts = {}
console.log('hash is ' + location.hash)
if (location.hash.startsWith('#zippie-vault=')) {
  vault_opts = {
    'vaultURL': location.hash.slice('#zippie-vault='.length)
  }
  location.hash = ''
}
/* vue idiocy */
if (location.hash.startsWith('#/zippie-vault=')) {
  vault_opts = {
    'vaultURL': location.hash.slice('#/zippie-vault='.length)
  }
  location.hash = ''
}
  
//Vue.config.productionTip = false

window.addEventListener('load', function () {

vault.init(vault_opts).then((result) => {
  console.log('got inited:')
  console.log(result)
  var provider = zippieprovider.init(vault, vaultSecp256k1, {
    network: 'kovan'
  })
  window.web3 = new Web3(provider)
  zippieprovider.addAccount('m/0').then((addy) => {
   console.log(addy)
   /* eslint-disable no-new */
   new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    })
  })
}, (error) => {
  console.log('encountered error: ')
    console.log(error)
    if (error.error === 'launch') {
      vault.launch(error.launch)
    }
})

})