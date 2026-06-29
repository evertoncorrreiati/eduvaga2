<template>
  <div class="nivel-container">
    <header class="navbar">
      <img src="/logo.png.png" alt="EduVaga" class="logo" @click="router.push('/modalidade')" />
      <div class="nav-info">
        <span class="modalidade-badge">{{ modalidade }}</span>
        <button @click="router.push('/modalidade')">Tela Inicial</button>
        <button @click="voltar">← Voltar</button>
        <button @click="logout">Sair</button>
      </div>
    </header>

    <div class="content">
      <h1>Escolha o nível de ensino</h1>
      <p class="subtitle">Selecione o tipo de curso que você busca</p>

      <div class="niveis">
        <div v-for="(nivel, index) in niveis" :key="index" class="nivel-card" @click="selectNivel(nivel)">
          <span class="nivel-num">{{ index + 1 }}</span>
          <div class="nivel-info">
            <strong>{{ nivel.nome }}</strong>
            <small>{{ nivel.descricao }}</small>
          </div>
          <span class="seta">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const modalidade = localStorage.getItem('modalidade') || ''

const niveis = [
  { nome: 'Curso Livre / FIC', descricao: 'Qualificação rápida' },
  { nome: 'Aprendizagem Profissional', descricao: 'Jovem Aprendiz' },
  { nome: 'Curso Técnico', descricao: 'Nível Médio profissionalizante' },
  { nome: 'Curso Tecnólogo', descricao: 'Graduação superior focada no mercado - 2 a 3 anos' },
  { nome: 'Graduação', descricao: 'Bacharelado e Licenciatura tradicional - 4 a 6 anos' },
  { nome: 'Curso de Extensão', descricao: 'Atualização rápida na universidade' },
  { nome: 'Pós-Graduação Lato Sensu', descricao: 'Especialização e MBA' },
  { nome: 'Residência', descricao: 'Pós-graduação prática em Saúde/Direito' },
  { nome: 'Mestrado', descricao: 'Stricto Sensu - Acadêmico ou Profissional' },
  { nome: 'Doutorado', descricao: 'Stricto Sensu - Alta pesquisa' },
  { nome: 'Pós-Doutorado', descricao: 'Pesquisa avançada pós-título' },
]

const selectNivel = (nivel: any) => {
  localStorage.setItem('nivel', nivel.nome)
  router.push('/feed')
}

const voltar = () => router.push('/modalidade')
const logout = () => { localStorage.clear(); router.push('/') }
</script>

<style scoped>
.nivel-container { min-height: 100vh; background: #f0f4f8; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #2563eb; color: white; }
.logo { height: 40px; filter: brightness(0) invert(1); cursor: pointer; }
.nav-info { display: flex; align-items: center; gap: 0.75rem; }
.modalidade-badge { background: white; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
.navbar button { padding: 0.5rem 1rem; background: white; color: #2563eb; border: none; border-radius: 6px; cursor: pointer; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
h1 { font-size: 1.8rem; color: #1e3a5f; margin-bottom: 0.5rem; text-align: center; }
.subtitle { color: #555; text-align: center; margin-bottom: 2rem; }
.niveis { display: flex; flex-direction: column; gap: 0.75rem; }
.nivel-card { background: white; border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.06); transition: all 0.2s; border: 2px solid transparent; }
.nivel-card:hover { border-color: #2563eb; transform: translateX(5px); }
.nivel-num { background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem; flex-shrink: 0; }
.nivel-info { flex: 1; }
.nivel-info strong { display: block; color: #1e3a5f; }
.nivel-info small { color: #888; font-size: 0.8rem; }
.seta { color: #2563eb; font-size: 1.2rem; }
</style>