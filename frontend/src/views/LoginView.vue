<template>
  <div class="login-container">
    <div class="card">
      <img src="/logo.png.png" alt="EduVaga" class="logo" />
      <p>Aprender nunca foi tão acessível. Descubra sua vaga.</p>

      <!-- LOGIN -->
      <div v-if="isLogin && !isForgotPassword">
        <h2>Entrar</h2>
        <input v-model="email" type="email" placeholder="E-mail" />
        <div class="input-group">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Senha" />
          <span class="eye" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </span>
        </div>
        <span class="forgot-link" @click="isForgotPassword = true">Esqueci a senha</span>
        <button @click="handleLogin">Entrar</button>
        <p>Não tem conta? <span @click="isLogin = false">Cadastre-se</span></p>
      </div>

      <!-- CADASTRO -->
      <div v-else-if="!isLogin && !isForgotPassword">
        <h2>Cadastro</h2>
        <input v-model="name" type="text" placeholder="Nome" />
        <input v-model="email" type="email" placeholder="E-mail" />
        <div class="input-group">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Senha" />
          <span class="eye" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </span>
        </div>
        <button @click="handleRegister">Cadastrar</button>
        <p>Já tem conta? <span @click="isLogin = true">Entrar</span></p>
      </div>

      <!-- ESQUECI A SENHA -->
      <div v-else-if="isForgotPassword && !forgotSent">
        <h2>Recuperar senha</h2>
        <p class="forgot-desc">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
        <input v-model="forgotEmail" type="email" placeholder="E-mail cadastrado" />
        <button @click="handleForgotPassword">Enviar link</button>
        <p><span @click="isForgotPassword = false">← Voltar ao login</span></p>
      </div>

      <!-- CONFIRMAÇÃO DE ENVIO -->
      <div v-else-if="forgotSent">
        <div class="success-icon">✉️</div>
        <h2>E-mail enviado!</h2>
        <p class="forgot-desc">Verifique sua caixa de entrada em <strong>{{ forgotEmail }}</strong> e siga as instruções para redefinir sua senha.</p>
        <button @click="backToLogin">Voltar ao login</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLogin = ref(true)
const isForgotPassword = ref(false)
const forgotSent = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const forgotEmail = ref('')
const error = ref('')
const successMsg = ref('')
const showPassword = ref(false)
const API = 'http://localhost:3000'

const handleLogin = async () => {
  error.value = ''
  try {
    const res = await axios.post(`${API}/auth/login`, { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/modalidade')
  } catch {
    error.value = 'E-mail ou senha incorretos'
  }
}

const handleRegister = async () => {
  error.value = ''
  try {
    await axios.post(`${API}/auth/register`, { name: name.value, email: email.value, password: password.value })
    isLogin.value = true
    error.value = ''
  } catch {
    error.value = 'E-mail já cadastrado'
  }
}

const handleForgotPassword = async () => {
  error.value = ''
  if (!forgotEmail.value) {
    error.value = 'Digite seu e-mail'
    return
  }
  try {
    await axios.post(`${API}/auth/forgot-password`, { email: forgotEmail.value })
    forgotSent.value = true
  } catch {
    forgotSent.value = true
  }
}

const backToLogin = () => {
  isForgotPassword.value = false
  forgotSent.value = false
  forgotEmail.value = ''
  error.value = ''
}
</script>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f4f8; }
.card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
.logo { width: 200px; margin-bottom: 0.5rem; }
input { display: block; width: 100%; padding: 0.75rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
.input-group { position: relative; }
.input-group input { padding-right: 2.5rem; }
.eye { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); cursor: pointer; display: flex; align-items: center; }
button { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 0.5rem; font-size: 1rem; }
button:hover { background: #1d4ed8; }
span { color: #2563eb; cursor: pointer; }
.forgot-link { display: block; text-align: right; font-size: 0.85rem; color: #2563eb; cursor: pointer; margin: 0.25rem 0 0.5rem; }
.forgot-link:hover { text-decoration: underline; }
.forgot-desc { font-size: 0.9rem; color: #555; margin-bottom: 1rem; }
.success-icon { font-size: 3rem; margin-bottom: 0.5rem; }
.error { color: red; margin-top: 0.5rem; }
.success { color: green; margin-top: 0.5rem; }
</style>