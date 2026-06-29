<template>
  <div class="login-container">
    <div class="left-panel">
      <div class="left-mid">
        <h1>Encontre sua vaga ideal</h1>
        <p>Conectamos estudantes às melhores oportunidades — presencial, híbrida ou a distância.</p>
        <div class="features">
          <div class="feat">
            <div class="feat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <span>Vagas em todo o Brasil</span>
          </div>
          <div class="feat">
            <div class="feat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <span>Atualizações em tempo real</span>
          </div>
          <div class="feat">
            <div class="feat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span>Comunidade ativa de estudantes</span>
          </div>
        </div>
      </div>
      <div class="dots">
        <div class="dot active"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>

    <div class="right-panel">
      <div v-if="isLogin && !isForgotPassword">
        <div class="logo-wrap">
          <img src="/logo.png" alt="EduVaga" class="logo-img" />
        </div>
        <h2>Bem-vindo de volta</h2>
        <p class="form-sub">Entre na sua conta para continuar</p>
        <div class="field">
          <label>E-mail</label>
          <input v-model="email" type="email" placeholder="seu@email.com" />
        </div>
        <div class="field">
          <label>Senha</label>
          <div class="input-group">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" />
            <span class="eye" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </span>
          </div>
        </div>
        <span class="forgot-link" @click="isForgotPassword = true">Esqueci a senha</span>
        <button class="btn-primary" @click="handleLogin">Entrar</button>
        <p class="toggle-text">Não tem conta? <span @click="isLogin = false">Cadastre-se grátis</span></p>
      </div>

      <div v-else-if="!isLogin && !isForgotPassword">
        <div class="logo-wrap">
          <img src="/logo.png" alt="EduVaga" class="logo-img" />
        </div>
        <h2>Criar conta</h2>
        <p class="form-sub">Junte-se à comunidade EduVaga</p>
        <div class="field">
          <label>Nome completo</label>
          <input v-model="name" type="text" placeholder="Seu nome" />
        </div>
        <div class="field">
          <label>E-mail</label>
          <input v-model="email" type="email" placeholder="seu@email.com" />
        </div>
        <div class="field">
          <label>Senha</label>
          <div class="input-group">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" />
            <span class="eye" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </span>
          </div>
        </div>
        <button class="btn-primary" @click="handleRegister">Criar conta</button>
        <p class="toggle-text">Já tem conta? <span @click="isLogin = true">Entrar</span></p>
      </div>

      <div v-else-if="isForgotPassword && !forgotSent">
        <div class="logo-wrap">
          <img src="/logo.png" alt="EduVaga" class="logo-img" />
        </div>
        <h2>Recuperar senha</h2>
        <p class="form-sub">Digite seu e-mail para receber o link de recuperação.</p>
        <div class="field">
          <label>E-mail cadastrado</label>
          <input v-model="forgotEmail" type="email" placeholder="seu@email.com" />
        </div>
        <button class="btn-primary" @click="handleForgotPassword">Enviar link</button>
        <p class="toggle-text"><span @click="isForgotPassword = false">← Voltar ao login</span></p>
      </div>

      <div v-else-if="forgotSent" class="success-state">
        <div class="logo-wrap">
          <img src="/logo.png" alt="EduVaga" class="logo-img" />
        </div>
        <div class="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h2>E-mail enviado!</h2>
        <p class="form-sub">Verifique sua caixa de entrada em <strong>{{ forgotEmail }}</strong>.</p>
        <button class="btn-primary" @click="backToLogin">Voltar ao login</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
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
const showPassword = ref(false)
const API = 'http://localhost:3000'

