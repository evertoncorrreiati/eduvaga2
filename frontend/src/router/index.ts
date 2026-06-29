import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import FeedView from '../views/FeedView.vue'
import ProfileView from '../views/ProfileView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import ModalidadeView from '../views/ModalidadeView.vue'
import NivelView from '../views/NivelView.vue'
import PublicacoesView from '../views/PublicacoesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginView },
    { path: '/modalidade', component: ModalidadeView },
    { path: '/nivel', component: NivelView },
    { path: '/feed', component: FeedView },
    { path: '/profile/:id', component: ProfileView },
    { path: '/reset-password', component: ResetPasswordView },
    { path: '/publicacoes', component: PublicacoesView }
  ]
})

export default router