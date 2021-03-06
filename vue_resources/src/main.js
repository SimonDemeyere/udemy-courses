import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';

import Header from './Components/Header_footer/Header.vue'
import Footer from './Components/Header_footer/Footer.vue';

Vue.component('app-header', Header)
Vue.component('app-footer', Footer)

Vue.use(VueResource);
Vue.http.options.root = 'http://localhost:3004/'
Vue.http.headers.common['Authorization'] = 'Basic token'

Vue.http.interceptors.push((request, next) => {
    console.log(request);
    // request.root = 'http://somethingelse.com';

    next(response => {
        // response.body = [...response.body, {hey: 'Hello'}]
    })
})

new Vue({
    el:'#app',
    render: h => h(App)
});
