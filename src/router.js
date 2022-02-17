import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
 

import Dashboard from './views/Dashboard.vue'

import Application from './views/Application.vue'

import Status from './views/Status.vue'

import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({  
  mode: 'history',
  base: process.env.PUBLIC_URL,
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home
    } ,

    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    } ,


    {
      path: '/status',
      name: 'status',
      component: Status
    } ,

    {
      path: '/application/:app_id',
      name: 'application',
      component: Application
    } ,


    

   
    {
      path: '/*',
      component: NotFound
    },
  ]
})
