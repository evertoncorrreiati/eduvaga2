<template>
  <div class="feed-container">
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
        <button @click="createPost">Publicar</button>
      </div>

      <div class="posts">
        <div v-if="posts.length === 0" class="empty">
          <p>Nenhuma vaga encontrada para este filtro.</p>
          <button @click="router.push('/modalidade')">Trocar filtro</button>
        </div>
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-header">
            <strong>{{ post.user.name }}</strong>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <div class="post-tags" v-if="post.modalidade || post.nivel">
            <span class="tag" v-if="post.modalidade">{{ post.modalidade }}</span>
            <span class="tag" v-if="post.nivel">{{ post.nivel }}</span>
          </div>
          <p>{{ post.content }}</p>
          <a :href="post.officialUrl" target="_blank">{{ extractDomain(post.officialUrl) }}</a>
          <div class="post-actions">
            <button @click="likePost(post)">❤️ {{ post.likes.length }}</button>
            <span>💬 {{ post.comments.length }} comentários</span>
          </div>

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

interface Comment {
  id: number
  content: string
  user: { name: string }
}

interface Post {
  id: number
  content: string
  officialUrl: string
  modalidade: string
  nivel: string
  createdAt: string
  user: { name: string }
  likes: any[]
  comments: Comment[]
}

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

const loadFeed = async () => {
  const params: any = {}
  if (modalidadeFiltro) params.modalidade = modalidadeFiltro
  if (nivelFiltro) params.nivel = nivelFiltro
  const res = await axios.get(`${API}/feed`, { params })
  posts.value = res.data
}

const createPost = async () => {
  if (!postContent.value || !officialUrl.value) return alert('Preencha todos os campos!')
  await axios.post(`${API}/posts`, {
    content: postContent.value,
    officialUrl: officialUrl.value,
    modalidade: postModalidade.value,
    nivel: postNivel.value,
    userId: user.id
  })
  postContent.value = ''
  officialUrl.value = ''
  postModalidade.value = ''
  postNivel.value = ''
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

const extractDomain = (url: string) => {
  try { return new URL(url).hostname } catch { return url }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const goToProfile = () => router.push(`/profile/${user.id}`)
const logout = () => { localStorage.clear(); router.push('/') }

onMounted(loadFeed)
</script>

<style scoped>
.feed-container { min-height: 100vh; background: #f0f4f8; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #2563eb; color: white; flex-wrap: wrap; gap: 0.5rem; }
.logo { height: 40px; filter: brightness(0) invert(1); cursor: pointer; }
.nav-right { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.navbar button { padding: 0.4rem 0.75rem; background: white; color: #2563eb; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
.navbar button.active { background: #1d4ed8; color: white; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.new-post { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
textarea { width: 100%; height: 80px; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; margin: 0.5rem 0; box-sizing: border-box; resize: none; }
input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; margin: 0.5rem 0; box-sizing: border-box; }
.selects { display: flex; gap: 0.75rem; margin: 0.5rem 0; flex-wrap: wrap; }
select { flex: 1; min-width: 140px; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; background: white; color: #333; font-size: 0.9rem; cursor: pointer; }
button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; }
.post-card { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.post-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.25rem; }
.post-header span { color: #999; font-size: 0.85rem; }
.post-tags { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.tag { background: #e8f0fe; color: #2563eb; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
a { color: #2563eb; font-size: 0.9rem; display: block; margin: 0.5rem 0; word-break: break-all; }
.post-actions { display: flex; gap: 1rem; margin-top: 0.75rem; align-items: center; flex-wrap: wrap; }
.post-actions button { background: none; color: #555; border: 1px solid #ddd; }
.share-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
.share-label { font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
.share-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.share-btn { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.8rem; color: #333; text-decoration: none; background: #f8f9fa; }
.share-btn:hover { background: #e8f0fe; border-color: #2563eb; color: #2563eb; }
.share-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.comments { margin-top: 1rem; }
.comment { padding: 0.5rem; background: #f8f9fa; border-radius: 6px; margin-bottom: 0.5rem; font-size: 0.9rem; }
.add-comment { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.add-comment input { margin: 0; }
.add-comment button { white-space: nowrap; }
.empty { text-align: center; padding: 3rem; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.empty p { color: #555; margin-bottom: 1rem; }
@media (max-width: 480px) {
  .new-post { padding: 1rem; }
  .post-card { padding: 1rem; }
  .selects { flex-direction: column; }
}
</style>