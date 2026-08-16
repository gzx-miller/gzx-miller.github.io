<script setup lang="ts">
import squirrelHero from './assets/squirrel-chestnut-avatar.webp'
import { knowledgeCategories } from './data/lessons'

const error = useError()
const readyCategories = knowledgeCategories.filter((c) => c.status === 'ready')

const is404 = computed(() => error.value?.statusCode === 404)
const title = computed(() => (is404.value ? '页面没找到' : '出了一点小问题'))
const description = computed(() =>
  is404.value
    ? '这颗栗子没找到，可能被移走或地址有误。回首页重新找一颗吧。'
    : '小松鼠在处理时遇到了一点意外，请稍后重试。',
)

useHead(() => ({ title: `${title.value} - 小松鼠举栗子` }))
</script>

<template>
  <a class="skip-link" href="#main-content">跳到正文</a>
  <div class="app-frame">
    <SiteHeader />
    <main id="main-content" class="error-page" tabindex="-1">
      <div class="error-card">
        <img class="error-avatar" :src="squirrelHero" alt="小松鼠" width="96" height="96" />
        <p class="error-code">{{ error?.statusCode ?? 404 }}</p>
        <h1 class="error-title">{{ title }}</h1>
        <p class="error-desc">{{ description }}</p>
        <div class="error-actions">
          <NuxtLink to="/" class="error-cta">回到首页</NuxtLink>
          <NuxtLink to="/vue" class="error-cta error-cta-secondary">去 Vue3 分类</NuxtLink>
        </div>
        <nav class="error-categories" aria-label="知识分类导航">
          <h2 class="error-cat-title">全部知识分类</h2>
          <ul class="error-cat-list">
            <li v-for="cat in readyCategories" :key="cat.id">
              <NuxtLink :to="cat.path" class="error-cat-link">{{ cat.name }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
