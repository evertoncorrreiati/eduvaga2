<template>
  <div class="profile-container">
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

    <div class="content" v-if="profile">
      <div class="profile-card">
        <div class="avatar">{{ profile.name?.charAt(0).toUpperCase() }}</div>
        <h2>{{ profile.name }}</h2>
        <p>{{ profile.email }}</p>
        <p v-if="profile.bio">{{ profile.bio }}</p>
        <div class="stats">
          <span><strong>{{ profile.posts?.length }}</strong> posts</span>
          <span><strong>{{ profile.followers?.length }}</strong> seguidores</span>
          <span><strong>{{ profile.following?.length }}</strong> seguindo</span>
        </div>
        <button v-if="!isOwner" @click="toggleFollow">
          {{ isFollowing ? 'Deixar de seguir' : 'Seguir' }}
        </button>
      </div>
      <div class="posts">
        <h3>Publicações</h3>
        <div v-for="post in profile.posts" :key="post.id" class="post-card">
          <p>{{ post.content }}</p>
          <a :href="post.officialUrl" target="_blank">{{ extractDomain(post.officialUrl) }}</a>
          <span class="date">{{ formatDate(post.createdAt) }}</span>

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
const user = JSON.parse(localStorage.getItem('user') || '{}')
const API = 'http://localhost:3000'

const isOwner = computed(() => profile.value?.id === user.id)
const isFollowing = computed(() => profile.value?.followers?.some((f: any) => f.followerId === user.id))

const loadProfile = async () => {
  const res = await axios.get(`${API}/users/${route.params.id}`)
  profile.value = res.data
}

const toggleFollow = async () => {
  await axios.post(`${API}/follow`, { followerId: user.id, followingId: profile.value.id })
  loadProfile()
}

const extractDomain = (url: string) => {
  try { return new URL(url).hostname } catch { return url }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
const logout = () => { localStorage.clear(); router.push('/') }

onMounted(loadProfile)
</script>

<style scoped>
.profile-container { min-height: 100vh; background: #f0f4f8; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #2563eb; color: white; flex-wrap: wrap; gap: 0.5rem; }
.logo { height: 40px; filter: brightness(0) invert(1); cursor: pointer; }
.nav-right { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.navbar button { padding: 0.4rem 0.75rem; background: white; color: #2563eb; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
.navbar button.active { background: #1d4ed8; color: white; }
.content { max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
.profile-card { background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 1.5rem; }
.avatar { width: 80px; height: 80px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem; }
.stats { display: flex; justify-content: center; gap: 1.5rem; margin: 1rem 0; flex-wrap: wrap; }
button { padding: 0.5rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 0.5rem; }
.posts h3 { text-align: center; margin-bottom: 1rem; color: #1e3a5f; }
.post-card { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.post-card p { color: #333; margin-bottom: 0.5rem; text-align: justify; }
a { color: #2563eb; display: block; margin: 0.5rem 0; text-align: center; font-size: 0.9rem; word-break: break-all; }
a:hover { text-decoration: underline; }
.date { color: #999; font-size: 0.85rem; display: block; text-align: center; margin-bottom: 1rem; }
.share-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
.share-label { font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
.share-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
.share-btn { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.8rem; color: #333; text-decoration: none; background: #f8f9fa; }
.share-btn:hover { background: #e8f0fe; border-color: #2563eb; color: #2563eb; }
.share-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
@media (max-width: 480px) {
  .profile-card { padding: 1.25rem; }
  .stats { gap: 1rem; }
  .post-card { padding: 1rem; }
}
</style>