import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
// import "buefy/dist/buefy.css";
import VueRouter from "vue-router";
import { routes } from "./routes";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";
import { setContext } from "apollo-link-context";
import conf from '../configure'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ApexCharts from 'apexcharts'
import VueApexCharts from 'vue-apexcharts'
Vue.config.productionTip = false;
// Vue.use(Buefy);
Vue.use(VueApexCharts)
Vue.use(VueRouter);
Vue.use(VueApollo);
Vue.use(BootstrapVue)
Vue.component('apexchart', VueApexCharts)
const router = new VueRouter({
  routes,
  mode: "history"
});

const baseURL = conf.API_URL
const graphURL = baseURL + '/graph'
const httpLink = new HttpLink({
  uri: graphURL
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      authorization: token ? `${token}` : ""
    }
  };
});

const link = authLink.concat(httpLink);
const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
});
const apolloProvider = new VueApollo({
    defaultClient: apolloClient
});

new Vue({
  el: "#app",
  router,
  provide: apolloProvider.provide(),
  render: h => h(App)
});
