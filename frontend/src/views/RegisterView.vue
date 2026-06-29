<template>
  <div class="register-container">
    <div class="register-card">
      <div class="logo">
        <span class="logo-text">EduVaga</span>
        🎓
      </div>
      <p class="subtitle">Aprender nunca foi tão acessível. Descubra sua vaga.</p>
      <h2>Cadastro</h2>

      <input v-model="nome" type="text" placeholder="Nome" class="input-field" />
      <input v-model="email" type="email" placeholder="E-mail" class="input-field" />
      <div class="password-wrapper">
        <input v-model="senha" :type="showPassword ? 'text' : 'password'" placeholder="Senha" class="input-field" />
        <span class="toggle-password" @click="showPassword = !showPassword">👁</span>
      </div>

      <button class="btn-cadastrar" @click="cadastrar">Cadastrar</button>

      <p class="login-link">Já tem conta? <router-link to="/login">Entrar</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nome = ref('')
const email = ref('')
const senha = ref('')
const showPassword = ref(false)

const cadastrar = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nome.value, email: email.value, password: senha.value })
    })
    if (response.ok) {
      router.push('/')
    } else {
      alert('Erro ao cadastrar. Tente novamente.')
    }
  } catch (error) {
    alert('Erro de conexão.')
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1a3c5e;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #8b1a1a;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  color: #111;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-60%);
  cursor: pointer;
  color: #999;
}

.btn-cadastrar {
  width: 100%;
  padding: 0.85rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-cadastrar:hover {
  background: #1d4ed8;
}

.login-link {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.login-link a {
  color: #2563eb;
  text-decoration: none;
}
</style>