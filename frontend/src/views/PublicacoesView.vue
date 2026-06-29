<template>
  <div class="publicacoes-container">
    <header class="navbar">
      <div class="logo-area" @click="router.push('/modalidade')">
        <img src="/logo.png" alt="EduVaga" class="logo-nav" />
      </div>
      <div class="nav-right">
        <button :class="{ active: route.path === '/modalidade' }" @click="router.push('/modalidade')">Início</button>
        <button :class="{ active: route.path === '/publicacoes' }" @click="router.push('/publicacoes')">Vagas</button>
        <button :class="{ active: route.path === '/feed' }" @click="router.push('/feed')">Publicar</button>
        <button :class="{ active: route.path.startsWith('/profile') }" @click="router.push(`/profile/${user.id}`)">Perfil</button>
        <button class="btn-sair" @click="logout">Sair</button>
      </div>
    </header>

    <div class="content">
      <h2 class="page-title">Publicações</h2>
      <div class="filters">
        <input v-model="search" type="text" placeholder="🔍 Buscar por palavra-chave..." class="search-input" />
        <div class="filter-row">
          <select v-model="filtroModalidade">
            <option value="">Todas as modalidades</option>
            <option value="Presencial">Presencial</option>
            <option value="Semipresencial">Semipresencial</option>
            <option value="EAD">EAD</option>
          </select>
          <select v-model="filtroNivel">
            <option value="">Todos os níveis</option>
            <option v-for="nivel in niveis" :key="nivel" :value="nivel">{{ nivel }}</option>
          </select>
          <select v-model="ordenar">
            <option value="recentes">Mais recentes</option>
            <option value="antigas">Mais antigas</option>
          </select>
        </div>
      </div>

      <div v-if="postsFiltrados.length === 0" class="empty">
        <p>Nenhuma publicação encontrada.</p>
      </div>

      <div v-for="post in postsPaginados" :key="post.id" class="post-card">
        <div class="post-header">
          <div class="post-avatar">{{ post.user.name?.charAt(0).toUpperCase() }}</div>
          <div class="post-meta">
            <strong>{{ post.user.name }}</strong>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
        <div class="post-tags">
          <span class="tag tag-blue" v-if="post.modalidade">{{ post.modalidade }}</span>
          <span class="tag tag-purple" v-if="post.nivel">{{ post.nivel }}</span>
        </div>
        <p class="post-content">{{ post.content }}</p>
        <a :href="post.officialUrl" target="_blank" class="post-link">{{ extractDomain(post.officialUrl) }}</a>
        <div class="share-section">
          <p class="share-label">Compartilhar:</p>
          <div class="share-buttons">
            <a :href="'https://wa.me/?text=' + encodeURIComponent(post.content + ' ' + post.officialUrl)" target="_blank" class="share-btn">WhatsApp</a>
            <a :href="'https://t.me/share/url?url=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn">Telegram</a>
            <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn">Facebook</a>
            <a :href="'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn">LinkedIn</a>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="postsFiltrados.length > porPagina">
        <button @click="pagina--" :disabled="pagina === 1">← Anterior</button>
        <span>Página {{ pagina }} de {{ totalPaginas }}</span>
        <button @click="pagina++" :disabled="pagina === totalPaginas">Próxima →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const posts = ref<any[]>([])
const search = ref('')
const filtroModalidade = ref('')
const filtroNivel = ref('')
const ordenar = ref('recentes')
const pagina = ref(1)
const porPagina = 5
const niveis = ['Curso Livre / FIC','Aprendizagem Profissional','Curso Técnico','Curso Tecnólogo','Graduação','Curso de Extensão','Pós-Graduação Lato Sensu','Residência','Mestrado','Doutorado','Pós-Doutorado']

const loadPosts = async () => {
  const res = await axios.get(`${API}/feed`)
  posts.value = res.data
}

const postsFiltrados = computed(() => {
  let r = posts.value
  if (search.value) {
    const q = search.value.toLowerCase()
    r = r.filter(p => p.content?.toLowerCase().includes(q) || p.user?.name?.toLowerCase().includes(q))
  }
  if (filtroModalidade.value) r = r.filter(p => p.modalidade === filtroModalidade.value)
  if (filtroNivel.value) r = r.filter(p => p.nivel === filtroNivel.value)
  return [...r].sort((a, b) => ordenar.value === 'recentes'
    ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
})

const totalPaginas = computed(() => Math.ceil(postsFiltrados.value.length / porPagina))
const postsPaginados = computed(() => {
  const i = (pagina.value - 1) * porPagina
  return postsFiltrados.value.slice(i, i + porPagina)
})
const extractDomain = (url: string) => { try { return new URL(url).hostname } catch { return url } }
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const logout = () => { localStorage.clear(); router.push('/') }
onMounted(loadPosts)
</script>

<style scoped>
.publicacoes-container { min-height: 100vh; background: #f0f4f8; }
.navbar { background: #1e40af; padding: 0.9rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.logo-area { cursor: pointer; display: flex; align-items: center; }
.logo-nav { height: 32px; width: auto; filter: brightness(0) invert(1); }
.nav-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.nav-right button { padding: 6px 14px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; background: rgba(255,255,255,0.12); color: white; }
.nav-right button:hover { background: rgba(255,255,255,0.2); }
.nav-right button.active { background: white; color: #1e40af; font-weight: 500; }
.btn-sair { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.65) !important; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.page-title { text-align: center; color: #1e3a5f; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 600; }
.filters { background: white; padding: 1.25rem; border-radius: 16px; margin-bottom: 1.5rem; border: 2px solid #2563eb; }
.search-input { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; box-sizing: border-box; margin-bottom: 0.75rem; }
.filter-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.filter-row select { flex: 1; min-width: 130px; padding: 0.65rem; border: 1.5px solid #e2e8f0; border-radius: 10px; background: white; color: #333; font-size: 0.85rem; }
.post-card { background: white; padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; border: 2px solid #2563eb; }
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem; }
.post-avatar { width: 36px; height: 36px; background: #dbeafe; color: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
.post-meta { display: flex; flex-direction: column; flex: 1; }
.post-meta strong { font-size: 0.9rem; color: #1e3a5f; }
.post-meta span { font-size: 0.8rem; color: #94a3b8; }
.post-tags { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
.tag { padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-purple { background: #ede9fe; color: #5b21b6; }
.post-content { color: #374151; font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.5rem; }
.post-link { color: #2563eb; font-size: 0.85rem; display: block; margin: 0.5rem 0 1rem; word-break: break-all; }
.share-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
.share-label { font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.5rem; }
.share-buttons { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.share-btn { padding: 4px 10px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 0.78rem; color: #374151; text-decoration: none; background: #f8fafc; }
.share-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem; padding-bottom: 2rem; }
.pagination button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; }
.pagination button:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
.pagination span { color: #64748b; font-size: 0.9rem; }
.empty { text-align: center; padding: 3rem; background: white; border-radius: 16px; border: 2px solid #2563eb; color: #64748b; }
</style>