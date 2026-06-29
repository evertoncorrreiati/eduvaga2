<template>
  <div class="publicacoes-container">
    <header class="navbar">
      <div class="logo-area" @click="router.push('/modalidade')">
        <img src="/logo.png" alt="EduVaga" class="logo-nav" />
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
      <!-- Formulário de publicação -->
      <div class="post-form" v-if="!editando">
        <textarea v-model="novoPost.content" placeholder="Descreva a vaga (curso, instituição, prazo...)" rows="3" />
        <input v-model="novoPost.officialUrl" type="url" placeholder="Link oficial da instituição (obrigatório)" />
        <div class="form-row">
          <select v-model="novoPost.modalidade">
            <option value="">Selecione a modalidade</option>
            <option value="Presencial">Presencial</option>
            <option value="Semipresencial">Semipresencial</option>
            <option value="EAD">EAD</option>
          </select>
          <select v-model="novoPost.nivel">
            <option value="">Selecione o nível</option>
            <option v-for="n in niveis" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <button class="btn-publicar" @click="publicar">Publicar</button>
      </div>

      <!-- Modal de edição -->
      <div class="modal-overlay" v-if="editando" @click.self="cancelarEdicao">
        <div class="modal">
          <h3>Editar publicação</h3>
          <textarea v-model="postEditando.content" rows="4" />
          <input v-model="postEditando.officialUrl" type="url" placeholder="Link oficial" />
          <div class="form-row">
            <select v-model="postEditando.modalidade">
              <option value="">Modalidade</option>
              <option value="Presencial">Presencial</option>
              <option value="Semipresencial">Semipresencial</option>
              <option value="EAD">EAD</option>
            </select>
            <select v-model="postEditando.nivel">
              <option value="">Nível</option>
              <option v-for="n in niveis" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-cancelar" @click="cancelarEdicao">Cancelar</button>
            <button class="btn-salvar" @click="salvarEdicao">Salvar</button>
          </div>
        </div>
      </div>

      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <div class="post-avatar">{{ post.user.name?.charAt(0).toUpperCase() }}</div>
          <div class="post-meta">
            <strong>{{ post.user.name }}</strong>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>

          <!-- Menu ⋮ só para o autor -->
          <div class="menu-wrapper" v-if="post.user.id === user.id">
            <button class="btn-menu" @click="toggleMenu(post.id)">⋮</button>
            <div class="dropdown" v-if="menuAberto === post.id">
              <button @click="abrirEdicao(post)">✏️ Editar</button>
              <button class="btn-excluir" @click="excluir(post.id)">🗑️ Excluir</button>
            </div>
          </div>
        </div>

        <div class="post-tags">
          <span class="tag tag-blue" v-if="post.modalidade">{{ post.modalidade }}</span>
          <span class="tag tag-purple" v-if="post.nivel">{{ post.nivel }}</span>
        </div>
        <p class="post-content">{{ post.content }}</p>
        <a :href="post.officialUrl" target="_blank" class="post-link">{{ extractDomain(post.officialUrl) }}</a>

        <!-- Curtidas e comentários -->
        <div class="post-actions">
          <button class="btn-like" @click="curtir(post)">
            ♡ {{ post.likes?.length || 0 }}
          </button>
          <span>💬 {{ post.comments?.length || 0 }} comentários</span>
        </div>

        <div class="share-section">
          <p class="share-label">Compartilhar:</p>
          <div class="share-buttons">
            <a :href="'https://wa.me/?text=' + encodeURIComponent(post.content + ' ' + post.officialUrl)" target="_blank" class="share-btn"><span class="share-dot" style="background:#25D366"></span>WhatsApp</a>
            <a :href="'https://t.me/share/url?url=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn"><span class="share-dot" style="background:#0088cc"></span>Telegram</a>
            <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn"><span class="share-dot" style="background:#1877F2"></span>Facebook</a>
            <a :href="'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn"><span class="share-dot" style="background:#0A66C2"></span>LinkedIn</a>
            <a :href="'https://twitter.com/intent/tweet?text=' + encodeURIComponent(post.content) + '&url=' + encodeURIComponent(post.officialUrl)" target="_blank" class="share-btn"><span class="share-dot" style="background:#1DA1F2"></span>Twitter/X</a>
          </div>
        </div>

        <!-- Comentários -->
        <div class="comments" v-if="post.comments?.length">
          <div v-for="c in post.comments" :key="c.id" class="comment">
            <strong>{{ c.user.name }}:</strong> {{ c.content }}
          </div>
        </div>
        <div class="comment-input">
          <input v-model="comentarios[post.id]" placeholder="Comentar..." @keyup.enter="comentar(post.id)" />
          <button @click="comentar(post.id)">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const posts = ref<any[]>([])
const comentarios = ref<Record<number, string>>({})
const menuAberto = ref<number | null>(null)
const editando = ref(false)
const postEditando = ref<any>({})

const niveis = ['Curso Livre / FIC','Aprendizagem Profissional','Curso Técnico','Curso Tecnólogo','Graduação','Curso de Extensão','Pós-Graduação Lato Sensu','Residência','Mestrado','Doutorado','Pós-Doutorado']

const novoPost = ref({ content: '', officialUrl: '', modalidade: '', nivel: '' })

const loadPosts = async () => {
  const res = await axios.get(`${API}/feed`)
  posts.value = res.data
}

