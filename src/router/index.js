import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    beforeEnter: ((to, from, next) => {
      if (sessionStorage.getItem("token")) {
        next()
      } else {
        alert("请登录")
        next("/login")
      }
    }),
    redirect: '/home/index',
    children: [
      { path: 'index', name: "Index", component: () => import('../Home/Index.vue') },
      { path: "users", name: "Users", component: () => import('../Home/Users.vue') },
      { path: "roles", name: "Roles", component: () => import('../Home/Roles.vue') },
      { path: "rights", name: "Rights", component: () => import('../Home/Rights.vue') },
      { path: "goods", name: "Goods", component: () => import('../Home/Goods.vue') },
      { path: "params", name: "Params", component: () => import('../Home/Params.vue') },
      { path: "categories", name: "Categories", component: () => import('../Home/Categories.vue') },
      { path: "orders", name: "Orders", component: () => import('../Home/Orders.vue') },
      { path: "reports", name: "Reports", component: () => import('../Home/Reports.vue') },
      { path: "add", name: "Add", component: () => import('../Home/Add.vue') },
    ]

  }
]

const router = new VueRouter({
  routes
})

export default router
