<template>
  <div class="profile-container">
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
      <div v-if="loading" class="loading">Carregando perfil...</div>
      <div v-else-if="!profile" class="empty">Perfil não encontrado.</div>
      <div v-else>
        <div class="profile-card">
          <div class="avatar-wrapper">
            <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="avatar-img" alt="Foto de perfil" />
            <div v-else class="avatar">{{ profile.name?.charAt(0).toUpperCase() }}</div>
            <label v-if="isOwner" class="avatar-upload" title="Trocar foto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <input type="file" accept="image/*" @change="handleUpload" style="display:none" />
            </label>
            <button v-if="isOwner && profile.avatarUrl" class="avatar-remove" @click="handleRemoveAvatar" title="Remover foto">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div v-if="uploading" class="upload-status">Enviando foto...</div>
          <h2>{{ profile.name }}</h2>
          <p class="email">{{ profile.email }}</p>
          <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>
          <div class="stats">
            <div class="stat"><strong>{{ profile.posts?.length ?? 0 }}</strong><span>publicações</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><strong>{{ profile.followers?.length ?? 0 }}</strong><span>seguidores</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><strong>{{ profile.following?.length ?? 0 }}</strong><span>seguindo</span></div>
          </div>
          <button v-if="!isOwner" class="btn-follow" :class="{ following: isFollowing }" @click="toggleFollow">
            {{ isFollowing ? 'Deixar de seguir' : 'Seguir' }}
          </button>
        </div>

        <div class="posts-section">
          <h3>Publicações</h3>
          <div v-if="profile.posts?.length === 0" class="empty">Nenhuma publicação ainda.</div>
          <div v-for="post in profile.posts" :key="post.id" class="post-card">
            <p class="post-content">{{ post.content }}</p>
            <a :href="post.officialUrl" target="_blank" class="post-link">{{ extractDomain(post.officialUrl) }}</a>
            <span class="date">{{ formatDate(post.createdAt) }}</span>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const profile = ref(null as any)
const loading = ref(true)
const uploading = ref(false)
const user = JSON.parse(localStorage.getItem('user') || '{}')
const API = 'http://localhost:3000'

const isOwner = computed(() => profile.value?.id === user.id)
const isFollowing = computed(() => profile.value?.followers?.some((f: any) => f.followerId === user.id))

const loadProfile = async () => {
  loading.value = true
  try {
    const id = route.params.id
    if (!id || id === 'undefined') { router.push(`/profile/${user.id}`); return }
    const res = await axios.get(`${API}/users/${id}`)
    profile.value = res.data
  } catch { profile.value = null }
  finally { loading.value = false }
}

const handleUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await axios.post(`${API}/users/${user.id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    profile.value.avatarUrl = res.data.avatarUrl
    const updatedUser = { ...user, avatarUrl: res.data.avatarUrl }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  } catch { alert('Erro ao fazer upload da foto') }
  finally { uploading.value = false }
}

const handleRemoveAvatar = async () => {
  if (!confirm('Remover foto de perfil?')) return
  try {
    await axios.delete(`${API}/users/${user.id}/avatar`)
    profile.value.avatarUrl = null
    const updatedUser = { ...user, avatarUrl: null }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  } catch { alert('Erro ao remover foto') }
}

const toggleFollow = async () => {
  await axios.post(`${API}/follow`, { followerId: user.id, followingId: profile.value.id })
  loadProfile()
}

const extractDomain = (url: string) => { try { return new URL(url).hostname } catch { return url } }
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const logout = () => { localStorage.clear(); router.push('/') }

onMounted(loadProfile)
</script>

<style scoped>
.profile-container { min-height: 100vh; background: #f0f4f8; }
.navbar { background: #1e40af; padding: 0.9rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.logo-area { cursor: pointer; display: flex; align-items: center; }
.logo-nav { height: 32px; width: auto; filter: brightness(0) invert(1); }
.nav-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.nav-right button { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; background: rgba(255,255,255,0.12); color: white; transition: background 0.2s; }
.nav-right button:hover { background: rgba(255,255,255,0.2); }
.nav-right button.active { background: white; color: #1e40af; font-weight: 500; }
.btn-sair { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.65) !important; font-size: 12px !important; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.loading { text-align: center; padding: 3rem; color: #64748b; }
.profile-card { background: white; padding: 2rem; border-radius: 16px; text-align: center; border: 2px solid #2563eb; margin-bottom: 1.5rem; }
.avatar-wrapper { position: relative; width: 80px; height: 80px; margin: 0 auto 1rem; }
.avatar { width: 80px; height: 80px; background: #dbeafe; color: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 600; }
.avatar-img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #2563eb; }
.avatar-upload { position: absolute; bottom: 0; right: 0; width: 26px; height: 26px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
.avatar-upload:hover { background: #1e40af; }
.avatar-remove { position: absolute; bottom: 0; left: 0; width: 26px; height: 26px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: background 0.2s; }
.avatar-remove:hover { background: #b91c1c; }
.upload-status { font-size: 0.8rem; color: #2563eb; margin-bottom: 0.5rem; }
h2 { color: #1e3a5f; font-size: 1.25rem; margin-bottom: 0.25rem; }
.email { color: #64748b; font-size: 0.9rem; margin-bottom: 0.5rem; }
.bio { color: #374151; font-size: 0.9rem; margin-bottom: 1rem; }
.stats { display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin: 1.25rem 0; flex-wrap: wrap; }
.stat { text-align: center; }
.stat strong { display: block; font-size: 1.25rem; color: #1e3a5f; }
.stat span { font-size: 0.8rem; color: #64748b; }
.stat-divider { width: 1px; height: 30px; background: #e2e8f0; }
.btn-follow { padding: 0.6rem 1.75rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 500; margin-top: 0.5rem; transition: all 0.2s; }
.btn-follow:hover { background: #1e40af; }
.btn-follow.following { background: white; color: #2563eb; border: 1.5px solid #2563eb; }
.posts-section h3 { color: #1e3a5f; margin-bottom: 1rem; font-size: 1rem; }
.post-card { background: white; padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; border: 2px solid #2563eb; transition: all 0.3s; }
.post-card:hover { background: #eff6ff; transform: translateY(-3px); }
.post-content { color: #374151; font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.5rem; }
.post-link { color: #2563eb; display: block; margin: 0.5rem 0; font-size: 0.85rem; word-break: break-all; }
.date { color: #94a3b8; font-size: 0.8rem; display: block; margin-bottom: 1rem; }
.share-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
.share-label { font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.5rem; }
.share-buttons { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; }
.share-btn { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 0.78rem; color: #374151; text-decoration: none; background: #f8fafc; transition: all 0.2s; }
.share-btn:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.share-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.empty { text-align: center; padding: 2rem; color: #64748b; }
@media (max-width: 480px) {
  .navbar { padding: 0.75rem 1rem; }
  .profile-card { padding: 1.25rem; }
  .post-card { padding: 1rem; }
  .stats { gap: 1rem; }
}
</style>