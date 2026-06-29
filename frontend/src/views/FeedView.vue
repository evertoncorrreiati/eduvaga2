<template>
  <div class="feed-container">
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
      <div class="new-post">
        <h3>Compartilhar uma vaga</h3>
        <textarea v-model="postContent" placeholder="Descreva a vaga (curso, instituição, prazo...)"></textarea>
        <input v-model="officialUrl" type="url" placeholder="Link oficial da instituição (obrigatório)" />
        <div class="selects">
          <select v-model="postModalidade">
            <option value="">Selecione a modalidade</option>
            <option value="Presencial">Presencial</option>
            <option value="Semipresencial">Semipresencial</option>
            <option value="EAD">EAD</option>
          </select>
          <select v-model="postNivel">
            <option value="">Selecione o nível</option>
            <option v-for="nivel in niveis" :key="nivel" :value="nivel">{{ nivel }}</option>
          </select>
        </div>
        <button class="btn-publicar" @click="createPost">Publicar</button>
      </div>

      <div class="posts">
        <div v-if="posts.length === 0" class="empty">
          <p>Nenhuma vaga encontrada para este filtro.</p>
          <button @click="router.push('/modalidade')">Trocar filtro</button>
        </div>
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-header">
            <div class="post-avatar">{{ post.user.name?.charAt(0).toUpperCase() }}</div>
            <div class="post-meta">
              <strong>{{ post.user.name }}</strong>
              <span>{{ formatDate(post.createdAt) }}</span>
            </div>
          </div>
          <div class="post-tags" v-if="post.modalidade || post.nivel">
            <span class="tag tag-blue" v-if="post.modalidade">{{ post.modalidade }}</span>
            <span class="tag tag-purple" v-if="post.nivel">{{ post.nivel }}</span>
          </div>
          <p class="post-content">{{ post.content }}</p>
          <a :href="post.officialUrl" target="_blank" class="post-link">{{ extractDomain(post.officialUrl) }}</a>
          <div class="post-actions">
            <button class="btn-like" @click="likePost(post)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {{ post.likes.length }}
            </button>
            <span class="btn-comment">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {{ post.comments.length }} comentários
            </span>
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
          <div class="comments">
            <div v-for="comment in post.comments" :key="comment.id" class="comment">
              <strong>{{ comment.user.name }}:</strong> {{ comment.content }}
            </div>
            <div class="add-comment">
              <input v-model="newComments[post.id]" placeholder="Comentar..." />
              <button @click="addComment(post.id)">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

interface Comment { id: number; content: string; user: { name: string } }
interface Post { id: number; content: string; officialUrl: string; modalidade: string; nivel: string; createdAt: string; user: { name: string }; likes: any[]; comments: Comment[] }

const router = useRouter()
const route = useRoute()
const posts = ref<Post[]>([])
const postContent = ref('')
const officialUrl = ref('')
const postModalidade = ref('')
const postNivel = ref('')
const newComments = ref({} as Record<number, string>)
const user = JSON.parse(localStorage.getItem('user') || '{}')
const modalidadeFiltro = localStorage.getItem('modalidade') || ''
const nivelFiltro = localStorage.getItem('nivel') || ''
const API = 'http://localhost:3000'

const niveis = ['Curso Livre / FIC','Aprendizagem Profissional','Curso Técnico','Curso Tecnólogo','Graduação','Curso de Extensão','Pós-Graduação Lato Sensu','Residência','Mestrado','Doutorado','Pós-Doutorado']

const loadFeed = async () => {
  const params: any = {}
  if (modalidadeFiltro) params.modalidade = modalidadeFiltro
  if (nivelFiltro) params.nivel = nivelFiltro
  const res = await axios.get(`${API}/feed`, { params })
  posts.value = res.data
}

const createPost = async () => {
  if (!postContent.value || !officialUrl.value) return alert('Preencha todos os campos!')
  await axios.post(`${API}/posts`, { content: postContent.value, officialUrl: officialUrl.value, modalidade: postModalidade.value, nivel: postNivel.value, userId: user.id })
  postContent.value = ''; officialUrl.value = ''; postModalidade.value = ''; postNivel.value = ''
  loadFeed()
}

