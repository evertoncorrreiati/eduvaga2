<template>
  <div class="login-container">
    <div class="card">
      <img src="/logo.png.png" alt="EduVaga" class="logo" />
      <p>Aprender nunca foi tão acessível. Descubra sua vaga.</p>

      <!-- FORMULÁRIO DE NOVA SENHA -->
      <div v-if="!success">
        <h2>Nova senha</h2>
        <p class="desc">Digite sua nova senha abaixo.</p>
        <input v-model="password" type="password" placeholder="Nova senha" />
        <input v-model="confirmPassword" type="password" placeholder="Confirmar nova senha" />
        <button @click="handleReset">Salvar nova senha</button>
        <p><span @click="$router.push('/')">← Voltar ao login</span></p>
      </div>

      <!-- CONFIRMAÇÃO -->
      <div v-else>
        <div class="success-icon">✅</div>
        <h2>Senha alterada!</h2>
        <p class="desc">Sua senha foi redefinida com sucesso.</p>
        <button @click="$router.push('/')">Ir para o login</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const token = ref('')
const API = 'http://localhost:3000'

onMounted(() => {
  token.value = route.query.token as string
  if (!token.value) {
    error.value = 'Link inválido ou expirado'
  }
})

const handleReset = async () => {
  error.value = ''

  if (!password.value || !confirmPassword.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }

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
.login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f4f8; }
.card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
.logo { width: 200px; margin-bottom: 0.5rem; }
input { display: block; width: 100%; padding: 0.75rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
button { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 0.5rem; font-size: 1rem; }
button:hover { background: #1d4ed8; }
span { color: #2563eb; cursor: pointer; }
.desc { font-size: 0.9rem; color: #555; margin-bottom: 1rem; }
.success-icon { font-size: 3rem; margin-bottom: 0.5rem; }
.error { color: red; margin-top: 0.5rem; }
</style>