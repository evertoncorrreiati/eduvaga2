<template>
  <div class="modalidade-container">
    <header class="navbar">
      <div class="logo-area" @click="router.push('/modalidade')">
        <img src="/logo.eduvaga.png" alt="EduVaga" class="logo-nav" />
      </div>
      <div class="nav-right">
        <button :class="{ active: route.path === '/modalidade' }" @click="router.push('/modalidade')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Início
        </button>
        <button :class="{ active: route.path === '/publicacoes' }" @click="router.push('/publicacoes')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          Vagas
        </button>
        <button :class="{ active: route.path === '/feed' }" @click="router.push('/feed')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Publicar
        </button>
        <button :class="{ active: route.path.startsWith('/profile') }" @click="router.push(`/profile/${user.id}`)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Perfil
        </button>
        <button class="btn-sair" @click="logout">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair
        </button>
      </div>
    </header>

    <div class="content">
      <div class="welcome-badge">
        <span class="badge-dot"></span>
        Bem-vindo de volta, {{ user.name }}
      </div>
      <h1>Como você prefere estudar?</h1>
      <p class="subtitle">Escolha a modalidade que melhor se encaixa na sua rotina</p>

      <div class="cards">
        <div class="card" :class="{ selected: selected === 'Presencial' }" @click="selectModalidade('Presencial')">
          <div class="card-icon icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          </div>
          <h2>Presencial</h2>
          <p>Aulas em sala de aula, contato direto com professores e colegas.</p>
          <span class="card-tag tag-blue">Tradicional</span>
        </div>

        <div class="card" :class="{ selected: selected === 'Semipresencial' }" @click="selectModalidade('Semipresencial')">
          <div class="card-icon icon-purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <h2>Semipresencial</h2>
          <p>Combina aulas presenciais com atividades online.</p>
          <span class="card-tag tag-purple">Híbrido</span>
        </div>

        <div class="card" :class="{ selected: selected === 'EAD' }" @click="selectModalidade('EAD')">
          <div class="card-icon icon-teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#065f46" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="17 8 12 13 7 8"/></svg>
          </div>
          <h2>EAD</h2>
          <p>Ensino a distância, estude de qualquer lugar.</p>
          <span class="card-tag tag-teal">Remoto</span>
        </div>
      </div>

      <div class="steps">
        <div class="step active"></div>
        <div class="step"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const selected = ref('')

const selectModalidade = (modalidade: string) => {
  selected.value = modalidade
  localStorage.setItem('modalidade', modalidade)
  setTimeout(() => router.push('/nivel'), 200)
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.modalidade-container { min-height: 100vh; background: #f0f4f8; }
.navbar { background: #1e40af; padding: 0.9rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.logo-area { cursor: pointer; display: flex; align-items: center; }
.logo-nav { height: 32px; width: auto; filter: brightness(0) invert(1); }
.nav-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.nav-right button { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; background: rgba(255,255,255,0.12); color: white; transition: background 0.2s; }
.nav-right button:hover { background: rgba(255,255,255,0.2); }
.nav-right button.active { background: white; color: #1e40af; font-weight: 500; }
.btn-sair { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.65) !important; font-size: 12px !important; }
.content { max-width: 700px; margin: 3rem auto; padding: 0 1rem; text-align: center; }
.welcome-badge { display: inline-flex; align-items: center; gap: 6px; background: #dbeafe; color: #1e40af; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-bottom: 1rem; }
.badge-dot { width: 6px; height: 6px; background: #1e40af; border-radius: 50%; flex-shrink: 0; }
h1 { font-size: 1.75rem; color: #1e3a5f; margin-bottom: 0.5rem; font-weight: 600; }
.subtitle { color: #64748b; font-size: 0.95rem; margin-bottom: 2.5rem; }
.cards { display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap; }
.card { background: white; border-radius: 16px; padding: 2rem 1.5rem; flex: 1 1 180px; max-width: 200px; cursor: pointer; border: 2px solid #2563eb; transition: all 0.3s; text-align: center; }
.card:hover { background: #eff6ff; transform: translateY(-3px); }
.card.selected { background: #eff6ff; border-color: #1e40af; }
.card-icon { width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; }
.icon-blue { background: #dbeafe; }
.icon-purple { background: #ede9fe; }
.icon-teal { background: #d1fae5; }
.card h2 { font-size: 0.95rem; color: #1e3a5f; margin-bottom: 0.5rem; font-weight: 600; }
.card p { color: #64748b; font-size: 0.82rem; line-height: 1.5; }
.card-tag { display: inline-block; margin-top: 0.75rem; font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-purple { background: #ede9fe; color: #5b21b6; }
.tag-teal { background: #d1fae5; color: #065f46; }
.steps { display: flex; justify-content: center; gap: 6px; margin-top: 2rem; }
.step { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; transition: all 0.2s; }
.step.active { background: #2563eb; width: 24px; border-radius: 4px; }
@media (max-width: 480px) {
  .navbar { padding: 0.75rem 1rem; }
  .cards { gap: 1rem; }
  .card { max-width: 100%; padding: 1.5rem; }
  h1 { font-size: 1.4rem; }
}
</style>