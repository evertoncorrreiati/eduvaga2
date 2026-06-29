<template>
  <div class="login-container">
    <div class="card">
      <img src="/logo.png" alt="Logo EduVaga" class="logo" />

      <h2>Redefinir Senha</h2>

      <div v-if="success" class="success-msg">
        ✅ Senha redefinida com sucesso! <a href="/login">Fazer login</a>
      </div>

      <div v-else>
        <p v-if="error" class="error-msg">{{ error }}</p>

        <input
          v-model="password"
          type="password"
          placeholder="Nova senha"
        />

        <button @click="handleReset">Redefinir</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const route = useRoute()
const token = ref((route.query.token as string) || '')
const password = ref('')
const error = ref('')
const success = ref(false)

const handleReset = async () => {
  error.value = ''

  if (password.value.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  try {
    await axios.post(`${API}/auth/reset-password`, {
      token: token.value,
      password: password.value
    })
    success.value = true
  } catch {
    error.value = 'Link inválido ou expirado'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 360px;
  text-align: center;
}

.logo {
  width: 200px;
  margin-bottom: 0.5rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background: #4338ca;
}

.error-msg {
  color: red;
  margin-bottom: 0.5rem;
}

.success-msg {
  color: green;
  font-size: 1rem;
}

.success-msg a {
  color: #4f46e5;
  font-weight: bold;
}
</style>