<template>
  <div class="modalidade-container">
    <header class="navbar">
      <img src="/logo.png.png" alt="EduVaga" class="logo" @click="router.push('/modalidade')" />
      <div class="nav-right">
        <button :class="{ active: route.path === '/modalidade' }" @click="router.push('/modalidade')">Tela Inicial</button>
        <button :class="{ active: route.path === '/publicacoes' }" @click="router.push('/publicacoes')">Vagas</button>
        <button :class="{ active: route.path === '/feed' }" @click="router.push('/feed')">+Publicar</button>
        <button :class="{ active: route.path.startsWith('/profile') }" @click="router.push(`/profile/${user.id}`)">Contribuições</button>
        <button @click="logout">Sair</button>
      </div>
    </header>

    <div class="content">
      <h1>Bem-vindo, {{ user.name }}!</h1>
      <p class="subtitle">Como você prefere estudar?</p>

      <div class="cards">
        <div class="card" @click="selectModalidade('Presencial')">
          <h2>Presencial</h2>
          <p>Aulas em sala de aula, contato direto com professores e colegas.</p>
        </div>
        <div class="card" @click="selectModalidade('Semipresencial')">
          <h2>Semipresencial</h2>
          <p>Combina aulas presenciais com atividades online.</p>
        </div>
        <div class="card" @click="selectModalidade('EAD')">
          <h2>EAD</h2>
          <p>Ensino a distância, estude de qualquer lugar.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const user = JSON.parse(localStorage.getItem('user') || '{}')

const selectModalidade = (modalidade: string) => {
  localStorage.setItem('modalidade', modalidade)
  router.push('/nivel')
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.modalidade-container { min-height: 100vh; background: #f0f4f8; }

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2563eb;
  color: white;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.logo { height: 40px; filter: brightness(0) invert(1); cursor: pointer; }
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.navbar button {
  padding: 0.4rem 0.75rem;
  background: white;
  color: #2563eb;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
.navbar button.active { background: #1d4ed8; color: white; }

.content { max-width: 900px; margin: 3rem auto; padding: 0 1rem; text-align: center; }
h1 { font-size: 2rem; color: #1e3a5f; margin-bottom: 0.5rem; }
.subtitle { color: #555; font-size: 1.1rem; margin-bottom: 3rem; }

.cards {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}
.card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  flex: 1 1 220px;
  max-width: 280px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s;
  border: 2px solid transparent;
}
.card:hover { border-color: #2563eb; transform: translateY(-5px); box-shadow: 0 8px 30px rgba(37,99,235,0.2); }
.card h2 { color: #1e3a5f; margin-bottom: 0.75rem; }
.card p { color: #666; font-size: 0.9rem; line-height: 1.5; }

@media (max-width: 480px) {
  .cards { gap: 1rem; }
  .card { max-width: 100%; padding: 1.5rem; }
  h1 { font-size: 1.5rem; }
}
</style>