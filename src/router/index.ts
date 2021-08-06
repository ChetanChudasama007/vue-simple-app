import store from '@/store';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Login from '@/components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';
import Logout from "@/components/Logout.vue";
import RegisteredStudentsDashboard from "@/components/RegisteredStudentsDashboard.vue";
import NotFound from "@/components/NotFound.vue";
import Profile from "@/components/Profile.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
          next();
        } else {
          next({name: "notFound"});
        }
      },
    },
    {
      path: '/registeredStudentsDashboard',
      name: 'registeredStudentsDashboard',
      component: RegisteredStudentsDashboard,
      beforeEnter: (to, from, next) => {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
          next();
        } else {
          next({ name: "notFound" });
        }
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');
  if (to.name !== 'login' && user === null) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