const handleLogin = async () => {
  error.value = ''
  try {
    const res = await axios.post(`${API}/auth/login`, { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/modalidade')
  } catch { error.value = 'E-mail ou senha incorretos' }
}

const handleRegister = async () => {
  error.value = ''
  try {
    await axios.post(`${API}/auth/register`, { name: name.value, email: email.value, password: password.value })
    isLogin.value = true
  } catch { error.value = 'E-mail já cadastrado' }
}

const handleForgotPassword = async () => {
  error.value = ''
  if (!forgotEmail.value) { error.value = 'Digite seu e-mail'; return }
  try { await axios.post(`${API}/auth/forgot-password`, { email: forgotEmail.value }) } catch {}
  forgotSent.value = true
}

const backToLogin = () => {
  isForgotPassword.value = false
  forgotSent.value = false
  forgotEmail.value = ''
  error.value = ''
}
</script>

<style scoped>
.login-container { display: flex; min-height: 100vh; }
.left-panel { width: 44%; background: white; padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; border-right: 3px solid #2563eb; animation: slideIn 0.6s ease; }
.left-mid h1 { color: #1e3a5f; font-size: 1.6rem; font-weight: 700; line-height: 1.35; margin-bottom: 0.75rem; }
.left-mid p { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem; }
.features { display: flex; flex-direction: column; gap: 1rem; }
.feat { display: flex; align-items: center; gap: 12px; animation: fadeUp 0.5s ease both; }
.feat:nth-child(1) { animation-delay: 0.3s; }
.feat:nth-child(2) { animation-delay: 0.5s; }
.feat:nth-child(3) { animation-delay: 0.7s; }
.feat-icon { width: 36px; height: 36px; background: #dbeafe; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.feat span { color: #374151; font-size: 0.9rem; }
.dots { display: flex; gap: 6px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #cbd5e1; }
.dot.active { background: #2563eb; width: 20px; border-radius: 4px; }
.right-panel { flex: 1; background: #f0f4f8; display: flex; flex-direction: column; justify-content: center; padding: 3rem; animation: fadeIn 0.6s ease 0.2s both; }
.logo-wrap { display: flex; justify-content: center; margin-bottom: 1.5rem; }
.logo-img { height: 52px; width: auto; display: block; }
h2 { color: #1e3a5f; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.25rem; text-align: center; }
.form-sub { color: #64748b; font-size: 0.9rem; margin-bottom: 1.75rem; text-align: center; }
.field { margin-bottom: 1rem; }
.field label { display: block; font-size: 0.85rem; font-weight: 500; color: #374151; margin-bottom: 0.4rem; }
.field input { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; box-sizing: border-box; background: white; transition: border-color 0.2s; }
.field input:focus { outline: none; border-color: #2563eb; }
.input-group { position: relative; }
.input-group input { padding-right: 2.75rem; }
.eye { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); cursor: pointer; display: flex; align-items: center; }
.forgot-link { display: block; text-align: right; font-size: 0.83rem; color: #2563eb; cursor: pointer; margin-bottom: 1.25rem; }
.forgot-link:hover { text-decoration: underline; }
.btn-primary { width: 100%; padding: 0.85rem; background: #2563eb; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 0.95rem; font-weight: 600; transition: background 0.2s, transform 0.1s; margin-top: 0.25rem; }
.btn-primary:hover { background: #1e40af; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
.toggle-text { text-align: center; font-size: 0.88rem; color: #64748b; margin-top: 1.25rem; }
.toggle-text span { color: #2563eb; cursor: pointer; font-weight: 500; }
.toggle-text span:hover { text-decoration: underline; }
.success-state { text-align: center; }
.success-icon { width: 64px; height: 64px; background: #dbeafe; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
.error { color: #dc2626; font-size: 0.85rem; margin-top: 0.75rem; text-align: center; }
@keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 700px) {
  .login-container { flex-direction: column; }
  .left-panel { width: 100%; padding: 1.5rem; border-right: none; border-bottom: 3px solid #2563eb; }
  .left-mid h1 { font-size: 1.2rem; }
  .features { display: none; }
  .right-panel { padding: 2rem 1.5rem; }
}
</style>