const likePost = async (post: Post) => {
  await axios.post(`${API}/posts/like`, { postId: post.id, userId: user.id })
  loadFeed()
}

const addComment = async (postId: number) => {
  if (!newComments.value[postId]) return
  await axios.post(`${API}/posts/comment`, { content: newComments.value[postId], postId, userId: user.id })
  newComments.value[postId] = ''
  loadFeed()
}

const extractDomain = (url: string) => { try { return new URL(url).hostname } catch { return url } }
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const logout = () => { localStorage.clear(); router.push('/') }
onMounted(loadFeed)
</script>

<style scoped>
.feed-container { min-height: 100vh; background: #f0f4f8; }
.navbar { background: #1e40af; padding: 0.9rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.logo-area { cursor: pointer; display: flex; align-items: center; }
.logo-nav { height: 32px; width: auto; filter: brightness(0) invert(1); }
.nav-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.nav-right button { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; background: rgba(255,255,255,0.12); color: white; transition: background 0.2s; }
.nav-right button:hover { background: rgba(255,255,255,0.2); }
.nav-right button.active { background: white; color: #1e40af; font-weight: 500; }
.btn-sair { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.65) !important; font-size: 12px !important; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.new-post { background: white; padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; border: 2px solid #2563eb; }
.new-post h3 { color: #1e3a5f; margin-bottom: 1rem; font-size: 1rem; }
textarea { width: 100%; height: 80px; padding: 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 10px; margin: 0.5rem 0; box-sizing: border-box; resize: none; font-family: inherit; font-size: 0.9rem; }
textarea:focus { outline: none; border-color: #2563eb; }
input { width: 100%; padding: 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 10px; margin: 0.5rem 0; box-sizing: border-box; font-size: 0.9rem; }
input:focus { outline: none; border-color: #2563eb; }
.selects { display: flex; gap: 0.75rem; margin: 0.5rem 0; flex-wrap: wrap; }
select { flex: 1; min-width: 140px; padding: 0.75rem; border: 1.5px solid #e2e8f0; border-radius: 10px; background: white; color: #333; font-size: 0.9rem; cursor: pointer; }
.btn-publicar { padding: 0.6rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 500; margin-top: 0.5rem; transition: background 0.2s; }
.btn-publicar:hover { background: #1e40af; }
.post-card { background: white; padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; border: 2px solid #2563eb; }
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem; }
.post-avatar { width: 36px; height: 36px; background: #dbeafe; color: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
.post-meta { display: flex; flex-direction: column; flex: 1; }
.post-meta strong { font-size: 0.9rem; color: #1e3a5f; }
.post-meta span { font-size: 0.8rem; color: #94a3b8; }
.post-tags { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
.tag { padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-purple { background: #ede9fe; color: #5b21b6; }
.post-content { color: #374151; font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.5rem; }
.post-link { color: #2563eb; font-size: 0.85rem; display: block; margin: 0.5rem 0; word-break: break-all; }
.post-actions { display: flex; gap: 1rem; margin-top: 0.75rem; align-items: center; flex-wrap: wrap; }
.btn-like { display: flex; align-items: center; gap: 5px; padding: 5px 12px; background: none; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.btn-like:hover { border-color: #e11d48; color: #e11d48; }
.btn-comment { display: flex; align-items: center; gap: 5px; color: #64748b; font-size: 0.85rem; }
.share-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
.share-label { font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.5rem; }
.share-buttons { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.share-btn { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 0.78rem; color: #374151; text-decoration: none; background: #f8fafc; transition: all 0.2s; }
.share-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.share-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.comments { margin-top: 1rem; }
.comment { padding: 0.5rem 0.75rem; background: #f8fafc; border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.88rem; color: #374151; }
.add-comment { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.add-comment input { margin: 0; }
.add-comment button { white-space: nowrap; padding: 0.6rem 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
.empty { text-align: center; padding: 3rem; background: white; border-radius: 16px; border: 2px solid #2563eb; }
.empty p { color: #64748b; margin-bottom: 1rem; }
.empty button { padding: 0.6rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; }
@media (max-width: 480px) {
  .navbar { padding: 0.75rem 1rem; }
  .new-post { padding: 1rem; }
  .post-card { padding: 1rem; }
  .selects { flex-direction: column; }
}
</style>