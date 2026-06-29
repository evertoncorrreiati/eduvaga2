<template>
  <div class="publicacoes-container">
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
          <strong>{{ post.user.name }}</strong>
          <span class="date">{{ formatDate(post.createdAt) }}</span>
        </div>
        <div class="post-tags">
          <span class="tag" v-if="post.modalidade">{{ post.modalidade }}</span>
          <span class="tag" v-if="post.nivel">{{ post.nivel }}</span>
        </div>
        <p class="post-content">{{ post.content }}</p>
        <a :href="post.officialUrl" target="_blank" class="post-link">{{ extractDomain(post.officialUrl) }}</a>

        <div class="share-section">
          <p class="share-label">Compartilhar:</p>
          <div class="share-buttons">
            <a :href="'https://wa.me/?text=' + encodeURIComponent(post.content + ' ' + post.officialUrl)" target="_blank" class="share-btn">
              <span class="share-dot" style="background:#25D366"></span> WhatsApp
            </a>
            <a :href="'https://t.me/share/url?url=' + encodeURIComponent(post.officialUrl) + '&text=' + encodeURIComponent(post.content)" target="_blank" class="share-btn">
              <span class="share-dot" style="background:#0088cc"></span> Telegram
            </a>
            <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn">
              <span class="share-dot" style="background:#1877F2"></span> Facebook
            </a>
            <a :href="'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn">
              <span class="share-dot" style="background:#0A66C2"></span> LinkedIn
            </a>
            <a :href="'https://twitter.com/intent/tweet?text=' + encodeURIComponent(post.content) + '&url=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn">
              <span class="share-dot" style="background:#1DA1F2"></span> Twitter/X
            </a>
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
const API = 'http://localhost:3000'

const posts = ref<any[]>([])
const search = ref('')
const filtroModalidade = ref('')
const filtroNivel = ref('')
const ordenar = ref('recentes')
const pagina = ref(1)
const porPagina = 5

const niveis = [
  'Curso Livre / FIC',
  'Aprendizagem Profissional',
  'Curso Técnico',
  'Curso Tecnólogo',
  'Graduação',
  'Curso de Extensão',
  'Pós-Graduação Lato Sensu',
  'Residência',
  'Mestrado',
  'Doutorado',
  'Pós-Doutorado'
]

const loadPosts = async () => {
  const res = await axios.get(`${API}/feed`)
  posts.value = res.data
}

const postsFiltrados = computed(() => {
  let resultado = posts.value

  if (search.value) {
    const q = search.value.toLowerCase()
    resultado = resultado.filter(p =>
      p.content?.toLowerCase().includes(q) ||
      p.user?.name?.toLowerCase().includes(q) ||
      p.officialUrl?.toLowerCase().includes(q)
    )
  }

  if (filtroModalidade.value) {
    resultado = resultado.filter(p => p.modalidade === filtroModalidade.value)
  }

  if (filtroNivel.value) {
    resultado = resultado.filter(p => p.nivel === filtroNivel.value)
  }

  if (ordenar.value === 'recentes') {
    resultado = [...resultado].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else {
    resultado = [...resultado].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  return resultado
})

const totalPaginas = computed(() => Math.ceil(postsFiltrados.value.length / porPagina))

const postsPaginados = computed(() => {
  const inicio = (pagina.value - 1) * porPagina
  return postsFiltrados.value.slice(inicio, inicio + porPagina)
})

const extractDomain = (url: string) => {
  try { return new URL(url).hostname } catch { return url }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const logout = () => { localStorage.clear(); router.push('/') }

onMounted(loadPosts)
</script>

<style scoped>
.publicacoes-container { min-height: 100vh; background: #f0f4f8; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #2563eb; color: white; flex-wrap: wrap; gap: 0.5rem; }
.logo { height: 40px; filter: brightness(0) invert(1); cursor: pointer; }
.nav-right { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.navbar button { padding: 0.4rem 0.75rem; background: white; color: #2563eb; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
.navbar button.active { background: #1d4ed8; color: white; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.page-title { text-align: center; color: #1e3a5f; margin-bottom: 1.5rem; font-size: 1.5rem; }
.filters { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.search-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box; margin-bottom: 0.75rem; }
.filter-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.filter-row select { flex: 1; min-width: 130px; padding: 0.65rem; border: 1px solid #ddd; border-radius: 8px; background: white; color: #333; font-size: 0.9rem; cursor: pointer; }
.post-card { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.post-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.25rem; }
.date { color: #999; font-size: 0.85rem; }
.post-tags { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.tag { background: #e8f0fe; color: #2563eb; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
.post-content { color: #333; margin-bottom: 0.5rem; line-height: 1.5; text-align: justify; }
.post-link { color: #2563eb; font-size: 0.9rem; display: block; margin: 0.5rem 0 1rem; word-break: break-all; }
.share-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
.share-label { font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
.share-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.share-btn { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.8rem; color: #333; text-decoration: none; background: #f8f9fa; }
.share-btn:hover { background: #e8f0fe; border-color: #2563eb; color: #2563eb; }
.share-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem; padding-bottom: 2rem; flex-wrap: wrap; }
.pagination button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; }
.pagination button:disabled { background: #ccc; cursor: not-allowed; }
.pagination span { color: #555; font-size: 0.9rem; }
.empty { text-align: center; padding: 3rem; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); color: #555; }
@media (max-width: 480px) {
  .filters { padding: 1rem; }
  .post-card { padding: 1rem; }
  .filter-row select { min-width: 100%; }
}
</style>