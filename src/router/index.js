import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import StudentView from '@/views/StudentView.vue';
import Login from '@/views/Login.vue';
import DashbordView from '@/views/DashbordView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: 'login',
      beforeEnter: isAuth,
      component: Login
    },
    {
      path: "/dashboard",
      name: 'dashboard',
      beforeEnter: isNotAuthLogout,
      component: DashbordView,
      meta: { requiresAuth: true },
    },
    {
      path: '/student',
      name: 'student',
      beforeEnter: isNotAuthLogout,
      component: StudentView
    },
    {
      path: '/about',
      name: 'about',
      beforeEnter: isNotAuthLogout,
   
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/update/:courseId/students/:studentId',
      name: 'update',
      beforeEnter: isNotAuthLogout,
      component: () => import('../views/UpdateStudent.vue')
    },
    {
      path: '/room',
      name: 'room',
      beforeEnter: isNotAuthLogout,
      component: () => import('../views/RoomView.vue')
    },
    {
      path: '/updateRoom/:courseId/students/:studentId/rooms/:roomId',
      name: 'updateRoom',
      beforeEnter: isNotAuthLogout,
      component: () => import('../views/UpdateRoom.vue')
    }
  ]
});


function isNotAuthLogout(to, from, next){
  const token = localStorage.getItem('token');  
  if (!token) {
    next('/');
  } else {
    next();
  }
}

function isAuth(to, from, next){
  const token = localStorage.getItem('token');  
  if (token) {
    next('/dashboard');
  } else {
    next();
  }
}





export default router;