const publicar = async () => {
  if (!novoPost.value.content || !novoPost.value.officialUrl) return
  await axios.post(`${API}/posts`, { ...novoPost.value, userId: user.id })
  novoPost.value = { content: '', officialUrl: '', modalidade: '', nivel: '' }
  await loadPosts()
}

const curtir = async (post: any) => {
  await axios.post(`${API}/posts/like`, { postId: post.id, userId: user.id })
  await loadPosts()
}

const comentar = async (postId: number) => {
  const content = comentarios.value[postId]
  if (!content) return
  await axios.post(`${API}/posts/comment`, { content, postId, userId: user.id })
  comentarios.value[postId] = ''
  await loadPosts()
}

const toggleMenu = (id: number) => {
  menuAberto.value = menuAberto.value === id ? null : id
}

const abrirEdicao = (post: any) => {
  postEditando.value = { ...post }
  editando.value = true
  menuAberto.value = null
}

const cancelarEdicao = () => {
  editando.value = false
  postEditando.value = {}
}

const salvarEdicao = async () => {
  await axios.put(`${API}/posts/${postEditando.value.id}`, {
    content: postEditando.value.content,
    officialUrl: postEditando.value.officialUrl,
    modalidade: postEditando.value.modalidade,
    nivel: postEditando.value.nivel,
    userId: user.id
  })
  editando.value = false
  await loadPosts()
}

const excluir = async (postId: number) => {
  if (!confirm('Deseja excluir esta publicação?')) return
  await axios.delete(`${API}/posts/${postId}`, { data: { userId: user.id } })
  menuAberto.value = null
  await loadPosts()
}

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
.nav-right button { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; background: rgba(255,255,255,0.12); color: white; transition: background 0.2s; }
.nav-right button:hover { background: rgba(255,255,255,0.2); }
.nav-right button.active { background: white; color: #1e40af; font-weight: 500; }
.btn-sair { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.65) !important; font-size: 12px !important; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }

/* Formulário */
.post-form { background: white; padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; border: 2px solid #2563eb; }
.post-form textarea, .post-form input { width: 100%; padding: 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; box-sizing: border-box; margin-bottom: 0.75rem; font-family: inherit; resize: vertical; }
.form-row { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; }
.form-row select { flex: 1; padding: 0.65rem; border: 1.5px solid #e2e8f0; border-radius: 10px; background: white; font-size: 0.85rem; }
.btn-publicar { background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; font-size: 0.9rem; font-weight: 500; }
.btn-publicar:hover { background: #1d4ed8; }

/* Cards */
.post-card { background: white; padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; border: 2px solid #2563eb; }
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem; position: relative; }
.post-avatar { width: 36px; height: 36px; background: #dbeafe; color: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
.post-meta { display: flex; flex-direction: column; flex: 1; }
.post-meta strong { font-size: 0.9rem; color: #1e3a5f; }
.post-meta span { font-size: 0.8rem; color: #94a3b8; }

/* Menu ⋮ */
.menu-wrapper { position: relative; margin-left: auto; }
.btn-menu { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94a3b8; padding: 4px 8px; border-radius: 6px; }
.btn-menu:hover { background: #f1f5f9; color: #374151; }
.dropdown { position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); z-index: 10; min-width: 140px; overflow: hidden; }
.dropdown button { display: block; width: 100%; padding: 0.65rem 1rem; border: none; background: none; text-align: left; cursor: pointer; font-size: 0.85rem; color: #374151; }
.dropdown button:hover { background: #f8fafc; }
.btn-excluir { color: #ef4444 !important; }

/* Tags */
.post-tags { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
.tag { padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-purple { background: #ede9fe; color: #5b21b6; }
.post-content { color: #374151; font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.5rem; }
.post-link { color: #2563eb; font-size: 0.85rem; display: block; margin: 0.5rem 0 0.75rem; word-break: break-all; }

/* Ações */
.post-actions { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem; font-size: 0.85rem; color: #64748b; }
.btn-like { background: none; border: none; cursor: pointer; font-size: 0.85rem; color: #64748b; padding: 0; }
.btn-like:hover { color: #ef4444; }

/* Compartilhar */
.share-section { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; }
.share-label { font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.5rem; }
.share-buttons { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.share-btn { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 0.78rem; color: #374151; text-decoration: none; background: #f8fafc; }
.share-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.share-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }

/* Comentários */
.comments { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; }
.comment { font-size: 0.85rem; color: #374151; margin-bottom: 0.4rem; }
.comment strong { color: #1e3a5f; }
.comment-input { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.comment-input input { flex: 1; padding: 0.5rem 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; }
.comment-input button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }

/* Modal de edição */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: white; padding: 2rem; border-radius: 16px; width: 100%; max-width: 500px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.modal h3 { margin-bottom: 1rem; color: #1e3a5f; }
.modal textarea, .modal input { width: 100%; padding: 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; box-sizing: border-box; margin-bottom: 0.75rem; font-family: inherit; resize: vertical; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; }
.btn-cancelar { padding: 0.65rem 1.25rem; border: 1.5px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; font-size: 0.9rem; }
.btn-salvar { padding: 0.65rem 1.25rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 500; }

@media (max-width: 480px) {
  .navbar { padding: 0.75rem 1rem; }
  .post-card { padding: 1rem; }
  .post-form { padding: 1rem; }
  .form-row { flex-direction: column; }
}
</style>